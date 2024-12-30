/**
 * 码表类型 和 工具函数
 * get 系列函数都会在mabiao对象里缓存结果
 * 码表对象不能是class，为了易于持久化
 * 码表对象有个cache字段
 */
import type { PlatformIds } from "../platforms"
import type { MbItem } from "./mabiao-item"
import { CollisionCounter } from "./collision-counter"

// #region 码表类型定义

/** 码表数据和相关的参数，各个平台应该编写自己专用的Mabiao类型 */
export interface Mabiao {
  /** 码表数据 */
  items: MbItem[]
  /**
   * 缓存，用于减少重复计算
   * cache里的数据，不会持久化
   * 已知的缓存数据：
   * - CTI: 编码映射到词条组的Map，用于小小等平台
   * - collisionCounter: 重码计数器对象
   */
  cache: Record<string, any>
  /** 原文件平台 */
  plat?: string
  /** 码表原始文件里的码表头内容 */
  header?: string
  /** 最大码长 */
  maxCodeLen?: number
  /** 最大词长 */
  maxWordsLen?: number
  /** 原始文件的副本 */
  txt?: string
  /** 原始文件的文件名 */
  fileName?: string
  /** 方案的名称 */
  name?: string
  /** 方案的版本 */
  version?: string
  /** 方案作者 */
  author?: string
  /** 方案简介 */
  description?: string
  /** 选重键 */
  selectKeys?: string
  /** 上屏码长 */
  cmLen?: number
  /** 码表里所有用到的按键 */
  keysSet?: Set<string>
}

/** 从文件里读取到的码表 */
export interface TextMabiao extends Mabiao {
  fileName: string
  header: string
  name: string
  plat: PlatformIds
  txt: string
  /** 文件编码，默认utf-8 */
  encoding?: string
}

/** 为了避免编码可能为 `__proto__`，这里用Map存储数据 */
type CodeToItemsMap = Map<string, MbItem[]>

// #endregion

// #region 工具函数

export function createEmptyMabiao(): Mabiao {
  return { items: [], cache: {} }
}

export function createEmptyTextMabiao(plat: PlatformIds): TextMabiao {
  return {
    items: [],
    cache: {},
    fileName: "",
    header: "",
    name: "",
    plat,
    txt: "",
  }
}

export function getCodeToWordsDict(mb: Mabiao): CodeToItemsMap {
  if (mb.cache.CTI)
    return mb.cache.CTI
  const result: CodeToItemsMap = new Map()
  for (const eachItem of mb.items) {
    const c = eachItem.cd
    const o = result.get(c)
    if (o)
      o.push(eachItem)
    else result.set(c, [eachItem])
  }
  mb.cache.CTI = result
  return result
}

export function getMaxCodeLen(mb: Mabiao) {
  if (mb.maxCodeLen)
    return mb.maxCodeLen
  let r = 0
  for (const { cd } of mb.items) {
    const codeLen = cd.length
    if (codeLen > r)
      r = codeLen
  }
  mb.maxCodeLen = r
  return r
}

export function getMaxWordsLen(mb: Mabiao) {
  if (mb.maxCodeLen)
    return mb.maxCodeLen
  let r = 0
  for (const { wd } of mb.items) {
    const l = [...wd].length
    if (l > r)
      r = l
  }
  mb.maxCodeLen = r
  return r
}

export function getKeysSet(mb: Mabiao) {
  if (mb.keysSet)
    return mb.keysSet
  const result = new Set<string>()
  for (const { cd } of mb.items) {
    for (const c of cd) result.add(c)
  }
  mb.keysSet = result
  return result
}

/** 获取选重键，如果没有设置过，则自动判断 */
export function getSelectKeys(mb: Mabiao) {
  if (mb.selectKeys)
    return mb.selectKeys
  let selectKeys = " ;'456789"
  const selectKeys2 = " 23456789"
  if (mb.keysSet) {
    if (mb.keysSet.has(";")) {
      selectKeys = selectKeys2
    }
  }
  else if (mabiaoHasKey(mb, ";")) {
    selectKeys = selectKeys2
  }
  mb.selectKeys = selectKeys
  return selectKeys
}

function mabiaoHasKey(mb: Mabiao, key: string): boolean {
  for (let i = 0; i < mb.items.length; i++) {
    const { cd } = mb.items[i]
    for (const element of cd) {
      if (key === element) {
        return true
      }
    }
  }
  return false
}

/** 只允许平台相同时，才能获取码表头数据 */
export function getMabiaoHeader(mb: Mabiao, plat: PlatformIds) {
  if (mb.plat === plat && mb.header)
    return `${mb.header}\n`
  return ""
}

/**
 * 重头计算选重数，如果码表里已经计算过了，则跳过。
 * 如果需要强行运行，先删除 `mb.cache.collisionCounter`
 */
export function calcCollision(mb: Mabiao): number {
  if (mb.cache.collisionCounter)
    return mb.cache.collisionCounter.max

  const collisionCounter = new CollisionCounter()
  for (const i of mb.items) {
    i.collision = collisionCounter.add(i.cd)
  }
  mb.cache.collisionCounter = collisionCounter
  return collisionCounter.max
}

// #endregion
