import * as utils from "@/libs/utils"
import * as R from "rambdax"
import {
  createEmptyTextMabiao,
  getCodeToWordsDict,
  type Mabiao,
  type TextMabiao,
  validateCodes,
} from "../../schema"
import { FormatError, type TextPlatform } from "../types"

import logo from "./yong.png"

// #region 平台信息
export const platYong = {
  id: "yong",
  nameEn: "Yong",
  nameZh: "小小",
  site: "https://yong.dgod.net/",
  logo,
  validate,
  load,
  dump,
} as const satisfies TextPlatform

// #endregion

// #region load
function load(raw: string, title?: string): TextMabiao {
  const result = createEmptyTextMabiao("yong")

  if (title) {
    result.fileName = title
    result.name = title.replace(/\.txt$/, "")
  }
  result.txt = raw

  // 找到[data]标记，之前都是码表头，之后才是码表数据
  const dataIndex = utils.indexOfLineEqualsIgnoreCase(raw, "[data]")
  let headerLines = 0

  // 解析码表头
  if (dataIndex !== -1) {
    const header = raw.slice(0, dataIndex - 7)
    result.header = header
    const yongObj: Record<string, string> = {}
    for (const [line, lineno] of utils.genEachLineJump(header)) {
      headerLines = lineno
      // 跳过注释
      if (utils.quickStartWith(line, "#"))
        continue

      if (!line.includes("="))
        throw new FormatError("码表头格式错误，没有“=”号", lineno)

      const [key, value] = utils.quickSplit2(line, "=")
      yongObj[key] = value
    }
    result.cache.yongObj = yongObj
    // 填入码表头里的已知信息
    if ("name" in yongObj) {
      result.name = yongObj.name
    }
    if ("len" in yongObj) {
      result.maxCodeLen = Number.parseInt(yongObj.len)
    }
  }

  // 解析码表数据
  for (const [line, lineno] of utils.genEachLineJump(
    raw.slice(dataIndex === -1 ? 0 : dataIndex),
  )) {
    const realLineNo = lineno + headerLines
    // 跳过注释
    if (utils.quickStartWith(line, "#"))
      continue

    const [cd, ...words] = utils.quickSplit(line, " ")
    if (!validateCodes(cd))
      throw new FormatError("编码含有非法字符", lineno)

    if (words.length === 0)
      throw new FormatError("没有词语", lineno)

    for (const wd of words) {
      result.items.push({ wd, cd, ln: realLineNo })
    }
  }
  return result
}
// #endregion

// #region validate
function validate(raw: string): boolean {
  // 有[data]标记，则肯定是小小的格式
  const dataIndex = utils.indexOfLineEqualsIgnoreCase(raw, "[data]")
  if (dataIndex !== -1)
    return true

  // 检查码表数据行的格式
  for (const [line, lineno] of utils.genEachLineJump(raw)) {
    if (lineno > 20)
      return true
    // 检查每一行是 编码 空格 词组
    const [code, ...words] = utils.quickSplit(line, " ")
    if (validateCodes(code) && words.length > 0)
      continue
    return false
  }
  return true
}

// #endregion

// #region dump
function dump(mb: Mabiao): string {
  let result = ""
  if (mb.plat === "yong") {
    result = mb.header ?? ""
    result += "\n[data]\n"
  }
  const codeToWordsDict = getCodeToWordsDict(mb)

  // TODO: 处理空格
  for (const [cd, items] of codeToWordsDict) {
    result += `${cd} ${R.map(i => i.wd, items).join(" ")}\n`
  }

  return result
}
// #endregion
