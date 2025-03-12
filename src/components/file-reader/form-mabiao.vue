<script setup lang="ts">
import type { UnwrapRef } from "vue"
import { ref, watch } from "vue"

const emit = defineEmits<{
  change: [form: UnwrapRef<typeof form>]
}>()

const form = ref({
  name: "",
  selectKeys: " 23456789",
  plat: "sogo",
  cmLen: 4,
})

watch(form, (n) => {
  emit("change", n)
})
</script>

<template>
  <ElForm :model="form" label-width="auto" label-position="right" size="small">
    <ElFormItem label="方案名称">
      <ElInput v-model="form.name" />
    </ElFormItem>
    <ElFormItem label="码表格式">
      <SelectMabiaoPlatform v-model="form.plat" />
    </ElFormItem>
    <ElFormItem label="选重键">
      <ElInput v-model="form.selectKeys" />
    </ElFormItem>
    <ElFormItem label="上屏码长">
      <ElInputNumber v-model="form.cmLen" :min="0" />
    </ElFormItem>
    <ElFormItem label="造词规则">
      <WordsRuleButton />
    </ElFormItem>
  </ElForm>
</template>
