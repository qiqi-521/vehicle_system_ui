<template>
  <div class="my-orders-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <h1>我的订单</h1>
        <p>查看和管理您的租赁订单</p>
      </div>
    </div>

    <div class="page-content">
      <!-- 状态筛选 -->
      <div class="status-tabs">
        <div
          v-for="tab in statusTabs"
          :key="tab.value"
          class="tab-item"
          :class="{ active: currentStatus === tab.value }"
          @click="handleStatusChange(tab.value)"
        >
          {{ tab.label }}
        </div>
      </div>

      <!-- 订单列表 -->
      <div v-loading="loading" class="order-list">
        <div
          v-for="order in orders"
          :key="order.id"
          class="order-card"
          @click="goToDetail(order.id)"
        >
          <div class="order-header">
            <span class="order-no">订单号：{{ order.orderNo }}</span>
            <span class="status-badge" :class="getStatusClass(order.status)">
              {{ getStatusText(order.status) }}
            </span>
          </div>

          <div class="order-body">
            <div class="vehicle-info">
              <div class="vehicle-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
                  <circle cx="7" cy="17" r="2" />
                  <path d="M9 17h6" />
                  <circle cx="17" cy="17" r="2" />
                </svg>
              </div>
              <div class="vehicle-details">
                <h3 class="vehicle-name">{{ order.vehicleBrand }} {{ order.vehicleModel }}</h3>
                <p class="vehicle-plate">{{ order.licensePlate }}</p>
              </div>
            </div>

            <div class="order-info">
              <div class="info-item">
                <span class="label">租赁时间</span>
                <span class="value">{{ formatDate(order.startTime) }} ~ {{ formatDate(order.endTime) }}</span>
              </div>
              <div class="info-item">
                <span class="label">订单金额</span>
                <span class="value price">¥{{ order.totalAmount }}</span>
              </div>
            </div>
          </div>

          <div class="order-footer">
            <span class="create-time">创建时间：{{ formatTime(order.createdAt) }}</span>
            <div class="actions" @click.stop>
              <el-button size="small" @click="goToDetail(order.id)">查看详情</el-button>
              <template v-if="order.status === 'pending'">
                <el-button size="small" type="primary" @click="handlePay(order)">支付</el-button>
                <el-button size="small" @click="handleCancel(order)">取消</el-button>
              </template>
            </div>
          </div>
        </div>

        <el-empty v-if="!loading && orders.length === 0" description="暂无订单" />
      </div>

      <!-- 分页 -->
      <div v-if="total > 0" class="pagination-wrapper">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.size"
          :page-sizes="[5, 10, 20]"
          :total="total"
          layout="total, sizes, prev, pager, next"
          @size-change="fetchOrders"
          @current-change="fetchOrders"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getMyOrders, payOrder, cancelOrder } from '@/api/user/order'

const router = useRouter()

const loading = ref(false)
const orders = ref([])
const total = ref(0)
const currentStatus = ref('')

const pagination = reactive({
  page: 1,
  size: 10
})

const statusTabs = [
  { label: '全部', value: '' },
  { label: '待支付', value: 'pending' },
  { label: '已支付', value: 'paid' },
  { label: '使用中', value: 'in_use' },
  { label: '已完成', value: 'completed' },
  { label: '已取消', value: 'cancelled' }
]

const statusMap = {
  pending: { text: '待支付', class: 'pending' },
  paid: { text: '已支付', class: 'paid' },
  in_use: { text: '使用中', class: 'progress' },
  completed: { text: '已完成', class: 'completed' },
  cancelled: { text: '已取消', class: 'cancelled' },
  refunded: { text: '已退款', class: 'refunded' }
}

function getStatusText(status) {
  return statusMap[status]?.text || '未知'
}

function getStatusClass(status) {
  return statusMap[status]?.class || ''
}

onMounted(() => {
  fetchOrders()
})

