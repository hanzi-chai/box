import { platDuoduo } from "./plat-duoduo"

const testMabiao = `---config@码表分类=主码-次显码表

砹	aae
砹	aaem
安安分分	aaff#固
暗暗高兴	aagx
安安静静	aajj`

describe("base", () => {
  test("validate", () => {
    expect(platDuoduo.validate("bsdf\t是")).toBeFalsy()
    expect(platDuoduo.validate("核\t为")).toBeFalsy()
    expect(platDuoduo.validate("sdf\twx")).toBeTruthy()
    expect(platDuoduo.validate("什么\twx")).toBeTruthy()
    expect(platDuoduo.validate("什么\twx\tsdf")).toBeFalsy()
    expect(platDuoduo.validate("什么\twx#固")).toBeTruthy()
    expect(platDuoduo.validate("什么\twx#序234")).toBeTruthy()
    expect(
      platDuoduo.validate(`---config@码表别名=圆满版
app	app
ChatGPT	chat`),
    ).toBeTruthy()
  })

  test("load", () => {
    const mb = platDuoduo.load(testMabiao, "xima")
    expect(mb).toMatchSnapshot()
  })
})

describe("dump", () => {
  test("should work", () => {
    const mb = platDuoduo.load(testMabiao, "xima")
    expect(platDuoduo.dump(mb)).toMatchSnapshot()
  })
})
