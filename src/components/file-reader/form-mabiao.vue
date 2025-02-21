<script setup lang="ts">
import { allTextPlatforms } from "@/libs/platforms"
import { ref } from "vue"

const form = ref({
  name: "",
  selectKeys: " 23456789",
  plat: "sogo",
  cmLen: 4,
})
</script>

<template>
  <ElForm :model="form" label-width="auto" label-position="right" size="small">
    <ElFormItem label="方案名称">
      <ElInput v-model="form.name" />
    </ElFormItem>
    <ElFormItem label="码表格式">
      <ElSelect v-model="form.plat" placeholder="请选择">
        <ElOption v-for="item in allTextPlatforms" :key="item.id" :label="item.nameZh" :value="item.id">
          <img :src="item.logo" class="mr-3 inline-block align-baseline" style="width: 1em; height: 1em;">
          <div class="inline-block">
            {{ item.nameZh }}
          </div>
        </ElOption>
      </ElSelect>
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
