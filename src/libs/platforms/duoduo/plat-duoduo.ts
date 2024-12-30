import type { DuoduoMeta } from "./mabiao-meta"
import * as utils from "@/libs/utils"
import {
  createEmptyTextMabiao,
  FormatError,
  type Mabiao,
  type MbItem,
  type TextMabiao,
  type TextPlatform,
} from "../types"
import logo from "./duoduo.jpg"
import * as meta from "./mabiao-meta"

// #region 类型
export interface MbItemDuoduo extends MbItem {
  meta?: DuoduoMeta
}

export interface MbDuoduo extends TextMabiao {
  items: MbItemDuoduo[]
  plat: "duoduo"
}
// #endregion

// #region 平台
export const platDuoduo = {
  id: "duoduo",
  nameEn: "duoduo",
  nameZh: "多多",
  site: "http://chinput.vninv.com/forum.php",
  logo,
  validate,
  load,
  dump,
} as const satisfies TextPlatform

// #endregion

// #region 方法
function load(raw: string, title?: string) {
  const result = createEmptyTextMabiao("duoduo") as MbDuoduo

  if (title) {
    result.fileName = title
    result.name = title.replace(/\.txt$/, "")
  }

  result.txt = raw

  let header = ""
  for (const [line, lineno] of utils.genEachLineJump(raw)) {
    if (utils.quickStartWith(line, "---config@")) {
      header += line
      header += "\n"
      continue
    }
    const tabCounts = utils.countChar(line, "\t")
    if (tabCounts !== 1) {
      throw new FormatError("需要一个Tab分隔符", lineno)
    }

    try {
      const lineSplit = utils.quickSplit2(line, "\t")
      const codeParsed = meta.parseDuoduoCodes(lineSplit[1])
      const tmpItem: MbItemDuoduo = {
        wd: lineSplit[0],
        cd: codeParsed[0],
        ln: lineno,
      }
      if (codeParsed[1] !== null) {
        tmpItem.meta = codeParsed[1]
      }

      result.items.push(tmpItem)
    }
    catch (error) {
      if (error instanceof Error) {
        throw new FormatError(`词条编码错误：${error.message}`, lineno)
      }
    }
  }

  result.header = header
  return result
}

function validate(raw: string): boolean {
  const text = utils.quickTrim(raw)
  // Match table file header.
  if (text.startsWith("---config@"))
    return true
  for (const [line, lineno] of utils.genEachLineJump(text)) {
    if (lineno > 80)
      return true

    const tabCounts = utils.countChar(line, "\t")
    if (tabCounts !== 1)
      return false

    const lineSplit = utils.quickSplit2(line, "\t")
    if (!meta.validateDuoduoCodes(lineSplit[1]))
      return false
  }
  return true
}

// TODO: 其他平台转换

function dump(mb: Mabiao) {
  let txt = ""
  if (mb.plat === "duoduo") {
    txt = mb.header ?? ""
    txt += "\n"
  }
  for (const item of mb.items) {
    txt += `${item.wd}\t${item.cd}\n`
  }
  return txt
}

// #endregion
