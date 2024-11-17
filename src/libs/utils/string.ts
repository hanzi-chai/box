// #region 更快速的标准库
/** 检查一个字符是不是空白字符 */
export function isSpace(char: string) {
    return (
        char === " " || char === "\r" || char === "\t" || char === "\n" || char === "\u00A0"
    ) /* 无中断空格 */
}

/** 第一个非空白字符 */
export function firstNonSpace(str: string) {
    for (const element of str) {
        if (!isSpace(element)) return element
    }
    return ""
}

/** 代替 String.trim，主要原理是避免正则表达式 */
export function quickTrim(str: string) {
    let a = 0
    const len = str.length
    let b = len
    for (let i = 0; i < len; i++) {
        if (!isSpace(str[i])) {
            a = i
            break
        }
    }
    if (a === len - 1) return ""
    for (let i = len - 1; i > a; i--) {
        if (!isSpace(str[i])) {
            b = i
            break
        }
    }
    return str.slice(a, b + 1)
}

/** 代替 String.trimEnd */
export function quickTrimEnd(str: string) {
    const len = str.length - 1
    let b = len
    for (let i = len; i > 0; i--) {
        if (!isSpace(str[i])) {
            b = i
            break
        }
    }
    return str.slice(0, b + 1)
}

/** 统计字符在字符串里出现的次数 */
export function countChar(str: string, char: string) {
    let c = 0
    for (let i = str.length - 1; i >= 0; i--) {
        if (str[i] === char) c++
    }
    return c
}

/**
 * 要提供返回的数组的长度，长度不能小于查询的字符。
 * 只能以单个字符作为分隔符
 */
export function quickSplitByLength(str: string, splitter: string, len: number) {
    const result: string[] = new Array(len)
    let start = 0
    let found = 0
    for (let i = 0; i < len; i++) {
        found = str.indexOf(splitter, start)
        // 字符串里的splitter数量不够
        if (found === -1) {
            result[i] = str.slice(start)
            return result
        }
        result[i] = str.slice(start, found)
        start = found + 1
    }
    return result
}

/** 代替 String.split */
export function quickSplit(str: string, splitter: string) {
    const count = countChar(str, splitter)
    switch (count) {
        case 0:
            return [str]
        case 1:
            return quickSplit2(str, splitter)
        default:
            return quickSplitByLength(str, splitter, count + 1)
    }
}

/** 把字符串拆成两段 */
export function quickSplit2(str: string, splitter: string): [string, string] {
    const i = str.indexOf(splitter)
    return [str.slice(0, i), str.slice(i + 1)]
}

/** 代替 String.startWith */
export function quickStartWith(str: string, prefix: string) {
    return str.slice(0, prefix.length) === prefix
}

/** 代替 String.endsWith */
export function quickEndsWith(str: string, suffix: string) {
    const len = str.length - suffix.length
    return str.slice(len) === suffix
}

// #endregion

/** 删除文件名的后缀名 */
export function removeFileNameExt(filename: string) {
    return filename.replace(/\.\w+$/, "")
}

// #region 解析文件

/**
 * 遍历每一行，提供每行内容和行号，
 * 会过滤空行，会去除后空白字符
 */
export function* genEachLineJump(src: string) {
    let find = 0
    let last = 0
    let lineno = 0
    let line = ""
    find = src.indexOf("\n")
    while (find !== -1) {
        ++lineno
        line = quickTrimEnd(src.slice(last, find))
        if (line) yield [line, lineno] as const
        last = find + 1
        find = src.indexOf("\n", last)
    }
    line = quickTrimEnd(src.slice(last))
    if (line) yield [src.slice(last), ++lineno] as const
}

/**
 * 快速地迭代每一行，假设换行符是 \n
 * 回调函数参数是 当前行内容 和 行开头的索引，如果返回 true, 则停止迭代
 */
export function eachlineQuick(src: string, cb: (line: string, index: number) => any) {
    let find = 0
    let last = 0
    find = src.indexOf("\n")
    while (find !== -1) {
        if (cb(src.slice(last, find), last)) return
        last = find + 1
        find = src.indexOf("\n", last)
    }
    cb(src.slice(last + 1), last)
}

export function* genEachLineRe(src: string) {
    const lineBreakerPattern = /\r?\n|\r/g
    let last = 0
    let match = lineBreakerPattern.exec(src)
    while (match) {
        yield src.slice(last, match.index)
        last = match.index + match[0].length
        match = lineBreakerPattern.exec(src)
    }
    yield src.slice(last)
}

/**
 * 迭代每一行，会过滤空行，同时返回每一行的行数
 * @param src
 */
export function* genEachLineJumpRe(src: string) {
    let lineNumber = 0
    for (const line of genEachLineRe(src)) {
        lineNumber++
        if (!line.trim()) continue
        yield [line, lineNumber] as const
    }
}

/** 解析TSV格式 */
export function parseTsv(txt: string, width = 2) {
    const result: string[][] = []
    for (const [line] of genEachLineJump(txt)) {
        result.push(quickSplitByLength(line, "\t", width))
    }
    return result
}

// #endregion

// #region 操作每一行
/** 如果文件里某一行只有一个单词，则返回该行最后一个字符的索引号  */
export function indexOfLineEquals(txt: string, keyWord: string) {
    let result = -1
    eachlineQuick(txt, (line, index) => {
        if (quickTrim(line) === keyWord) {
            result = index + line.length
            return true
        }
    })
    return result
}

/** 如果文件里某一行只有一个单词，则返回该行最后一个字符的索引号,会忽略大小写  */
export function indexOfLineEqualsIgnoreCase(txt: string, keyWord: string) {
    let result = -1
    const keyWordLower = keyWord.toLowerCase()
    eachlineQuick(txt, (line, index) => {
        if (quickTrim(line).toLowerCase() === keyWordLower) {
            result = index + line.length
            return true
        }
    })
    return result
}

/** 如果文件里某一行匹配了正则表达式，则返回该行最后一个字符的索引号  */
export function indexOfLineMatch(txt: string, pattern: RegExp) {
    let result = -1
    eachlineQuick(txt, (line, index) => {
        if (pattern.test(line)) {
            result = index + line.length
            return true
        }
    })
    return result
}
// #endregion
