<script setup lang="ts">
import { ref } from "vue"
import DragCard from "./card-drag.vue"

const content = ref("")
</script>

<template>
  <DragCard empty-label="拖动赛文文件至此，或者点击" @drop-file="c => content = c">
    {{ content.slice(0, 10) }}
    <template #empty="{ next }">
      <FileReader v-model="content" kind-name="文本" />
      <div class="flex justify-right pt-3">
        <ElButton size="small" type="primary" plain :disabled="!content" @click="next()">
          确认
        </ElButton>
      </div>
    </template>
  </DragCard>
</template>
