/**
 * 公认的基础数据
 */

/** 当量数据包含的键位, 不含包括空格 */
export const KEYS_MAIN = "1qaz2wsx3edc4rfv5tgb6yhn7ujm8ik,9ol.0p;/-['=]"
/** 不需要按shift键的键位 */
export const KEYS_NO_SHIFT = `${KEYS_MAIN}\\\``

/** 要按shift才能打出的，与 KEYS_NO_SHIFT 一一对应 */
export const KEYS_SHIFT = `!QAZ@WSX#EDC$RFV%TGB^YHN&UJM*IK<(OL>)P:?_{"+}|~`

export enum KeyUno {
  Space = " ",
  Shift = "↑",
  BackSpace = "←",
  Tab = "→",
  Enter = "↩",
}

/** 默认当量数据包含的46键位，包含空格 */
export const KEYS_EQ = KEYS_MAIN + KeyUno.Space

/** 特殊功能的按键：空格、shift、BackSpace、Tab、Enter */
export const KEYS_UNO = `${KeyUno.Space}${KeyUno.Shift}${KeyUno.BackSpace}${KeyUno.Tab}${KeyUno.Enter}`

/** 按shift键才能打出的字，映射回来 */
export const KEYS_TO_UPPER = (() => {
  const result: Record<string, string> = {}
  for (let i = 0; i < KEYS_SHIFT.length; i++) {
    result[KEYS_NO_SHIFT[i]] = KEYS_SHIFT[i]
  }
  return result
})()

/** 按shift键才能打出的字，映射回来 */
export const KEYS_TO_LOWER = (() => {
  const result: Record<string, string> = {}
  for (let i = 0; i < KEYS_SHIFT.length; i++) {
    result[KEYS_SHIFT[i]] = KEYS_NO_SHIFT[i]
  }
  return result
})()

/** 所有能用的按键 */
export const KEYS = KEYS_NO_SHIFT + KEYS_UNO

/** 所有按键 */
export const KEYS_ALL = KEYS + KEYS_SHIFT

type PunctuationsData = Record<"uni" | "cn" | "en", Record<string, string>>

export const PUNCTUATIONS: PunctuationsData = {
  // 中英文都能打出的字符
  uni: mixStr("0123456789=+-~@%#&* ", {
    "\n": KeyUno.Enter, // 换行
    "\r\n": KeyUno.Enter, // 换行
    "\r": KeyUno.Enter, // 换行
    "\t": KeyUno.Tab, // Tab符
  }),
  // 常见的中文标点
  cn: {
    "·": "`",
    "——": "_",
    "—": `_${KeyUno.BackSpace}`,
    "‘": "'",
    "’": "'",
    "“": "\"",
    "”": "\"",
    "……": "^",
    "…": `^${KeyUno.BackSpace}`,
    "、": "/",
    "。": ".",
    "《": "<",
    "》": ">",
    "【": "[",
    "】": "]",
    "！": "!",
    "（": "(",
    "）": ")",
    "，": ",",
    "：": ":",
    "；": ";",
    "？": "?",
    "￥": "$",
  },
  // 需要切换成英文模式后才能打出的英文符号
  en: mixStr(
    "',./\\[]`abcdefghijklmnopqrstuvwxyz{}^_:;<>?ABCDEFGHIJKLMNOPQRSTUVWXYZ\"$()",
    {},
  ),
}

function mixStr(str: string, other: object) {
  const r: Record<string, string> = {}
  for (const s of str) r[s] = s
  return Object.assign(r, other)
}
