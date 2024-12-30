import type { FreqMatrix, HanziMap } from "./share"
import type { EvaluateLineWords, EvaluateWordsItem } from "./types"

import * as feel from "@/libs/feeling"
import { type Mabiao, validateCodesInEquivalent } from "@/libs/schema"
import { freqCountToFreq } from "@/libs/utils"
import { CollisionCounter } from "../schema/collision-counter"
import * as share from "./share"

/** 测评一个码表的组词性能 */
export async function quickEvaluateWords(mb: Mabiao, tsv?: string) {
  // 获取词频数据
  let freqTsv: FreqMatrix
  if (tsv) {
    freqTsv = share.parseFreqTsv(tsv).slice(0, 60000)
    if (freqTsv.length < 60000)
      throw new Error("词频数据不足60000行")
  }
  else {
    freqTsv = (await import(/* webpackPrefetch: true */ "./words-freq-data"))
      .default
  }

  // TODO: 要留意词频的格式 数量 词语字数
  // 获取单字码表
  const singleHanziMap = share.singleHanziMapFromMb(
    mb,
    genEveryHanzi(freqTsv),
    false,
  )
  // 测评词库
  const evaluateResult = evaluateSections(freqTsv, singleHanziMap)
  return {
    evaluateResult,
    usage: freqCountToFreq(share.getTotalUsage(evaluateResult)),
  }
}

function* genEveryHanzi(matrix: share.FreqMatrix) {
  for (const e of matrix) {
    for (const a of e[0]) {
      yield a
    }
  }
}

/** 测评6个区间 */
function evaluateSections(matrix: FreqMatrix, hanzimap: HanziMap) {
  const WordsSections = [
    [0, 2000],
    [2000, 5000],
    [5000, 10000],
    [10000, 20000],
    [20000, 40000],
    [40000, 60000],
  ] as const
  const collisionCounter = new CollisionCounter()

  const result: EvaluateLineWords[] = []
  for (const [start, end] of WordsSections) {
    let totalFreq = 0
    const items: EvaluateLineWords["items"] = []
    const usageHelpArray = share.createUsageHelpArray()

    for (let i = start; i < end; i++) {
      const el = matrix[i]
      const [wd, freq] = el
      totalFreq += freq

      const cd = makeCodeUnderWubi(hanzimap, wd)
      // 缺字
      if (!cd) {
        items.push({ wd, freq, reFreq: 0, freqRank: i + 1 })
        continue
      }
      const cdLen = cd.length
      const tmpEvaluateItem: EvaluateWordsItem = {
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

/** 五笔规则造词, 生成编码, 如果无法造词, 返回空字符串 */
function makeCodeUnderWubi(hanzimap: HanziMap, words: string): string {
  const wordsArray = [...words]
  // 2 字词
  if (wordsArray.length === 2) {
    const cd1 = hanzimap.get(wordsArray[0])
    if (!cd1)
      return ""
    const cd2 = hanzimap.get(wordsArray[1])
    if (!cd2)
      return ""
    return cd1.item.cd.slice(0, 2) + cd2.item.cd.slice(0, 2)
  }
  // 3 字词
  if (wordsArray.length === 3) {
    const cd1 = hanzimap.get(wordsArray[0])
    if (!cd1)
      return ""
    const cd2 = hanzimap.get(wordsArray[1])
    if (!cd2)
      return ""
    const cd3 = hanzimap.get(wordsArray[2])
    if (!cd3)
      return ""
    return cd1.item.cd.slice(0, 2) + cd2.item.cd[0] + cd3.item.cd[0]
  }
  // 多字词
  const cd1 = hanzimap.get(wordsArray[0])
  if (!cd1)
    return ""
  const cd2 = hanzimap.get(wordsArray[1])
  if (!cd2)
    return ""
  const cd3 = hanzimap.get(wordsArray[2])
  if (!cd3)
    return ""
  const cd4 = hanzimap.get(wordsArray.at(-1)!)
  if (!cd4)
    return ""
  return cd1.item.cd[0] + cd2.item.cd[0] + cd3.item.cd[0] + cd4.item.cd[0]
}
