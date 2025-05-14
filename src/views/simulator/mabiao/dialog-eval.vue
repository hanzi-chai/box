<!-- 手感差的词条，字集，单字测评，造词测评 -->
<script setup lang="ts">
import type { Mabiao } from "@/libs/schema"
import { computed, onMounted, onUnmounted, ref, shallowRef, watch } from "vue"
import HanziTab from "./tab-hanzi.vue"

const props = defineProps<{
  mb: Mabiao
}>()

const activeTab = ref("hanzi")
</script>

<template>
  <ElTabs v-model="activeTab" type="card">
    <ElTabPane label="单字" name="hanzi">
      <HanziTab :mb="props.mb" />
    </ElTabPane>
    <ElTabPane label="字集" name="set">
      TODO
      😎
    </ElTabPane>
  </ElTabs>
</template>
