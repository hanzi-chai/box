import { platRime } from "./plat-rime.ts"

const changjieDict = `# encoding: utf-8
#
# 單字碼表《五倉世紀》來自 www.chinesecj.com
#
# 又：
# 倉頡五代構詞碼碼表
# 由惜緣兄製作
# 佛振修訂於 2012-04-08
#
# License: GPL
#
# 說明：
# 詞彙編碼中，單字的取碼有幾種情況：
# 取首碼、取尾碼、取首尾二碼、取首、次、尾三碼。
# 輔助字形中的單字，在詞彙中直接用倉頡字母而不拆開；
# 包含結構的單字，被包含部分的編碼位於'符號之後，可據此取得尾碼。
#

---
name: "cangjie5"
version: "0.18"
sort: by_weight
use_preset_vocabulary: true
max_phrase_length: 7
min_phrase_weight: 100
columns:
  - text
  - code
  - stem
encoder:
  exclude_patterns:
    - '^x.*$'
    - '^z.*$'
  rules:
    - length_equal: 2
      formula: "AaAzBaBbBz"
    - length_equal: 3
      formula: "AaAzBaBzCz"
    - length_in_range: [4, 10]
      formula: "AaBzCaYzZz"
  tail_anchor: "'"
...

日	a
曰	a
昌	aa
昍	aa
昩	adj
暐	admq
暕	adwf	adw'f
`

const strokeDict = `
# Rime dictionary: stroke
# encoding: utf-8
#
# 五筆畫
# h,s,p,n,z 代表橫、豎、撇、捺、折
#
# 主碼表源自行政院國家發展委員會，CNS11643中文標準交換碼全字庫網站，http://www.cns11643.gov.tw。
# 由 Kunki Chou 整理
#
# 附碼表源自北大中文論壇
# 由孙海峰, 徐孟罗, 唐捺之, 谢振斌諸君整理
#
# 四季的風, 雪齋, Kunki Chou 製作 Rime 輸入方案
#

---
name: stroke
version: "1.1"
sort: by_weight              # 按字頻排序
use_preset_vocabulary: true  # 導入八股文字頻
max_phrase_length: 1         # 不生成詞彙
...

㐀	shhsh
㐁	hszpnh
㐂	hzhzhz
㐃	zns
㐄	hzs
㐅	pn`

describe("validate rime", () => {
  test("by title", () => {
    expect(platRime.validate("", "wb.dict.yaml")).toBeTruthy()
    expect(platRime.validate("", "wb.dict.yml")).toBeFalsy()
    expect(platRime.validate("", "wb.schema.yml")).toBeFalsy()
    expect(platRime.validate("", "schema.yml")).toBeFalsy()
  })

  test("by content", () => {
    expect(platRime.validate("# Rime dict: stroke")).toBeTruthy()
    expect(platRime.validate(changjieDict)).toBeTruthy()
    expect(platRime.validate(strokeDict)).toBeTruthy()
    expect(platRime.validate("name: stroke")).toBeFalsy()
  })
})

describe("load rime", () => {
  test("happy", () => {
    expect(platRime.load(changjieDict)).toMatchSnapshot()
  })
  test("check dict errors", () => {
    expect(() => platRime.load("㐀	shhsh")).toThrowError("缺少")
    expect(() => platRime.load("---\n...")).toThrowError("name")
    expect(() => platRime.load("---\nname: stroke\n...")).toThrowError(
      "version",
    )
    expect(
      platRime.load("---\nname: stroke\nversion: 2.3\n...\nabc\t123\n"),
    ).toMatchSnapshot()
  })
})
