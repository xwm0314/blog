<template>
  <Teleport to="body">
    <el-dialog
      v-model="dialogVisible"
      title="裁剪头像"
      width="600px"
      :close-on-click-modal="false"
      :append-to-body="true"
      :modal-append-to-body="true"
      @close="handleClose"
    >
      <div class="cropper-container">
        <div class="cropper-area" ref="cropperArea">
          <img
            v-show="imageUrl"
            ref="imageRef"
            :src="imageUrl"
            class="crop-image"
            :style="imageStyle"
            @mousedown="startDrag"
            @touchstart="startDrag"
            @load="onImageLoad"
            draggable="false"
          />
          <div class="crop-overlay"></div>
          <div class="crop-frame">
            <div class="frame-corner top-left"></div>
            <div class="frame-corner top-right"></div>
            <div class="frame-corner bottom-left"></div>
            <div class="frame-corner bottom-right"></div>
          </div>
        </div>
      </div>
      <div class="cropper-tips">拖动图片调整位置，使用下方按钮缩放和旋转</div>
      <div class="cropper-actions">
        <button class="btn-action" @click="uploadFile">
          <el-icon><Upload /></el-icon>
          更换图片
        </button>
        <button class="btn-action" @click="rotateLeft">
          <el-icon><RefreshLeft /></el-icon>
          左旋
        </button>
        <button class="btn-action" @click="rotateRight">
          <el-icon><RefreshRight /></el-icon>
          右旋
        </button>
        <button class="btn-action" @click="zoomOut">
          <el-icon><Minus /></el-icon>
        </button>
        <button class="btn-action" @click="zoomIn">
          <el-icon><Plus /></el-icon>
        </button>
      </div>
      <template #footer>
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleConfirm" :disabled="!imageUrl">确认上传</el-button>
      </template>
      <input ref="fileInput" type="file" accept="image/*" hidden @change="handleFileChange" />
    </el-dialog>
  </Teleport>
</template>

<script setup>
import { ref, watch, nextTick, computed } from 'vue'
import { Upload, RefreshLeft, RefreshRight, Plus, Minus } from '@element-plus/icons-vue'

const props = defineProps({
  visible: Boolean,
  initialImage: String
})

const emit = defineEmits(['update:visible', 'confirm'])

const fileInput = ref(null)
const cropperArea = ref(null)
const imageRef = ref(null)
const imageUrl = ref('')
const dialogVisible = ref(false)
const scale = ref(1)
const translateX = ref(0)
const translateY = ref(0)
const rotation = ref(0)
const isDragging = ref(false)
const lastX = ref(0)
const lastY = ref(0)
const imageLoaded = ref(false)
const cropSize = ref(280)
const minScale = ref(0)

watch(() => props.visible, (val) => {
  dialogVisible.value = val
})

watch(dialogVisible, (val) => {
  if (!val) {
    emit('update:visible', false)
  }
})

const imageStyle = computed(() => ({
  transform: `translate(-50%, -50%) translate(${translateX.value}px, ${translateY.value}px) scale(${scale.value}) rotate(${rotation.value}deg)`,
  transformOrigin: 'center center'
}))

watch(() => props.visible, async (val) => {
  if (val) {
    resetState()
    if (props.initialImage) {
      imageUrl.value = props.initialImage
    }
    await nextTick()
    if (cropperArea.value) {
      const areaSize = Math.min(cropperArea.value.clientWidth, cropperArea.value.clientHeight)
      cropSize.value = Math.min(280, areaSize * 0.85)
    }
  }
})

function resetState() {
  scale.value = 1
  translateX.value = 0
  translateY.value = 0
  rotation.value = 0
  imageLoaded.value = false
  minScale.value = 0
}

function uploadFile() {
  fileInput.value?.click()
}

function handleFileChange(e) {
  const file = e.target.files[0]
  if (!file) return

  resetState()
  const reader = new FileReader()
  reader.onload = (event) => {
    imageUrl.value = event.target?.result || ''
  }
  reader.readAsDataURL(file)
  e.target.value = ''
}

function onImageLoad() {
  imageLoaded.value = true
  nextTick(() => {
    fitImage()
  })
}

