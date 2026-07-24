<template>
  <div class="dashboard-page">
    <div class="page-header">
      <h2 class="page-title">数据概览</h2>
      <p class="page-subtitle">欢迎回来，查看你的博客数据</p>
    </div>

    <el-row :gutter="16" class="stat-row">
      <el-col :xs="12" :sm="12" :md="6" v-for="stat in stats" :key="stat.label">
        <div class="stat-card" :class="stat.type">
          <div class="stat-icon">
            <el-icon :size="24">
              <component :is="stat.icon" />
            </el-icon>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ stat.value }}</div>
            <div class="stat-label">{{ stat.label }}</div>
          </div>
        </div>
      </el-col>
    </el-row>

    <el-row :gutter="16" class="chart-row">
      <el-col :md="16" :sm="24">
        <el-card shadow="never" class="chart-card">
          <template #header>
            <div class="card-header">
              <div class="header-left">
                <span class="card-title">文章发布趋势</span>
                <el-radio-group v-model="trendRange" size="small" class="range-selector" @change="handleRangeChange">
                  <el-radio-button label="7">近7天</el-radio-button>
                  <el-radio-button label="30">近30天</el-radio-button>
                  <el-radio-button label="90">近3月</el-radio-button>
                  <el-radio-button label="180">近6月</el-radio-button>
                  <el-radio-button label="365">近12月</el-radio-button>
                </el-radio-group>
              </div>
              <span class="card-subtitle">单位：篇 / 次</span>
            </div>
          </template>
          <div ref="trendChartRef" class="chart-container"></div>
        </el-card>
      </el-col>
      <el-col :md="8" :sm="24">
        <el-card shadow="never" class="chart-card">
          <template #header>
            <div class="card-header">
              <span class="card-title">标签分布</span>
              <span class="card-subtitle">TOP 10</span>
            </div>
          </template>
          <div ref="tagChartRef" class="chart-container pie-chart"></div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="16">
      <el-col :span="24">
        <el-card shadow="never" class="table-card">
          <template #header>
            <div class="card-header">
              <span class="card-title">最新文章</span>
              <el-button type="primary" text @click="goToArticles">查看全部</el-button>
            </div>
          </template>
          <el-table :data="recentArticles" style="width: 100%" :show-header="true">
            <el-table-column prop="title" label="文章标题" min-width="200">
              <template #default="{ row }">
                <span class="article-title" @click="viewArticle(row._id)">{{ row.title }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="category" label="分类" width="120">
              <template #default="{ row }">
                <el-tag size="small" type="info">{{ row.category }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="views" label="浏览量" width="120">
              <template #default="{ row }">
                <span class="view-count">
                  <el-icon><View /></el-icon>
                  {{ formatViews(row.views) }}
                </span>
              </template>
            </el-table-column>
            <el-table-column prop="createdAt" label="发布时间" width="180">
              <template #default="{ row }">
                <span class="date-text">{{ formatDate(row.createdAt) }}</span>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import * as echarts from 'echarts'
import { getStats, getArticleTrend, getTagStats, getRecentArticles } from '@/api/stats'
import { Document, PriceTag, Message, View, DataAnalysis, ChatDotRound } from '@element-plus/icons-vue'

const router = useRouter()
const trendChartRef = ref(null)
const tagChartRef = ref(null)
let trendChart = null
let tagChart = null

const stats = ref([
  { label: '文章总数', value: 0, icon: Document, type: 'article' },
  { label: '动态总数', value: 0, icon: ChatDotRound, type: 'dynamic' },
  { label: '标签总数', value: 0, icon: PriceTag, type: 'tag' },
  { label: '总浏览量', value: 0, icon: View, type: 'views' }
])

const recentArticles = ref([])
const trendRange = ref('365')
const trendData = ref(null)
const trendType = ref('month')

function formatViews(num) {
  if (num >= 10000) return (num / 10000).toFixed(1) + 'w'
  if (num >= 1000) return (num / 1000).toFixed(1) + 'k'
  return num
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function goToArticles() {
  router.push('/admin/articles')
}

function viewArticle(id) {
  router.push(`/admin/articles/${id}/edit`)
}

function initTrendChart(data, type) {
  trendData.value = data
  trendType.value = type
  if (!trendChartRef.value) return
  updateTrendChart()
}

async function handleRangeChange() {
  const days = parseInt(trendRange.value)
  
  if (days <= 30) {
    trendType.value = 'day'
    try {
      const res = await getArticleTrend({ type: 'day', days })
      trendData.value = res.data
    } catch (e) {
      console.error('获取日趋势数据失败:', e)
    }
  } else {
    trendType.value = 'month'
    try {
      const res = await getArticleTrend({ type: 'month' })
      trendData.value = res.data
    } catch (e) {
      console.error('获取月趋势数据失败:', e)
    }
  }
  
  updateTrendChart()
}

function updateTrendChart() {
  if (!trendChartRef.value || !trendData.value) return
  
  let labels = []
  let counts = []
  let views = []
  
  if (trendType.value === 'day') {
    const days = parseInt(trendRange.value)
    const filtered = trendData.value.days.slice(-days)
    labels = filtered.map(d => d.day.slice(5).replace('-', '/'))
    counts = filtered.map(d => d.count)
    views = filtered.map(d => d.views)
  } else {
    const monthCount = Math.ceil(parseInt(trendRange.value) / 30)
    const filtered = trendData.value.months.slice(-monthCount)
    labels = filtered.map(m => m.month.slice(5) + '月')
    counts = filtered.map(m => m.count)
    views = filtered.map(m => m.views)
  }
  
  const option = {
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#f0e8ec',
      borderWidth: 1,
      textStyle: {
        color: '#6b5c60'
      }
    },
    legend: {
      data: ['发布数量', '浏览量'],
      right: 10,
      top: 0,
      textStyle: {
        color: '#8b7d81',
        fontSize: 12
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '15%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: labels,
      axisLine: {
        lineStyle: { color: '#e8dfe3' }
      },
      axisLabel: {
        color: '#9e8f94',
        fontSize: 11,
        interval: trendType.value === 'day' && labels.length > 15 ? Math.floor(labels.length / 8) : 0
      }
    },
    yAxis: [
      {
        type: 'value',
        name: '篇数',
        axisLine: { show: false },
        axisTick: { show: false },
        splitLine: {
          lineStyle: {
            color: '#f5eef1',
            type: 'dashed'
          }
        },
        axisLabel: {
          color: '#9e8f94',
          fontSize: 11
        }
      },
      {
        type: 'value',
        name: '浏览量',
        axisLine: { show: false },
        axisTick: { show: false },
        splitLine: { show: false },
        axisLabel: {
          color: '#9e8f94',
          fontSize: 11,
          formatter: function(value) {
            if (value >= 10000) return (value / 10000) + 'w'
            if (value >= 1000) return (value / 1000) + 'k'
            return value
          }
        }
      }
    ],
    series: [
      {
        name: '发布数量',
        type: 'line',
        smooth: true,
        data: counts,
        lineStyle: {
          color: '#e891a8',
          width: 3
        },
        itemStyle: {
          color: '#e891a8'
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(232, 145, 168, 0.3)' },
            { offset: 1, color: 'rgba(232, 145, 168, 0.02)' }
          ])
        },
        symbol: 'circle',
        symbolSize: trendType.value === 'day' && labels.length > 15 ? 4 : 6
      },
      {
        name: '浏览量',
        type: 'line',
        smooth: true,
        yAxisIndex: 1,
        data: views,
        lineStyle: {
          color: '#a7c8f0',
          width: 2,
          type: 'dashed'
        },
        itemStyle: {
          color: '#a7c8f0'
        },
        symbol: 'circle',
        symbolSize: trendType.value === 'day' && labels.length > 15 ? 3 : 5
      }
    ]
  }
  
  if (!trendChart) {
    trendChart = echarts.init(trendChartRef.value)
  }
  trendChart.setOption(option, true)
}

function initTagChart(data) {
  if (!tagChartRef.value) return
  tagChart = echarts.init(tagChartRef.value)
  
  const colors = [
    '#e891a8', '#f4b8c9', '#d4a8e8', '#a7c8f0', '#a8e0d4',
    '#f5d89e', '#f2b6a0', '#c5b6e8', '#e8c4a8', '#a8d4e8'
  ]
  
  const option = {
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#f0e8ec',
      borderWidth: 1,
      textStyle: {
        color: '#6b5c60'
      },
      formatter: '{b}: {c} 篇 ({d}%)'
    },
    legend: {
      orient: 'vertical',
      right: 10,
      top: 'center',
      textStyle: {
        color: '#8b7d81',
        fontSize: 12
      },
      itemWidth: 10,
      itemHeight: 10
    },
    series: [
      {
        type: 'pie',
        radius: ['45%', '70%'],
        center: ['35%', '50%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 6,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: false
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 14,
            fontWeight: 'bold',
            color: '#6b5c60'
          },
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.1)'
          }
        },
        labelLine: {
          show: false
        },
        data: data.tags,
        color: colors
      }
    ]
  }
  
  tagChart.setOption(option)
}

