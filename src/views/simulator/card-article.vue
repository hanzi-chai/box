<script setup lang="ts">
import { ref } from "vue"
import DragCard from "./card-drag.vue"

const content = ref("")
</script>

<template>
  <DragCard empty-label="拖动赛文文件至此，或者点击" @drop-file="c => content = c">
    {{ content.slice(0, 10) }}
    <template #empty="{ next }">
      <FileReader @text="t => content = t" />
      <div class="flex justify-right pt-3">
        <ElButton size="small" type="primary" plain @click="next()">
          确认
        </ElButton>
      </div>
    </template>
  </DragCard>
</template>
