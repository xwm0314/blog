<template>
  <section class="content-feed" ref="feedRef">
    <div class="feed-ambient"></div>

    <div class="feed-tabs" ref="tabsRef">
      <div
        class="tab-item"
        :class="{ active: activeTab === 'all' }"
        @click="switchTab('all')"
      >
        全部
      </div>
      <div
        class="tab-item"
        :class="{ active: activeTab === 'article' }"
        @click="switchTab('article')"
      >
        文章
      </div>
      <div
        class="tab-item"
        :class="{ active: activeTab === 'dynamic' }"
        @click="switchTab('dynamic')"
      >
        动态
      </div>
      <div class="tab-indicator"></div>
    </div>

    <div v-if="loading" class="feed-grid">
      <div v-for="n in 6" :key="n" class="skeleton-card">
        <div class="skeleton skeleton-top"></div>
        <div class="skeleton skeleton-title"></div>
        <div class="skeleton skeleton-text"></div>
        <div class="skeleton skeleton-text short"></div>
      </div>
    </div>

    <div v-else class="feed-grid">
      <el-card
        v-for="item in visibleItems"
        :key="item._id"
        :data-date="formatDateAttr(item.createdAt)"
        :data-id="item._id"
        class="content-card"
        :class="[
          { 'is-filtered': selectedDate === formatDateAttr(item.createdAt), 'card-visible': enteredCards.has(item._id), 'has-cover': item.cover },
          item.type
        ]"
        shadow="never"
        @click="handleCardClick(item)"
      >
        <div class="card-top">
          <span class="card-date">{{ formatDateShort(item.createdAt) }}</span>
          <el-tag v-if="item.category" size="small" class="card-tag">{{ item.category }}</el-tag>
          <el-tag v-else size="small" class="card-tag dynamic-tag">动态</el-tag>
        </div>
        <h3 v-if="item.title" class="card-title">{{ item.title }}</h3>
        <p class="card-excerpt">{{ item.excerpt || item.content }}</p>
        <div v-if="item.images && item.images.length > 0" class="card-images">
          <img v-for="(img, index) in item.images.slice(0, 3)" :key="index" :src="img" class="card-image" />
        </div>
      </el-card>
    </div>

    <div v-if="allItems.length === 0 && !loading" class="feed-empty">
      <div class="feed-empty-icon">
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
          <circle cx="24" cy="24" r="20" stroke="#d9d2ce" stroke-width="1.5"/>
          <path d="M16 20h16M16 26h12M16 32h8" stroke="#d9d2ce" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
      </div>
      <p class="feed-empty-text">暂无内容</p>
      <p class="feed-empty-hint">当有新的文章或动态时，会显示在这里</p>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from "vue"
import { useRouter } from "vue-router"
import { getArticleList } from "@/api/article"
import { getPublishedDynamics } from "@/api/dynamic"

const router = useRouter()

const articles = ref([])
const dynamics = ref([])
const selectedDate = ref(null)
const enteredCards = ref(new Set())
const feedRef = ref(null)
const tabsRef = ref(null)
const loading = ref(false)
const activeTab = ref('all')
let indicatorInitialized = false
let observer = null

function switchTab(tab) {
  activeTab.value = tab
  nextTick(() => {
    updateIndicatorPosition(true)
  })
}

function updateIndicatorPosition(animate = false) {
  const tabsEl = document.querySelector('.feed-tabs')
  if (!tabsEl) return
  const indicatorEl = tabsEl.querySelector('.tab-indicator')
  if (!indicatorEl) return
  
  const tabItems = tabsEl.querySelectorAll('.tab-item')
  const tabMap = { all: 0, article: 1, dynamic: 2 }
  const activeIndex = tabMap[activeTab.value] ?? 0
  const activeTabEl = tabItems[activeIndex]
  if (!activeTabEl) return
  
  const tabsRect = tabsEl.getBoundingClientRect()
  const tabRect = activeTabEl.getBoundingClientRect()
  const left = tabRect.left - tabsRect.left
  const width = tabRect.width
  
  if (!animate || !indicatorInitialized) {
    indicatorEl.style.transition = 'none'
    indicatorInitialized = true
  }
  
  indicatorEl.style.left = `${left}px`
  indicatorEl.style.width = `${width}px`
  
  if (!animate) {
    requestAnimationFrame(() => {
      indicatorEl.style.transition = ''
    })
  }
}

