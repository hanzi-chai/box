export function downloadFile<T extends Blob>(aFile: T, filename: string) {
  const href = URL.createObjectURL(aFile)
  const downloadElement = document.createElement("a")
  downloadElement.style.display = "none"
  downloadElement.href = href
  downloadElement.download = filename
  document.body.append(downloadElement)
  downloadElement.click()
  downloadElement.remove()
  URL.revokeObjectURL(href)
}

/** 是否有ElementPlus的对话框 */
export function hasElDialog() {
  return document.getElementsByClassName("el-dialog").length > 0
}

export async function writeStringToClipboard(str: string) {
  await navigator.clipboard.writeText(str)
}

export async function readStringFromClipboard() {
  try {
    return await navigator.clipboard.readText()
  }
  catch (err) {
    console.error(err)
    return ""
  }
}

export function sleep(milliseconds = 0) {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}
