<template>
  <section class="skill-section page-container scroll-animate" ref="elRef">
    <h2 class="section-title">技能</h2>
    <div class="skill-grid">
      <div v-for="skill in skills" :key="skill.name" class="skill-item">
        <div class="skill-header">
          <span class="skill-name">{{ skill.name }}</span>
          <span class="skill-level">{{ skill.level }}%</span>
        </div>
        <el-progress
          :percentage="skill.level"
          :stroke-width="8"
          :color="skillColors"
          :format="() => ''"
        />
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useScrollAnimate } from '@/utils/useScrollAnimate'

const elRef = ref(null)

const skills = ref([])

const skillColors = [
  { color: '#d4839a', percentage: 80 },
  { color: '#eaa6b8', percentage: 60 },
  { color: '#f2c4d0', percentage: 40 },
  { color: '#f8dce4', percentage: 20 }
]

onMounted(() => {
  useScrollAnimate(elRef.value)
})
</script>

<style lang="scss" scoped>
.skill-section {
  padding: $spacing-2xl $spacing-lg;
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

.skill-grid {
  max-width: 500px;
  margin: 0 auto;
}

.skill-item {
  margin-bottom: $spacing-lg;
  padding: $spacing-md;
  background: $color-bg-card;
  border-radius: $radius-md;
  border: 1px solid $warm-gray-200;
  box-shadow: 0 1px 2px rgba($pink-800, 0.03);
  transition: transform $transition-fast, box-shadow $transition-fast;

  &:hover {
    transform: translateY(-2px);
    box-shadow: $shadow-sm;
  }
}

.skill-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: $spacing-sm;
}

.skill-name {
  font-size: $font-size-sm;
  font-weight: $font-weight-medium;
  color: $color-text;
}

.skill-level {
  font-size: $font-size-xs;
  color: $pink-500;
  font-weight: $font-weight-semibold;
}
</style>
