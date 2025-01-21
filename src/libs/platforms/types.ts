import type { Mabiao, TextMabiao } from "../schema"

export type { Mabiao, MbItem, TextMabiao } from "../schema"
export { createEmptyTextMabiao } from "../schema"

/** 用纯文本储存的平台的码表 */
export interface TextPlatform {
  /** 唯一的标识名，符号 */
  id: string
  /** 面向用户的英文名称 */
  nameEn: string
  /** 面向用户的中文名称 */
  nameZh: string
  /** 平台的其他信息 */
  desc?: string
  /** 平台的网站URL */
  site?: string
  /** 平台的LOGO */
  logo?: string
  /** 文件扩展名，默认是.txt */
  ext?: string
  /** 文件的编码，默认是utf-8。如果码表有encoding属性，则使用码表的 */
  encoding?: string
  /**
   * 验证是不是这个平台。用于自动推测平台类型用。
   * 因为load允许码表有错，要提供即使有错也要告诉用户推测的平台类型。
   */
  validate: (raw: string, title?: string, ctx?: any) => boolean
  /**
   * 读取码表，转成内部结构。
   * 如果码表有错，请 Throw FormatError。
   */
  load: (raw: string, title?: string, ctx?: any) => TextMabiao
  /**
   * 序列化码表，把内部对象变成字符串。
   * 如果码表有错，请 Throw FormatError。
   * 码表的格式应该写在mb对象上。
   */
  dump: (mb: Mabiao, ctx?: any) => string
}

export class MabiaoFormatError extends Error {
  name = "MabiaoFormatError"
  constructor(
    msg: string,
    public ln: number,
  ) {
    super(msg)
  }
}
