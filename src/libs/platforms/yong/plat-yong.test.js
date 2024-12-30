import { platYong } from "./plat-yong"

describe("validate", () => {
  test("common", () => {
    expect(platYong.validate("abc")).toBeFalsy()
    expect(platYong.validate("abc 就")).toBeTruthy()
    expect(platYong.validate("abc 经 济")).toBeTruthy()
    expect(platYong.validate("[data]\nabc 就")).toBeTruthy()
    expect(platYong.validate("[DATA]\nabc 就")).toBeTruthy()
  })
  test("wrong code characters", () => {
    expect(platYong.validate("就 abc")).toBeFalsy()
  })
})

const mbContent = `name=码表
key=abcdefghijklmnopqrstuvwxyz;
len=4
dicts=mb/1.txt mb/2.txt
wildcard=z
[data]
a 工
aa 式
aaa 工
aaaa 工 允许多个 允许多行
`

describe("load", () => {
  test("common", () => {
    expect(platYong.load(mbContent)).toMatchSnapshot()
  })
})

describe("dump", () => {
  test("common", () => {
    const mb = platYong.load(mbContent)
    expect(platYong.dump(mb)).toBe(mbContent)
  })
})
