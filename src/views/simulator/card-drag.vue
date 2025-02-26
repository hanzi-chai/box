<script setup lang="ts">
import * as utils from "@/libs/utils"
import {
  CirclePlus,
  DataAnalysis,
  Delete,
  Operation,
} from "@element-plus/icons-vue"
import { ref } from "vue"

defineProps<{
  emptyLabel?: string
}>()

const e = defineEmits<{
  file: [content: string]
  clear: []
  set: []
  evaluate: []
}>()

const content = ref("")
const isDrag = ref(false)
const dropArea = ref<HTMLElement | null>(null)
const inputRef = ref<HTMLInputElement | null>(null)

function dragenter(e: DragEvent) {
  e.preventDefault()
  isDrag.value = true
}

function dragleave(e: DragEvent) {
  e.preventDefault()
  const isStillInside = dropArea.value?.contains(
    document.elementFromPoint(e.clientX, e.clientY),
  )
  if (!isStillInside)
    isDrag.value = false
}

async function readFileFromFileList(fl?: FileList | null) {
  if (!fl) {
    throw new Error("没有文件")
  }
  if (fl.length > 1) {
    throw new Error("只能选择一个文件")
  }
  const fileContent = await utils.blobDetectAndRead(fl[0])
  content.value = fileContent
  e("file", fileContent)
}

async function drop(e: DragEvent) {
  e.preventDefault()
  isDrag.value = false
  const files = e.dataTransfer?.files
  await readFileFromFileList(files)
}

function inputClick() {
  inputRef.value?.click()
}

async function inputChange() {
  await readFileFromFileList(inputRef.value!.files)
}
</script>

<template>
  <div
    ref="dropArea"
    class="relative h-80 flex flex-col overflow-hidden rounded-lg bg-white shadow-sm transition duration-500 hover:shadow-lg"
    @dragenter.prevent="dragenter"
    @dragover.prevent=""
    @dragleave.prevent="dragleave"
    @drop="drop"
  >
    <input ref="inputRef" type="file" class="hidden" @change="inputChange">
    <div v-show="isDrag" class="absolute inset-0 z-80 bg-blue-200 bg-opacity-80">
      <p class="h-full flex place-items-center justify-center text-center text-gray-700">
        释放文件，自动打开
      </p>
    </div>
    <div
      v-if="!content" class="h-full flex flex-col cursor-pointer place-items-center justify-center gap-5 bg-white from-blue-100/30 to-white text-center text-gray-700 hover:bg-gradient-to-t hover:text-blue-600"
      @click="inputClick"
    >
      <el-icon size="38" color="gray">
        <CirclePlus />
      </el-icon>
      <p>
        {{ emptyLabel || '拖动文件至此，或者点击' }}
      </p>
    </div>
    <div v-else class="max-h-67 overflow-hidden">
      <slot>
        <pre class="text-gray-700">{{ content }}</pre>
      </slot>
      <div class="absolute inset-x-0 bottom-0 flex">
        <el-button class="flex-1" size="large" :icon="Delete" type="warning" text @click="content = '';$emit('clear')">
          清除
        </el-button>
        <el-button class="flex-1" size="large" :icon="Operation" type="success" text @click="$emit('set')">
          设置
        </el-button>
        <el-button class="flex-1" size="large" :icon="DataAnalysis" type="primary" text @click="$emit('evaluate')">
          测评
        </el-button>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
