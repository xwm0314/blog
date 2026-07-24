<template>
  <section class="timeline-preview-section scroll-animate" ref="elRef">
    <div class="section-inner page-container">
      <h2 class="section-title">成长时间线</h2>
      <div class="timeline-list">
        <div v-for="item in milestones" :key="item._id" class="timeline-item">
          <div class="timeline-dot"></div>
          <div class="timeline-content">
            <span class="timeline-date">{{ formatDate(item.date) }}</span>
            <p class="timeline-text">{{ item.text }}</p>
          </div>
        </div>
      </div>
      <div class="timeline-more">
        <router-link to="/timeline" class="more-link">查看完整时间线 &rarr;</router-link>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useScrollAnimate } from '@/utils/useScrollAnimate'

const elRef = ref(null)

const milestones = ref([])

function formatDate(dateStr) {
  if (!dateStr) return ""
  const d = new Date(dateStr)
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`
}

onMounted(() => {
  useScrollAnimate(elRef.value)
})
</script>

<style lang="scss" scoped>
.timeline-preview-section {
  padding: $spacing-2xl 0 $spacing-3xl;
  position: relative;
  background: $color-bg-warm;

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

.section-inner {
  position: relative;
  z-index: 1;
}

.section-title {
  text-align: center;
  font-size: $font-size-xl;
  font-weight: $font-weight-semibold;
  color: $pink-600;
  letter-spacing: $tracking-tight;
  margin-bottom: $spacing-xl;

  &::after {
    content: '';
    display: block;
    width: 40px;
    height: 3px;
    background: $gradient-pink-accent;
    margin: $spacing-sm auto 0;
    border-radius: 2px;
  }
}

.timeline-list {
  position: relative;
  max-width: 500px;
  margin: 0 auto;
  padding-left: 20px;
  border-left: 2px solid $pink-200;
}

.timeline-item {
  position: relative;
  padding-bottom: $spacing-xl;
  padding-left: $spacing-lg;

  &:last-child {
    padding-bottom: 0;
  }
}

.timeline-dot {
  position: absolute;
  left: -26px;
  top: 4px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: $pink-400;
  border: 2px solid $color-bg-card;
  box-shadow: 0 0 0 3px rgba($pink-300, 0.3);
  z-index: 1;
}

.timeline-content {
  background: $color-bg-card;
  border-radius: $radius-md;
  padding: $spacing-md;
  border: 1px solid $warm-gray-200;
  box-shadow: 0 1px 2px rgba($pink-800, 0.04);
  transition: transform $transition-fast, box-shadow $transition-fast;

  &:hover {
    transform: translateX(4px);
    box-shadow: $shadow-sm;
  }
}

.timeline-date {
  font-size: $font-size-xs;
  color: $pink-500;
  font-weight: $font-weight-medium;
  display: block;
  margin-bottom: $spacing-xs;
}

.timeline-text {
  font-size: $font-size-sm;
  color: $color-text;
  line-height: 1.5;
}

.timeline-more {
  text-align: center;
  margin-top: $spacing-lg;
}

.more-link {
  font-size: $font-size-sm;
  color: $pink-500;
  text-decoration: none;
  transition: color $transition-fast;

  &:hover {
    color: $pink-700;
  }
}
</style>
