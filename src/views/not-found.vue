<script setup lang="ts">
import NotFoundPicture from "@/assets/undraw_page_not_found.svg"
</script>

<template>
  <ElResult
    title="找不到页面"
    :sub-title="`抱歉，您访问的 ${$route.path} 页面不存在 🙈`"
    icon="error"
  >
    <template #icon>
      <img :src="NotFoundPicture" alt="Page Not Found" width="240">
    </template>
    <template #extra>
      <ElButton type="primary" @click="$router.push('/')">
        返回首页
      </ElButton>
    </template>
  </ElResult>
</template>
