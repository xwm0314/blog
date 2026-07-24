<template>
  <footer class="app-footer">
    <div class="footer-inner">
      <div class="footer-top">
        <div class="footer-brand">
          <span class="footer-name">{{ siteConfig.nickname }}</span>
          <span class="footer-tag">{{ siteConfig.slogan }}</span>
        </div>
        <nav class="footer-nav">
          <router-link to="/" class="footer-link">首页</router-link>
          <router-link to="/articles" class="footer-link">文章</router-link>
        </nav>
      </div>
      <div class="footer-bottom">
        <p class="footer-copy">&copy; {{ year }} {{ siteConfig.nickname }}. All rights reserved.</p>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { computed } from 'vue'
import { useAppStore } from '@/stores/app'

const appStore = useAppStore()
const siteConfig = appStore.siteConfig
const year = computed(() => new Date().getFullYear())
</script>

<style lang="scss" scoped>
.app-footer {
  background: $color-bg-card;
  border-top: 1px solid $warm-gray-200;
}

.footer-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: $spacing-xl $spacing-lg;
}

.footer-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: $spacing-lg;
}

.footer-brand {
  display: flex;
  flex-direction: column;
  gap: $spacing-xs;
}

.footer-name {
  font-size: $font-size-base;
  font-weight: $font-weight-semibold;
  color: $pink-600;
}

.footer-tag {
  font-size: $font-size-xs;
  color: $color-text-secondary;
}

.footer-nav {
  display: flex;
  gap: $spacing-lg;
}

.footer-link {
  font-size: $font-size-sm;
  color: $color-text-secondary;
  text-decoration: none;
  transition: color $transition-fast;

  &:hover {
    color: $pink-500;
  }
}

.footer-bottom {
  padding-top: $spacing-md;
  border-top: 1px solid $warm-gray-100;
  text-align: center;
}

.footer-copy {
  font-size: $font-size-xs;
  color: $warm-gray-400;
}
</style>