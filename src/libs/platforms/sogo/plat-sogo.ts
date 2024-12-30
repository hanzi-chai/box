import * as R from "rambdax"
import { checkCodes, getCodeToWordsDict, validateCodes } from "@/libs/schema"
import * as utils from "@/libs/utils"
import {
  createEmptyTextMabiao,
  type Mabiao,
  type TextMabiao,
} from "../../schema"

import type { TextPlatform } from "../types"

// #region 类型定义

type SplitSpace = " " | "\t"

export interface SogoFormat {
  /** 分隔符 */
  split: SplitSpace
  /** 编码在前，还是在最后一列 */
  ahead: boolean
}

export interface MbSogo extends TextMabiao {
  format: SogoFormat
  plat: "sogo"
}
// #endregion

// #region platSogo
// TODO: 调查手机搜狗百度要求
export const platSogo = {
  id: "sogo",
  nameEn: "sougou/baidu",
  nameZh: "手机搜狗百度",
  desc: "可用于移动端的搜狗输入法、百度输入法",
  validate,
  load,
  dump,
} as const satisfies TextPlatform

// #endregion

// #region 工具函数

function load(raw: string, title?: string, ctx?: SogoFormat): MbSogo {
  const format = ctx || detectPlatFormat(raw)
  if (!format) throw new TypeError("fail: load platSogo - no format")
  const result = createEmptyTextMabiao("sogo") as MbSogo

  result.txt = raw

  if (title) {
    result.fileName = title
    result.name = title.replace(/\.txt$/, "")
  }

  for (const [line, lineno] of utils.genEachLineJump(raw)) {
    const wordsSplit = utils.quickSplit(line, format.split)
    if (wordsSplit.length === 1)
      throw new TypeError(`第 ${lineno} 行只有一列数据`)
    // 编码在前
    if (format.ahead) {
      const cd = checkCodes(wordsSplit[0])
      for (const wd of wordsSplit.slice(1)) {
        if (wd === "") continue
        result.items.push({ wd, cd, ln: lineno })
      }
    }
    // 编码在后
    else {
      const cd = wordsSplit.pop()!
      for (const wd of wordsSplit) {
        if (wd === "") continue
        result.items.push({ wd, cd, ln: lineno })
      }
    }
  }
  return result
}

/** 验证是否为搜狗百度输入法的格式，同时会填充 format */
function validate(raw: string): boolean {
  const format = detectPlatFormat(raw)
  return format !== null
}

interface dumpCtx {
  format: SogoFormat
  fold: boolean
}

/** ctx 包含配置：格式format，是否折叠fold？ */
function dump(mb: Mabiao, ctx?: dumpCtx): string {
  let format: SogoFormat
  let fold = false

  if ("format" in mb) {
    format = mb.format as SogoFormat
  } else {
    if (!(ctx?.format)) {
      throw new TypeError("fail: dump platSogo - no format")
    }
    format = ctx.format
    fold = ctx.fold
  }

  let res = ""

  // 每行只有一条词
  if (!fold) {
    for (const { wd, cd } of mb.items) {
      if (format.ahead) res += `${cd}${format.split}${wd}\n`
      else res += `${wd}${format.split}${cd}\n`
    }
    return res
  }

  // 每行多词
  for (const [codes, items] of getCodeToWordsDict(mb)) {
    const words = R.map((v) => v.wd, items).join(format.split)
    if (format.ahead) res += `${codes}${format.split}${words}\n`
    else res += `${words}${format.split}${codes}\n`
  }
  return res
}

/** 自动检查码表的格式，返回推测的格式，如果返回null，则无法推断出来 */
export function detectPlatFormat(text: string) {
  for (const [l] of utils.genEachLineJump(text)) {
    const line = utils.quickTrim(l)
    // 只担心词条是纯英文的
    const tabindex = line.indexOf("\t")
    const spaceindex = line.indexOf(" ")
    if (tabindex === -1) {
      if (spaceindex === -1)
        // 没有分隔符
        return null
      // 只有 space
      const f = detectFormatInLine(line, spaceindex, " ")
      if (f) return f
    } else if (spaceindex === -1) {
      // 只有 tab
      const f = detectFormatInLine(line, tabindex, "\t")
      if (f) return f
    }
    // tab 和 空格都有
    else {
      // 尝试tab
      let f = detectFormatInLine(line, tabindex, "\t")
      if (f) return f
      // 尝试空格
      f = detectFormatInLine(line, spaceindex, " ")
      if (f) return f
    }
  }
  // 整个码表都推断不出，只可能是纯英文码表了，没有办法
  return null
}

/** 返回null暗示了词语是英文 */
function detectFormatInLine(
  line: string,
  firstIndex: number,
  space: SplitSpace,
): SogoFormat | null {
  const lastIndex = line.lastIndexOf(space)
  const codeAhead = validateCodes(line.slice(0, firstIndex))
  const lastIsCode = validateCodes(line.slice(lastIndex + 1))
  if (codeAhead && !lastIsCode) return { split: space, ahead: true }

  if (!codeAhead && lastIsCode) return { split: space, ahead: false }
  return null
}

// #endregion
