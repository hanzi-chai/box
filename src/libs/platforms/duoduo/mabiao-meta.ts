import * as utils from "@/libs/utils"
import * as sch from "../../schema"

export interface DuoduoMeta {
  order?: number
  kind?: number
  fix?: boolean
  user?: boolean
  secondary?: boolean
  support?: boolean
}

const sharpControlZi = new Set("固用辅次类序")

export function validateDuoduoCodes(codes: string): boolean {
  const sharpSigIndex = codes.indexOf("#")
  if (sharpSigIndex === -1) return sch.validateCodes(codes)
  const nextZi = codes[sharpSigIndex + 1]
  return sharpControlZi.has(nextZi)
}

type CodesPair = [string, DuoduoMeta]
export function parseDuoduoCodes(src: string) {
  if (!src.includes("#")) return [sch.checkCodes(src), null] as const
  const srcTrim = utils.quickTrim(src)

  const srcSplit = utils.quickSplit(srcTrim, "#")
  const result: CodesPair = [sch.checkCodes(srcSplit[0]), {}]
  const resultMeta = result[1]
  for (let i = 1; i < srcSplit.length; i++) {
    const element = srcSplit[i]
    switch (element[0]) {
      case "序": {
        const orderNumber = Number.parseInt(element.slice(1))
        if (Number.isNaN(orderNumber))
          throw new TypeError(`编码「${src}」中的「#${element}」后方应该有整数`)
        resultMeta.order = orderNumber
        break
      }
      case "类": {
        const kindNumber = Number.parseInt(element.slice(1))
        if (Number.isNaN(kindNumber))
          throw new TypeError(`编码「${src}」中的「#${element}」后方应该有整数`)
        resultMeta.kind = kindNumber
        break
      }
      case "次":
        resultMeta.secondary = true
        break
      case "辅":
        resultMeta.support = true
        break
      case "用":
        resultMeta.user = true
        break
      case "固":
        resultMeta.fix = true
        break
      default:
        throw new TypeError(`无法分析编码「${src}」中的「#${element}」`)
    }
  }
  return result
}
