﻿<template>
  <div class="dynamic-manage-page">
    <div class="page-header">
      <h2 class="page-title">动态管理</h2>
      <el-button type="primary" @click="$router.push('/admin/dynamics/create')">
        <el-icon><Plus /></el-icon>发布动态
      </el-button>
    </div>
    <div class="dynamic-list" v-loading="loading">
      <div v-for="dynamic in dynamics" :key="dynamic._id" class="dynamic-item">
        <div class="dynamic-header">
          <span class="dynamic-time">{{ formatTime(dynamic.createdAt) }}</span>
          <el-button size="small" type="danger" @click="handleDelete(dynamic)">删除</el-button>
        </div>
        <div class="dynamic-content">{{ dynamic.content }}</div>
        <div v-if="dynamic.images && dynamic.images.length > 0" class="dynamic-images">
          <img v-for="(img, index) in dynamic.images" :key="index" :src="img" class="dynamic-image" />
        </div>
      </div>
      <div v-if="dynamics.length === 0 && !loading" class="empty-state">
        <el-icon size="48" color="#ccc"><Message /></el-icon>
        <p>暂无动态</p>
      </div>
    </div>
    <div class="pagination-wrapper" v-if="total > pageSize">
      <el-pagination
        v-model:current-page="currentPage"
        :page-size="pageSize"
        :total="total"
        layout="prev, pager, next"
        @current-change="loadDynamics"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Message } from '@element-plus/icons-vue'
import { getDynamicList, deleteDynamic as deleteDynamicApi } from '@/api/dynamic'

const dynamics = ref([])
const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(20)
const total = ref(0)

onMounted(async () => {
  await loadDynamics()
})

async function loadDynamics() {
  loading.value = true
  try {
    const res = await getDynamicList({
      page: currentPage.value,
      limit: pageSize.value
    })
    dynamics.value = res.data.list || res.data.dynamics || []
    total.value = res.data.total || 0
  } catch (e) {
    console.error('获取动态列表失败:', e)
  } finally {
    loading.value = false
  }
}

function formatTime(time) {
  const date = new Date(time)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
}

async function handleDelete(dynamic) {
  try {
    await ElMessageBox.confirm('确认删除该动态？', '提示', {
      type: 'warning',
      confirmButtonText: '确认',
      cancelButtonText: '取消'
    })
    await deleteDynamicApi(dynamic._id)
    ElMessage.success('删除成功')
    dynamics.value = dynamics.value.filter(d => d._id !== dynamic._id)
    total.value--
    if (dynamics.value.length === 0 && currentPage.value > 1) {
      currentPage.value--
      await loadDynamics()
    }
  } catch (e) {
    if (e !== 'cancel') {
      console.error('删除动态失败:', e)
    }
  }
}
</script>

<style lang="scss" scoped>
.dynamic-manage-page {
  padding: $spacing-lg;
  min-height: 100%;
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

.dynamic-list {
  max-width: 600px;
}

.dynamic-item {
  background: $color-white;
  padding: $spacing-lg;
  border-radius: $radius-lg;
  box-shadow: $shadow-sm;
  margin-bottom: $spacing-md;
}

.dynamic-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: $spacing-sm;
}

.dynamic-time {
  font-size: $font-size-sm;
  color: $color-text-secondary;
}

.dynamic-content {
  font-size: $font-size-base;
  line-height: 1.6;
  color: $color-text;
}

.dynamic-images {
  display: flex;
  flex-wrap: wrap;
  gap: $spacing-sm;
  margin-top: $spacing-md;
}

.dynamic-image {
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: $radius-md;
}

.empty-state {
  text-align: center;
  padding: $spacing-2xl;
  color: $color-text-secondary;
  p {
    margin-top: $spacing-sm;
  }
}

.pagination-wrapper {
  display: flex;
  justify-content: center;
  margin-top: $spacing-lg;
}
</style>
