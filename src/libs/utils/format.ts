import { trunc } from "./math"

export function formatFloat(f: number, fraction = 3, percent = false) {
    if (percent) return `${(f * 100).toFixed(fraction)}%`
    return f.toFixed(fraction)
}

export function formatTimeSpan(seconds: number): string {
    let result = ""
    let tmpSeconds = seconds

    const magic = [
        [604800, "周"],
        [86400, "天"],
        [3600, "时"],
        [60, "分"],
        [1, "秒"],
    ] as const
    for (const m of magic) {
        if (tmpSeconds >= m[0]) {
            result += `${trunc(tmpSeconds / m[0])} ${m[1]} `
            tmpSeconds = tmpSeconds % m[0]
        }
    }

    return result.trim()
}

/**
 * 把大数字转成汉字表达的几亿几万
 * 如果首尾是数字，会自动添加一个空格。
 * @param positive_number 被转换的数字,是正整数
 * @param cas 转换的层级,1表示一个层级,如: 约7亿,约8万.2表示两个层级,如 约7亿800万.3表示完整取整
 * @param addYue 不精确的数字前面是否添加 约
 */
export function formatYiWan(positive_number: number, cas = 1, addYue = true): string {
    if (positive_number < 1) return String(positive_number)
    let tmp_number = trunc(positive_number)
    const coll: string[] = []
    const magic = [
        [1e8, "亿"],
        [1e4, "万"],
        [1, ""],
    ] as const
    for (const [n, u] of magic) {
        if (tmp_number >= n) {
            coll.push(` ${trunc(tmp_number / n)} ${u}`)
            tmp_number = tmp_number % n
        }
    }
    let res = coll.slice(0, cas).join("")
    if (addYue && cas < coll.length) res = `约${res}`
    if (cas >= coll.length) res += " "
    return res
}

const numberIntlFormatter = new Intl.NumberFormat("zh-Hans-CN")

/** 添加千分位 */
export function formatInterger(num: number | bigint) {
    return numberIntlFormatter.format(num)
}
