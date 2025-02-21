/** 基础信息，缺字也要保留 */
export interface EvaluateItemBase {
  /** 字词 */
  wd: string
  /** 频数 */
  freq: number
  /** 全局频率 */
  reFreq: number
  /** 字频排名 */
  freqRank: number
}

/** 非缺字的词条的信息 */
export interface EvaluateItemWords extends EvaluateItemBase {
  /** 编码 */
  code: string
  /** 编码长度 */
  cdLen: number
  /** 选重数 */
  collision: number
  /** 词编码的加权当量, 已经乘了词频, 最后使用时求和再除以总频数 */
  eq: number
  /** 本词条编码里左右互击的次数 */
  dh: number
  /** 本词条编码里同指大跨排的次数 */
  ms: number
  /** 本词条编码里同指小跨排的次数 */
  ss: number
  /** 本词条编码里小指干扰的次数 */
  pd: number
  /** 本词条编码里错手的次数 */
  lfd: number
  /** 本词条编码里三连击的次数 */
  trible: number
  /** 本词条编码里超标键位的次数 */
  overKey: number
}

/** 非缺字的汉字信息, 也是详细表格里会展示的列 */
export interface EvaluateItemHanzi extends EvaluateItemBase {
  /** 编码 */
  code: string
  /** 原码表里的行数 */
  line: number
  /** 选重数 */
  collision: number
  /** 选重键, 空字符串表示可以直接上屏 */
  selectKey: string
  /** 码长, 用于统计一码 两码…… */
  cdLen: number
  /** 理论二简 */
  brief2: boolean
  /** 加权键长, 使用时要除以总频数 */
  CL: number
  /** 加权字均当量, 使用时汇总再除以总频数 */
  ziEq: number
  /** 加权键均当量, 使用时汇总再除以总频数 */
  keyEq: number
  /** 左右互击的次数 */
  dh: number
  /** 同指大跨排的次数 */
  ms: number
  /** 同指小跨排的次数 */
  ss: number
  /** 小指干扰的次数 */
  pd: number
  /** 错手的次数 */
  lfd: number
  /** 三连击的次数 */
  trible: number
  /** 超标键位的次数 */
  overKey: number
}

interface EvaluateLine<T> {
  /** 每一条数据 */
  items: Array<T | EvaluateItemBase>
  /** 从第几个字频开始 */
  start: number
  /** 到第几个字频结束(不包括) */
  end: number
  /** 这一行的总频数 */
  freq: number
  /** 按键使用量, 已经加权过了, 也要用于计算用指负荷 */
  usage: Record<string, number>
}

export type EvaluateLineHanzi = EvaluateLine<EvaluateItemHanzi>
export type EvaluateLineWords = EvaluateLine<EvaluateItemWords>
