/** 字频统计和词频统计公用的方法 */

import * as utils from "@/libs/utils"
import type { Mabiao, MbItem } from "@/libs/schema"

import { CollisionCounter } from "../simulator/collision-counter"
import type { EvaluateLineHanzi, EvaluateLineWords } from "./types"

/** 合并多个测评结果中的usage */
export function getTotalUsage(
  evaluateResult: { usage: Record<string, number> }[],
) {
  const totalUsage = { ...evaluateResult[0].usage }
  for (let i = 1; i < evaluateResult.length; i++) {
    const e = evaluateResult[i].usage
    for (const [k, n] of Object.entries(e)) {
      totalUsage[k] = totalUsage[k] ?? 0 + n
    }
  }
  return totalUsage
}

/** 获取字频数据 */
export type FreqMatrix = [string, number][]

export function parseFreqTsv(tsv: string): FreqMatrix {
  const matrix = utils.parseTsv(tsv)
  const r: FreqMatrix = Array(matrix.length)
  for (let i = 0; i < matrix.length; i++) {
    const element = matrix[i]
    const freq = Number.parseInt(element[1])
    if (Number.isNaN(freq))
      throw new Error(`TSV格式错误: ${element[0]} ${element[1]}`)
    r[i] = [element[0], freq]
  }
  return r
}

export type HanziMap = Map<string, { item: MbItem; collision: number }>
/**
 * 提取码表中的单字数据
 * @param mb 从哪个码表里提取单字数据
 * @param hanzi 要提取哪些汉字，没有指定的汉字忽略
 * @param [shortCode] 遇到一字多码时, 保留较短的那个？
 * @returns - 单字相关数据
 */
export function singleHanziMapFromMb(
  mb: Mabiao,
  hanzi: Iterable<string>,
  shortCode = true,
): HanziMap {
  const rs: HanziMap = new Map()
  const hanziSet = new Set(hanzi)
  const collisionCounter = new CollisionCounter()
  for (const item of mb.items) {
    const wd = item.wd
    const cd = item.cd
    // 过滤不必要的汉字
    if (wd.length > 1 || !hanziSet.has(wd)) continue

    const oldItem = rs.get(wd)
    // 没有数据时, 添加数据
    if (!oldItem) {
      rs.set(wd, { item, collision: collisionCounter.add(cd) })
      continue
    }
    // 有数据时
    // 单字测评取码长更短的
    if (shortCode) {
      if (oldItem.item.cd.length > cd.length) {
        const collision = collisionCounter.add(cd)
        rs.set(wd, { item, collision })
      }
    }
    // 词语测评取码长更长的
    else if (oldItem.item.cd.length < cd.length) {
      const collision = collisionCounter.add(cd)
      rs.set(wd, { item, collision })
    }
  }
  return rs
}

/** 合并多个计算结果 */
export function mergeEvaluationLines<
  T extends EvaluateLineHanzi | EvaluateLineWords,
>(items: T[]): T {
  const len = items.length
  if (len === 1) return items[0]
  const rs = utils.mergeDeepMore(items)
  rs.start = items[0].start
  rs.end = items[len - 1].end
  return rs
}

/** 排除缺字和超标 */
export function isNormal<T>(evaluteItem: T) {
  // @ts-expect-error undefined magic
  return evaluteItem.overKey === 0
}

export const createUsageHelpArray = (): number[] => Array(128).fill(0)

/** 数组形式的 */
export function usageHelpArrayToUsage(helpArray: number[]) {
  const r: Record<string, number> = {}
  for (let i = 0; i < helpArray.length; i++) {
    const n = helpArray[i]
    if (n > 0) {
      r[String.fromCharCode(i)] = n
    }
  }
  return r
}
