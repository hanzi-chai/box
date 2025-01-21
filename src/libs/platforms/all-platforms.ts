import type { TextPlatform } from "./types"
import * as Schema from "../schema"
import { platDuoduo } from "./duoduo"
import { platRime } from "./rime"
import { platSogo } from "./sogo"
import { platYong } from "./yong"

/** 顺序会影响自动推断的优先级 */
export const allTextPlatforms = [
  platDuoduo,
  platRime,
  platYong,
  platSogo,
] as const

export type PlatformIds = "duoduo" | "rime" | "sogo" | "yong" | "jisu"

// TODO: 极速赛码表格式 单单赛码表 chaifen.app的码表 冰凌

// #region 推测平台
export function detectTextPlatform(raw: string, fileName: string) {
  for (const plat of allTextPlatforms) {
    if (plat.validate(raw, fileName))
      return plat as TextPlatform
  }
  return null
}

/** 推测格式, 补全选重、码长等信息 */
export function detectAndFillMabiao(raw: string, fileName: string) {
  const plat = detectTextPlatform(raw, fileName)
  if (!plat)
    throw new Error("无法识别的码表格式")
  const mb = plat.load(raw, fileName)
  Schema.getMaxCodeLen(mb)
  mb.cmLen = mb.cmLen ?? mb.maxCodeLen
  Schema.getSelectKeys(mb)
  mb.txt = raw // 防错
  return mb
}
