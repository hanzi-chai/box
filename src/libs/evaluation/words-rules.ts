import type { HanziMap } from "./share"

export interface WordsRuleMethod {
  (words: string, utils: {
    hanziMap: HanziMap
  }): string
}

/** 五笔造词规则 */
export const ruleWubi: WordsRuleMethod = (words, { hanziMap }) => generalRule(words, hanziMap, GeneralRuleKind.Wubi)

/** 两笔造词规则 */
export const ruleErbi: WordsRuleMethod = (words, { hanziMap }) => generalRule(words, hanziMap, GeneralRuleKind.Erbi)

/** 郑码造词规则 */
export const ruleZhengma: WordsRuleMethod = (words, { hanziMap }) => generalRule(words, hanziMap, GeneralRuleKind.Zhengma)



/** 用于select组件 */
export const presetRules = [
  {
    label: "五笔",
    value: ruleWubi,
    example: "blgo"
  },
  {
    label: "两笔",
    value: ruleErbi,
    example: "balg"
  },
  {
    label: "郑码",
    value: ruleZhengma,
    example: "blig"
  },
].map((v, i) => ({ ...v, key: i }))

const enum GeneralRuleKind {
  Wubi,
  Erbi,
  Zhengma,
}

function generalRule(words: string, hanziMap: HanziMap, kind: GeneralRuleKind) {
  const wordsArray = [...words]
  const getHanziCodeViaMap = (hanziIndex: number) => {
    const cd = hanziMap.get(wordsArray[hanziIndex])
    if (!cd)
      throw new Error(`词语【${words}】中的第${hanziIndex + 1}个字〖${wordsArray[hanziIndex]}〗无法找到编码`)
    return cd.item.cd
  }
  const twoCodes = (index: number) => getHanziCodeViaMap(index).slice(0, 2)
  const firstCode = (index: number) => getHanziCodeViaMap(index)[0]

  switch (wordsArray.length) {
    case 1:
      throw new Error(`单字【${words}】无法造词`)
    case 2: {
      return twoCodes(0) + twoCodes(1)
    }
    case 3: {
      switch (kind) {
        case GeneralRuleKind.Wubi:
          return firstCode(0) + firstCode(1) + twoCodes(2)
        case GeneralRuleKind.Erbi:
          return twoCodes(0) + firstCode(1) + firstCode(2)
        case GeneralRuleKind.Zhengma:
          return firstCode(0) + twoCodes(1) + firstCode(2)
      }
    }
    default: {
      const lastIndex = wordsArray.length - 1
      return firstCode(0) + firstCode(1) + firstCode(2) + firstCode(lastIndex)
    }
  }
}