/** 
 * 贪婪算法的赛码器，
 * 1. 先读取mabiao，生成内部对象(正则对象，词条→码表元素对象)
 * 2. 再据此切分文章，得到每个文章片段的按键编码，
 * 3. 最后根据编码计算所需的数值。
 * 
 * 为了性能，2、3两部合二为一
 */

import type { Mabiao, MbItem } from '../schema'
import { calcCollision, getMaxCodeLen, getMaxWordsLen, getSelectKeys } from '../schema'
import { PUNCTUATIONS } from "@/libs/constants"
import * as feel from "@/libs/feeling"
import * as utils from '@/libs/utils';
import { type SegValue, SegKind, type SegValuePunc } from './types'


//#region 读取码表

/** 读取码表，生成搜索的正则。
 * @param mb 码表
 * @param mabiaoOrder 是否严格按照码表顺序，默认false
 */
export function createSearchRegexPattern(mb: Mabiao, mabiaoOrder = false) {
    const len = mb.items.length
    const tmpArray = Array<string>(len)
    for (let i = 0; i < len; i++) {
        tmpArray[i] = mb.items[i].wd;
    }
    if (!mabiaoOrder) {
        tmpArray.sort((a, b) => b.length - a.length)
    }
    return new RegExp(`^(${tmpArray.join('|')})`)
}

/** 读取码表，生成搜索用的Map
 * @param mb 码表
 */
export function createSearchMap(mb: Mabiao) {
    calcCollision(mb)
    const r = new Map<string, MbItem>()
    for (const i of mb.items) {
        const mbi = r.get(i.wd)
        if (mbi && mbi.cd.length <= i.cd.length) {
            // 只保留更长的
            continue
        }
        r.set(i.wd, i)
    }
    return r
}

//#endregion


//#region 切分和测评

export interface SimurateOptions {
    /** 收集所有的切分结果，组成数组。 */
    collect?: boolean
}

export type SimurateResult = ReturnType<typeof simurate>

