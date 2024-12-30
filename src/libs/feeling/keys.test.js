import { KeyUno } from "@/libs/constants"
import * as k from "./keys"

test("get space key info", () => {
  const ex = k.getDefaultKeyMagicSimple(" ")
  expect(k.magicRow(ex)).toBe(4)
  expect(k.magicFinger(ex)).toBe(k.Fingers.Thumb)
})

test("get & key info", () => {
  const ex = k.getDefaultKeyMagicSimple("&")
  expect(k.magicRow(ex)).toBe(0)
  expect(k.magicFinger(ex)).toBe(k.Fingers.RightIndex)
})

test("get backspace key info", () => {
  const ex = k.getDefaultKeyMagic(KeyUno.BackSpace)
  expect(k.magicRow(ex)).toBe(0)
  expect(k.magicFinger(ex)).toBe(k.Fingers.RightPinky)
})
