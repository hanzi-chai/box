<!-- 单字测评工具（科学形码测评系统） -->
<script setup lang="ts">
import type { Mabiao } from "@/libs/schema"
import { useEvaluateHanzi } from "@/libs/evaluation/hanzi"
import { useSetTitle } from "@/libs/hooks"
import { onUnmounted } from "vue"

const props = defineProps<{
  mb: Mabiao
}>()

useSetTitle("单字测评")

const { total, progress, result } = useEvaluateHanzi({ mb: props.mb })

onUnmounted(() => result.abortFn?.())
</script>

<template>
  {{ progress }}
  {{ total }}
  {{ result.finLoad }}
</template>
