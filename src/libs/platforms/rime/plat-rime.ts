/** rime会占用 mb.cache.rimeObj */

import * as utils from "@/libs/utils"

import { load as loadYaml } from "js-yaml"
import * as R from "rambdax"
import {
  createEmptyTextMabiao,
  MabiaoFormatError,
  type Mabiao,
  type MbItem,
  type TextMabiao,
  type TextPlatform,
} from "../types"

import logo from "./rime.png"

// #region 码表类型定义
export interface MbItemRime extends MbItem {
  meta?: Record<string, string | number>
}

export interface MbRime extends TextMabiao {
  items: MbItemRime[]
  plat: "rime"
}
// #endregion

// #region 平台信息
export const platRime = {
  id: "rime",
  nameEn: "Rime",
  nameZh: "中州韵",
  site: "https://rime.im/",
  ext: ".dict.yaml",
  logo,
  validate,
  load,
  dump,
} as const satisfies TextPlatform
// #endregion

// #region 平台信息的方法
// #region validate
// Rime 码表总是需要码表头的, 所以不需要检查码表内容格式
function validate(raw: string, title?: string) {
  // 根据文件名判断是否为Rime码表
  if (title && utils.quickEndsWith(title, ".dict.yaml")) {
    return true
  }
  // 根据文件首行注释判断
  if (utils.quickStartWith(raw, "# Rime")) {
    return true
  }

  let hasMinuses = false

  for (const [line] of utils.genEachLineJump(raw)) {
    // 跳过注释行
    if (utils.firstNonSpace(line) === "#")
      continue
    if (line === "---") {
      hasMinuses = true
      continue
    }
    if (line === "..." && hasMinuses) {
      return true
    }
  }
  return false
}
// #endregion

// #region dump
/** 把码表对象转换成rime格式的字符串 */
function dump(mb: Mabiao) {
  let txt = ""
  if (mb.plat === "rime") {
    txt += mb.header || ""
  }

  const columns: string[] = R.path("cache.rimeObj.columns", mb) || [
    "text",
    "code",
  ]
  const columnsLen = columns.length

  for (const item of mb.items) {
    for (let i = 0; i < columnsLen; i++) {
      if (i)
        txt += "\t"
      const key = columns[i]
      switch (key) {
        case "text":
          txt += item.wd
          break
        case "code":
          txt += item.wd
          break
        case "weight":
          txt += item.freq
          break
        default:
          txt += (item.meta as any)[key]
      }
    }
    txt += "\n"
  }

  return txt
}

// #endregion

// #region load
function load(raw: string, title?: string) {
  const result = createEmptyTextMabiao("rime") as MbRime

  if (title) {
    result.fileName = title
    result.name = title.replace(".dict.yaml", "")
  }
  result.txt = raw

  // 解析Rime码表头信息
  const start = raw.indexOf("---")
  const end = raw.indexOf("...")
  if (start === -1 || end === -1) {
    throw new MabiaoFormatError("缺少Rime码表头", 1)
  }

  result.header = raw.slice(0, end + 3)

  const header = raw.slice(start + 3, end)

  let headerObj: any
  try {
    headerObj = loadHeaderObj(header, title)
  }
  catch (error) {
    // 解析yaml格式出错
    if (error instanceof Error) {
      throw new MabiaoFormatError(`解析Yaml码表头出错：${error.message}`, 2)
    }
  }
  result.cache.rimeObj = headerObj

  result.name = headerObj.name
  result.version = headerObj.version

  // 解析码表内容
  const columns: string[] = headerObj.columns || ["text", "code"]
  const columnsLen = columns.length

  const mbItemTmpl: MbItemRime = {
    wd: "",
    cd: "",
    ln: 0,
  }
  if (columns.includes("weight"))
    mbItemTmpl.freq = 0
  if (hasExtraColumns(columns))
    mbItemTmpl.meta = undefined

  const dictStartLineno = utils.countChar(raw.slice(0, end), "\n")

  for (const [line, ln] of utils.genEachLineJump(raw.slice(end + 3))) {
    const lineno = ln + dictStartLineno + 2
    // 过滤注释行
    if (utils.firstNonSpace(line) === "#")
      continue
    const tmpMbItem: MbItemRime = { ...mbItemTmpl }
    tmpMbItem.meta = {}
    tmpMbItem.ln = lineno
    const parts = utils.quickSplitByLength(line, "\t", columnsLen)
    for (let i = 0; i < columnsLen; i++) {
      if (columns[i] === "text") {
        tmpMbItem.wd = parts[i]
        continue
      }
      if (columns[i] === "code") {
        tmpMbItem.cd = parts[i]
        continue
      }
      if (columns[i] === "weight") {
        const freq = Number.parseInt(parts[i])
        if (Number.isNaN(freq)) {
          throw new MabiaoFormatError("词频不是整数", lineno)
        }
        tmpMbItem.freq = freq
        continue
      }
      if (!parts[i])
        // 有可能是undefined或空字符串
        continue
      tmpMbItem.meta![columns[i]] = parts[i]
    }
    result.items.push(tmpMbItem)
  }
  return result
}

function hasExtraColumns(columns: string[]) {
  const columns3 = new Set(["text", "code", "weight"])
  for (const col of columns) {
    if (!columns3.has(col)) {
      return true
    }
  }
  return false
}

function loadHeaderObj(header: string, title?: string) {
  const yamlObj: any = loadYaml(header, { filename: title })
  if (R.isEmpty(yamlObj)) {
    throw new TypeError("Rime头信息是空的")
  }
  if (!yamlObj.name) {
    throw new TypeError("Rime头信息中没有name字段")
  }
  if (!yamlObj.version) {
    throw new TypeError("Rime头信息中没有version字段")
  }
  return yamlObj
}
// #endregion
// #endregion