function handleResize() {
  trendChart?.resize()
  tagChart?.resize()
}

onMounted(async () => {
  try {
    const [statsRes, trendRes, tagRes, recentRes] = await Promise.all([
      getStats(),
      getArticleTrend(),
      getTagStats(),
      getRecentArticles()
    ])
    
    const data = statsRes.data
    stats.value = [
      { label: '文章总数', value: data.articleCount || 0, icon: Document, type: 'article' },
      { label: '动态总数', value: data.dynamicCount || 0, icon: ChatDotRound, type: 'dynamic' },
      { label: '标签总数', value: data.tagCount || 0, icon: PriceTag, type: 'tag' },
      { label: '总浏览量', value: formatViews(data.totalViews || 0), icon: View, type: 'views' }
    ]
    
    recentArticles.value = recentRes.data?.list || []
    
    await nextTick()
    initTrendChart(trendRes.data, 'month')
    initTagChart(tagRes.data)
    
    window.addEventListener('resize', handleResize)
  } catch (e) {
    console.error('加载统计数据失败:', e)
  }
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  trendChart?.dispose()
  tagChart?.dispose()
})
</script>

<style lang="scss" scoped>
.dashboard-page {
  padding: 20px 24px 24px;
  background: #faf6f7;
  min-height: 100%;
}

