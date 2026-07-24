<template>
  <router-view />
</template>

<script setup>
import { onMounted } from 'vue'
import { useAppStore } from '@/stores/app'
import { getSiteConfig } from '@/api/config'

const appStore = useAppStore()

onMounted(async () => {
  try {
    const res = await getSiteConfig()
    if (res.data?.config) {
      appStore.setSiteConfig(res.data.config)
      document.title = res.data.config.nickname + ' - 个人成长记录'
    }
  } catch (e) {
    console.error('获取站点配置失败:', e)
  }
})
</script>

<style lang="scss">
// 全局样式已在 main.js 中导入 global.scss
</style>