const allItems = computed(() => {
  const items = [
    ...articles.value.map((a) => ({ ...a, type: "article" })),
    ...dynamics.value.map((d) => ({ ...d, type: "dynamic" }))
  ]
  return items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
})

const markedDates = computed(() =>
  allItems.value.map((item) => formatDateAttr(item.createdAt))
)

const visibleItems = computed(() => {
  if (activeTab.value === 'all') return allItems.value
  return allItems.value.filter(item => item.type === activeTab.value)
})

async function loadContent() {
  loading.value = true
  try {
    const [articleRes, dynamicRes] = await Promise.all([
      getArticleList({ page: 1, limit: 100 }),
      getPublishedDynamics({ page: 1, limit: 100 })
    ])
    articles.value = articleRes.data?.list || []
    dynamics.value = dynamicRes.data?.list || dynamicRes.data?.dynamics || []
  } catch (e) {
    console.error("加载内容失败:", e)
  } finally {
    loading.value = false
  }
}

function handleCardClick(item) {
  if (item.type === "article") {
    router.push(`/articles/${item._id}`)
  } else if (item.type === "dynamic") {
    router.push(`/dynamics/${item._id}`)
  }
}

function filterByDate(dateStr) {
  selectedDate.value = selectedDate.value === dateStr ? null : dateStr
  if (selectedDate.value) {
    nextTick(() => scrollToDate(dateStr))
  }
}

function scrollToDate(dateStr) {
  if (!feedRef.value) return
  const card = feedRef.value.querySelector(`[data-date="${dateStr}"]`)
  if (card) {
    const feedEl = feedRef.value
    const cardTop = card.offsetTop
    feedEl.scrollTo({ top: cardTop - 16, behavior: "smooth" })
  }
}

function clearFilter() { selectedDate.value = null }

function formatDateAttr(dateStr) {
  if (!dateStr) return ""
  return dateStr.slice(0, 10)
}

function formatDateShort(dateStr) {
  if (!dateStr) return ""
  const d = new Date(dateStr)
  const weekdays = ["日", "一", "二", "三", "四", "五", "六"]
  return `${d.getMonth() + 1}/${d.getDate()} 周${weekdays[d.getDay()]}`
}

defineExpose({
  contentItems: articles, markedDates, filterByDate, clearFilter, selectedDate, enteredCards
})

function setupObserver() {
  if (observer) observer.disconnect()
  if (!feedRef.value) return
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.dataset.id
          if (id) {
            enteredCards.value = new Set([...enteredCards.value, id])
          }
          observer.unobserve(entry.target)
        }
      })
    },
    { root: feedRef.value, rootMargin: "0px 0px -40px 0px", threshold: 0.05 }
  )
  const cards = feedRef.value.querySelectorAll(".content-card")
  cards.forEach((card) => observer.observe(card))
}

watch(() => articles.value, () => { enteredCards.value = new Set(); nextTick(setupObserver) }, { deep: true })
watch(visibleItems, () => { enteredCards.value = new Set(); nextTick(setupObserver) })
watch(activeTab, () => {
  nextTick(() => {
    updateIndicatorPosition(true)
  })
})

function handleResize() {
  updateIndicatorPosition()
}

onMounted(() => { 
  loadContent(); 
  nextTick(() => {
    setupObserver()
    updateIndicatorPosition()
  })
  setTimeout(() => {
    updateIndicatorPosition()
  }, 100)
  setTimeout(() => {
    updateIndicatorPosition()
  }, 500)
  window.addEventListener('resize', handleResize)
})
onUnmounted(() => { 
  if (observer) observer.disconnect() 
  window.removeEventListener('resize', handleResize)
})
</script>

