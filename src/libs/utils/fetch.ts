async function customFetch<T>(url: string, handler: (f: Response) => Promise<T>) {
    const f = await fetch(url)
    if (f.ok) return handler(f)
    throw new Error(`无法下载${url}文件`)
}

export async function fetchText(url: string) {
    return await customFetch(url, (r) => r.text())
}

export async function fetchJson(url: string) {
    return await customFetch(url, (r) => r.json())
}

/**
 * 由于fetch不能在file协议下使用，因此需要JSONP, 请自己标注返回类型。
 * @param url 请求地址，是相对于index.html的路径，必须是javascript文件
 * @param callbackName 回调函数名，默认jsonp
 */
export function jsonp(url: string, callbackName = "jsonp") {
    return new Promise((resolve, reject) => {
        const script = document.createElement("script")
        script.src = url
        script.async = true
        // @ts-ignore
        window[callbackName] = (data) => {
            resolve(data)
            script.remove()
            // @ts-ignore
            window[callbackName] = undefined
        }
        script.onerror = (e) => {
            reject(e)
            script.remove()
            // @ts-ignore
            window[callbackName] = undefined
        }
        document.body.append(script)
    })
}
