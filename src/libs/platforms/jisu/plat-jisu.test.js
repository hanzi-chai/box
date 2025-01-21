import { platJisu } from "./plat-jisu"

const testMabiao = `酣	hj'_
胡	hjd
鹕	hjt_
翰	hjf_
鬟	hjg_
韩	hjh_
醐	hjj_
卉	hjk_
醢	hjk2
邯	hjm_`

describe("base", () => {
  test("validate", () => {
    expect(platJisu.validate("bsdf\t是")).toBeFalsy()
    expect(platJisu.validate("核\t为")).toBeFalsy()
    expect(platJisu.validate("sdf\twx")).toBeTruthy()
    expect(platJisu.validate("什么\twx")).toBeTruthy()
    expect(platJisu.validate("什么\twx\tsdf")).toBeFalsy()
  })

  test("load", () => {
    const mb = platJisu.load(testMabiao, "erbi")
    expect(mb).toMatchSnapshot()
  })
})

describe("dump", () => {
  test("should work", () => {
    const mb = platJisu.load(testMabiao, "erbi")
    expect(platJisu.dump(mb)).toMatchSnapshot()
  })
})