function fitImage() {
  if (!imageRef.value || !cropperArea.value) return
  const image = imageRef.value
  const imgWidth = image.naturalWidth
  const imgHeight = image.naturalHeight
  const minSide = Math.min(imgWidth, imgHeight)

  minScale.value = cropSize.value / minSide

  if (imgWidth >= imgHeight) {
    scale.value = cropSize.value / imgHeight
  } else {
    scale.value = cropSize.value / imgWidth
  }

  translateX.value = 0
  translateY.value = 0
}

function startDrag(e) {
  if (!imageLoaded.value) return
  isDragging.value = true
  const point = e.touches ? e.touches[0] : e
  lastX.value = point.clientX
  lastY.value = point.clientY
  document.addEventListener('mousemove', onDrag)
  document.addEventListener('mouseup', stopDrag)
  document.addEventListener('touchmove', onDrag)
  document.addEventListener('touchend', stopDrag)
}

function onDrag(e) {
  if (!isDragging.value) return
  e.preventDefault?.()
  const point = e.touches ? e.touches[0] : e
  const dx = point.clientX - lastX.value
  const dy = point.clientY - lastY.value
  translateX.value += dx
  translateY.value += dy
  lastX.value = point.clientX
  lastY.value = point.clientY
}

function stopDrag() {
  isDragging.value = false
  document.removeEventListener('mousemove', onDrag)
  document.removeEventListener('mouseup', stopDrag)
  document.removeEventListener('touchmove', onDrag)
  document.removeEventListener('touchend', stopDrag)
}

function rotateLeft() {
  rotation.value -= 90
}

function rotateRight() {
  rotation.value += 90
}

function zoomIn() {
  scale.value = Math.min(scale.value * 1.2, 5)
}

function zoomOut() {
  scale.value = Math.max(scale.value / 1.2, minScale.value)
}

async function handleConfirm() {
  if (!imageUrl.value || !imageLoaded.value) return

  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  const size = 300
  canvas.width = size
  canvas.height = size

  const img = new Image()
  img.crossOrigin = 'anonymous'

  await new Promise((resolve, reject) => {
    img.onload = resolve
    img.onerror = reject
    img.src = imageUrl.value
  })

  ctx.save()
  ctx.translate(size / 2, size / 2)
  ctx.rotate((rotation.value * Math.PI) / 180)
  ctx.scale(scale.value * (size / cropSize.value), scale.value * (size / cropSize.value))
  ctx.drawImage(img, -img.width / 2 + translateX.value / scale.value, -img.height / 2 + translateY.value / scale.value)
  ctx.restore()

  const result = canvas.toDataURL('image/png')
  emit('confirm', result)
}

function handleClose() {
  imageUrl.value = ''
}
</script>

<style lang="scss" scoped>
.cropper-container {
  width: 100%;
  height: 400px;
  background: #222;
  border-radius: 8px;
  overflow: hidden;
}

.cropper-area {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  user-select: none;
}

.crop-image {
  position: absolute;
  top: 50%;
  left: 50%;
  cursor: move;
  max-width: none;
  max-height: none;
  pointer-events: auto;
  user-select: none;
  -webkit-user-drag: none;
}

.crop-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 280px;
  height: 280px;
  border-radius: 50%;
  border: 2px solid #fff;
  box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.6);
  pointer-events: none;
  box-sizing: content-box;
}

.crop-frame {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 280px;
  height: 280px;
  pointer-events: none;
  box-sizing: content-box;
}

.frame-corner {
  position: absolute;
  width: 14px;
  height: 14px;
  border-color: #fff;
  border-style: solid;
  border-width: 0;

  &.top-left {
    top: -2px;
    left: -2px;
    border-top-width: 3px;
    border-left-width: 3px;
  }
  &.top-right {
    top: -2px;
    right: -2px;
    border-top-width: 3px;
    border-right-width: 3px;
  }
  &.bottom-left {
    bottom: -2px;
    left: -2px;
    border-bottom-width: 3px;
    border-left-width: 3px;
  }
  &.bottom-right {
    bottom: -2px;
    right: -2px;
    border-bottom-width: 3px;
    border-right-width: 3px;
  }
}

.cropper-tips {
  text-align: center;
  color: #999;
  font-size: 12px;
  margin-top: 12px;
  margin-bottom: 4px;
}

.cropper-actions {
  display: flex;
  gap: 10px;
  margin-top: 8px;
  justify-content: center;
  flex-wrap: wrap;
}

.btn-action {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 14px;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  background: #fff;
  font-size: 13px;
  color: #666;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: $pink-400;
    color: $pink-500;
    background: $pink-50;
  }
}
</style>
