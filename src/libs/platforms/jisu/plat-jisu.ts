import { validateCodes } from "@/libs/schema"
import * as utils from "@/libs/utils"

import {
  createEmptyTextMabiao,
  type Mabiao,
  type TextMabiao,
} from "../../schema"
import { MabiaoFormatError, type TextPlatform } from "../types"

import logo from "./jisu.png"

export interface MbJisu extends TextMabiao {
  plat: "jisu"
}

export const platJisu: TextPlatform = {
  id: "jisu",
  nameEn: "Jisu",
  nameZh: "极速赛码表",
  desc: "极速赛码器的码表，包含选重信息",
  site: "http://www.jsxiaoshi.com/",
  logo,
  validate,
  load,
  dump,
}

function validate(raw: string): boolean {
  const text = utils.quickTrim(raw)
  for (const [line, lineno] of utils.genEachLineJump(text)) {
    if (lineno > 80)
      return true

    const tabCounts = utils.countChar(line, "\t")
    if (tabCounts !== 1)
      return false

    const lineSplit = utils.quickSplit2(line, "\t")
    if (!validateJisuCodes(lineSplit[1]))
      return false
  }
  return true
}

/** 编码的后缀是数字或者_ */
const JisuCodesRe = /^(\D+?)(\d+|_)?$/

function validateJisuCodes(codes: string): boolean {
  if (!validateCodes(codes))
    return false
  return JisuCodesRe.test(codes)
}

function load(raw: string, title?: string): MbJisu {
  const result = createEmptyTextMabiao("duoduo") as MbJisu

  if (title) {
    result.fileName = title
    result.name = title.replace(/\.txt$/, "")
  }

  result.txt = raw
  for (const [line, lineno] of utils.genEachLineJump(raw)) {
    const tabCounts = utils.countChar(line, "\t")
    if (tabCounts !== 1) {
      throw new MabiaoFormatError("需要一个Tab分隔符", lineno)
    }
    const [wd, cd] = utils.quickSplit2(line, "\t")
    const matchResult = JisuCodesRe.exec(cd)
    if (!matchResult) {
      throw new MabiaoFormatError(`编码${cd}格式错误`, lineno)
    }
    const match2 = matchResult[2]
    let collision = 0
    if (match2 === "_") {
      collision = 1
    }
    else {
      collision = Number.parseInt(match2)
      if (Number.isNaN(collision))
        collision = 0
    }

    result.items.push({
      wd,
      cd: matchResult[1],
      ln: lineno,
      collision,
    })
  }
  return result
}

function dump(mb: Mabiao) {
  let txt = ""
  for (const item of mb.items) {
    txt += `${item.wd}\t${item.cd}\n`
  }
  return txt
}
