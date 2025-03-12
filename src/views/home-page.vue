<script setup lang="ts">
const buildtime = import.meta.env.BUILD_TIME
</script>

<template>
  <div class="flex justify-center">
    <div class="flex flex-col items-center gap-lg">
      <RouterLink to="/simulator">
        <el-button size="large">
          赛码器
        </el-button>
      </RouterLink>
      <RouterLink to="/simulator">
        <el-button size="large">
          测评工具
        </el-button>
      </RouterLink>
      <div class="font-misans text-xs text-gray-400 decoration-none">
        Build time: {{ buildtime }}<br>
        Under <a href="https://www.mozilla.org/en-US/MPL/2.0/" target="_blank">MPL2.0</a> lisence.<br>
        Welcome to our <a href="https://github.com/hanzi-chai/box" target="_blank">Github Repo</a>.<br>
      </div>
    </div>
  </div>
</template>
