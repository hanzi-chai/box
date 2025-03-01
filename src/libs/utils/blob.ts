import DetectFileEncoding from "detect-file-encoding-and-language"

export function createTextBlob(content: string) {
  return new Blob([content], { type: "text/plain;charset=utf-8" })
}

/**
 * 推测二进制文件的编码
 * @throws {TypeError} 无法识别文件编码
 */
export async function blobDetectFileEncoding(src: Blob, filename = "") {
  const encoding = (await DetectFileEncoding(src)).encoding as string
  if (!encoding) {
    throw new TypeError(
      `无法识别文本文件《${filename}》的编码。建议转换成UTF-8编码。`,
    )
  }
  return encoding
}

/** 读取二进制数据为字符串，如果不填编码参数，默认为utf-8 */
export function readBlob(src: Blob, encoding?: string) {
  // 默认为utf-8
  if (!encoding) {
    return src.text()
  }
  return new Promise<string>((res, rej) => {
    const reader = new FileReader()
    reader.readAsText(src, encoding)
    reader.onload = () => {
      const resultText = reader.result as string
      res(resultText)
    }
    reader.onerror = () => {
      rej(reader.error)
    }
  })
}

/** 读取FileList，只能打开一个文件。用于拖拽或input元素 */
export async function fileListDetectAndRead(fl?: FileList | null) {
  if (!fl) {
    throw new Error("没有文件")
  }
  if (fl.length > 1) {
    throw new Error("只能选择一个文件")
  }
  return await blobDetectAndRead(fl[0])
}

export async function blobDetectAndRead(src: Blob, filename = "") {
  const encoding = await blobDetectFileEncoding(src, filename)
  return await readBlob(src, encoding)
}

export async function blobReadAsUint8Array(src: Blob) {
  const blobBuffer = await src.arrayBuffer()
  return new Uint8Array(blobBuffer)
}
