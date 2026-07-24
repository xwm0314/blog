<template>
  <section class="profile-section page-container scroll-animate" ref="elRef">
    <div class="profile-card">
      <el-avatar
        :size="100"
        :src="siteConfig.avatar || '/src/assets/images/default-avatar.png'"
        class="profile-avatar"
      />
      <div class="profile-info">
        <h2 class="profile-name">{{ siteConfig.nickname }}</h2>
        <p class="profile-bio">{{ siteConfig.bio || '这个人很懒，什么都没写...' }}</p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAppStore } from '@/stores/app'
import { useScrollAnimate } from '@/utils/useScrollAnimate'

const appStore = useAppStore()
const siteConfig = appStore.siteConfig
const elRef = ref(null)

onMounted(() => {
  useScrollAnimate(elRef.value)
})
</script>

<style lang="scss" scoped>
.profile-section {
  padding: $spacing-3xl $spacing-lg;
}

.profile-card {
  display: flex;
  align-items: center;
  gap: $spacing-xl;
  padding: $spacing-xl;
  max-width: 600px;
  margin: 0 auto;
  background: $color-bg-card;
  border-radius: $radius-lg;
  border: 1px solid $warm-gray-200;
  box-shadow: 0 1px 2px rgba($pink-800, 0.04);
  transition: transform $transition-normal, box-shadow $transition-normal;

  &:hover {
    transform: translateY(-3px);
    box-shadow: $shadow-md;
  }
}

.profile-avatar {
  flex-shrink: 0;
  border: 3px solid $color-border;
  box-shadow: 0 0 0 2px rgba($pink-300, 0.3);
}

.profile-name {
  font-size: $font-size-xl;
  font-weight: $font-weight-bold;
  color: $pink-600;
  margin-bottom: $spacing-sm;
  letter-spacing: $tracking-tight;
}

.profile-bio {
  font-size: $font-size-sm;
  color: $color-text-secondary;
  line-height: 1.6;
}
</style>
