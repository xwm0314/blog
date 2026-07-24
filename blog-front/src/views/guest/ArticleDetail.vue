<template>
  <div class="article-detail-page">
    <div class="page-ambient"></div>
    <article class="article-content">
      <div class="article-header">
        <h1 class="article-title">{{ article.title || '加载中...' }}</h1>
        <div class="article-meta">
          <span class="meta-date">{{ formatDate(article.createdAt) }}</span>
          <span class="meta-sep">&middot;</span>
          <span class="meta-views">{{ article.views || 0 }} 阅读</span>
          <span v-for="tag in article.tags" :key="tag" class="meta-tag">{{ tag }}</span>
        </div>
      </div>
      <div class="article-body" v-html="article.content"></div>
    </article>

    <div class="back-section">
      <button class="back-btn" @click="goBack">
        <span class="back-arrow">&larr;</span>
        <span>返回文章列表</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getArticleDetail } from '@/api/article'

const route = useRoute()
const router = useRouter()

const article = ref({ title: '', content: '', tags: [], createdAt: '', views: 0 })

async function loadArticle() {
  const id = route.params.id
  if (!id) return
  try {
    const res = await getArticleDetail(id)
    article.value = res.data?.article || {}
  } catch (e) { console.error('加载文章详情失败:', e) }
}

function goBack() { router.push('/articles') }

function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

onMounted(() => { loadArticle() })
</script>

<style lang="scss" scoped>
.article-detail-page {
  padding: $spacing-2xl $spacing-lg $spacing-3xl;
  max-width: 740px;
  margin: 0 auto;
  position: relative;
}

.page-ambient {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  background:
    radial-gradient(ellipse 60% 40% at 25% 20%, rgba($pink-300, 0.12) 0%, transparent 50%),
    radial-gradient(ellipse 45% 50% at 75% 70%, rgba($pink-400, 0.08) 0%, transparent 50%),
    radial-gradient(ellipse 35% 45% at 50% 50%, rgba($pink-200, 0.06) 0%, transparent 50%);
  background-size: 180% 180%;
  animation: pageFlow 28s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite;
}

@keyframes pageFlow {
  0% { background-position: 25% 20%, 75% 70%, 50% 50%; }
  25% { background-position: 35% 15%, 60% 55%, 40% 40%; }
  50% { background-position: 55% 30%, 45% 40%, 60% 60%; }
  75% { background-position: 20% 40%, 70% 30%, 35% 30%; }
  100% { background-position: 25% 20%, 75% 70%, 50% 50%; }
}

@media (prefers-reduced-motion: reduce) {
  .page-ambient { animation: none; }
}

.article-content {
  position: relative;
  z-index: 1;
  background: rgba(255, 255, 255, 0.94);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-radius: $radius-xl;
  padding: $spacing-2xl $spacing-2xl;
  border: 1px solid $warm-gray-200;
  box-shadow: 0 1px 2px rgba($pink-800, 0.04);
  transition: box-shadow $transition-slow;
  &:hover { box-shadow: $shadow-sm; }
}

.article-header {
  margin-bottom: $spacing-xl;
  padding-bottom: $spacing-lg;
  border-bottom: 1px solid $warm-gray-100;
}

.article-title {
  font-size: $font-size-2xl;
  font-weight: $font-weight-bold;
  color: $color-text;
  line-height: 1.3;
  letter-spacing: $tracking-tight;
  margin-bottom: $spacing-lg;
  text-wrap: pretty;
}

.article-meta {
  color: $color-text-secondary;
  font-size: $font-size-sm;
  display: flex;
  align-items: center;
  gap: $spacing-sm;
  flex-wrap: wrap;
}
.meta-sep { color: $warm-gray-300; }
.meta-tag {
  padding: 2px 8px;
  background: $pink-50;
  color: $pink-600;
  border-radius: $radius-sm;
  font-size: $font-size-xs;
}

.article-body {
  line-height: 1.9;
  font-size: $font-size-md;
  color: $color-text;

  :deep(p) { margin-bottom: $spacing-md; text-wrap: pretty; }
  :deep(h2) {
    font-size: $font-size-xl; font-weight: $font-weight-semibold;
    color: $pink-700; margin: $spacing-xl 0 $spacing-md;
    padding-bottom: $spacing-sm; border-bottom: 1px solid $pink-100;
    letter-spacing: $tracking-tight;
  }
  :deep(h3) { font-size: $font-size-lg; font-weight: $font-weight-semibold; color: $color-text; margin: $spacing-lg 0 $spacing-md; }
  :deep(ul), :deep(ol) { margin-bottom: $spacing-md; padding-left: $spacing-xl; }
  :deep(li) { margin-bottom: $spacing-xs; }
  :deep(blockquote) {
    margin: $spacing-lg 0; padding: $spacing-md $spacing-lg;
    border-left: 3px solid $pink-300; background: rgba($pink-500, 0.03);
    border-radius: 0 $radius-md $radius-md 0; color: $warm-gray-600; font-style: italic;
  }
  :deep(code) { background: $pink-50; padding: 2px 6px; border-radius: $radius-sm; font-size: $font-size-sm; color: $pink-700; font-family: $font-mono; }
  :deep(pre) {
    background: $warm-gray-900; padding: $spacing-lg; border-radius: $radius-md;
    overflow-x: auto; margin-bottom: $spacing-md; line-height: 1.6;
    code { background: none; padding: 0; color: #e4e4e7; font-size: $font-size-sm; }
  }
  :deep(a) { color: $pink-500; text-decoration: underline; text-underline-offset: 2px; text-decoration-color: rgba($pink-400, 0.3);
    &:hover { color: $pink-700; text-decoration-color: $pink-500; }
  }
  :deep(img) { max-width: 100%; height: auto; border-radius: $radius-md; margin: $spacing-md 0; box-shadow: $shadow-sm; }
  :deep(hr) { margin: $spacing-xl 0; border: none; height: 1px; background: linear-gradient(90deg, transparent, $warm-gray-200, transparent); }
  :deep(table) {
    width: 100%; border-collapse: collapse; margin: $spacing-md 0;
    th, td { padding: $spacing-sm $spacing-md; border: 1px solid $warm-gray-200; text-align: left; }
    th { background: $warm-gray-50; font-weight: $font-weight-semibold; }
  }
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
  .back-arrow { transition: transform $transition-fast; }
  &:hover .back-arrow { transform: translateX(-2px); }
}
</style>
