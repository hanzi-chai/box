<script setup lang="ts">
import { useSetTitle } from "@/libs/hooks"
import { CaretRight } from "@element-plus/icons-vue"

useSetTitle("赛码器")
</script>

<template>
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
          <el-button>
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
      <el-card class="col-span-2">
        <h2>赛文</h2>
        {{ $route }}
        <template #footer>
          <ElButton>设置</ElButton>
          <ElButton>统计</ElButton>
        </template>
      </el-card>

      <ElCard class="col-span-2 sm:col-span-1">
        <h2>主码表</h2>
        {{ $parent }}
        <template #footer>
          <ElButton>设置</ElButton>
          <ElButton>测评</ElButton>
        </template>
      </ElCard>
      <ElCard class="col-span-2 sm:col-span-1">
        <h2 />副码表
        <template #footer>
          <ElButton>设置</ElButton>
          <ElButton>测评</ElButton>
        </template>
      </ElCard>
    </div>
  </el-page-header>
</template>
