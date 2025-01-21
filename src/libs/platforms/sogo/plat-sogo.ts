import type { TextPlatform } from "../types"
import { validateCodes } from "@/libs/schema"
import * as utils from "@/libs/utils"
import {
  createEmptyTextMabiao,
  type Mabiao,
  type TextMabiao,
} from "../../schema"

import logo from "./soubai.png"

// #region 类型定义

export interface MbSogo extends TextMabiao {
  plat: "sogo"
}
// #endregion

// #region platSogo
// TODO: 调查手机搜狗百度要求
export const platSogo = {
  id: "sogo",
  nameEn: "sougou/baidu",
  nameZh: "手机搜狗/百度",
  desc: `可用于移动端的搜狗输入法、百度输入法。
本项目采用规则如下：
1. UTF-8编码的txt文件
2. 编码只能是a-z，最多4个字母
3. 每行可以有多个词，每个元素之间用空格或制表符分隔
4. 最多20万对“词语-编码”数据
5. 建议把编码放在第一列，每行只放一个词，用空格分隔`,
  validate,
  load,
  dump,
  logo,
} as const satisfies TextPlatform

// #endregion

// #region 工具函数

function load(raw: string, title?: string): MbSogo {
  const result = createEmptyTextMabiao("sogo") as MbSogo

  result.txt = raw

  if (title) {
    result.fileName = title
    result.name = title.replace(/\.txt$/, "")
  }

  for (const [line, lineno] of utils.genEachLineJump(raw)) {
    const wordsSplit = line.split(/ |\t/)
    if (wordsSplit.length === 1)
      throw new TypeError(`第 ${lineno} 行只有一列数据`)

    const ahead = validateCodes(wordsSplit[0])

    // 编码在前
    if (ahead) {
      const cd = wordsSplit[0]
      for (const wd of wordsSplit.slice(1)) {
        if (wd === "")
          continue
        result.items.push({ wd, cd, ln: lineno })
      }
    }
    // 编码在后
    else {
      const cd = wordsSplit.pop()!
      for (const wd of wordsSplit) {
        if (wd === "")
          continue
        result.items.push({ wd, cd, ln: lineno })
      }
    }
  }
  return result
}

/** 验证是否为搜狗百度输入法的格式，由于格式的宽容度高，它一直返回正确， */
function validate(_: string): boolean {
  return true
}

/** 建议把编码放在第一列，每行只放一个词，用空格分隔 */
function dump(mb: Mabiao): string {
  let res = ""
  for (const { wd, cd } of mb.items) {
    res += `${cd} ${wd}\n`
  }
  return res
}

// #endregion