/** 切分 */
export function* simurate(mb: Mabiao, re: RegExp, map: Map<string, MbItem>, article: string, opt?: SimurateOptions) {
    const { uni, en, cn } = PUNCTUATIONS
    const articleLength = article.length
    let index = 0
    let tmpArticle = article
    /** 当前的按键编码  */
    let theseCodes = ""
    /** 上一轮里的最后一个按键 */
    let lastCode = ""
    const needCollect = opt?.collect || false
    /** 收集的全部数据 */
    const collectArray: SegValue[] = []

    let firstCharacter = ''
    let secondCharacter = ''

    ///// 下面是测评相关的变量
    /**
     * 选重频数分布
     *
     * 需要提供最大值,用于性能优化
     *
     * - 索引 0 顶字上屏
     * - 索引 1 首选
     * - 索引 2 二重
     */
    const collisionDist = utils.createZerosArray(calcCollision(mb))
    /**
     * 各长度的词语的次数,
     * 例：索引0表示上屏单字的次数
     *
     * 需要提供最大值,用于性能优化
     */
    const wordsDist = utils.createZerosArray(getMaxWordsLen(mb))
    /**
     * 不同编码长度的分布,例：索引0表示1码长的上屏次数
     *
     * 需要提供最大值,用于性能优化
     */
    const codeLenDist = utils.createZerosArray(getMaxCodeLen(mb))
    /** 各按键的频数 */
    const keysDist = utils.createZerosArray(128)
    /** 选重用的按键 */
    const collisionKeys = getSelectKeys(mb)
    const commitLength = 4
    /** 所有按键组合的为了性能，一开始只把键位组合统计到map里 */
    const comboDist: number[][] = Array.from({ length: 128 }, () => Array(128).fill(0))
    /** 方案里缺少的字符, 无法打出的字符 */
    const lackCounter = new Map<string, number>()

    //// 闭包函数，避免代码太长

    /** 有正常值（各种标点、码表）之后要做的事情。调用之前，先设置 `theseCodes` */
    const afterValue = () => {
        // 处理按键组合
        for (let i = 1; i < theseCodes.length; i++) {
            comboDist[theseCodes.charCodeAt(i - 1)][theseCodes.charCodeAt(i)]++
        }
        if (lastCode) {
            comboDist[lastCode.charCodeAt(0)][theseCodes.charCodeAt(0)]++
        }
        // 处理单个按键
        for (let i = 0; i < theseCodes.length; i++) {
            keysDist[theseCodes.charCodeAt(i)]++
        }
        lastCode = theseCodes[theseCodes.length - 1]
    }

    /** 处理两个字符的标点符号。调用前，先设置firstCharacter和secondCharacter */
    const handleTwoCharacterPunctuations = (punc: string, key: string, kind: SegValuePunc[0]) => {
        if (firstCharacter === punc[0] && secondCharacter === punc[1]) {
            index += 2
            theseCodes = key
            afterValue()
            if (needCollect)
                collectArray.push([kind, punc])
            return true
        }
        return false
    }

    while (index < articleLength) {
        yield index // 用于非阻塞

        tmpArticle = article.slice(index)

        // 用户码表里的词
        const match = re.exec(tmpArticle)
        if (match) {
            const item = map.get(match[1])!
            const { cd, collision, wd } = item
            collisionDist[collision! - 1] += 1

            // 处理词语长度
            const wdLen = [...wd].length
            wordsDist[wdLen - 1] += 1

            // 处理编码长度，不考虑选重键
            const cdLen = cd.length
            codeLenDist[cdLen - 1] += 1

            // 编码加选重键
            if (cdLen < commitLength || collision !== 1) {
                theseCodes = cd + collisionKeys[collision! - 1]
            }
            index += match[1].length
            afterValue()
            // 添加到收集数组
            if (needCollect)
                collectArray.push([SegKind.Mabiao, item])
            continue
        }

        firstCharacter = tmpArticle[0]
        secondCharacter = tmpArticle[1]
        // 是不是中文标点
        if (firstCharacter in cn) {
            // 破折号
            if (handleTwoCharacterPunctuations('——', cn['——'], SegKind.CnPunc)) continue
            if (handleTwoCharacterPunctuations('……', cn['……'], SegKind.CnPunc)) continue
            // 单个字符的中文标点
            index += 1
            theseCodes = cn[firstCharacter]
            afterValue()
            if (needCollect)
                collectArray.push([SegKind.CnPunc, firstCharacter])
            continue
        }

        // 是不是英文标点或英文字符，自动收集整串英文
        if (firstCharacter in en) {
            index += 1
            theseCodes = en[firstCharacter]
            while (index < articleLength && article[index] in en) {
                index += 1
                theseCodes += en[article[index]]
            }
            afterValue()
            if (needCollect)
                collectArray.push([SegKind.EnPunc, en[firstCharacter]])
            continue
        }

        // 是不是中英文通用的标点
        if (firstCharacter in uni) {
            if (handleTwoCharacterPunctuations('\r\n', uni['\r\n'], SegKind.UniPunc)) continue
            index += 1
            theseCodes = uni[firstCharacter]
            afterValue()
            if (needCollect)
                collectArray.push([SegKind.UniPunc, uni[firstCharacter]])
            continue
        }

        // 都不是的话，只可能是缺字了
        const wd = utils.firstCharacter(tmpArticle)
        lackCounter.set(wd, (lackCounter.get(wd) || 0) + 1)
        index += wd.length
        if (needCollect)
            collectArray.push([SegKind.Lack, wd])
        lastCode = ''
    } // end while 遍历文章

    // ② 测评
    let lacks = 0
    for (const e of lackCounter.values()) lacks += e
    const lackString = [...lackCounter.keys()].sort().join("")

    const singleCount = wordsDist[0]
    let commit = 0
    let char = 0
    for (let i = 0; i < wordsDist.length; i++) {
        const n = wordsDist[i]
        commit += n
        char += n * (i + 1)
    }

    let collision = 0
    for (const e of collisionDist) collision += e

    let codeLen = 0
    for (let i = 0; i < codeLenDist.length; i++) {
        const e = codeLenDist[i]
        codeLen += e * (i + 1)
    }

    const kbdRowDist = utils.createZerosArray(5)
    const finDist = utils.createZerosArray(11)
    let keys = 0
    for (let n = 0; n < keysDist.length; n++) {
        const count = keysDist[n]
        if (count === 0) continue
        keys += count
        const magic = feel.defaultKeyMagics[n]
        kbdRowDist[feel.magicRow(magic)] += count
        finDist[feel.magicFinger(magic)] += count
    }

    let combo = 0
    let sameFingers = 0
    const comboFeels = utils.createZerosArray(7)
    const diffHands = utils.createZerosArray(4)
    let Eq = 0
    for (let a = 0; a < comboDist.length; a++) {
        for (let b = 0; b < comboDist[a].length; b++) {
            const count = comboDist[a][b]
            combo += count

            const magic = feel.getComboMagicFromAscii(a, b)
            Eq += feel.magicEquivalentTen(magic) * count
            comboFeels[feel.magicComboType(magic)] += count
            const fin1 = feel.magicFinger(feel.defaultKeyMagics[a])
            const fin2 = feel.magicFinger(feel.defaultKeyMagics[b])

            //@ts-ignore
            sameFingers += (count * (fin1 === fin2))
            //@ts-ignore
            diffHands[((fin1 > 5) << 1) | (fin2 > 5)] += count
            // fin1 > 5 是右手
        }
    }
    Eq = Eq / 10

    return {
        lacks,
        lackString,
        lackCounter,
        wordsDist,
        singleCount,
        commit,
        char,
        collision,
        collisionDist,
        codeLen,
        codeLenDist,
        keys,
        keysDist,
        kbdRowDist,
        finDist,
        comboDist,
        combo,
        Eq,
        double: comboFeels[feel.ComboType.DoubleHit],
        singleSpan: comboFeels[feel.ComboType.SingleSpan],
        multiSpan: comboFeels[feel.ComboType.MultiSpan],
        longFD: comboFeels[feel.ComboType.LongFingersDisturb],
        littleFD: comboFeels[feel.ComboType.PinkyDisturb],
        sameFingers,
        leftLeft: diffHands[0],
        leftRight: diffHands[1],
        rightLeft: diffHands[2],
        rightRight: diffHands[3],
        diffHand: diffHands[1] + diffHands[2],
        collectArray,
    } as const
}



//#endregion