<style lang="scss" scoped>
.content-feed {
  flex: 1;
  height: 100%;
  padding: 0 $spacing-lg $spacing-lg;
  overflow-y: auto;
  position: relative;
  background: transparent;

  .feed-tabs {
    position: sticky;
    top: 0;
    margin: 0 (-$spacing-lg) $spacing-lg;
    padding: $spacing-md $spacing-lg 0;
    display: flex;
    gap: 4px;
    background: rgba(255, 255, 255, 0.6);
    backdrop-filter: blur(20px) saturate(180%);
    -webkit-backdrop-filter: blur(20px) saturate(180%);
    z-index: 10;
    border-bottom: 1px solid rgba(255, 255, 255, 0.5);
    box-shadow: 
      0 4px 20px rgba($pink-400, 0.08),
      inset 0 -1px 0 rgba(255, 255, 255, 0.3);
  }

  .tab-item {
    padding: 10px 22px 12px;
    font-size: $font-size-sm;
    font-weight: $font-weight-medium;
    color: $color-text-secondary;
    cursor: pointer;
    border-radius: $radius-lg $radius-lg 0 0;
    transition: all $transition-fast;
    position: relative;
    z-index: 1;

    &:hover {
      color: $pink-600;
      background: rgba(255, 255, 255, 0.5);
      transform: translateY(-1px);
    }

    &.active {
      color: $pink-600;
      font-weight: $font-weight-semibold;
      background: rgba(255, 255, 255, 0.8);
      box-shadow: 
        0 -4px 12px rgba($pink-400, 0.15),
        inset 0 1px 0 rgba(255, 255, 255, 0.95);
      transform: translateY(-1px);
    }
  }

  .tab-indicator {
    position: absolute;
    bottom: 0;
    left: 0;
    height: 4px;
    background: $gradient-pink-purple;
    border-radius: 4px 4px 0 0;
    transition: left 0.3s ease, width 0.3s ease;
    z-index: 2;
    box-shadow: 
      0 2px 8px rgba($pink-400, 0.6),
      0 0 16px rgba($pink-300, 0.4);
  }

  .feed-ambient {
    position: absolute;
    inset: 0;
    z-index: 0;
    pointer-events: none;
    background:
      radial-gradient(ellipse 70% 45% at 20% 30%, rgba($pink-300, 0.12) 0%, transparent 55%),
      radial-gradient(ellipse 50% 55% at 80% 70%, rgba($pink-400, 0.08) 0%, transparent 50%),
      radial-gradient(ellipse 40% 60% at 50% 0%, rgba($pink-200, 0.06) 0%, transparent 50%);
    background-size: 200% 200%;
    animation: feedFlow 25s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite;
  }

  &::-webkit-scrollbar { width: 6px; }
  &::-webkit-scrollbar-track { background: transparent; }
  &::-webkit-scrollbar-thumb { background: rgba($pink-400, 0.4); border-radius: 3px; }
  &::-webkit-scrollbar-thumb:hover { background: $pink-400; }
}

@keyframes feedFlow {
  0% { background-position: 20% 30%, 80% 70%, 50% 0%; }
  25% { background-position: 40% 20%, 60% 50%, 30% 30%; }
  50% { background-position: 60% 40%, 40% 30%, 70% 50%; }
  75% { background-position: 30% 50%, 70% 40%, 40% 20%; }
  100% { background-position: 20% 30%, 80% 70%, 50% 0%; }
}

@media (prefers-reduced-motion: reduce) {
  .feed-ambient { animation: none; }
}

.skeleton-card {
  height: 180px;
  background: #ffffff;
  border-radius: $radius-lg;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  border: 1px solid $warm-gray-200;
  box-shadow: 0 1px 2px rgba($pink-800, 0.04);
  position: relative;
  z-index: 1;
}

.skeleton-top { width: 60%; height: 12px; }
.skeleton-title { width: 80%; height: 16px; }
.skeleton-text { width: 100%; height: 10px; &.short { width: 50%; } }

.feed-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px;
  align-content: start;
  padding-bottom: $spacing-xl;
  position: relative;
  z-index: 1;
}

