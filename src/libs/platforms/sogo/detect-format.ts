import { getCodeToWordsDict, type Mabiao, validateCodes } from "@/libs/schema"
import * as utils from "@/libs/utils"

type SplitSpace = " " | "\t"

export interface FormatFlavor {
  /** 分隔符 */
  split: SplitSpace
  /** 编码在前，还是在最后一列 */
  ahead: boolean
  /** 每行是否多个词语 */
  multi: boolean
}

/** 按照指定的格式输出码表 */
export function dumpInFormat(mb: Mabiao, format: FormatFlavor) {
  let res = ""
  const { split, ahead, multi } = format
  if (multi) {
    for (const { wd, cd } of mb.items) {
      if (ahead)
        res += `${cd}${split}${wd}\n`
      else res += `${wd}${split}${cd}\n`
    }
    return res
  }
  // 每行多词
  for (const [codes, items] of getCodeToWordsDict(mb)) {
    const words = utils.map(items, v => v.wd).join(format.split)
    if (ahead)
      res += `${codes}${split}${words}\n`
    else res += `${words}${split}${codes}\n`
  }
  return res
}

/** 自动检查码表的格式，返回推测的格式，如果返回null，则无法推断出来 */
export function detectPlatFormat(text: string) {
  let multiCounter = 0
  let f: ReturnType<typeof detectEachline> = null
  for (const [l] of utils.genEachLineJump(text)) {
    f = detectEachline(l)
    // 没有分隔符或者纯英文行
    if (f === null) {
      continue
    }
    if (!f.multi) {
      if (++multiCounter > 10) {
        return f
      }
    }
    else {
      return f
    }
  }
  // 整个码表都推断不出，只可能是纯英文码表了，没有办法
  return f
}

/** 返回null表示无法推断出来，这个函数处理空格符号 */
function detectEachline(l: string) {
  const line = utils.quickTrim(l)
  // 只担心词条是纯英文的
  const tabindex = line.indexOf("\t")
  const spaceindex = line.indexOf(" ")
  if (tabindex === -1) {
    if (spaceindex === -1)
      // 没有分隔符
      return null
    // 只有 space
    const f = detectFormatFlavorEachline(line, spaceindex, " ")
    if (f)
      return f
  }
  else if (spaceindex === -1) {
    // 只有 tab
    const f = detectFormatFlavorEachline(line, tabindex, "\t")
    if (f)
      return f
  }
  // tab 和 空格都有
  else {
    // 尝试tab
    let f = detectFormatFlavorEachline(line, tabindex, "\t")
    if (f)
      return f
    // 尝试空格
    f = detectFormatFlavorEachline(line, spaceindex, " ")
    if (f)
      return f
  }
  return null
}

/** 返回null暗示了词语是英文 */
function detectFormatFlavorEachline(
  line: string,
  firstIndex: number,
  space: SplitSpace,
): FormatFlavor | null {
  const spaceCount = utils.countChar(line, space)
  const multi = spaceCount > 1

  const lastIndex = line.lastIndexOf(space)
  const codeAhead = validateCodes(line.slice(0, firstIndex))
  const lastIsCode = validateCodes(line.slice(lastIndex + 1))
  if (codeAhead && !lastIsCode)
    return { split: space, ahead: true, multi }

  if (!codeAhead && lastIsCode)
    return { split: space, ahead: false, multi }
  return null
}
