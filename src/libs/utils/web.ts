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

export async function writeStringToClipboard(str: string) {
    await navigator.clipboard.writeText(str)
}
