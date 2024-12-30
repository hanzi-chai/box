/**
 * 按键组合的手感的数据
 */

import { KEYS_EQ, KEYS_SHIFT, KeyUno } from "@/libs/constants"
import comboData from "./combo-data.js"
import { ComboType } from "./combo-types.js"

export const defaultComboMagics = (() => {
  const result = new Uint8Array(128 * 128)
  const keys = KEYS_EQ
  const keysLen = keys.length

  const lowercaseAndUppercase = keys + KEYS_SHIFT.slice(0, 45) + KeyUno.Space

  const len = lowercaseAndUppercase.length

  let rawData = JSON.parse(comboData)

  for (let i = 0; i < len; i++) {
    const k1 = lowercaseAndUppercase.charCodeAt(i)
    for (let j = 0; j < len; j++) {
      const k2 = lowercaseAndUppercase.charCodeAt(j)
      const magic = rawData[(i % keysLen) * keysLen + (j % keysLen)]
      result[(k1 << 7) | k2] = magic
    }
  }
  rawData = null
  return result
})()

export const getDefaultComboMagic = (keys: string, index: number) =>
  defaultComboMagics[(keys.charCodeAt(index) << 7) | keys.charCodeAt(index + 1)]

export const magicPinkyDisturb = (magicNumber: number) =>
  (magicNumber & 7) === ComboType.PinkyDisturb

export const magicSingleSpan = (magicNumber: number) =>
  (magicNumber & 7) === ComboType.SingleSpan

export const magicLongFingersDisturb = (magicNumber: number) =>
  (magicNumber & 7) === ComboType.LongFingersDisturb

export const magicMultiSpan = (magicNumber: number) =>
  (magicNumber & 7) === ComboType.MultiSpan

export const magicDoubleHit = (magicNumber: number) =>
  (magicNumber & 7) === ComboType.DoubleHit

export const magicDifferentHands = (magicNumber: number) =>
  (magicNumber & 7) === ComboType.DifferentHands

/** 注意此处的当量是乘以10后的整数。 */
export const magicEquivalentTen = (magicNumber: number) => magicNumber >> 3

export const magicComboType = (magicNumber: number): ComboType =>
  magicNumber & 7
/**
 * 简单地计算按键组合的当量，已经除过10了，
 * 要提前处理一个按键的编码的当量 */
export const calcEq = (keys: string) => {
  let rs = 0
  for (let i = 1; i < keys.length; i++) {
    rs += magicEquivalentTen(getDefaultComboMagic(keys, i - 1))
  }
  return rs / 10
}

export const getComboMagicFromAscii = (first: number, second: number) =>
  defaultComboMagics[(first << 7) | second]
