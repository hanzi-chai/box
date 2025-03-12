import { KEYS_ALL, KEYS_EQ, KEYS_NO_SHIFT } from "@/libs/constants"

/**
 * 生成一个函数，用于验证编码是否合规
 * @param validKeys 合规的键位，只能是ascii字符
 * @returns 验证函数
 */
export function makeValidateCodes(validKeys: string) {
  const keysArray = new Int8Array(128)
  for (let i = 0; i < validKeys.length; i++) {
    const charCode = validKeys.charCodeAt(i)
    keysArray[charCode] = 1
  }
  return (code: string): boolean => {
    for (let i = 0; i < code.length; i++) {
      const charCode = code.charCodeAt(i)

      // 非ASCII字符
      if (charCode > 127)
        return false

      // 不属于目标的按键
      if (!keysArray[charCode])
        return false
    }
    return true
  }
}

/**
 * 生成一个函数，用于验证编码是否合规。支持更多的键位，但性能不如makeValidateCodes
 * @param validKeys 合规的键位，可以使用非ASCII字符
 * @returns 验证函数
 */
export function makeValidateCodesExpanded(validKeys: string) {
  const keysSet = new Set(validKeys)

  return (code: string): boolean => {
    for (let i = 0; i < code.length; i++) {
      if (!keysSet.has(code[i])) {
        return false
      }
    }
    return true
  }
}

/**
 * 验证编码是否合规，按键只能是键盘主键盘区的48个可打字的字符
 * @param code 待验证的编码
 * @returns 能否成功
 */
export const validateCodes = makeValidateCodes(KEYS_NO_SHIFT)

/** 检查是不是当量所用的46个按键 */
export const validateCodesInEquivalent = makeValidateCodes(KEYS_EQ)

/** 所有可能的按键 */
export const validateCodesAll = makeValidateCodes(KEYS_ALL)

/**
 * 检查编码是否合规，按键只能是键盘主键盘区的48个可打字的字符
 * @param code 待验证的编码
 * @throws 不合规的编码报错
 * @returns 编码的参数
 */
export function checkCodes(code: string) {
  if (!validateCodes(code))
    throw new TypeError(`${code} 中含有不合规的按键。`)
  return code
}

/**
 * 检查编码是否合规，按键只能是键盘主键盘区的48个可打字的字符
 * @param code 待验证的编码
 * @throws 不合规的编码报错
 * @returns 编码的参数
 */
export function checkCodesAll(code: string) {
  if (!validateCodesAll(code))
    throw new TypeError(`${code} 中含有不合规的按键。`)
  return code
}
