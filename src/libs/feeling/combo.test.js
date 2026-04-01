import * as c from "./combo"

const getMagic = (s) => c.getDefaultComboMagic(s, 0)

test("combo 11", () => {
  const oo = getMagic("11")
  expect(oo).toBe(110)
})
test("combo =,", () => {
  const oo = getMagic("=,")
  expect(c.magicEquivalentTen(oo)).toBe(26)
})
test("combo g_", () => {
  const oo = getMagic("g ")
  expect(c.magicEquivalentTen(oo)).toBe(14)
})

test("combo ak", () => {
  const ak = getMagic("ak")
  expect(c.magicEquivalentTen(ak)).toBe(10)
  expect(c.magicPinkyDisturb(ak)).toBeFalsy()
  expect(c.magicDoubleHit(ak)).toBeFalsy()
  expect(c.magicLongFingersDisturb(ak)).toBeFalsy()
  expect(c.magicSingleSpan(ak)).toBeFalsy()
  expect(c.magicMultiSpan(ak)).toBeFalsy()
  expect(c.magicDifferentHands(ak)).toBeTruthy()
})

test("combo zw", () => {
  const zw = getMagic("zw")
  expect(c.magicEquivalentTen(zw)).toBe(21)
  expect(c.magicPinkyDisturb(zw)).toBeTruthy()
  expect(c.magicDoubleHit(zw)).toBeFalsy()
  expect(c.magicLongFingersDisturb(zw)).toBeFalsy()
  expect(c.magicSingleSpan(zw)).toBeFalsy()
  expect(c.magicMultiSpan(zw)).toBeFalsy()
})

test("combo Yb", () => {
  const yb = getMagic("Yb")
  expect(c.magicEquivalentTen(yb)).toBe(11)
  expect(c.magicDifferentHands(yb)).toBeTruthy()
  expect(c.magicPinkyDisturb(yb)).toBeFalsy()
})

test("combo )P", () => {
  const yb = getMagic(")P")
  expect(c.magicEquivalentTen(yb)).toBe(17)
  expect(c.magicDifferentHands(yb)).toBeFalsy()
  expect(c.magicSingleSpan(yb)).toBeTruthy()
})
