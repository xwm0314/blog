<template>
  <div class="dynamic-detail-page">
    <div class="page-ambient"></div>
    <article class="dynamic-content">
      <div class="dynamic-header">
        <span class="dynamic-date">{{ formatDate(dynamic.createdAt) }}</span>
        <span class="dynamic-badge">动态</span>
      </div>
      <div class="dynamic-text" v-if="dynamic.content">{{ dynamic.content }}</div>
      <div v-if="dynamic.images && dynamic.images.length > 0" class="dynamic-images">
        <img v-for="(img, index) in dynamic.images" :key="index" :src="img" class="dynamic-image" @click="previewImage(img)" />
      </div>
    </article>

    <div class="back-section">
      <button class="back-btn" @click="goBack">
        <span class="back-arrow">&larr;</span>
        <span>返回首页</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getPublishedDynamicDetail } from '@/api/dynamic'

const route = useRoute()
const router = useRouter()

const dynamic = ref({ content: "", images: [], createdAt: "" })
const showViewer = ref(false)
const viewerUrlList = ref([])
const viewerInitialIndex = ref(0)

function formatDate(dateStr) {
  if (!dateStr) return ""
  const d = new Date(dateStr)
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`
}

function previewImage(url) {
  viewerUrlList.value = dynamic.value.images || []
  viewerInitialIndex.value = viewerUrlList.value.indexOf(url)
  showViewer.value = true
}

async function loadDynamic() {
  const id = route.params.id
  if (!id) return
  try {
    const res = await getPublishedDynamicDetail(id)
    dynamic.value = res.data?.dynamic || {}
  } catch (e) { console.error("加载动态详情失败:", e) }
}

function goBack() { router.push("/") }

onMounted(() => { loadDynamic() })
</script>

<style lang="scss" scoped>
.dynamic-detail-page {
  padding: $spacing-2xl $spacing-lg $spacing-3xl;
  max-width: 700px;
  margin: 0 auto;
  position: relative;
}

.page-ambient {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  background:
    radial-gradient(ellipse 55% 40% at 30% 25%, rgba($pink-300, 0.12) 0%, transparent 50%),
    radial-gradient(ellipse 40% 50% at 70% 60%, rgba($pink-400, 0.08) 0%, transparent 50%),
    radial-gradient(ellipse 35% 40% at 50% 80%, rgba($pink-200, 0.06) 0%, transparent 50%);
  background-size: 180% 180%;
  animation: dynFlow 26s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite;
}

@keyframes dynFlow {
  0% { background-position: 30% 25%, 70% 60%, 50% 80%; }
  25% { background-position: 40% 20%, 55% 45%, 40% 60%; }
  50% { background-position: 55% 35%, 45% 35%, 60% 50%; }
  75% { background-position: 25% 45%, 65% 25%, 35% 70%; }
  100% { background-position: 30% 25%, 70% 60%, 50% 80%; }
}

@media (prefers-reduced-motion: reduce) { .page-ambient { animation: none; } }

.dynamic-content {
  position: relative;
  z-index: 1;
  background: rgba(255, 255, 255, 0.94);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-radius: $radius-xl;
  padding: $spacing-2xl;
  border: 1px solid $warm-gray-200;
  box-shadow: 0 1px 2px rgba($pink-800, 0.04);
  transition: box-shadow $transition-slow;
  &:hover { box-shadow: $shadow-sm; }
}

.dynamic-header {
  display: flex; align-items: center; gap: $spacing-md;
  margin-bottom: $spacing-lg; padding-bottom: $spacing-lg;
  border-bottom: 1px solid $warm-gray-100;
}

.dynamic-date { font-size: $font-size-sm; color: $color-text-secondary; }

.dynamic-badge {
  font-size: $font-size-xs; padding: 2px 10px;
  background: rgba($pink-500, 0.08); color: $pink-500;
  border-radius: 999px; font-weight: $font-weight-medium;
}

.dynamic-text {
  font-size: $font-size-md; line-height: 1.8; color: $color-text;
  white-space: pre-wrap; word-break: break-word; margin-bottom: $spacing-lg;
}

.dynamic-images { display: flex; flex-direction: column; gap: $spacing-md; }

.dynamic-image {
  width: 100%; border-radius: $radius-md; cursor: pointer;
  transition: transform $transition-fast, box-shadow $transition-fast;
  &:hover { transform: scale(1.01); box-shadow: $shadow-sm; }
}

.back-section {
  position: relative; z-index: 1; margin-top: $spacing-xl; display: flex; justify-content: center;
}

.back-btn {
  display: inline-flex; align-items: center; gap: $spacing-sm;
  padding: $spacing-sm $spacing-lg; border: 1px solid $warm-gray-200;
  border-radius: 999px; background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(8px); color: $color-text-secondary;
  font-size: $font-size-sm; cursor: pointer;
  transition: all $transition-fast;
  box-shadow: 0 1px 2px rgba($pink-800, 0.04);
  &:hover {
    border-color: $pink-300; color: $pink-600;
    background: rgba($pink-100, 0.5); transform: translateY(-2px); box-shadow: $shadow-sm;
  }
  &:active { transform: scale(0.97); }
}
</style>
