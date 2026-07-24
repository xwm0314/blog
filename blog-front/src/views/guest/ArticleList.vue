<template>
  <div class="article-list-page page-container">
    <div class="page-header">
      <span class="page-eyebrow">ARTICLES</span>
      <h1 class="page-title">文章</h1>
      <p class="page-desc">记录思考，分享见闻</p>
    </div>

    <div class="filter-bar">
      <el-select v-model="filter.category" placeholder="选择分类" size="small" @change="loadArticles" class="filter-select">
        <el-option label="全部" value="" />
        <el-option v-for="cat in categories" :key="cat" :label="cat" :value="cat" />
      </el-select>
      <el-select v-model="filter.month" placeholder="选择月份" size="small" @change="loadArticles" class="filter-select">
        <el-option label="全部" value="" />
        <el-option v-for="m in months" :key="m" :label="m" :value="m" />
      </el-select>
    </div>

    <div v-if="loading" class="skeleton-grid">
      <div v-for="n in 6" :key="n" class="skeleton-card">
        <div class="skeleton skeleton-img"></div>
        <div class="skeleton skeleton-title"></div>
        <div class="skeleton skeleton-text"></div>
        <div class="skeleton skeleton-text short"></div>
      </div>
    </div>

    <div v-else class="article-list">
      <article
        v-for="article in articles"
        :key="article._id"
        class="article-card"
        @click="goToDetail(article._id)"
      >
        <div class="card-header">
          <span class="article-date">{{ formatDate(article.createdAt) }}</span>
          <div class="card-tags">
            <el-tag v-for="tag in article.tags" :key="tag" size="small" class="article-tag">{{ tag }}</el-tag>
          </div>
        </div>
        <h3 class="article-title">{{ article.title }}</h3>
        <p class="article-excerpt">{{ article.excerpt }}</p>
        <div class="card-footer">
          <span class="read-count">{{ article.views || 0 }} 阅读</span>
          <span class="card-arrow">&rarr;</span>
        </div>
        <div class="card-accent"></div>
      </article>
    </div>

    <div v-if="!loading && articles.length === 0" class="empty-text">
      <p>暂无文章</p>
    </div>

    <div v-if="total > pageSize" class="pagination-bar">
      <el-pagination
        v-model:current-page="currentPage"
        :page-size="pageSize"
        :total="total"
        @current-change="loadArticles"
        layout="prev, pager, next"
        background
        small
      />
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { getArticleList } from '@/api/article'

const router = useRouter()

const articles = ref([])
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)
const loading = ref(false)

const filter = reactive({
  category: '',
  month: ''
})

const categories = ['随笔', '学习', '技术', '生活', '其他']

const months = computed(() => {
  const result = []
  const now = new Date()
  for (let i = 0; i < 12; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    result.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`)
  }
  return result
})

async function loadArticles() {
  loading.value = true
  try {
    const params = {
      page: currentPage.value,
      limit: pageSize.value,
      category: filter.category || undefined,
      month: filter.month || undefined
    }
    const res = await getArticleList(params)
    articles.value = res.data?.list || []
    total.value = res.data?.total || 0
  } catch (e) {
    console.error('加载文章列表失败:', e)
  } finally {
    loading.value = false
  }
}

function goToDetail(id) {
  router.push(`/articles/${id}`)
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

onMounted(() => {
  loadArticles()
})
</script>

<style lang="scss" scoped>
.article-list-page {
  padding-top: 60px;
  padding-bottom: $spacing-3xl;
  max-width: 900px;
  position: relative;
}

.page-header {
  text-align: center;
  padding: $spacing-2xl 0 $spacing-xl;
}

.page-eyebrow {
  font-size: $font-size-xs;
  font-weight: $font-weight-semibold;
  letter-spacing: $tracking-wider;
  color: $pink-400;
  display: block;
  margin-bottom: $spacing-sm;
}

.page-title {
  font-size: $font-size-2xl;
  font-weight: $font-weight-bold;
  color: $color-text;
  letter-spacing: $tracking-tight;
  margin-bottom: $spacing-sm;
  line-height: 1.2;
}

.page-desc {
  font-size: $font-size-sm;
  color: $color-text-secondary;
}

.skeleton-grid {
  display: flex;
  flex-direction: column;
  gap: $spacing-md;
}

.skeleton-card {
  background: $color-bg-card;
  border-radius: $radius-lg;
  padding: $spacing-lg;
  display: flex;
  flex-direction: column;
  gap: 10px;
  border: 1px solid $warm-gray-200;
}

.filter-bar {
  display: flex;
  gap: $spacing-md;
  justify-content: center;
  margin-bottom: $spacing-xl;
}

.filter-select {
  width: 140px;
}

.article-list {
  display: flex;
  flex-direction: column;
  gap: $spacing-md;
}

.article-card {
  position: relative;
  overflow: hidden;
  background: $color-bg-card;
  border-radius: $radius-lg;
  padding: $spacing-lg;
  cursor: pointer;
  border: 1px solid $warm-gray-200;
  box-shadow: 0 1px 2px rgba($pink-800, 0.04);
  transition: transform $transition-normal, box-shadow $transition-normal;

  &::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 3px;
    background: $gradient-pink-accent;
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
  }

  &:hover {
    transform: translateY(-6px);
    box-shadow: $shadow-lg;

    &::after { transform: scaleX(1); }
    .card-arrow { transform: translateX(4px); opacity: 1; }
    .article-title { color: $pink-600; }
  }

  &:active {
    transform: translateY(-3px) scale(0.995);
  }
}

.card-header {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
  margin-bottom: $spacing-md;

  .article-date {
    font-size: $font-size-xs;
    color: $color-text-secondary;
  }
}

.card-tags {
  display: flex;
  gap: $spacing-xs;
  flex-wrap: wrap;
}

.article-tag {
  --el-tag-bg-color: #{$pink-100};
  --el-tag-border-color: #{$pink-200};
  --el-tag-text-color: #{$pink-600};
}

.article-title {
  font-size: $font-size-lg;
  font-weight: $font-weight-semibold;
  color: $color-text;
  margin-bottom: $spacing-sm;
  line-height: 1.4;
  transition: color $transition-fast;
}

.article-excerpt {
  font-size: $font-size-sm;
  color: $color-text-secondary;
  line-height: 1.7;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin-bottom: $spacing-md;
}

.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;

  .read-count {
    font-size: $font-size-xs;
    color: $warm-gray-400;
  }

  .card-arrow {
    font-size: $font-size-md;
    color: $pink-400;
    opacity: 0.5;
    transition: all $transition-fast;
  }
}

.card-accent {
  display: none;
}

.empty-text {
  text-align: center;
  color: $color-text-secondary;
  padding: $spacing-3xl 0;
}

.pagination-bar {
  display: flex;
  justify-content: center;
  margin-top: $spacing-xl;
}
</style>
