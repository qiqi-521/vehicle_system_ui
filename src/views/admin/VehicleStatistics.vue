<template>
  <div class="statistics-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-info">
        <div class="header-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
            <circle cx="7" cy="17" r="2" />
            <path d="M9 17h6" />
            <circle cx="17" cy="17" r="2" />
          </svg>
        </div>
        <div class="header-text">
          <h2 class="title">车辆分析</h2>
          <p class="subtitle">车辆数据统计分析</p>
        </div>
      </div>
    </div>

    <!-- 统计卡片 -->
    <div class="stats-cards">
      <div class="stat-card">
        <div class="stat-icon total">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
            <circle cx="7" cy="17" r="2" />
            <path d="M9 17h6" />
            <circle cx="17" cy="17" r="2" />
          </svg>
        </div>
        <div class="stat-content">
          <span class="stat-value">{{ overview.totalVehicles }}</span>
          <span class="stat-label">总车辆数</span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon available">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        </div>
        <div class="stat-content">
          <span class="stat-value">{{ overview.availableVehicles }}</span>
          <span class="stat-label">可租用车辆</span>
        </div>
      </div>
    </div>

    <!-- 车辆租赁热度排行 -->
    <div class="chart-card">
      <div class="chart-header">
        <h3 class="chart-title">车辆租赁热度排行（Top 10）</h3>
      </div>
      <div ref="popularityChart" class="chart-container"></div>
    </div>

    <!-- 车辆状态分布 -->
    <div class="chart-card">
      <div class="chart-header">
        <h3 class="chart-title">车辆状态分布</h3>
      </div>
      <div ref="statusChart" class="chart-container"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import * as echarts from 'echarts'
import { getVehiclePopularity, getVehicleStatus, getVehicleOverview } from '@/api/admin/statistics'

// 图表实例
const popularityChart = ref(null)
const statusChart = ref(null)
let popularityInstance = null
let statusInstance = null

// 数据
const overview = ref({
  totalVehicles: 0,
  availableVehicles: 0
})

// 获取车辆概览
async function fetchOverview() {
  try {
    const res = await getVehicleOverview()
    overview.value = res
  } catch (e) {
    // 错误已处理
  }
}

// 获取车辆热度排行
async function fetchPopularity() {
  try {
    const res = await getVehiclePopularity()
    renderPopularityChart(res)
  } catch (e) {
    // 错误已处理
  }
}

// 获取车辆状态分布
async function fetchStatus() {
  try {
    const res = await getVehicleStatus()
    renderStatusChart(res)
  } catch (e) {
    // 错误已处理
  }
}

// 渲染热度排行图
function renderPopularityChart(data) {
  if (!popularityInstance) {
    popularityInstance = echarts.init(popularityChart.value)
  }

  // 反转数据，让最多的在上面
  const reversedData = [...data].reverse()

  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' }
    },
    grid: {
      left: '3%',
      right: '8%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'value',
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: '#64748b', fontSize: 12 },
      splitLine: { lineStyle: { color: '#f1f5f9' } }
    },
    yAxis: {
      type: 'category',
      data: reversedData.map(item => item.vehicleName),
      axisLine: { lineStyle: { color: '#e2e8f0' } },
      axisLabel: { color: '#1e293b', fontSize: 13, fontWeight: 500 }
    },
    series: [{
      name: '订单数',
      type: 'bar',
      barWidth: '60%',
      itemStyle: {
        borderRadius: [0, 4, 4, 0],
        color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
          { offset: 0, color: '#8b5cf6' },
          { offset: 1, color: '#a78bfa' }
        ])
      },
      label: {
        show: true,
        position: 'right',
        color: '#64748b',
        fontSize: 12
      },
      data: reversedData.map(item => item.orderCount)
    }]
  }

  popularityInstance.setOption(option)
}

// 渲染状态分布图
function renderStatusChart(data) {
  if (!statusInstance) {
    statusInstance = echarts.init(statusChart.value)
  }

  const colors = ['#10b981', '#f59e0b', '#8b5cf6']

  const option = {
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c}辆 ({d}%)'
    },
    legend: {
      orient: 'horizontal',
      bottom: '5%',
      itemWidth: 12,
      itemHeight: 12,
      textStyle: { color: '#64748b', fontSize: 13 }
    },
    series: [{
      type: 'pie',
      radius: ['40%', '65%'],
      center: ['50%', '45%'],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 6,
        borderColor: '#fff',
        borderWidth: 2
      },
      label: {
        show: true,
        position: 'inside',
        formatter: '{c}',
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold'
      },
      emphasis: {
        label: { show: true, fontSize: 16, fontWeight: 'bold' }
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

// 窗口大小变化时重绘图表
function handleResize() {
  popularityInstance?.resize()
  statusInstance?.resize()
}

onMounted(async () => {
  await nextTick()
  fetchOverview()
  fetchPopularity()
  fetchStatus()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  popularityInstance?.dispose()
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
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
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
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
}

.stat-icon.available {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
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

.chart-container {
  height: 350px;
}

@media (max-width: 1024px) {
  .stats-cards {
    grid-template-columns: 1fr;
  }
}
</style>
