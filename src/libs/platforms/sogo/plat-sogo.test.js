import { detectPlatFormat, platSogo } from "./plat-sogo"

describe("detectPlatFormat", () => {
  test("common", () => {
    expect(detectPlatFormat("abc 234")).toBeNull()

    expect(detectPlatFormat("abc 是 你")).toMatchSnapshot()

    expect(detectPlatFormat("是你 abc").ahead).toBe(false)
    expect(detectPlatFormat("是你\tabc")).toEqual({ ahead: false, split: "\t" })
  })
  test("无视纯英文行", () => {
    expect(detectPlatFormat("a\tb\n是你\tabc")).toEqual({
      ahead: false,
      split: "\t",
    })
  })
  test("混合分隔符", () => {
    expect(detectPlatFormat("是你\tabc 是")).toBeNull()
  })
})

describe("load", () => {
  test("common", () => {
    expect(
      platSogo.load("abc 是 不是\nedg 可以吗？", "demo.txt"),
    ).toMatchSnapshot()
  })
})
