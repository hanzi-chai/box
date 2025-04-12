<script setup lang="ts">
import { ref } from "vue"
import DragCard from "../card-drag.vue"

const content = ref("")
const title = ref("")
</script>

<template>
  <DragCard empty-label="拖动赛文文件至此，或者点击" @drop-file="(c, t) => { content = c; title = t }">
    <h2 class="ma-3 text-sm text-bluegray-700 font-bold">
      {{ title }}
    </h2>
    <p class="ma-3 max-h-49 overflow-hidden text-sm text-bluegray-600">
      {{ content.slice(0, 800) }}
      <span v-if="content.length > 800" class="mx-2 text-blue">……</span>
    </p>
    <p class="ma-2 mr-6 text-right text-sm text-slate-800">
      共有 {{ content.length }} 个字符
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
      TODO 😎
    </template>

    <template #evaluate>
      TODO 😎
    </template>
  </DragCard>
</template>
