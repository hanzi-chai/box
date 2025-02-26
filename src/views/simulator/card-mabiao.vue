<script setup lang="ts">
import DragCard from "./card-drag.vue"
</script>

<template>
  <DragCard empty-label="拖动码表文件至此">
    <slot />
  </DragCard>
</template>
