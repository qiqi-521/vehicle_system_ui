<template>
  <div class="statistics-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-info">
        <div class="header-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 20V10" />
            <path d="M12 20V4" />
            <path d="M6 20v-6" />
          </svg>
        </div>
        <div class="header-text">
          <h2 class="title">订单分析</h2>
          <p class="subtitle">订单数据统计分析</p>
        </div>
      </div>
    </div>

    <!-- 统计卡片 -->
    <div class="stats-cards">
      <div class="stat-card">
        <div class="stat-icon orders">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
          </svg>
        </div>
        <div class="stat-content">
          <span class="stat-value">{{ overview.todayOrderCount }}</span>
          <span class="stat-label">今日订单数</span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon revenue">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="12" y1="1" x2="12" y2="23" />
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
        </div>
        <div class="stat-content">
          <span class="stat-value">¥{{ formatMoney(overview.todayRevenue) }}</span>
          <span class="stat-label">今日收入</span>
        </div>
      </div>
    </div>

    <!-- 订单趋势图 -->
    <div class="chart-card">
      <div class="chart-header">
        <h3 class="chart-title">订单趋势</h3>
        <div class="chart-tabs">
          <button :class="['tab', { active: orderTrendDays === 7 }]" @click="changeOrderTrendDays(7)">近7天</button>
          <button :class="['tab', { active: orderTrendDays === 30 }]" @click="changeOrderTrendDays(30)">近30天</button>
        </div>
      </div>
      <div ref="orderTrendChart" class="chart-container"></div>
    </div>

    <!-- 订单状态分布 & 收入趋势 -->
    <div class="charts-row">
      <div class="chart-card half">
        <div class="chart-header">
          <h3 class="chart-title">订单状态分布</h3>
        </div>
        <div ref="orderStatusChart" class="chart-container"></div>
      </div>
      <div class="chart-card half">
        <div class="chart-header">
          <h3 class="chart-title">收入趋势</h3>
          <div class="chart-tabs">
            <button :class="['tab', { active: revenueTrendDays === 7 }]" @click="changeRevenueTrendDays(7)">近7天</button>
            <button :class="['tab', { active: revenueTrendDays === 30 }]" @click="changeRevenueTrendDays(30)">近30天</button>
          </div>
        </div>
        <div ref="revenueTrendChart" class="chart-container"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import * as echarts from 'echarts'
import { getOrderTrend, getOrderStatus, getRevenueTrend, getTodayOverview } from '@/api/admin/statistics'

// 图表实例
const orderTrendChart = ref(null)
const orderStatusChart = ref(null)
const revenueTrendChart = ref(null)
let orderTrendInstance = null
let orderStatusInstance = null
let revenueTrendInstance = null

// 数据
const overview = ref({
  todayOrderCount: 0,
  todayRevenue: 0
})
const orderTrendDays = ref(7)
const revenueTrendDays = ref(7)

// 格式化金额
function formatMoney(value) {
  if (!value) return '0.00'
  return Number(value).toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

// 获取今日概览
async function fetchOverview() {
  try {
    const res = await getTodayOverview()
    overview.value = res
  } catch (e) {
    // 错误已处理
  }
}

// 获取订单趋势数据
async function fetchOrderTrend() {
  try {
    const res = await getOrderTrend(orderTrendDays.value)
    renderOrderTrendChart(res)
  } catch (e) {
    // 错误已处理
  }
}

// 获取订单状态分布
async function fetchOrderStatus() {
  try {
    const res = await getOrderStatus()
    renderOrderStatusChart(res)
  } catch (e) {
    // 错误已处理
  }
}

// 获取收入趋势数据
async function fetchRevenueTrend() {
  try {
    const res = await getRevenueTrend(revenueTrendDays.value)
    renderRevenueTrendChart(res)
  } catch (e) {
    // 错误已处理
  }
}

// 渲染订单趋势图
function renderOrderTrendChart(data) {
  if (!orderTrendInstance) {
    orderTrendInstance = echarts.init(orderTrendChart.value)
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
      data: data.map(item => item.date.substring(5)), // 只显示月-日
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
      name: '订单数',
      type: 'line',
      smooth: true,
      symbol: 'circle',
      symbolSize: 8,
      lineStyle: { width: 3, color: '#3b82f6' },
      itemStyle: { color: '#3b82f6' },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: 'rgba(59, 130, 246, 0.3)' },
          { offset: 1, color: 'rgba(59, 130, 246, 0.05)' }
        ])
      },
      data: data.map(item => item.count)
    }]
  }

  orderTrendInstance.setOption(option)
}

// 渲染订单状态分布图
function renderOrderStatusChart(data) {
  if (!orderStatusInstance) {
    orderStatusInstance = echarts.init(orderStatusChart.value)
  }

  const colors = ['#f59e0b', '#3b82f6', '#8b5cf6', '#10b981', '#ef4444']

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

  orderStatusInstance.setOption(option)
}

// 渲染收入趋势图
function renderRevenueTrendChart(data) {
  if (!revenueTrendInstance) {
    revenueTrendInstance = echarts.init(revenueTrendChart.value)
  }

  const option = {
    tooltip: {
      trigger: 'axis',
      formatter: '{b}<br/>收入: ¥{c}',
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
      axisLabel: {
        color: '#64748b',
        fontSize: 12,
        formatter: '¥{value}'
      },
      splitLine: { lineStyle: { color: '#f1f5f9' } }
    },
    series: [{
      name: '收入',
      type: 'bar',
      barWidth: '50%',
      itemStyle: {
        borderRadius: [4, 4, 0, 0],
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: '#10b981' },
          { offset: 1, color: '#059669' }
        ])
      },
      data: data.map(item => item.amount)
    }]
  }

  revenueTrendInstance.setOption(option)
}

// 切换订单趋势天数
function changeOrderTrendDays(days) {
  orderTrendDays.value = days
  fetchOrderTrend()
}

// 切换收入趋势天数
function changeRevenueTrendDays(days) {
  revenueTrendDays.value = days
  fetchRevenueTrend()
}

// 窗口大小变化时重绘图表
function handleResize() {
  orderTrendInstance?.resize()
  orderStatusInstance?.resize()
  revenueTrendInstance?.resize()
}

onMounted(async () => {
  await nextTick()
  fetchOverview()
  fetchOrderTrend()
  fetchOrderStatus()
  fetchRevenueTrend()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  orderTrendInstance?.dispose()
  orderStatusInstance?.dispose()
  revenueTrendInstance?.dispose()
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
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  border-radius: 16px;
  color: #fff;
  box-shadow: 0 4px 20px rgba(59, 130, 246, 0.25);
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

.stat-icon.orders {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
}

.stat-icon.revenue {
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

.chart-card.half {
  flex: 1;
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
  color: #3b82f6;
}

.chart-tabs .tab.active {
  background: #fff;
  color: #3b82f6;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.chart-container {
  height: 300px;
}

/* 图表行 */
.charts-row {
  display: flex;
  gap: 20px;
}

@media (max-width: 1024px) {
  .stats-cards {
    grid-template-columns: 1fr;
  }

  .charts-row {
    flex-direction: column;
  }
}
</style>
