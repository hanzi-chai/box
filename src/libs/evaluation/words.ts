import type { Ref } from "vue"
import type { FreqMatrix, HanziMap } from "./share"

import type { EvaluateItemWords, EvaluateLineWords } from "./types"
import type { WordsRuleMethod } from "./words-rules"
import type { Mabiao } from "@/libs/schema"
import { ref, shallowReactive } from "vue"
import * as feel from "@/libs/feeling"
import { validateCodesInEquivalent } from "@/libs/schema"
import { freqCountToFreq } from "@/libs/utils"
import * as utils from "@/libs/utils"
import { CollisionCounter } from "../schema/collision-counter"
import * as share from "./share"
import { ruleWubi } from "./words-rules"

interface EvaluateWordsOptions {
  mb: Mabiao
  tsv?: string
  wordsRule?: WordsRuleMethod
}
export function useEvaluateWords(opt: EvaluateWordsOptions) {
  const total = ref(0)
  const progress = ref(0)
  const result = shallowReactive({
    eval: [] as EvaluateLineWords[],
    usage: {} as Record<string, number>,
    abortFn: null as (() => void) | null,
  })

  makeFreqMatrix(opt.tsv)
    .then((freqMatrix) => {
      total.value = freqMatrix.length

      const singleHanziMap = share.singleHanziMapFromMb(
        opt.mb,
        genEveryHanzi(freqMatrix),
        false,
      )
      const controller = new AbortController()
      const scheduler = utils.runGeneratorInIdle(evaluateSections(freqMatrix, singleHanziMap, progress), controller)
      result.abortFn = () => {
        controller.abort()
      }
      return scheduler
    })
    .then((r) => {
      result.eval = r
      result.usage = freqCountToFreq(share.getTotalUsage(r))
    })

  return { total, progress, result }
}

async function makeFreqMatrix(tsv?: string) {
  if (!tsv)
    return (await import(/* webpackPrefetch: true */ "./words-freq-data")).default
  const freqTsv = share.parseFreqTsv(tsv)
  if (freqTsv.length < 60000)
    throw new Error("词频数据不足60000行")
  freqTsv.sort((a, b) => b[1] - a[1])
  return freqTsv
}

function* genEveryHanzi(matrix: share.FreqMatrix) {
  for (const e of matrix) {
    for (const a of e[0]) {
      yield a
    }
  }
}

/** 测评6个区间 */
function* evaluateSections(matrix: FreqMatrix, hanzimap: HanziMap, progress: Ref<number>, wordsRule: WordsRuleMethod = ruleWubi) {
  const wordsSections = [
    [0, 2000],
    [2000, 5000],
    [5000, 10000],
    [10000, 20000],
    [20000, 40000],
    [40000, 60000],
  ] as const
  const collisionCounter = new CollisionCounter()

  const result: EvaluateLineWords[] = []
  for (const [start, end] of wordsSections) {
    let totalFreq = 0
    const items: EvaluateLineWords["items"] = []
    const usageHelpArray = share.createUsageHelpArray()

    for (let i = start; i < end; i++) {
      yield i
      progress.value = i + 1
      const el = matrix[i]
      const [wd, freq] = el
      totalFreq += freq

      const cd = wordsRule(wd, { hanziMap: hanzimap })

      // 缺字
      if (!cd) {
        items.push({ wd, freq, reFreq: 0, freqRank: i + 1 })
        continue
      }
      const cdLen = cd.length
      const tmpEvaluateItem: EvaluateItemWords = {
        wd,
        freq,
        reFreq: 0,
        freqRank: i + 1,
        collision: collisionCounter.add(cd),
        code: cd,
        cdLen,
        eq: 0,
        dh: 0,
        ms: 0,
        ss: 0,
        pd: 0,
        lfd: 0,
        trible: 0,
        overKey: 0,
      }

      // 超标键位
      for (let k = 0; k < cdLen; k++) {
        if (!validateCodesInEquivalent(cd[k])) {
          tmpEvaluateItem.overKey += 1
        }
        else {
          // 各按键使用率 写在区间的数据上
          usageHelpArray[cd.charCodeAt(k)] += freq
        }
      }

      if (tmpEvaluateItem.overKey > 0) {
        items.push(tmpEvaluateItem)
        continue
      }

      // 互击 大跨排 小跨排 小指干扰 错手
      for (let i = 0; i < cdLen - 1; i++) {
        const magic = feel.getDefaultComboMagic(cd, i)
        switch (magic & 7) {
          case feel.ComboType.PinkyDisturb:
            tmpEvaluateItem.pd += 1
            break
          case feel.ComboType.SingleSpan:
            tmpEvaluateItem.ss += 1
            break
          case feel.ComboType.MultiSpan:
            tmpEvaluateItem.ms += 1
            break
          case feel.ComboType.LongFingersDisturb:
            tmpEvaluateItem.lfd += 1
            break
          case feel.ComboType.DifferentHands:
            tmpEvaluateItem.dh += 1
            break
          default:
            break
        }
      }

      // 三连击
      for (let i = 2; i < cdLen; i++) {
        if (cd[i - 2] === cd[i - 1] && cd[i - 1] === cd[i])
          tmpEvaluateItem.trible += 1
      }

      // 加权当量
      const wdEq = cdLen < 2 ? 1 : feel.calcEq(cd)
      tmpEvaluateItem.eq += wdEq * freq

      items.push(tmpEvaluateItem)
    }
    result.push({
      freq: totalFreq,
      items,
      start,
      end,
      usage: share.usageHelpArrayToUsage(usageHelpArray),
    })
  }
  // 补齐相对词频数据
  let totalFreq = 0
  for (const e of result) totalFreq += e.freq
  for (const e of result) {
    for (const it of e.items) it.reFreq = it.freq / totalFreq
  }
  return result
}
