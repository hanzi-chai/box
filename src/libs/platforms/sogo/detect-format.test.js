import { detectPlatFormat } from './detect-format'

describe("detectPlatFormat", () => {
    test("common", () => {
        expect(detectPlatFormat("abc 234")).toBeNull()
        expect(detectPlatFormat("abc 是 你")).toMatchSnapshot()
        expect(detectPlatFormat("是你 abc").ahead).toBe(false)
        expect(detectPlatFormat("是你\tabc")).toEqual({ ahead: false, split: "\t", multi: false })
    })
    test("无视纯英文行", () => {
        expect(detectPlatFormat("a\tb\n是你\tabc")).toEqual({
            ahead: false,
            split: "\t",
            multi: false,
        })
    })
    test("一行多词", () => {
        expect(detectPlatFormat("a\tb\n是你\t不是\tabc")).toEqual({
            ahead: false,
            split: "\t",
            multi: true,
        })
    })
    test("混合分隔符", () => {
        expect(detectPlatFormat("是你\tabc 是")).toBeNull()
    })
})