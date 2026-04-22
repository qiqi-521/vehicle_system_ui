<template>
  <div class="statistics-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-info">
        <div class="header-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        </div>
        <div class="header-text">
          <h2 class="title">用户分析</h2>
          <p class="subtitle">用户数据统计分析</p>
        </div>
      </div>
    </div>

    <!-- 统计卡片 -->
    <div class="stats-cards">
      <div class="stat-card">
        <div class="stat-icon total">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        </div>
        <div class="stat-content">
          <span class="stat-value">{{ overview.totalUsers }}</span>
          <span class="stat-label">总用户数</span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon today">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="8.5" cy="7" r="4" />
            <line x1="20" y1="8" x2="20" y2="14" />
            <line x1="23" y1="11" x2="17" y2="11" />
          </svg>
        </div>
        <div class="stat-content">
          <span class="stat-value">{{ overview.todayNewUsers }}</span>
          <span class="stat-label">今日新增用户</span>
        </div>
      </div>
    </div>

    <!-- 用户注册趋势图 -->
    <div class="chart-card">
      <div class="chart-header">
        <h3 class="chart-title">用户注册趋势</h3>
        <div class="chart-tabs">
          <button :class="['tab', { active: trendDays === 7 }]" @click="changeTrendDays(7)">近7天</button>
          <button :class="['tab', { active: trendDays === 30 }]" @click="changeTrendDays(30)">近30天</button>
        </div>
      </div>
      <div ref="trendChart" class="chart-container"></div>
    </div>

    <!-- 用户状态分布 -->
    <div class="chart-card">
      <div class="chart-header">
        <h3 class="chart-title">用户状态分布</h3>
      </div>
      <div ref="statusChart" class="chart-container"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import * as echarts from 'echarts'
import { getUserTrend, getUserStatus, getUserOverview } from '@/api/admin/statistics'

// 图表实例
const trendChart = ref(null)
const statusChart = ref(null)
let trendInstance = null
let statusInstance = null

// 数据
const overview = ref({
  totalUsers: 0,
  todayNewUsers: 0
})
const trendDays = ref(7)

// 获取用户概览
async function fetchOverview() {
  try {
    const res = await getUserOverview()
    overview.value = res
  } catch (e) {
    // 错误已处理
  }
}

// 获取用户注册趋势数据
async function fetchTrend() {
  try {
    const res = await getUserTrend(trendDays.value)
    renderTrendChart(res)
  } catch (e) {
    // 错误已处理
  }
}

// 获取用户状态分布
async function fetchStatus() {
  try {
    const res = await getUserStatus()
    renderStatusChart(res)
  } catch (e) {
    // 错误已处理
  }
}

// 渲染用户注册趋势图
function renderTrendChart(data) {
  if (!trendInstance) {
    trendInstance = echarts.init(trendChart.value)
  }

  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: data.map(item => item.date.substring(5)),
      axisLine: { lineStyle: { color: '#e2e8f0' } },
      axisLabel: { color: '#64748b', fontSize: 12 }
    },
    yAxis: {
      type: 'value',
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: '#64748b', fontSize: 12 },
      splitLine: { lineStyle: { color: '#f1f5f9' } }
    },
    series: [{
      name: '新增用户',
      type: 'line',
      smooth: true,
      symbol: 'circle',
      symbolSize: 8,
      lineStyle: { width: 3, color: '#8b5cf6' },
      itemStyle: { color: '#8b5cf6' },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: 'rgba(139, 92, 246, 0.3)' },
          { offset: 1, color: 'rgba(139, 92, 246, 0.05)' }
        ])
      },
      data: data.map(item => item.count)
    }]
  }

  trendInstance.setOption(option)
}

// 渲染用户状态分布图
function renderStatusChart(data) {
  if (!statusInstance) {
    statusInstance = echarts.init(statusChart.value)
  }

  const colors = ['#10b981', '#ef4444']

  const option = {
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      right: '5%',
      top: 'center',
      itemWidth: 12,
      itemHeight: 12,
      textStyle: { color: '#64748b', fontSize: 13 }
    },
    series: [{
      type: 'pie',
      radius: ['45%', '70%'],
      center: ['35%', '50%'],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 6,
        borderColor: '#fff',
        borderWidth: 2
      },
      label: { show: false },
      emphasis: {
        label: { show: true, fontSize: 14, fontWeight: 'bold' }
      },
      data: data.map((item, index) => ({
        name: item.status,
        value: item.count,
        itemStyle: { color: colors[index % colors.length] }
      }))
    }]
  }

  statusInstance.setOption(option)
}

// 切换趋势天数
function changeTrendDays(days) {
  trendDays.value = days
  fetchTrend()
}

// 窗口大小变化时重绘图表
function handleResize() {
  trendInstance?.resize()
  statusInstance?.resize()
}

onMounted(async () => {
  await nextTick()
  fetchOverview()
  fetchTrend()
  fetchStatus()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  trendInstance?.dispose()
  statusInstance?.dispose()
})
</script>

<style scoped>
.statistics-page {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* 页面头部 */
.page-header {
  padding: 24px 28px;
  background: linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%);
  border-radius: 16px;
  color: #fff;
  box-shadow: 0 4px 20px rgba(139, 92, 246, 0.25);
}

.header-info {
  display: flex;
  align-items: center;
  gap: 16px;
}

.header-icon {
  width: 52px;
  height: 52px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.header-icon svg {
  width: 28px;
  height: 28px;
}

.header-text .title {
  font-size: 24px;
  font-weight: 700;
  margin: 0 0 4px 0;
}

.header-text .subtitle {
  font-size: 14px;
  opacity: 0.85;
  margin: 0;
}

/* 统计卡片 */
.stats-cards {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.stat-card {
  background: #fff;
  border-radius: 16px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.stat-icon {
  width: 56px;
  height: 56px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-icon svg {
  width: 28px;
  height: 28px;
  color: #fff;
}

.stat-icon.total {
  background: linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%);
}

.stat-icon.today {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
}

.stat-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  color: #1e293b;
}

.stat-label {
  font-size: 14px;
  color: #64748b;
}

/* 图表卡片 */
.chart-card {
  background: #fff;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.chart-title {
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

.chart-tabs {
  display: flex;
  gap: 4px;
  background: #f1f5f9;
  padding: 4px;
  border-radius: 8px;
}

.chart-tabs .tab {
  padding: 6px 16px;
  border: none;
  background: transparent;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s;
}

.chart-tabs .tab:hover {
  color: #8b5cf6;
}

.chart-tabs .tab.active {
  background: #fff;
  color: #8b5cf6;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.chart-container {
  height: 300px;
}

@media (max-width: 1024px) {
  .stats-cards {
    grid-template-columns: 1fr;
  }
}
</style>
