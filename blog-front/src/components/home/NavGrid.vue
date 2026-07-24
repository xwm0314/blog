<template>
  <section class="nav-grid-section page-container scroll-animate" ref="elRef">
    <div class="nav-grid">
      <router-link
        v-for="item in gridItems"
        :key="item.path"
        :to="item.path"
        class="grid-card"
      >
        <div class="grid-card-inner">
          <el-icon :size="36" class="grid-icon"><component :is="item.icon" /></el-icon>
          <h3 class="grid-title">{{ item.title }}</h3>
          <p class="grid-desc">{{ item.desc }}</p>
        </div>
        <div class="grid-accent"></div>
      </router-link>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import {
  EditPen, Notebook, Timer, ChatDotSquare
} from '@element-plus/icons-vue'
import { useScrollAnimate } from '@/utils/useScrollAnimate'

const elRef = ref(null)

const gridItems = [
  { path: '/articles?tag=随笔', title: '生活随笔', desc: '日常生活的点滴记录', icon: EditPen },
  { path: '/articles?tag=学习', title: '学习笔记', desc: '技术学习的心得整理', icon: Notebook },
  { path: '/timeline', title: '成长时间线', desc: '一路走来的里程碑', icon: Timer },
  { path: '/messages', title: '留言交流', desc: '期待你的声音', icon: ChatDotSquare }
]

onMounted(() => {
  useScrollAnimate(elRef.value)
})
</script>

<style lang="scss" scoped>
.nav-grid-section {
  padding: $spacing-3xl $spacing-lg;
  position: relative;
  background: $color-bg-warm;

  // 背景层次
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, $warm-gray-200, transparent);
  }
}

.nav-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: $spacing-lg;
  max-width: 900px;
  margin: 0 auto;
  position: relative;
  z-index: 1;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
}

.grid-card {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 0;
  cursor: pointer;
  text-decoration: none;
  color: $color-text;
  background: $color-bg-card;
  border-radius: $radius-lg;
  border: 1px solid $warm-gray-200;
  box-shadow: 0 1px 2px rgba($pink-800, 0.04);
  overflow: hidden;
  transition: transform $transition-normal, box-shadow $transition-normal;

  &:hover {
    transform: translateY(-6px);
    box-shadow: $shadow-lg;

    .grid-icon { color: $color-primary; transform: scale(1.1); }
    .grid-accent { transform: scaleX(1); }
  }

  &:active {
    transform: translateY(-3px) scale(0.98);
  }
}

.grid-card-inner {
  padding: $spacing-xl $spacing-md;
  width: 100%;
}

.grid-accent {
  height: 3px;
  width: 100%;
  background: $gradient-pink-accent;
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.grid-icon {
  margin-bottom: $spacing-md;
  color: $pink-400;
  transition: color $transition-normal, transform $transition-normal;
}

.grid-title {
  font-size: $font-size-md;
  font-weight: $font-weight-semibold;
  color: $pink-600;
  margin-bottom: $spacing-sm;
}

.grid-desc {
  font-size: $font-size-sm;
  color: $color-text-secondary;
}
</style>
