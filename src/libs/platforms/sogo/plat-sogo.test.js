import { platSogo } from "./plat-sogo"


describe("load", () => {
  test("common", () => {
    expect(
      platSogo.load("abc 是 不是\nedg 可以吗？", "demo.txt"),
    ).toMatchSnapshot()
  })
})

describe('dump',() => { 
  test('common',() => { 
    expect(platSogo.dump(platSogo.load("abc 是 不是\n可以吗？ edg", "demo.txt"))).toMatchSnapshot()
   })
 })


 