.content-card {
  position: relative;
  height: 180px;
  overflow: hidden;
  border-radius: $radius-xl;
  opacity: 0;
  transform: translateY(20px);
  cursor: pointer;
  background: $glass-bg;
  backdrop-filter: blur($glass-blur-light);
  -webkit-backdrop-filter: blur($glass-blur-light);
  border: 1px solid $glass-border;
  box-shadow: $glass-shadow-sm;
  transition:
    opacity 0.5s ease,
    transform 0.35s cubic-bezier(0.4, 0, 0.2, 1),
    box-shadow 0.35s cubic-bezier(0.4, 0, 0.2, 1),
    border-color 0.3s ease,
    background 0.3s ease;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.9), transparent);
    pointer-events: none;
    transition: opacity 0.3s ease;
  }

  &::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 4px;
    background: $gradient-pink-purple;
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    border-radius: 0 0 $radius-xl $radius-xl;
    opacity: 0.9;
    box-shadow: 0 0 12px rgba($pink-400, 0.5);
  }

  &:hover {
    transform: translateY(-18px) scale(1.03);
    box-shadow: 
      0 36px 80px rgba($pink-400, 0.35),
      0 20px 48px rgba($pink-500, 0.25),
      0 8px 20px rgba($pink-500, 0.15),
      0 0 60px rgba($pink-300, 0.35),
      inset 0 1px 0 rgba(255, 255, 255, 1),
      inset 0 0 20px rgba(255, 255, 255, 0.5);
    border-color: $glass-border-strong;
    background: $glass-bg-strong;
    
    &::before { opacity: 1; }
    &::after { transform: scaleX(1); }
    
    .card-title { 
      color: $pink-600;
      text-shadow: 0 0 20px rgba($pink-400, 0.35);
    }
  }
  &:active { 
    transform: translateY(-8px) scale(1.01); 
    box-shadow: 
      0 16px 40px rgba($pink-400, 0.25),
      0 8px 20px rgba($pink-500, 0.15),
      0 3px 10px rgba($pink-500, 0.1),
      inset 0 1px 0 rgba(255, 255, 255, 0.9);
  }

  &.is-filtered {
    box-shadow: 0 0 0 3px rgba($pink-400, 0.5), $glass-shadow-md;
    transform: translateY(-4px) scale(1.02);
    border-color: rgba($pink-400, 0.6);
  }
  &.card-visible { opacity: 1; transform: translateY(0); }
  &.has-cover { height: 260px; }

  &.dynamic {
    height: auto;
    min-height: 120px;
    background: linear-gradient(135deg, rgba(253, 232, 239, 0.6), rgba(249, 212, 224, 0.5));
    border-color: rgba($pink-200, 0.6);
    .card-title { display: none; }
    .card-excerpt { font-size: $font-size-sm; color: $color-text; line-height: 1.7; -webkit-line-clamp: 3; }
  }

  :deep(.el-card__body) {
    padding: 16px;
    height: 100%;
    display: flex;
    flex-direction: column;
  }
}

.card-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px; }
.card-date { font-size: $font-size-xs; color: $color-text-secondary; }
.card-tag {
  --el-tag-bg-color: transparent;
  --el-tag-border-color: transparent;
  --el-tag-text-color: #fff;
  flex-shrink: 0;
  background: $gradient-pink-purple-soft;
  border-radius: 999px;
  font-weight: $font-weight-medium;
  box-shadow: 
    0 2px 8px rgba($pink-400, 0.25),
    0 1px 3px rgba($purple-pink-400, 0.2);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  transition: all $transition-fast;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 
      0 4px 12px rgba($pink-400, 0.35),
      0 2px 6px rgba($purple-pink-400, 0.25),
      0 0 12px rgba($pink-300, 0.3);
  }

  :deep(.el-tag__inner) {
    background: transparent;
    color: #fff;
    border: none;
  }
}
.card-tag.dynamic-tag {
  background: linear-gradient(135deg, rgba(147, 197, 253, 0.85), rgba(96, 165, 250, 0.85));
  box-shadow: 
    0 2px 8px rgba(59, 130, 246, 0.25),
    0 1px 3px rgba(37, 99, 235, 0.2);
}
.card-title {
  font-size: $font-size-base;
  font-weight: $font-weight-semibold;
  color: $color-text;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: color $transition-fast;
}
.card-excerpt {
  font-size: $font-size-sm;
  color: $color-text-secondary;
  line-height: 1.6;
  flex: 1;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.card-images { display: flex; gap: 4px; margin-top: 8px; flex-wrap: wrap; }
.card-image { width: calc(33.33% - 3px); height: 60px; object-fit: cover; border-radius: $radius-sm; }

.feed-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: $spacing-3xl 0;
  grid-column: 1 / -1;
  gap: $spacing-md;
  position: relative;
  z-index: 1;
  .feed-empty-icon { opacity: 0.6; }
  .feed-empty-text { font-size: $font-size-base; color: $color-text-secondary; font-weight: $font-weight-medium; }
  .feed-empty-hint { font-size: $font-size-sm; color: $warm-gray-400; }
}
</style>