.page-header {
  margin-bottom: 20px;
  
  .page-title {
    font-size: 22px;
    font-weight: 600;
    color: #4a3b40;
    margin: 0 0 4px 0;
  }
  
  .page-subtitle {
    font-size: 13px;
    color: #9e8f94;
    margin: 0;
  }
}

.stat-row {
  margin-bottom: 16px;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 20px;
  background: #fff;
  border-radius: 12px;
  border: 1px solid #f0e8ec;
  transition: all 0.3s ease;
  
  &:hover {
    box-shadow: 0 6px 20px rgba(200, 150, 170, 0.12);
    transform: translateY(-2px);
  }
  
  .stat-icon {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  
  &.article .stat-icon {
    background: linear-gradient(135deg, #fde7ed 0%, #f9d4de 100%);
    color: #d4698a;
  }
  
  &.dynamic .stat-icon {
    background: linear-gradient(135deg, #e8f4fd 0%, #d0e8fa 100%);
    color: #5b9bd5;
  }
  
  &.tag .stat-icon {
    background: linear-gradient(135deg, #f3ecf7 0%, #e6daf0 100%);
    color: #9575cd;
  }
  
  &.views .stat-icon {
    background: linear-gradient(135deg, #e8f8f4 0%, #c9f0e6 100%);
    color: #4db6ac;
  }
  
  .stat-content {
    flex: 1;
    min-width: 0;
  }
  
  .stat-value {
    font-size: 24px;
    font-weight: 700;
    color: #4a3b40;
    line-height: 1.2;
    margin-bottom: 4px;
  }
  
  .stat-label {
    font-size: 12px;
    color: #9e8f94;
  }
}

.chart-row {
  margin-bottom: 16px;
}

.chart-card {
  border-radius: 12px;
  border: 1px solid #f0e8ec;
  
  :deep(.el-card__header) {
    padding: 16px 20px;
    border-bottom: 1px solid #f7f0f3;
  }
  
  :deep(.el-card__body) {
    padding: 16px 20px 20px;
  }
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  
  .header-left {
    display: flex;
    align-items: center;
    gap: 16px;
  }
  
  .card-title {
    font-size: 15px;
    font-weight: 600;
    color: #4a3b40;
  }
  
  .card-subtitle {
    font-size: 12px;
    color: #b5a7ac;
  }
}

.range-selector {
  :deep(.el-radio-button__inner) {
    padding: 6px 14px;
    font-size: 12px;
    border-color: #e8dfe3;
    color: #8b7d81;
    background: #fff;
    
    &:hover {
      color: #d4698a;
    }
  }
  
  :deep(.el-radio-button__orig-radio:checked + .el-radio-button__inner) {
    background: linear-gradient(135deg, #e891a8 0%, #d4698a 100%);
    border-color: #d4698a;
    color: #fff;
    box-shadow: none;
  }
  
  :deep(.el-radio-button:first-child .el-radio-button__inner) {
    border-radius: 6px 0 0 6px;
  }
  
  :deep(.el-radio-button:last-child .el-radio-button__inner) {
    border-radius: 0 6px 6px 0;
  }
}

.chart-container {
  width: 100%;
  height: 300px;
  
  &.pie-chart {
    height: 300px;
  }
}

.table-card {
  border-radius: 12px;
  border: 1px solid #f0e8ec;
  
  :deep(.el-card__header) {
    padding: 16px 20px;
    border-bottom: 1px solid #f7f0f3;
  }
  
  :deep(.el-card__body) {
    padding: 0;
  }
  
  :deep(.el-table) {
    border-radius: 0;
    
    th.el-table__cell {
      background: #fdf9fa;
      color: #8b7d81;
      font-weight: 500;
      font-size: 13px;
    }
    
    td.el-table__cell {
      color: #6b5c60;
      font-size: 13px;
    }
  }
}

.article-title {
  color: #4a3b40;
  cursor: pointer;
  transition: color 0.2s ease;
  
  &:hover {
    color: #d4698a;
  }
}

.view-count {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #9e8f94;
  font-size: 12px;
}

.date-text {
  color: #b5a7ac;
  font-size: 12px;
}

@media (max-width: 768px) {
  .dashboard-page {
    padding: 16px;
  }
  
  .stat-card {
    padding: 16px;
    
    .stat-icon {
      width: 40px;
      height: 40px;
    }
    
    .stat-value {
      font-size: 20px;
    }
  }
  
  .chart-container {
    height: 250px;
  }
}
</style>
