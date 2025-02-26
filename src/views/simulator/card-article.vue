<script setup lang="ts">
import DragCard from "./card-drag.vue"
</script>

<template>
  <DragCard empty-label="拖动赛文文件至此，或者点击">
    <slot />
  </DragCard>
</template>
