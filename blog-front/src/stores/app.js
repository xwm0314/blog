// ========================================
// 应用全局状态
// ========================================
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAppStore = defineStore('app', () => {
  // 是否处于封面区域（控制导航栏显示）
  const isCoverVisible = ref(true)
  // 页面加载完成
  const isPageLoaded = ref(false)
  // 站点配置（从后端获取）
  const siteConfig = ref({
    nickname: '昵称',
    slogan: '记录成长，遇见更好的自己',
    avatar: '',
    bio: ''
  })
  // 是否已经跳过英雄区域
  const hasSeenHero = ref(false)

  const coverHeight = computed(() => {
    return window.innerHeight
  })

  function setCoverVisible(visible) {
    isCoverVisible.value = visible
  }

  function setPageLoaded(loaded) {
    isPageLoaded.value = loaded
  }

  function setSiteConfig(config) {
    siteConfig.value = { ...siteConfig.value, ...config }
  }

  function initHasSeenHero() {
    const saved = localStorage.getItem('hasSeenHero')
    if (saved === 'true') {
      hasSeenHero.value = true
    }
  }

  function setHasSeenHero(value) {
    hasSeenHero.value = value
    localStorage.setItem('hasSeenHero', value ? 'true' : 'false')
  }

  return {
    isCoverVisible,
    isPageLoaded,
    siteConfig,
    coverHeight,
    hasSeenHero,
    setCoverVisible,
    setPageLoaded,
    setSiteConfig,
    initHasSeenHero,
    setHasSeenHero
  }
})
