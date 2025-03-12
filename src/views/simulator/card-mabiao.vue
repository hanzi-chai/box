<script setup lang="ts">
import type { Mabiao } from "@/libs/schema"
import { allTextIdToImpl, detectAndFillMabiao } from "@/libs/platforms"
import { watchThrottled } from "@vueuse/core"
import { ref } from "vue"
import DragCard from "./card-drag.vue"

const content = ref("")
const dragCardRef = ref<InstanceType<typeof DragCard>>()
const mb = ref<Mabiao>()
watchThrottled(content, async (c) => {
  try {
    const res = await detectAndFillMabiao(c, "")
    mb.value = res
  }
  catch (e) {
    dragCardRef.value?.fail()
    throw e
  }
}, { throttle: 300 })
</script>

<template>
  <DragCard ref="dragCardRef" empty-label="拖动码表文件至此" @drop-file="c => content = c">
    <div v-if="mb" class="pa-3 text-sm">
      <div class="flex gap-2">
        <ul class="grow-1 overflow-hidden text-nowrap">
          <li v-for="i in mb.items.slice(0, 20)" :key="i.ln">
            <span class="text-bluegray-500">{{ i.cd }}</span>
            <span class="ml-2 text-bluegray-800">{{ i.wd }}</span>
          </li>
        </ul>
        <div class="over flex grow-1 flex-col text-xs text-bluegray-500 leading-relaxed">
          <div class="grow-auto" />
          <div class="grow-none">
            <p>
              码表格式：<span class="text-sm text-slate-900">{{ allTextIdToImpl[mb.plat!].nameZh }}</span>
            </p>
            <p>
              词条数量：<span class="text-sm text-slate-900">{{ mb.items.length }}</span>
            </p>
            <p>
              最大码长：<span class="text-sm text-slate-900">{{ mb.maxCodeLen }}</span>
            </p>
            <p>
              选重键：<span class="text-sm text-slate-900">{{ mb.selectKeys }}</span>
            </p>
          </div>
        </div>
      </div>
    </div>

    <template #empty="{ next }">
      <FileReader v-model="content" />
      <div class="flex justify-right pt-3">
        <ElButton size="small" type="primary" plain :disabled="!content" @click="next()">
          确认
        </ElButton>
      </div>
    </template>

    <template #set>
      <ElForm v-if="mb" v-model="mb" label-width="auto" label-position="right">
        <ElFormItem label="码表格式">
          <SelectMabiaoPlatform v-model="mb.plat!" />
        </ElFormItem>
        <ElFormItem label="码表名称">
          <ElInput v-model="mb.name" />
        </ElFormItem>
        <ElFormItem label="最大码长">
          <ElInputNumber v-model="mb.maxCodeLen" :min="0" />
        </ElFormItem>
        <ElFormItem label="选重键">
          <ElInput v-model="mb.selectKeys" />
        </ElFormItem>
        <ElFormItem label="造词规则">
          <WordsRuleButton />
        </ElFormItem>
      </ElForm>
    </template>
  </DragCard>
</template>
