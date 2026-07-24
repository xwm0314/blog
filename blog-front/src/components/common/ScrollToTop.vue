<template>
  <transition name="fade-scroll">
    <div v-if="visible" class="scroll-to-top" @click="scrollToTop">
      <el-icon :size="20"><ArrowUp /></el-icon>
    </div>
  </transition>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { ArrowUp } from '@element-plus/icons-vue'

const visible = ref(false)
let handler = null

onMounted(() => {
  handler = () => {
    visible.value = window.scrollY > 400
  }
  window.addEventListener('scroll', handler, { passive: true })
})

onUnmounted(() => {
  if (handler) window.removeEventListener('scroll', handler)
})

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<style lang="scss" scoped>
.scroll-to-top {
  position: fixed;
  right: 24px;
  bottom: 24px;
  z-index: 999;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: $color-bg-card;
  border: 1px solid $warm-gray-200;
  color: $pink-500;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: $shadow-md;
  transition: all $transition-fast;

  &:hover {
    background: $pink-500;
    color: #fff;
    transform: translateY(-2px);
    box-shadow: $shadow-lg;
  }

  &:active {
    transform: scale(0.95);
  }
}

.fade-scroll-enter-active,
.fade-scroll-leave-active {
  transition: opacity $transition-normal;
}

.fade-scroll-enter-from,
.fade-scroll-leave-to {
  opacity: 0;
}
</style>
