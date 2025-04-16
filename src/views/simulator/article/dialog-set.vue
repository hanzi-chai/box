<!-- 截取文章，删除生僻字，去除多余空格 -->
<script setup lang="ts">
import { watchDebounced } from "@vueuse/core"
import { computed, ref, watch } from "vue"

const props = defineProps<{
  article: string
}>()

const emits = defineEmits<{
  result: [string]
}>()

const articleArray = computed(() => [...props.article])
const rangeMax = computed(() => articleArray.value.length)
const collapseWhiteSpaces = ref(false)
/**
 * @todo 只保留制定字集里的字。
 */
const filterToCharset = ref("all")

/**
 * 截取原字符串，从第几个索引开始截取，到第几个索引结束。
 * 字符串修改时需要重置这个比例
 */
const substringRange = ref([0, 0])

watch(articleArray, () => {
  substringRange.value[1] = articleArray.value.length
  substringRange.value[0] = 0
  collapseWhiteSpaces.value = false
}, { immediate: true })

function formatTooltip(n: number) {
  return `第${n + 1}字：${articleArray.value[n]}`
}

watchDebounced([substringRange, collapseWhiteSpaces], () => {
  // 截取字符串
  const [start, end] = substringRange.value
  let result = articleArray.value.slice(start, end).join("")
  // 去除多余空格，只保留第一个空格符号
  if (collapseWhiteSpaces.value) {
    result = result.replace(/\s{2,}/g, s => s[0])
  }
  emits("result", result)
}, { debounce: 500 })
</script>

<template>
  <ElForm>
    <ElFormItem label="截取文章">
      <ElSlider v-model="substringRange" range :max="rangeMax - 1" :min="0" :format-tooltip />
    </ElFormItem>
    <ElFormItem label="合并多余的空白字符">
      <ElSwitch v-model="collapseWhiteSpaces" />
    </ElFormItem>
  </ElForm>
</template>
