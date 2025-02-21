/** 根据字频表数据测评, 即科学形码测评系统 */

import type { Mabiao } from "@/libs/schema"
import type { FreqMatrix, HanziMap } from "./share"
import type { EvaluateItemHanzi, EvaluateLineHanzi } from "./types"
import * as feel from "@/libs/feeling"
import {
  getKeysSet,

  validateCodesInEquivalent,
} from "@/libs/schema"
import * as utils from "@/libs/utils"
import * as R from "rambdax"
import { fingerLoad } from "../feeling/finger-load"
import * as share from "./share"

export async function quickEvaluateHanzi(mb: Mabiao, tsv?: string) {
  let freqTsv: FreqMatrix
  if (tsv) {
    freqTsv = share.parseFreqTsv(tsv).slice(0, 6000)
    if (freqTsv.length < 6000)
      throw new Error("字频数据不足6000行")
  }
  else {
    freqTsv = (await import(/* webpackPrefetch: true */ "./hanzi-freq-data"))
      .default
  }
  const singleHanziMap = share.singleHanziMapFromMb(
    mb,
    R.mapArray(v => v[0], freqTsv),
  )
  const evaluate_result = evaluateSections(freqTsv, singleHanziMap, mb)

  return {
    evaluate: evaluate_result,
    baseFinLoadRate: getBaseFinLoadRate(mb),
    usage: utils.freqCountToFreq(share.getTotalUsage(evaluate_result)),
  }
}

/** 测评5个区间 */
export function evaluateSections(
  matrix: FreqMatrix,
  singleHanzimap: HanziMap,
  mb: Mabiao,
) {
  const sections = [
    [0, 300],
    [300, 500],
    [500, 1500],
    [1500, 3000],
    [3000, 6000],
  ] as const
  const result: EvaluateLineHanzi[] = []

  /** 用于计算理论二简 */
  const brief2Set = new Set<string>()

  for (const [start, end] of sections) {
    let totalFreq = 0
    const usageHelpArray = share.createUsageHelpArray()

    const items: EvaluateLineHanzi["items"] = []

    for (let i = start; i < end; i++) {
      const el = matrix[i]
      const [wd, freq] = el
      totalFreq += freq

      const hanzimap_rs = singleHanzimap.get(wd)
      // 缺字
      if (!hanzimap_rs) {
        items.push({ wd, freq, reFreq: 0, freqRank: i + 1 })
        continue
      }
      const { cd, ln } = hanzimap_rs.item
      const cdLen = cd.length
      const collision = hanzimap_rs.collision

      // 补齐选重键
      let selectKey = ""
      const selectKeyLen = mb.selectKeys?.length
      if (mb.cmLen! > cdLen || collision > 1) {
        const coll = Math.min(collision, selectKeyLen)
        selectKey = mb.selectKeys?.[coll - 1]
      }

      // 手指使用量(选重键)
      if (selectKey) {
        usageHelpArray[selectKey.charCodeAt(0)] += freq
      }
      /** 待测评的词条 */
      const tmpEvaluateItem: EvaluateItemHanzi = {
        wd,
        freq,
        reFreq: 0,
        freqRank: i + 1,
        code: cd,
        line: ln,
        collision,
        selectKey,
        cdLen,
        brief2: false,
        CL: 0,
        ziEq: 0,
        keyEq: 0,
        dh: 0,
        ms: 0,
        ss: 0,
        pd: 0,
        lfd: 0,
        trible: 0,
        overKey: 0,
      }
      for (let k = 0; k < cd.length; k++) {
        // 过滤超标键位
        if (!validateCodesInEquivalent(cd[k])) {
          tmpEvaluateItem.overKey += 1
        }
        else {
          // 手指使用量
          usageHelpArray[cd.charCodeAt(k)] += freq
        }
      }
      if (tmpEvaluateItem.overKey > 0) {
        items.push(tmpEvaluateItem)
        continue
      }

      // 理论二简
      const code2 = cd.slice(0, 2)
      if (!brief2Set.has(code2)) {
        brief2Set.add(code2)
        tmpEvaluateItem.brief2 = true
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

      const cdWithSelect = cd + selectKey
      const keysLen = cdWithSelect.length

      // 字均当量
      // 1 码字的当量为 1
      const ziEq = keysLen < 2 ? 1 : feel.calcEq(cdWithSelect)

      tmpEvaluateItem.ziEq = ziEq * freq
      // 键均当量
      tmpEvaluateItem.keyEq = (ziEq / (keysLen - 1)) * freq

      // 加权键长
      tmpEvaluateItem.CL = keysLen * freq

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

function getBaseFinLoadRate(mb: Mabiao) {
  const keysInFingerLoad = utils.setsIntersection(
    getKeysSet(mb),
    utils.objectKeysToSet(fingerLoad),
  )
  const customFingerLoad = utils.pickObject(fingerLoad, keysInFingerLoad)
  const baseFinLoadRate = utils.freqCountToFreq(customFingerLoad)
  return baseFinLoadRate
}
