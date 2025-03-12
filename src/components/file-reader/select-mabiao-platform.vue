<script setup lang="ts">
import { allTextPlatforms } from "@/libs/platforms"

const platform = defineModel({ default: "sogo", required: true })
</script>

<template>
  <ElSelect v-model="platform" placeholder="请选择">
    <ElOption v-for="item in allTextPlatforms" :key="item.id" :label="item.nameZh" :value="item.id">
      <img :src="item.logo" class="mr-3 inline-block align-baseline" style="width: 1em; height: 1em;" :alt="`${item.nameZh}平台LOGO`">
      <div class="inline-block">
        {{ item.nameZh }}
      </div>
    </ElOption>
  </ElSelect>
</template>
