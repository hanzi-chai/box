import type { Ref } from "vue"
import { nextTick, onMounted, onUnmounted, ref, toValue, watch } from "vue"

/** 组件卸载时会修改回原来的 */
export function useSetTitle(newtitle?: string) {
  let oldTitle = ""
  onMounted(() => {
    oldTitle = document.title
    document.title = newtitle ? `${newtitle} · 形码盒子` : "形码盒子"
  })
  onUnmounted(() => {
    document.title = oldTitle
  })
}

interface AbortableProps {
  end: () => boolean
  each: () => void
  onAbort?: () => void
}

/**
 * 可中断的辅助函数，
 * @returns 一个元组，0号是中断运行的abortController对象，1号是开始执行的函数
 */
export function useAbortable(opt: AbortableProps) {
  const ac = new AbortController()
  return [
    ac,
    async () => {
      while (!opt.end()) {
        if (ac.signal.aborted)
          return opt.onAbort?.()
        await nextTick()
        opt.each()
      }
    },
  ] as const
}

/**
 * 返回一个响应式对象。
 * 同时会侦听一个对象，如果它改动了，返回的对象会立即修改。
 */
export function twoLevelComputed<T>(watchObj: Ref<T>): Ref<T> {
  const b = ref(structuredClone(toValue(watchObj))) as Ref<T>
  watch(watchObj, (o) => {
    b.value = o
  })
  return b
}
