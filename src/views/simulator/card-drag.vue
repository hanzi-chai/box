<script setup lang="ts">
import * as utils from "@/libs/utils"
import { CirclePlus, DataAnalysis, Delete, Operation } from "@element-plus/icons-vue"
import { ref } from "vue"

defineProps<{
  emptyLabel?: string
}>()

const e = defineEmits<{
  dropFile: [content: string, title: string]
  emptyClick: [next: () => void]
  clear: []
  set: []
  evaluate: []
}>()

defineExpose({
  fail,
})

const content = ref("")
const title = ref("")
const isDrag = ref(false)
const dropArea = ref<HTMLElement | null>(null)

const openEmptyDialog = ref(false)
const openSetDialog = ref(false)
const openEvaluateDialog = ref(false)

function dragenter(e: DragEvent) {
  // 如果有 el-dialog 打开，则不处理
  if (utils.hasElDialog())
    return
  e.preventDefault()
  isDrag.value = true
}

function dragleave(e: DragEvent) {
  e.preventDefault()
  const isStillInside = dropArea.value?.contains(document.elementFromPoint(e.clientX, e.clientY))
  if (!isStillInside)
    isDrag.value = false
}

async function readFileFromFileList(fl?: FileList | null) {
  const fileContent = await utils.fileListDetectAndRead(fl)
  content.value = fileContent
  title.value = fl?.[0].name || ""
  e("dropFile", fileContent, title.value)
}

async function drop(e: DragEvent) {
  e.preventDefault()
  isDrag.value = false
  const files = e.dataTransfer?.files
  await readFileFromFileList(files)
}

function next() {
  openEmptyDialog.value = false
  content.value = "我太懒了，不想动笔 😭"
  isDrag.value = false
}

function fail() {
  openEmptyDialog.value = false
  isDrag.value = false
  content.value = ""
}

function onDelete() {
  content.value = ""
  openEmptyDialog.value = false
  e("clear")
}
</script>

<template>
  <div
    ref="dropArea"
    class="relative h-80 flex flex-col overflow-hidden rounded-lg bg-white shadow-sm transition duration-500 hover:shadow-lg"
    @dragenter.stop="dragenter"
    @dragover.prevent=""
    @dragleave.prevent="dragleave"
    @drop="drop"
  >
    <div v-show="isDrag" class="absolute inset-0 z-80 bg-blue-200 bg-opacity-80">
      <p class="h-full flex select-none place-items-center justify-center text-center text-gray-700">
        释放文件，自动打开
      </p>
    </div>
    <!-- 打开文件的对话框 -->
    <el-dialog v-model="openEmptyDialog" width="20rem">
      <slot name="empty" :next />
    </el-dialog>
    <div
      v-if="!content"
      class="h-full flex flex-col cursor-pointer select-none place-items-center justify-center gap-5 bg-white from-blue-100/30 to-white text-left text-gray-700 hover:bg-gradient-to-t hover:text-blue-600"
      @click="openEmptyDialog = true"
    >
      <el-icon size="38" color="gray">
        <CirclePlus />
      </el-icon>
      <p>
        {{ emptyLabel || "拖动文件至此，或者点击" }}
      </p>
    </div>
    <div v-else class="max-h-67 overflow-hidden">
      <!-- 默认插槽，展示基本信息 -->
      <slot>
        <pre class="text-gray-700">{{ content.slice(0, 800) }}</pre>
      </slot>

      <!-- 设置弹窗 -->
      <el-dialog v-model="openSetDialog">
        <div class="ma-2">
          <slot name="set" />
        </div>
      </el-dialog>

      <!-- 测评弹窗 -->
      <el-dialog v-model="openEvaluateDialog" fullscreen :modal="false">
        <slot name="evaluate" />
      </el-dialog>
      <div class="absolute inset-x-0 bottom-0 flex">
        <el-button class="flex-1" size="large" :icon="Delete" type="warning" text @click="onDelete">
          清除
        </el-button>
        <el-button class="flex-1" size="large" :icon="Operation" type="success" text @click="openSetDialog = true; $emit('set')">
          设置
        </el-button>
        <el-button class="flex-1" size="large" :icon="DataAnalysis" type="primary" text @click="openEvaluateDialog = true; $emit('evaluate')">
          测评
        </el-button>
      </div>
    </div>
  </div>
</template>
