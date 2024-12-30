/**
 * 原始文件对象
 */

import DetectFileEncoding from "detect-file-encoding-and-language"

// import { createTextBlob } from './utils'

export class RawFile {
  constructor(src: Blob | File | string, name = "") {
    this.name = name
    if (typeof src === "string") {
      // this.blob = createTextBlob(src)
      this.blob = new Blob()
      this.#encode = "UTF-8"
      this.txt = src
      this.size = src.length
      return
    }
    if (src instanceof File && !name)
      this.name = src.name
    this.blob = src
    this.size = src.size
  }

  readonly blob: Blob
  name = ""
  size

  #encode?: string
  get encoding() {
    if (!this.#encode)
      this.#encode = ""

    return this.#encode
  }

  set encoding(newEncoding: string) {
    this.#encode = newEncoding
    this.txt = undefined
  }

  /** 根据blob数据，推测文件编码 */
  async detectEncoding() {
    const enc = (await DetectFileEncoding(this.blob)).encoding as string
    if (!enc)
      throw new TypeError(`无法识别文件${this.name}的编码。`)
    this.encoding = enc
    return enc
  }

  /** 把blob数据读取成字符串 */
  async readBlob(): Promise<string> {
    const encoding = this.encoding
    if (encoding === "UTF-8") {
      this.txt = await this.blob.text()
      return this.txt
    }
    return new Promise<string>((res, rej) => {
      const reader = new FileReader()

      reader.readAsText(this.blob, encoding)
      reader.onload = () => {
        const resultText = reader.result as string
        this.txt = resultText
        res(resultText)
      }
      reader.onerror = () => {
        rej(reader.error)
      }
    })
  }

  /** 获取缓存的文本 */
  async getText() {
    // 没有缓存则生成一个新的
    if (!this.txt) {
      // 没有编码则重新检测
      if (!this.#encode)
        await this.detectEncoding()
      await this.readBlob()
    }
    return this.txt!
  }

  /** 尽量不要使用这个值 */
  public txt?: string

  async getBytes() {
    if (!this.#byte) {
      const blobbuffer = await this.blob.arrayBuffer()
      this.#byte = new Uint8Array(blobbuffer)
    }
    return this.#byte
  }

  // 二进制不在乎文件编码
  #byte?: Uint8Array
}
