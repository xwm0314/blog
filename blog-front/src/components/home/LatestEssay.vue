<template>
  <section class="latest-essay-section scroll-animate" ref="elRef">
    <div class="section-inner page-container">
      <h2 class="section-title">最新随笔</h2>
      <div class="essay-list">
        <div v-for="item in essays" :key="item._id" class="essay-card">
          <router-link :to="`/articles/${item._id}`" class="essay-link">
            <h3 class="essay-title">{{ item.title }}</h3>
            <p class="essay-excerpt">{{ item.excerpt || '暂无摘要...' }}</p>
            <div class="essay-meta">
              <span class="essay-date">{{ formatDate(item.createdAt) }}</span>
              <el-tag v-for="tag in item.tags" :key="tag" size="small" class="essay-tag">{{ tag }}</el-tag>
            </div>
          </router-link>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useScrollAnimate } from '@/utils/useScrollAnimate'

const elRef = ref(null)

const essays = ref([])

function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

onMounted(() => {
  useScrollAnimate(elRef.value)
})
</script>

<style lang="scss" scoped>
.latest-essay-section {
  padding: $spacing-2xl 0;
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

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    pointer-events: none;
    background:
      radial-gradient(ellipse 50% 50% at 50% 30%, rgba($pink-200, 0.06) 0%, transparent 60%);
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
  position: relative;

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

.essay-list {
  display: flex;
  flex-direction: column;
  gap: $spacing-md;
  max-width: 700px;
  margin: 0 auto;
}

.essay-card {
  background: $color-bg-card;
  border-radius: $radius-lg;
  padding: $spacing-lg;
  border: 1px solid $warm-gray-200;
  box-shadow: 0 1px 2px rgba($pink-800, 0.04);
  transition: transform $transition-normal, box-shadow $transition-normal;

  &:hover {
    transform: translateY(-4px);
    box-shadow: $shadow-md;

    .essay-title { color: $pink-600; }
  }

  &:active {
    transform: translateY(-2px);
  }
}

.essay-link {
  text-decoration: none;
  color: inherit;
  display: block;
}

.essay-title {
  font-size: $font-size-md;
  font-weight: $font-weight-semibold;
  color: $color-text;
  margin-bottom: $spacing-sm;
  transition: color $transition-fast;
}

.essay-excerpt {
  font-size: $font-size-base;
  color: $color-text-secondary;
  line-height: 1.6;
  margin-bottom: $spacing-md;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.essay-meta {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
  flex-wrap: wrap;
}

.essay-date {
  font-size: $font-size-xs;
  color: $color-text-secondary;
}

.essay-tag {
  --el-tag-bg-color: #{$pink-100};
  --el-tag-border-color: #{$pink-200};
  --el-tag-text-color: #{$pink-600};
}
</style>
