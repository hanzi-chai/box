<script setup lang="ts">
import { useSetTitle } from "@/libs/hooks"
import { MabiaoFormatError } from "@/libs/platforms"
import { CaretRight } from "@element-plus/icons-vue"
import { ElNotification } from "element-plus"
import { onErrorCaptured, ref } from "vue"
import CardArticle from "./card-article.vue"
import CardMabiao from "./card-mabiao.vue"

import HelpArticle from "./help-article.vue"

onErrorCaptured((err) => {
  if (err instanceof MabiaoFormatError) {
    ElNotification({
      title: `码表格式错误（第${err.ln}行）`,
      message: err.message,
      type: "error",
    })
  }
  else {
    ElNotification({
      title: "操作错误",
      message: err.message,
      type: "error",
    })
  }
})

useSetTitle("赛码器")

const helpDialog = ref(false)
</script>

<template>
  <ElScrollbar height="100vh">
    <el-page-header class="bg-gray-100 px-6 pt-4 min-h-dvh" @back="$router.push('/')">
      <template #title>
        <span class="hidden sm:block">
          首页
        </span>
      </template>
      <template #content>
        <div class="flex items-center">
          <span class="text-large mr-3 font-600">赛码器</span>
          <span class="mr-2 hidden text-sm md:block" style="color: var(--el-text-color-regular)">
            模拟方案打文章
          </span>
        </div>
      </template>
      <template #extra>
        <div class="flex items-center justify-center">
          <div class="hidden sm:block">
            <el-button @click="helpDialog = true">
              说明
            </el-button>
            <el-button>
              设置
            </el-button>
          </div>
          <el-button type="primary" size="large" class="ml-4" :icon="CaretRight" round>
            开赛！
          </el-button>
        </div>
      </template>

      <div class="grid grid-cols-2 m-auto max-w-screen-lg gap-5 p-4">
        <CardArticle class="col-span-2" />
        <CardMabiao class="col-span-2 md:col-span-1" />
        <CardMabiao class="col-span-2 md:col-span-1" />
      </div>
    </el-page-header>
  </ElScrollbar>
  <ElDialog v-model="helpDialog" title="赛码器工具说明" destroy-on-close>
    <div class="prose">
      <HelpArticle />
    </div>
  </ElDialog>
</template>
