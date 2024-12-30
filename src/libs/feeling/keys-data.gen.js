import { writeFileSync } from "node:fs"
import { KEYS } from "@/libs/constants"

/** 每一排的按键 */
export const KEYS_BY_LINE = [
  "`1234567890-=←",
  "→qwertyuiop[]",
  "asdfghjkl;'\\↩",
  "↑zxcvbnm,./",
  " ",
]

const key2line = new Map(
  KEYS_BY_LINE.flatMap((v, i) => [...v].map((v2) => [v2, i])),
)

/** 键位到手指的映射 */
const keyToFinger = {
  " ": 0,
  1: 1,
  q: 1,
  a: 1,
  z: 1,
  2: 2,
  w: 2,
  s: 2,
  x: 2,
  3: 3,
  e: 3,
  d: 3,
  c: 3,
  4: 4,
  r: 4,
  f: 4,
  v: 4,
  5: 4,
  t: 4,
  g: 4,
  b: 4,
  6: 7,
  y: 7,
  h: 7,
  n: 7,
  7: 7,
  u: 7,
  j: 7,
  m: 7,
  8: 8,
  i: 8,
  k: 8,
  ",": 8,
  9: 9,
  o: 9,
  l: 9,
  ".": 9,
  0: 10,
  p: 10,
  ";": 10,
  "/": 10,
  "-": 10,
  "[": 10,
  "'": 10,
  "=": 10,
  "]": 10,
  "\\": 10,
  "←": 10,
  "`": 1,
  "↩": 10,
  "↑": 1,
  "→": 1,
}

const result = [...KEYS].map((v) => (keyToFinger[v] << 3) | key2line.get(v))

console.log("max finger magic is:", Math.max(...result))

for (const k of KEYS) {
  console.log(k, keyToFinger[k], key2line.get(k))
}

const resultJson = JSON.stringify(result)
writeFileSync("keys-data.js", `export default "${resultJson}"`)
