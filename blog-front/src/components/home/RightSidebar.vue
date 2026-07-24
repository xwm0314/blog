<template>
  <aside class="right-sidebar">
    <div class="calendar-widget">
      <div class="calendar-header">
        <el-button text @click="prevMonth" size="small" class="cal-nav-btn">
          <el-icon><ArrowLeft /></el-icon>
        </el-button>
        <span class="calendar-title">{{ year }} 年{{ month + 1 }} 月</span>
        <el-button text @click="nextMonth" size="small" class="cal-nav-btn">
          <el-icon><ArrowRight /></el-icon>
        </el-button>
      </div>

      <div class="calendar-weekdays">
        <span v-for="w in weekdays" :key="w" class="weekday">{{ w }}</span>
      </div>

      <div class="calendar-grid">
        <div
          v-for="(day, idx) in calendarDays"
          :key="idx"
          class="calendar-cell"
          :class="{
            'is-empty': !day.day,
            'is-marked': day.day && hasContent(day.date),
            'is-selected': day.day && isSelected(day.date),
            'is-today': day.day && isToday(day.date)
          }"
          :title="day.day ? (hasContent(day.date) ? '点击筛选' : '') : ''"
          @click="handleDateClick(day)"
        >
          <span v-if="day.day" class="cell-day">{{ day.day }}</span>
        </div>
      </div>
    </div>

    <div class="sidebar-footer">
      <div class="dot-legend">
        <span class="dot dot-marked"></span>
        <span class="dot-label">有内容</span>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ArrowLeft, ArrowRight } from '@element-plus/icons-vue'

const props = defineProps({
  markedDates: {
    type: Array,
    default: () => []
  },
  selectedDate: {
    type: String,
    default: null
  }
})

const emit = defineEmits(['date-click'])

const weekdays = ['日', '一', '二', '三', '四', '五', '六']

const currentMonth = ref(new Date())
const year = computed(() => currentMonth.value.getFullYear())
const month = computed(() => currentMonth.value.getMonth())

const markedSet = computed(() => new Set(props.markedDates))

const calendarDays = computed(() => {
  const firstDay = new Date(year.value, month.value, 1)
  const lastDay = new Date(year.value, month.value + 1, 0)
  const days = []

  const startWeekday = firstDay.getDay()
  for (let i = 0; i < startWeekday; i++) {
    days.push({ day: null, date: null })
  }

  for (let d = 1; d <= lastDay.getDate(); d++) {
    const date = `${year.value}-${String(month.value + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    days.push({ day: d, date })
  }

  const remaining = 7 - (days.length % 7)
  if (remaining < 7) {
    for (let i = 0; i < remaining; i++) {
      days.push({ day: null, date: null })
    }
  }

  return days
})

function hasContent(date) {
  return markedSet.value.has(date)
}

function isSelected(date) {
  return props.selectedDate === date
}

function isToday(date) {
  const today = new Date()
  return date === `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
}

function handleDateClick(day) {
  if (day.day && hasContent(day.date)) {
    emit('date-click', day.date)
  }
}

function prevMonth() {
  currentMonth.value = new Date(year.value, month.value - 1, 1)
}

function nextMonth() {
  currentMonth.value = new Date(year.value, month.value + 1, 1)
}
</script>

<style lang="scss" scoped>
.right-sidebar {
  width: 280px;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: $spacing-xl $spacing-md;
  background: $glass-bg;
  backdrop-filter: blur($glass-blur);
  -webkit-backdrop-filter: blur($glass-blur);
  border-left: 1px solid $glass-border;
  flex-shrink: 0;
  position: relative;
  z-index: 2;
  box-shadow: 
    -4px 0 24px rgba($pink-400, 0.08),
    inset 1px 0 0 rgba(255, 255, 255, 0.6);
}

.calendar-widget {
  width: 100%;
  max-width: 240px;
  padding: $spacing-md;
  background: rgba(255, 255, 255, 0.4);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-radius: $radius-xl;
  border: 1px solid rgba(255, 255, 255, 0.5);
  box-shadow: $glass-shadow-sm;
}

.calendar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: $spacing-md;
}

.cal-nav-btn {
  --el-button-hover-bg-color: rgba($pink-200, 0.5);
  --el-button-hover-text-color: #{$pink-600};
  color: $color-text-secondary;
}

.calendar-title {
  font-size: $font-size-base;
  font-weight: $font-weight-semibold;
  background: $gradient-pink-purple;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: $tracking-tight;
}

.calendar-weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;
  margin-bottom: $spacing-xs;
}

.weekday {
  font-size: 11px;
  color: $color-text-secondary;
  line-height: 28px;
  font-weight: $font-weight-medium;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;
  gap: 2px;
}

.calendar-cell {
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: $radius-sm;
  font-size: $font-size-sm;
  cursor: default;

  &.is-empty {
    cursor: default;
  }

  &.is-today .cell-day {
    font-weight: $font-weight-bold;
    background: linear-gradient(135deg, rgba($pink-300, 0.6), rgba($purple-pink-300, 0.6));
    color: #fff;
    box-shadow: 0 2px 8px rgba($pink-400, 0.3);
  }

  &.is-marked {
    cursor: pointer;

    .cell-day {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 28px;
      height: 28px;
      border-radius: $radius-round;
      background: rgba($pink-300, 0.25);
      color: $pink-700;
      font-weight: $font-weight-semibold;
      transition: all $transition-fast;
    }

    &:hover .cell-day {
      background: $gradient-pink-purple-soft;
      color: #fff;
      transform: scale(1.15);
      box-shadow: 
        0 4px 12px rgba($pink-400, 0.3),
        0 0 16px rgba($pink-300, 0.4);
    }

    &.is-selected .cell-day {
      background: $gradient-pink-purple;
      color: #fff;
      box-shadow: 
        0 0 0 2px rgba(255, 255, 255, 0.8),
        0 4px 12px rgba($pink-500, 0.4),
        0 0 20px rgba($pink-400, 0.5);
      transform: scale(1.1);
    }
  }

  &:not(.is-marked):not(.is-empty) .cell-day {
    width: 28px;
    height: 28px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: $radius-round;
    color: $color-text-secondary;
    transition: background $transition-fast;
  }

  &:not(.is-marked):not(.is-empty):hover .cell-day {
    background: rgba(255, 255, 255, 0.5);
  }
}

.cell-day {
  font-size: $font-size-sm;
  transition: all $transition-fast;
}

.sidebar-footer {
  margin-top: $spacing-lg;
  width: 100%;
  max-width: 240px;
  padding-top: $spacing-md;
  border-top: 1px solid rgba(255, 255, 255, 0.4);
}

.dot-legend {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;

  &.dot-marked {
    background: $gradient-pink-purple;
    box-shadow: 0 0 8px rgba($pink-400, 0.6);
  }
}

.dot-label {
  font-size: $font-size-xs;
  color: $color-text-secondary;
}
</style>