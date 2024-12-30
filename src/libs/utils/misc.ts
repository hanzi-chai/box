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
  if (!_cacheStore.has(name)) _cacheStore.set(name, value)
  return value
}

/** 给定函数的函数代码，常用于new Function的特殊性能优化之中 */
export function functionBody(fn: any) {
  const str = fn.toString()
  return str.slice(str.indexOf("{") + 1, str.lastIndexOf("}"))
}

/** 使用 requestIdleCallback 实现的可中断的调度器，构建时传入一个生成器 */
export class AbortableScheduler {
  #generator: () => Generator<any, any, any>
  /** 如果暂停了，会记录当前的 Generator 状态 */
  #runningGenerator: Generator<any, any, any> | null = null
  #paused = false
  #idle: number | null = null
  #aborted = false

  result: any = null

  #destroy() {
    if (this.#idle !== null) {
      cancelIdleCallback(this.#idle)
      this.#idle = null
    }
    this.#runningGenerator = null
    this.#aborted = false
    this.#paused = false
  }

  constructor(generator: () => Generator<any, any, any>) {
    this.#generator = generator
  }

  run() {
    const gen = this.#runningGenerator || this.#generator()

    const idleCallback = (deadline: IdleDeadline) => {
      while (!deadline.didTimeout && deadline.timeRemaining() > 0) {
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
        const n = gen.next()
        if (n.done) {
          this.result = n.value
          this.#destroy()
          return
        }
      }
      this.#idle = requestIdleCallback(idleCallback, { timeout: 3000 })
    }
    this.#idle = requestIdleCallback(idleCallback, { timeout: 3000 })
  }

  pause() {
    this.#paused = true
  }

  abort() {
    this.#aborted = true
  }
}
