<script setup lang="ts">
import { ref } from "vue"

const showWordsRule = ref(false)
</script>

<template>
  <ElButton @click="showWordsRule = true">
    设置造词规则…
  </ElButton>
  <ElDialog v-model="showWordsRule" title="设置造词规则" class="min-w-sm" center>
    <WordsRuleTabs />
    <template #footer>
      <ElButton type="primary" size="default" @click="showWordsRule = false">
        确认
      </ElButton>
    </template>
  </ElDialog>
</template>
