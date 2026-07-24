<template>
  <!-- 首页：HeroCover（上方）+ 三栏布局（下方） -->
  <div v-if="isHomePage" class="home-page-wrap" :class="{ 'hero-skipped': heroSkipped }">
    <header class="home-nav" :class="{ 'nav-visible': !isAtHero }">
      <div class="nav-inner page-container">
        <div class="nav-left">
          <router-link v-if="heroSkipped" class="back-hero-btn" to="/" @click.prevent="goBackToHero">
            <el-icon class="btn-icon"><DArrowLeft /></el-icon>
            <span>返回封面</span>
          </router-link>
          <router-link to="/" class="nav-logo">{{ siteConfig.nickname }}</router-link>
        </div>
        <nav class="nav-links">
          <router-link to="/" class="nav-link" :class="{ active: isHomePage }">首页</router-link>
          <router-link to="/articles" class="nav-link" :class="{ active: isArticlePage }">文章</router-link>
        </nav>
      </div>
    </header>
    <router-view />
  </div>

  <!-- 其他页走原导航布局 -->
  <div v-else class="guest-layout">
    <header class="guest-nav nav-fixed">
      <div class="nav-inner page-container">
        <div class="nav-left">
          <router-link to="/" class="back-home-btn">
            <el-icon class="btn-icon"><ArrowLeft /></el-icon>
            <span>返回首页</span>
          </router-link>
          <span class="nav-logo-text">{{ siteConfig.nickname }}</span>
        </div>
        <nav class="nav-links">
          <router-link to="/" class="nav-link" :class="{ active: isHomePage }">首页</router-link>
          <router-link to="/articles" class="nav-link" :class="{ active: isArticlePage }">文章</router-link>
        </nav>
      </div>
    </header>

    <main class="guest-main">
      <router-view />
    </main>

    <AppFooter />
  </div>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { ArrowUp, DArrowLeft } from '@element-plus/icons-vue'
import { useAppStore } from '@/stores/app'
import AppFooter from '@/components/common/AppFooter.vue'

const route = useRoute()
const appStore = useAppStore()
const siteConfig = appStore.siteConfig
const isHomePage = computed(() => route.name === 'Home')
const isArticlePage = computed(() => route.name === 'ArticleList' || route.name === 'ArticleDetail')
const heroSkipped = computed(() => appStore.hasSeenHero)

// 首页顶栏：滑过封面一小段后立即淡入
const isAtHero = ref(true)
let scrollHandler = null

function goBackToHero() {
  appStore.setHasSeenHero(false)
  isAtHero.value = true
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => {
  appStore.initHasSeenHero()
  if (appStore.hasSeenHero) {
    isAtHero.value = false
  }
  scrollHandler = () => {
    isAtHero.value = window.scrollY < 100 && !appStore.hasSeenHero
    if (window.scrollY > 100 && !appStore.hasSeenHero) {
      appStore.setHasSeenHero(true)
    }
  }
  window.addEventListener('scroll', scrollHandler, { passive: true })
})

onUnmounted(() => {
  if (scrollHandler) window.removeEventListener('scroll', scrollHandler)
})

watch(
  () => route.name,
  (newName) => {
    if (newName === 'Home') {
      if (appStore.hasSeenHero) {
        isAtHero.value = false
      } else {
        isAtHero.value = true
      }
    }
  }
)
</script>

<style lang="scss" scoped>
.home-page-wrap {
  // 高度由 children 撑开
}

// 首页导航 — 半透明磨砂
.home-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 110;
  height: 60px;
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(16px) saturate(180%);
  -webkit-backdrop-filter: blur(16px) saturate(180%);
  border-bottom: 1px solid rgba($pink-200, 0.3);
  opacity: 0;
  transition: opacity 0.5s cubic-bezier(0.2, 0.8, 0.2, 1);
  pointer-events: none;

  &.nav-visible {
    opacity: 1;
    pointer-events: auto;
  }
}

.home-page-wrap.hero-skipped .home-nav {
  opacity: 0;
  animation: nav-slide-down 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
}

@keyframes nav-slide-down {
  0% {
    opacity: 0;
    transform: translateY(-100%);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.nav-inner {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.nav-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.back-hero-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 5px 14px;
  font-size: $font-size-sm;
  color: $pink-500;
  background: rgba($pink-100, 0.6);
  border: 1px solid rgba($pink-300, 0.3);
  border-radius: 999px;
  text-decoration: none;
  transition: all $transition-fast;

  &:hover {
    color: $pink-600;
    background: rgba($pink-100, 0.9);
    border-color: $pink-300;
    transform: translateX(-2px);
  }

  &:active {
    transform: translateX(-1px) scale(0.97);
  }

  .btn-icon {
    font-size: 14px;
  }
}

.nav-logo {
  font-size: $font-size-lg;
  font-weight: $font-weight-bold;
  color: $pink-600;
  letter-spacing: $tracking-tight;
}

.nav-links {
  display: flex;
  gap: $spacing-xl;
}

.nav-link {
  font-size: $font-size-base;
  font-weight: $font-weight-medium;
  color: $color-text-secondary;
  position: relative;
  transition: color $transition-fast;

  &::after {
    content: '';
    position: absolute;
    bottom: -4px;
    left: 0;
    width: 0;
    height: 2px;
    background: $gradient-pink-accent;
    border-radius: 1px;
    transition: width $transition-normal;
  }

  &:hover,
  &.active {
    color: $color-primary;
  }

  &.active::after {
    width: 100%;
  }
}

// 次级页面导航
.guest-layout {
  min-height: 100vh;
}

.guest-nav {
  position: sticky;
  top: 0;
  z-index: 100;
  height: 60px;
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.88);
  backdrop-filter: blur(16px) saturate(180%);
  -webkit-backdrop-filter: blur(16px) saturate(180%);
  border-bottom: 1px solid rgba($warm-gray-200, 0.8);
}

.back-home-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 5px 14px;
  font-size: $font-size-sm;
  color: $pink-500;
  background: rgba($pink-100, 0.6);
  border: 1px solid rgba($pink-300, 0.3);
  border-radius: 999px;
  text-decoration: none;
  transition: all $transition-fast;

  &:hover {
    color: $pink-600;
    background: rgba($pink-100, 0.9);
    border-color: $pink-300;
    transform: translateX(-2px);
  }

  &:active {
    transform: translateX(-1px) scale(0.97);
  }

  .btn-icon {
    font-size: 14px;
  }
}

.nav-logo-text {
  font-size: $font-size-lg;
  font-weight: $font-weight-bold;
  color: $pink-600;
  cursor: default;
  letter-spacing: $tracking-tight;
}

.guest-main {
  min-height: calc(100vh - 60px);
}
</style>