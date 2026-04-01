<!-- 单字测评工具（科学形码测评系统） -->
<script setup lang="ts">
import type { Mabiao } from "@/libs/schema"
import { onUnmounted } from "vue"
import { useEvaluateHanzi } from "@/libs/evaluation/hanzi"
import { useSetTitle } from "@/libs/hooks"

const props = defineProps<{
  mb: Mabiao
}>()

useSetTitle("单字测评")

const { total, progress, result } = useEvaluateHanzi({ mb: props.mb })

onUnmounted(() => result.abortFn?.())
</script>

<template>
  <!-- 因为单字测评速度通常较快，所以不用进度条而是骨架屏 -->
  <ElSkeleton :loading="result.eval.length === 0" :throttle="400">
    <table>
      <thead>
        <tr>
          <th>
            统计范围
          </th>
          <th>1码</th>
          <th>2码</th>
          <th>3码</th>
          <th>4码</th>
          <th>选重</th>
          <th>理论<br>二简</th>
          <th>加权<br>键长</th>
          <th>加权<br>字均当量</th>
          <th>加权<br>键均当量</th>
          <th>左右<br>互击</th>
          <th>同指<br>大跨排</th>
          <th>同指<br>小跨排</th>
          <th>小指<br>干扰</th>
          <th>错手</th>
          <th>三连击</th>
          <th>超标<br>键位</th>
          <th>缺字<br>标记</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{{ result.eval[0].start }}~{{ result.eval[0].end }}</td>
          <td>{{ result.eval[0].items[0] }}</td>
        </tr>
      </tbody>
    </table>
    {{ progress }}
    {{ total }}
    {{ result.finLoad }}
  </ElSkeleton>
</template>