async function fetchOrders() {
  loading.value = true
  try {
    const params = {
      page: pagination.page,
      size: pagination.size
    }
    if (currentStatus.value) {
      params.status = currentStatus.value
    }

    const res = await getMyOrders(params)
    orders.value = res.records || []
    total.value = res.total || 0
  } catch (error) {
    ElMessage.error('获取订单列表失败')
  } finally {
    loading.value = false
  }
}

function handleStatusChange(status) {
  currentStatus.value = status
  pagination.page = 1
  fetchOrders()
}

function goToDetail(id) {
  router.push(`/order/${id}`)
}

function formatDate(time) {
  if (!time) return '-'
  return time.replace('T', ' ').substring(0, 10)
}

function formatTime(time) {
  if (!time) return '-'
  return time.replace('T', ' ').substring(0, 16)
}

async function handlePay(order) {
  try {
    await ElMessageBox.confirm('确认支付该订单吗？', '支付确认', {
      type: 'info',
      confirmButtonText: '确认支付',
      cancelButtonText: '取消'
    })

    await payOrder(order.id)
    ElMessage.success('支付成功')
    fetchOrders()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error(error.message || '支付失败')
    }
  }
}

async function handleCancel(order) {
  try {
    await ElMessageBox.confirm('确认取消该订单吗？', '取消订单', {
      type: 'warning',
      confirmButtonText: '确认取消',
      cancelButtonText: '返回'
    })

    await cancelOrder(order.id)
    ElMessage.success('订单已取消')
    fetchOrders()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error(error.message || '取消失败')
    }
  }
}
</script>

<style scoped>
.my-orders-page {
  min-height: calc(100vh - 72px - 120px);
}

/* 页面头部 */
.page-header {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  padding: 48px 32px;
  text-align: center;
}

.header-content h1 {
  font-size: 32px;
  font-weight: 700;
  color: #fff;
  margin: 0 0 8px 0;
}

.header-content p {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.85);
  margin: 0;
}

/* 页面内容 */
.page-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 32px;
}

/* 状态筛选 */
.status-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.tab-item {
  padding: 10px 20px;
  background: #fff;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.tab-item:hover {
  color: #3b82f6;
}

.tab-item.active {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: #fff;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

/* 订单列表 */
.order-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-height: 200px;
}

/* 订单卡片 */
.order-card {
  background: #fff;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  cursor: pointer;
  transition: all 0.2s;
}

.order-card:hover {
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f1f5f9;
}

.order-no {
  font-size: 14px;
  color: #64748b;
}

.status-badge {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
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

.order-body {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.vehicle-info {
  display: flex;
  align-items: center;
  gap: 16px;
}

.vehicle-icon {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.vehicle-icon svg {
  width: 24px;
  height: 24px;
  color: #fff;
}

.vehicle-name {
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 4px 0;
}

.vehicle-plate {
  font-size: 13px;
  color: #64748b;
  margin: 0;
}

.order-info {
  display: flex;
  gap: 32px;
}

.info-item {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
}

.info-item .label {
  font-size: 12px;
  color: #94a3b8;
}

.info-item .value {
  font-size: 14px;
  font-weight: 500;
  color: #1e293b;
}

.info-item .value.price {
  color: #3b82f6;
  font-weight: 600;
}

.order-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 16px;
  border-top: 1px solid #f1f5f9;
}

.create-time {
  font-size: 13px;
  color: #94a3b8;
}

.actions {
  display: flex;
  gap: 8px;
}

/* 分页 */
.pagination-wrapper {
  margin-top: 32px;
  display: flex;
  justify-content: center;
}

/* 响应式 */
@media (max-width: 768px) {
  .page-content {
    padding: 20px;
  }

  .order-body {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .order-info {
    width: 100%;
    justify-content: space-between;
  }

  .info-item {
    align-items: flex-start;
  }

  .order-footer {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .actions {
    width: 100%;
  }

  .actions .el-button {
    flex: 1;
  }
}
</style>
