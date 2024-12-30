/** 每个按键的手感数据 */
import { KEYS_NO_SHIFT, KEYS_SHIFT, KEYS_UNO, KeyUno } from "@/libs/constants"
import Data from "./keys-data"

/**
每个手指的索引号，分别是：
|索引号|左右手|手指|
|---|---|---|
|0 | |拇指  |
|1 |左 |小指  |
|2 |左 |无名指|
|3 |左 |中指  |
|4 |左 |食指  |
|5 |左 |拇指  |
|6 |右 |拇指  |
|7 |右 |食指  |
|8 |右 |中指  |
|9 |右 |无名指|
|10|右 |小指  |
 */
export enum Fingers {
  Thumb = 0,
  LeftPinky = 1,
  LeftRing = 2,
  LeftMiddle = 3,
  LeftIndex = 4,
  LeftThumb = 5,
  RightThumb = 6,
  RightIndex = 7,
  RightMiddle = 8,
  RightRing = 9,
  RightPinky = 10,
}

export type KeyboardRows = 0 | 1 | 2 | 3 | 4

export const defaultKeyMagics = (() => {
  const len = KEYS_NO_SHIFT.length // 47
  const result = new Uint8Array(128)
  // dataArray 有 47+1+5 个按键的数据, 1 是空格键
  const dataArray: number[] = JSON.parse(Data)
  for (let i = 0; i < len; i++) {
    result[KEYS_NO_SHIFT.charCodeAt(i)] = dataArray[i]
    result[KEYS_SHIFT.charCodeAt(i)] = dataArray[i]
  }
  result[KEYS_UNO.charCodeAt(0) /* 空格键 */] = dataArray[len]

  // 要留意几个特殊的按键，不包括空格键，比如Tab键、Enter键等
  // 这里直接放到 uint8Array 中的头几个数字里。
  for (let i = 0; i < KEYS_UNO.length - 1; i++) {
    result[i] = dataArray[len + 1 + i] // len 是空格键，所以从 len+1 开始
  }
  return result
})()

/** 不考虑特殊功能键 */
export function getDefaultKeyMagicSimple(aKey: string) {
  return defaultKeyMagics[aKey.charCodeAt(0)]
}

export function getDefaultKeyMagic(aKey: string) {
  switch (aKey) {
    case KeyUno.Shift:
      return defaultKeyMagics[0]
    case KeyUno.BackSpace:
      return defaultKeyMagics[1]
    case KeyUno.Tab:
      return defaultKeyMagics[2]
    case KeyUno.Enter:
      return defaultKeyMagics[3]
    default:
      return defaultKeyMagics[aKey.charCodeAt(0)]
  }
}
export const magicRow = (magic: number) => (magic & 7) as KeyboardRows
export const magicFinger = (magic: number) => (magic >> 3) as Fingers
