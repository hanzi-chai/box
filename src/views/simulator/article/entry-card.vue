<script setup lang="ts">
import { twoLevelComputed } from "@/libs/hooks"
import { ref, watch } from "vue"
import DragCard from "../card-drag.vue"
import SetDialog from "./dialog-set.vue"

const emits = defineEmits<{
  content: [content: string, title: string]
}>()

const content = ref("")
const reformedContent = twoLevelComputed(content)
const title = ref("")

watch([reformedContent, title], (v) => {
  emits("content", v[0], v[1])
})
</script>

<template>
  <DragCard empty-label="拖动赛文文件至此，或者点击" @drop-file="(c, t) => { content = c; title = t }">
    <h2 class="ma-3 text-sm text-bluegray-700 font-bold">
      {{ title }}
    </h2>
    <p class="ma-3 max-h-49 overflow-hidden text-sm text-bluegray-600">
      {{ reformedContent.slice(0, 2000) }}
    </p>
    <p class="ma-2 mr-6 text-right text-sm text-slate-800">
      共有 {{ reformedContent.length }} 个字符
    </p>

    <template #empty="{ next }">
      <FileReader v-model="content" kind-name="文本" />
      <div class="flex justify-right pt-3">
        <ElButton size="small" type="primary" plain :disabled="!content" @click="next()">
          确认
        </ElButton>
      </div>
    </template>

    <template #set>
      <SetDialog :article="content" @result="v => reformedContent = v " />
    </template>

    <template #evaluate>
      TODO 😎
    </template>
  </DragCard>
</template>
