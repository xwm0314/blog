<template>
  <div class="home-page" :class="{ 'hero-skipped': hasSeenHero }">
    <div class="hero-layer" :style="heroStyle">
      <HeroCover />
    </div>

    <div class="content-layer" :style="contentStyle">
      <LeftSidebar />
      <ContentFeed ref="feedRef" />
      <RightSidebar
        :marked-dates="markedDates"
        :selected-date="selectedDate"
        @date-click="handleDateClick"
      />
    </div>
  </div>

  <div v-if="isManageMode" class="manage-fab" @click="dialogVisible = true">
    <el-icon :size="24"><Plus /></el-icon>
  </div>

  <el-dialog v-model="dialogVisible" title="添加内容" width="420px">
    <el-form :model="form" label-width="60px" size="small">
      <el-form-item label="标题">
        <el-input v-model="form.title" placeholder="输入标题" />
      </el-form-item>
      <el-form-item label="日期">
        <el-date-picker v-model="form.date" type="date" value-format="YYYY-MM-DD" style="width:100%" />
      </el-form-item>
      <el-form-item label="分类">
        <el-select v-model="form.category" style="width:100%">
          <el-option label="随笔" value="随笔" />
          <el-option label="学习" value="学习" />
          <el-option label="技术" value="技术" />
          <el-option label="生活" value="生活" />
          <el-option label="其他" value="其他" />
        </el-select>
      </el-form-item>
      <el-form-item label="摘要">
        <el-input v-model="form.excerpt" type="textarea" :rows="3" placeholder="简要描述" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button size="small" @click="dialogVisible = false">取消</el-button>
      <el-button size="small" type="primary" @click="submitContent">添加</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useContentStore } from '@/stores/content'
import { Plus } from '@element-plus/icons-vue'
import HeroCover from '@/components/home/HeroCover.vue'
import LeftSidebar from '@/components/home/LeftSidebar.vue'
import ContentFeed from '@/components/home/ContentFeed.vue'
import RightSidebar from '@/components/home/RightSidebar.vue'
import { useAppStore } from '@/stores/app'

const route = useRoute()
const contentStore = useContentStore()
const appStore = useAppStore()

const feedRef = ref(null)
const markedDates = ref([])
const selectedDate = ref(null)
const scrollY = ref(0)
const hasSeenHero = computed(() => appStore.hasSeenHero)

const isManageMode = computed(() => route.query.manage === 'true')
const dialogVisible = ref(false)

const form = ref({
  title: '',
  date: new Date().toISOString().slice(0, 10),
  category: '随笔',
  excerpt: ''
})

function submitContent() {
  if (!form.value.title.trim()) return
  contentStore.add({ ...form.value })
  form.value.title = ''
  form.value.excerpt = ''
  dialogVisible.value = false
}

const feedMarkedDates = computed(() => feedRef.value?.markedDates || [])

watch(feedMarkedDates, (dates) => {
  markedDates.value = [...dates]
}, { immediate: true, deep: true })

watch(
  () => feedRef.value?.selectedDate,
  (val) => { selectedDate.value = val ?? null },
  { immediate: true }
)

let onScroll = null
onMounted(() => {
  appStore.initHasSeenHero()
  onScroll = () => {
    scrollY.value = window.scrollY
    if (window.scrollY > 100 && !appStore.hasSeenHero) {
      appStore.setHasSeenHero(true)
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true })
})
onUnmounted(() => {
  if (onScroll) window.removeEventListener('scroll', onScroll)
})

const transitionProgress = computed(() => {
  if (hasSeenHero.value) return 1
  const trigger = window.innerHeight * 0.35
  return Math.min(scrollY.value / trigger, 1)
})

const heroStyle = computed(() => {
  const p = transitionProgress.value
  return {
    opacity: 1 - p,
    transform: `translateY(-${p * 60}px) scale(${1 - p * 0.04})`,
    pointerEvents: p > 0.8 ? 'none' : 'auto',
    zIndex: p > 0.8 ? 1 : 10
  }
})

const contentStyle = computed(() => {
  const p = transitionProgress.value
  return {
    opacity: p,
    transform: `translateY(${(1 - p) * 55}px)`
  }
})

function handleDateClick(dateStr) {
  feedRef.value?.filterByDate(dateStr)
}
</script>

<style lang="scss" scoped>
.home-page {
  padding-top: 1px;
}

.hero-layer {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  min-height: 100dvh;
  z-index: 10;
  will-change: opacity, transform;
}

.content-layer {
  position: relative;
  z-index: 5;
  margin-top: 100vh;
  display: flex;
  height: calc(100vh - 60px);
  overflow: hidden;
  will-change: opacity, transform;
}

.home-page.hero-skipped {
  .hero-layer {
    display: none;
  }

  .content-layer {
    margin-top: 60px;
    min-height: calc(100dvh - 60px);
    animation: content-fade-in 0.8s cubic-bezier(0.2, 0.8, 0.2, 1);
  }
}

@keyframes content-fade-in {
  0% {
    opacity: 0;
    transform: translateY(30px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.manage-fab {
  position: fixed;
  right: 30px;
  bottom: 30px;
  z-index: 999;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: $gradient-pink-accent;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 16px rgba($pink-500, 0.4);
  transition: transform $transition-normal, box-shadow $transition-normal;

  &:hover {
    transform: scale(1.1) translateY(-2px);
    box-shadow: 0 6px 24px rgba($pink-500, 0.5);
  }

  &:active {
    transform: scale(0.95);
  }
}
</style>