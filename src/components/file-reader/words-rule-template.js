export default `// @ts-check
/**
 * @description 用户自定义造词规则
 * @param {string} words 需要处理的词语
 * @param {RuleUtils} utils 工具方法
 * @returns {string} 返回这个词语的编码
 */
export function customRule(words, utils) {
  // 请在此处开始编写自定义规则，不要改动上面的内容！

  // 这是是五笔造词规则的示范
  const wordsArr = [...words]
  const len = wordsArr.length

  /** @typedef {(index: number) => string} CodeFn */
  /** @type {CodeFn} */
  const myGetCode = (index) => {
    const cd = utils.getCode(wordsArr[index])
    if (!cd) {
      throw new Error(\`没有找到字【\${wordsArr[index]}】的编码\`)
    }
    return cd
  }
  /** @type {CodeFn} */
  const firstCode = index => myGetCode(index)[0]
  /** @type {CodeFn} */
  const twoCodes = index => myGetCode(index).slice(0, 2)

  if (len === 1) {
    throw new Error("不应该是单字")
  }
  if (len === 2) {
    return twoCodes(0) + twoCodes(1)
  }
  if (len === 3) {
    return firstCode(0) + firstCode(1) + twoCodes(2)
  }
  return firstCode(0) + firstCode(1) + firstCode(2) + firstCode(len - 1)
  // 下文的内容请勿改动！
}

/**
 * @typedef {object} RuleUtils
 * @property {(hanzi: string) => string|undefined} getCode
 * 获取某字的编码，如果没有找到这个字的编码，则返回 undefined
 */
`