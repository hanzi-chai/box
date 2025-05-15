import { customAlphabet } from "nanoid"

export const nanoid6 = customAlphabet(
  "346789ABCDEFGHJKLMNPQRTUVWXYabcdefghijkmnpqrtwxyz",
  6,
)

/**
 * 生成反向索引
 * @param i 可迭代的流数据，元素必须是数字或字符串
 * @returns 元素到索引的Map
 */
export function createWantIndex<T>(i: Iterable<T>) {
  return new Map([...i].map((v, ii) => [v, ii]))
}

const _cacheStore = new Map()

/**
 * 缓存一个值
 */
export function Cache(name: string, value: any) {
  if (!_cacheStore.has(name))
    _cacheStore.set(name, value)
  return value
}

/** 给定函数的函数代码，常用于new Function的特殊性能优化之中 */
export function functionBody(fn: any) {
  const str = fn.toString()
  return str.slice(str.indexOf("{") + 1, str.lastIndexOf("}"))
}

/**
 * 使用 requestIdleCallback 实现的可中断的调度器，构建时传入一个生成器.
 * 它可以暂停，再继续。但如果你不需要这么复杂的功能，直接使用 runGeneratorInIdle 即可。
 */
export class AbortableScheduler<T> {
  #generator: () => Generator<any, T, any>
  /** 如果暂停了，会记录当前的 Generator 状态 */
  #runningGenerator: Generator<any, T, any> | null = null
  #paused = false
  #idle: number | null = null
  #aborted = false

  onresult: (result: T) => void = () => { }
  onerror: (err: Error) => void = () => { }

  #destroy() {
    if (this.#idle !== null) {
      cancelIdleCallback(this.#idle)
      this.#idle = null
    }
    this.#runningGenerator = null
    this.#aborted = false
    this.#paused = false
  }

  constructor(generator: () => Generator<any, T, any>) {
    this.#generator = generator
  }

  run() {
    const gen = this.#runningGenerator || this.#generator()

    const idleCallback = (deadline: IdleDeadline) => {
      while (deadline.timeRemaining() > 0) {
        if (this.#aborted) {
          this.#destroy()
          return
        }
        if (this.#paused) {
          this.#runningGenerator = gen
          cancelIdleCallback(this.#idle!)
          this.#idle = null
          return
        }
        try {
          const n = gen.next()
          if (n.done) {
            this.onresult(n.value)
            this.#destroy()
            return
          }
        }
        catch (err) {
          this.onerror(err as Error)
          this.#destroy()
          return
        }
      }
      this.#idle = requestIdleCallback(idleCallback)
    }
    this.#idle = requestIdleCallback(idleCallback)
  }

  /** 重置生成器 */
  reset(generator: () => Generator<any, T, any>) {
    this.#destroy()
    this.#generator = generator
  }

  pause() {
    this.#paused = true
  }

  abort() {
    this.#aborted = true
  }
}
/**  非堵塞地运行一个生成器，可以中断运行。 */
export function runGeneratorInIdle<T>(generator: Generator<any, T, any> | (() => Generator<any, T, any>), abortController?: AbortController) {
  const g = typeof generator === "function" ? generator() : generator
  var idle = 0
  return new Promise<T>((resolve, reject) => {
    const idleCallback = (deadline: IdleDeadline) => {
      while (deadline.timeRemaining() > 0) {
        if (abortController?.signal?.aborted) {
          cancelIdleCallback(idle)
          reject(new Error(`主动中止 ${abortController.signal.reason}`))
          return
        }
        try {
          const n = g.next()
          if (n.done) {
            cancelIdleCallback(idle)
            resolve(n.value)
            return
          }
        }
        catch (err) {
          reject(err)
          return
        }
      }
      idle = requestIdleCallback(idleCallback)
    }
    idle = requestIdleCallback(idleCallback)
  })
}
