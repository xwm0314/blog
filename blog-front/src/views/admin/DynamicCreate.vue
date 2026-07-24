﻿<template>
  <div class="dynamic-create-page">
    <div class="page-header">
      <h2 class="page-title">发布动态</h2>
      <el-button type="primary" @click="submitDynamic" :loading="submitting">发布</el-button>
    </div>
    <div class="dynamic-form">
      <el-input
        v-model="content"
        type="textarea"
        :rows="6"
        placeholder="分享你的想法..."
        class="content-input"
      />
      <div class="upload-area">
        <el-upload
          action="/api/upload"
          :headers="{ Authorization: 'Bearer ' + getToken() }"
          :multiple="true"
          :on-success="handleUploadSuccess"
          :on-error="handleUploadError"
          list-type="picture-card"
          :limit="9"
          class="image-upload"
        >
          <el-icon><Plus /></el-icon>
        </el-upload>
      </div>
      <div v-if="images.length > 0" class="preview-images">
        <div v-for="(img, index) in images" :key="index" class="preview-item">
          <img :src="img" alt="" />
          <el-icon class="delete-icon" @click="removeImage(index)"><Delete /></el-icon>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Plus, Delete } from '@element-plus/icons-vue'
import { getToken } from '@/utils/auth'
import { createDynamic } from '@/api/dynamic'

const router = useRouter()
const content = ref('')
const images = ref([])
const submitting = ref(false)

function handleUploadSuccess(response) {
  if (response.code === 0) {
    images.value.push(response.data.url)
    ElMessage.success('图片上传成功')
  } else {
    ElMessage.error(response.message || '上传失败')
  }
}

function handleUploadError() {
  ElMessage.error('图片上传失败')
}

function removeImage(index) {
  images.value.splice(index, 1)
}

async function submitDynamic() {
  if (!content.value.trim() && images.value.length === 0) {
    ElMessage.warning('请输入内容或上传图片')
    return
  }

  submitting.value = true
  try {
    await createDynamic({
      content: content.value,
      images: images.value
    })
    ElMessage.success('发布成功')
    router.push('/admin/dynamics')
  } catch (e) {
    ElMessage.error(e.message || '发布失败')
  } finally {
    submitting.value = false
  }
}
</script>

<style lang="scss" scoped>
.dynamic-create-page {
  padding: $spacing-lg;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: $spacing-lg;
}

.page-title {
  font-size: $font-size-xl;
  color: $color-text;
}

.dynamic-form {
  max-width: 600px;
  background: $color-white;
  padding: $spacing-xl;
  border-radius: $radius-lg;
  box-shadow: $shadow-sm;
}

.content-input {
  font-size: $font-size-base;
  line-height: 1.6;
}

.upload-area {
  margin-top: $spacing-md;
}

.preview-images {
  display: flex;
  flex-wrap: wrap;
  gap: $spacing-sm;
  margin-top: $spacing-md;
}

.preview-item {
  position: relative;
  width: 120px;
  height: 120px;
  border-radius: $radius-md;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .delete-icon {
    position: absolute;
    top: 4px;
    right: 4px;
    color: $color-white;
    background: rgba(0, 0, 0, 0.5);
    border-radius: 50%;
    padding: 4px;
    cursor: pointer;
  }
}
</style>
