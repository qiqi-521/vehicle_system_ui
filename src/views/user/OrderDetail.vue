<template>
  <div class="order-detail-page">
    <div v-loading="loading" class="detail-container">
      <template v-if="order">
        <!-- 面包屑 -->
        <div class="breadcrumb">
          <router-link to="/orders">我的订单</router-link>
          <span class="separator">/</span>
          <span class="current">订单详情</span>
        </div>

        <!-- 订单状态卡片 -->
        <div class="status-card">
          <div class="status-left">
            <div class="order-no">订单号：{{ order.orderNo }}</div>
            <div class="status-info">
              <span class="status-badge" :class="statusClass">{{ statusText }}</span>
              <span class="create-time">创建时间：{{ formatTime(order.createdAt) }}</span>
            </div>
          </div>
          <div class="status-right">
            <template v-if="order.status === 'pending'">
              <el-button type="primary" :loading="paying" @click="handlePay">
                立即支付
              </el-button>
              <el-button :loading="canceling" @click="handleCancel">
                取消订单
              </el-button>
            </template>
            <template v-else-if="order.status === 'paid'">
              <span class="status-tip">订单已支付，请按时取车</span>
            </template>
            <template v-else-if="order.status === 'in_use'">
              <span class="status-tip">租赁使用中</span>
            </template>
            <template v-else-if="order.status === 'completed'">
              <span class="status-tip">订单已完成</span>
            </template>
            <template v-else-if="order.status === 'cancelled'">
              <span class="status-tip">订单已取消</span>
            </template>
            <template v-else-if="order.status === 'refunded'">
              <span class="status-tip">订单已退款</span>
            </template>
          </div>
        </div>

        <div class="detail-content">
          <!-- 车辆信息 -->
          <div class="info-card">
            <div class="card-header">
              <h3>车辆信息</h3>
            </div>
            <div class="card-body">
              <div class="vehicle-info">
                <div class="vehicle-image">
                  <img :src="defaultImage" alt="车辆图片" />
                </div>
                <div class="vehicle-details">
                  <h4 class="vehicle-name">{{ order.vehicleBrand }} {{ order.vehicleModel }}</h4>
                  <div class="detail-row">
                    <span class="label">车牌号</span>
                    <span class="value">{{ order.licensePlate }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 租赁信息 -->
          <div class="info-card">
            <div class="card-header">
              <h3>租赁信息</h3>
            </div>
            <div class="card-body">
              <div class="info-row">
                <div class="info-item">
                  <span class="info-label">开始时间</span>
                  <span class="info-value">{{ formatTime(order.startTime) }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">结束时间</span>
                  <span class="info-value">{{ formatTime(order.endTime) }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">租赁天数</span>
                  <span class="info-value">{{ rentDays }} 天</span>
                </div>
                <div class="info-item" v-if="order.actualReturnTime">
                  <span class="info-label">实际归还时间</span>
                  <span class="info-value">{{ formatTime(order.actualReturnTime) }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 费用明细 -->
          <div class="info-card">
            <div class="card-header">
              <h3>费用明细</h3>
            </div>
            <div class="card-body">
              <div class="cost-list">
                <div class="cost-item">
                  <span class="cost-label">租金总额</span>
                  <span class="cost-value">¥{{ order.totalAmount }}</span>
                </div>
                <div class="cost-divider"></div>
                <div class="cost-item total">
                  <span class="cost-label">应付金额</span>
                  <span class="cost-value">¥{{ order.totalAmount }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>

      <el-empty v-else-if="!loading" description="订单不存在" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getOrderDetail, payOrder, cancelOrder } from '@/api/user/order'

const route = useRoute()
const router = useRouter()

const loading = ref(false)
const paying = ref(false)
const canceling = ref(false)
const order = ref(null)

const defaultImage = 'https://via.placeholder.com/200x120?text=Vehicle'

const statusMap = {
  pending: { text: '待支付', class: 'pending' },
  paid: { text: '已支付', class: 'paid' },
  in_use: { text: '使用中', class: 'progress' },
  completed: { text: '已完成', class: 'completed' },
  cancelled: { text: '已取消', class: 'cancelled' },
  refunded: { text: '已退款', class: 'refunded' }
}

const statusText = computed(() => {
  return statusMap[order.value?.status]?.text || '未知'
})

const statusClass = computed(() => {
  return statusMap[order.value?.status]?.class || ''
})

const rentDays = computed(() => {
  if (!order.value?.startTime || !order.value?.endTime) return 0
  const start = new Date(order.value.startTime)
  const end = new Date(order.value.endTime)
  const diff = end - start
  if (diff <= 0) return 0
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
})

onMounted(() => {
  fetchOrderDetail()
})

async function fetchOrderDetail() {
  const id = route.params.id
  if (!id) {
    router.push('/orders')
    return
  }

  loading.value = true
  try {
    const res = await getOrderDetail(id)
    order.value = res
  } catch (error) {
    ElMessage.error('获取订单详情失败')
  } finally {
    loading.value = false
  }
}

function formatTime(time) {
  if (!time) return '-'
  return time.replace('T', ' ').substring(0, 16)
}

async function handlePay() {
  try {
    await ElMessageBox.confirm('确认支付该订单吗？', '支付确认', {
      type: 'info',
      confirmButtonText: '确认支付',
      cancelButtonText: '取消'
    })

    paying.value = true
    await payOrder(order.value.id)
    ElMessage.success('支付成功')
    await fetchOrderDetail()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error(error.message || '支付失败')
    }
  } finally {
    paying.value = false
  }
}

async function handleCancel() {
  try {
    await ElMessageBox.confirm('确认取消该订单吗？', '取消订单', {
      type: 'warning',
      confirmButtonText: '确认取消',
      cancelButtonText: '返回'
    })

    canceling.value = true
    await cancelOrder(order.value.id)
    ElMessage.success('订单已取消')
    await fetchOrderDetail()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error(error.message || '取消失败')
    }
  } finally {
    canceling.value = false
  }
}
</script>

<style scoped>
.order-detail-page {
  min-height: calc(100vh - 72px - 120px);
  background: #f8fafc;
  padding: 24px;
}

.detail-container {
  max-width: 900px;
  margin: 0 auto;
}

/* 面包屑 */
.breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 24px;
  font-size: 14px;
}

.breadcrumb a {
  color: #64748b;
  text-decoration: none;
  transition: color 0.2s;
}

.breadcrumb a:hover {
  color: #3b82f6;
}

.breadcrumb .separator {
  color: #cbd5e1;
}

.breadcrumb .current {
  color: #1e293b;
  font-weight: 500;
}

/* 状态卡片 */
.status-card {
  background: #fff;
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.order-no {
  font-size: 14px;
  color: #64748b;
  margin-bottom: 8px;
}

.status-info {
  display: flex;
  align-items: center;
  gap: 16px;
}

.status-badge {
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
}

.status-badge.pending {
  background: #fef3c7;
  color: #d97706;
}

.status-badge.paid {
  background: #dbeafe;
  color: #2563eb;
}

.status-badge.progress {
  background: #d1fae5;
  color: #059669;
}

.status-badge.completed {
  background: #dcfce7;
  color: #16a34a;
}

.status-badge.cancelled {
  background: #fee2e2;
  color: #dc2626;
}

.status-badge.refunded {
  background: #f3e8ff;
  color: #9333ea;
}

.create-time {
  font-size: 13px;
  color: #94a3b8;
}

.status-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.status-tip {
  font-size: 14px;
  color: #64748b;
}

/* 信息卡片 */
.info-card {
  background: #fff;
  border-radius: 16px;
  margin-bottom: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  overflow: hidden;
}

.card-header {
  padding: 16px 24px;
  border-bottom: 1px solid #e2e8f0;
}

.card-header h3 {
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

.card-body {
  padding: 24px;
}

/* 车辆信息 */
.vehicle-info {
  display: flex;
  gap: 20px;
}

.vehicle-image {
  width: 160px;
  height: 100px;
  border-radius: 12px;
  overflow: hidden;
  flex-shrink: 0;
}

.vehicle-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.vehicle-details {
  flex: 1;
}

.vehicle-name {
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 12px 0;
}

.detail-row {
  display: flex;
  gap: 32px;
}

.detail-row .label {
  font-size: 13px;
  color: #64748b;
}

.detail-row .value {
  font-size: 14px;
  font-weight: 500;
  color: #1e293b;
}

/* 租赁信息 */
.info-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.info-label {
  font-size: 13px;
  color: #64748b;
}

.info-value {
  font-size: 15px;
  font-weight: 500;
  color: #1e293b;
}

/* 费用明细 */
.cost-list {
  max-width: 300px;
}

.cost-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
}

.cost-label {
  font-size: 14px;
  color: #64748b;
}

.cost-value {
  font-size: 14px;
  font-weight: 500;
  color: #1e293b;
}

.cost-divider {
  height: 1px;
  background: #e2e8f0;
  margin: 8px 0;
}

.cost-item.total .cost-label {
  font-size: 15px;
  font-weight: 600;
  color: #1e293b;
}

.cost-item.total .cost-value {
  font-size: 20px;
  font-weight: 700;
  color: #3b82f6;
}

/* 响应式 */
@media (max-width: 600px) {
  .order-detail-page {
    padding: 16px;
  }

  .status-card {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .status-right {
    width: 100%;
  }

  .status-right .el-button {
    flex: 1;
  }

  .vehicle-info {
    flex-direction: column;
  }

  .vehicle-image {
    width: 100%;
    height: 160px;
  }

  .info-row {
    grid-template-columns: 1fr;
  }
}
</style>
