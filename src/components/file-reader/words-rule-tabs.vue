<script setup lang="ts">
import type { WordsRuleMethod } from "@/libs/evaluation/words-rules"
import { presetRules } from "@/libs/evaluation/words-rules"
import { ref } from "vue"
import jsTemplate from "./words-rule-template.js"

defineEmits<{
  (e: "rule", value: WordsRuleMethod): void
}>()

const chosenTab = ref(0)

const preset = ref(presetRules[0].key)

const customString = ref(jsTemplate)
</script>

<template>
  <ElTabs v-model="chosenTab">
    <ElTabPane label="预设" :name="0">
      <ElRadioGroup v-model="preset" size="large">
        <ElRadio v-for="item in presetRules" :key="item.key" :value="item.key">
          {{ item.label }}
        </ElRadio>
      </ElRadioGroup>

      <p class="text-slate-400">
        假如码表里有“斑ban、鬣lie、狗gou”这3个词条，<br>
        那么在《{{ presetRules[preset].label }}》里“斑鬣狗”一词的编码是{{ presetRules[preset].example }}
      </p>
    </ElTabPane>
    <ElTabPane label="JavaScript" :name="1">
      <ElInput v-model="customString" spellcheck="false" input-style="white-space: nowrap;" :rows="20" type="textarea" placeholder="请输入自定义规则" />
      <p class="font-misans pt-2 font-size-3 text-slate-400">
        小技巧：把上文粘贴到 <a href="https://www.typescriptlang.org/zh/play/?filetype=js#code/Q" target="_blank">TypeScript Playground</a> 或者 <a href="https://code.visualstudio.com/Download" target="_blank">VSCode 编辑器</a>里，有更好的编程体验。
      </p>
    </ElTabPane>
  </ElTabs>
</template>
