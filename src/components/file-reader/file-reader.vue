<script setup lang="ts">
import * as utils from "@/libs/utils"
import { UploadFilled } from "@element-plus/icons-vue"
import { ref, watch } from "vue"

const p = withDefaults(
  defineProps<{
    strategy?: Strategy
    kindName?: string
  }>(),
  {
    strategy: "upload",
    kindName: "码表",
  },
)
const text = defineModel({ default: "", required: true })

const kindName = p.kindName as string

const strategies = [
  ["upload", `打开本地${kindName}文件`],
  ["clip", "读取系统剪切板"],
  ["textarea", "输入文本"],
] as const

type Strategy = (typeof strategies)[number][0]
const strategyRef = ref<Strategy>(p.strategy)

// 每次切换策略时，清空文本内容
watch(strategyRef, () => {
  text.value = ""
})

async function beforeUpload(file: File) {
  text.value = await utils.blobDetectAndRead(file, file.name)
  return false
}

async function readFromClipboard() {
  text.value = await utils.readStringFromClipboard()
}
</script>

<template>
  <ElSelect v-model="strategyRef" class="mb-4" :placeholder="`请选择${kindName}文件`" :limit="1">
    <ElOption v-for="s in strategies" :key="s[0]" :label="s[1]" :value="s[0]" />
  </ElSelect>
  <template v-if="strategyRef === 'upload'">
    <ElUpload drag :show-file-list="false" :multiple="false" :before-upload="beforeUpload">
      <ElIcon class="el-icon--upload">
        <UploadFilled />
      </ElIcon>
      <div class="el-upload__text">
        拖动{{ kindName }}文件到此处，或<em>点击上传</em>
      </div>
    </ElUpload>
  </template>
  <template v-else-if="strategyRef === 'clip'">
    <ElButton type="primary" class="my-6 ml-16 shadow-lg" size="large" @click="readFromClipboard">
      读取系统剪切板
    </ElButton>
  </template>
  <template v-else>
    <ElInput v-model="text" type="textarea" input-style="white-space: nowrap;" :rows="10" placeholder="请输入……" spellcheck="false" />
  </template>
  <!-- 底部信息 -->
  <div v-if="strategyRef !== 'textarea'" v-opacity="text.length > 0" class="select-text">
    <h4 class="mt-4 select-text text-gray-700">
      读取到{{ text.length }}个字符：
    </h4>
    <p class="el-upload__tip select-text truncate">
      {{ text.slice(0, 80) || '老歪的摸鱼之作' }}
    </p>
  </div>
</template>
