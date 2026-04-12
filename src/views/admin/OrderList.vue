<template>
  <div class="order-list">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-info">
        <div class="header-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <path d="M14 2v6h6" />
            <path d="M16 13H8" />
            <path d="M16 17H8" />
            <path d="M10 9H8" />
          </svg>
        </div>
        <div class="header-text">
          <h2 class="title">订单管理</h2>
          <p class="subtitle">管理所有租赁订单</p>
        </div>
      </div>
      <div class="header-stats">
        <div class="stat-item">
          <span class="stat-value">{{ pagination.total }}</span>
          <span class="stat-label">总订单</span>
        </div>
      </div>
    </div>

    <!-- 搜索区域 -->
    <div class="search-section">
      <div class="search-header">
        <el-icon class="search-icon"><Filter /></el-icon>
        <span>筛选条件</span>
      </div>
      <div class="search-form">
        <div class="search-row">
          <div class="search-item">
            <label>
              <el-icon><Search /></el-icon>
              关键词
            </label>
            <el-input
              v-model="searchForm.keyword"
              placeholder="订单号/用户名"
              clearable
              @keyup.enter="fetchData"
            />
          </div>
          <div class="search-item">
            <label>
              <el-icon><Timer /></el-icon>
              订单状态
            </label>
            <el-select v-model="searchForm.status" placeholder="全部状态" clearable>
              <el-option label="待支付" value="PENDING" />
              <el-option label="已支付" value="PAID" />
              <el-option label="使用中" value="IN_USE" />
              <el-option label="已完成" value="COMPLETED" />
              <el-option label="已取消" value="CANCELLED" />
              <el-option label="已退款" value="REFUNDED" />
            </el-select>
          </div>
        </div>
        <div class="search-actions">
          <el-button type="primary" @click="fetchData">
            <el-icon><Search /></el-icon>
            搜索
          </el-button>
          <el-button @click="resetSearch">
            <el-icon><Refresh /></el-icon>
            重置
          </el-button>
        </div>
      </div>
    </div>

    <!-- 数据表格 -->
    <div class="table-section">
      <div class="table-header">
        <div class="table-title">
          <el-icon><List /></el-icon>
          <span>订单列表</span>
          <span class="total-count">共 {{ pagination.total }} 条记录</span>
        </div>
      </div>

      <el-table
        :data="tableData"
        v-loading="loading"
        class="modern-table"
        :header-cell-style="{ background: '#f8fafc', color: '#475569', fontWeight: '600', fontSize: '13px' }"
        :row-class-name="tableRowClassName"
      >
        <el-table-column prop="id" label="ID" width="70" align="center">
          <template #default="{ row }">
            <span class="id-text">#{{ row.id }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="orderNo" label="订单号" min-width="170">
          <template #default="{ row }">
            <div class="order-no-cell">
              <el-icon class="order-icon"><Document /></el-icon>
              <span class="order-no">{{ row.orderNo }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="userName" label="用户" min-width="100">
          <template #default="{ row }">
            <div class="user-cell">
              <el-avatar :size="28" class="user-avatar">
                {{ row.userName?.charAt(0) || 'U' }}
              </el-avatar>
              <span class="user-name">{{ row.userName || '-' }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="车辆信息" min-width="180">
          <template #default="{ row }">
            <div class="vehicle-info">
              <span class="vehicle-name">{{ row.vehicleBrand }} {{ row.vehicleModel }}</span>
              <span class="license-plate">{{ row.licensePlate }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="租赁时间" min-width="200">
          <template #default="{ row }">
            <div class="time-range">
              <div class="time-item">
                <span class="time-label">起</span>
                <span class="time-value">{{ formatDate(row.startTime) }}</span>
              </div>
              <div class="time-arrow">
                <el-icon><Right /></el-icon>
              </div>
              <div class="time-item">
                <span class="time-label">止</span>
                <span class="time-value">{{ formatDate(row.endTime) }}</span>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="totalAmount" label="金额" width="110" align="right">
          <template #default="{ row }">
            <div class="price-cell">
              <span class="price-symbol">¥</span>
              <span class="price-value">{{ row.totalAmount }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100" align="center">
          <template #default="{ row }">
            <span :class="['status-badge', getStatusClass(row.status)]">
              <span class="status-indicator"></span>
              {{ getStatusText(row.status) }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="创建时间" min-width="150">
          <template #default="{ row }">
            <div class="time-cell">
              <el-icon><Clock /></el-icon>
              <span>{{ formatDate(row.createdAt) }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="100" align="center">
          <template #default="{ row }">
            <el-tooltip content="修改状态" placement="top">
              <el-button
                circle
                size="small"
                class="action-btn"
                :class="{ disabled: row.status === 'CANCELLED' || row.status === 'REFUNDED' }"
                @click="handleStatus(row)"
                :disabled="row.status === 'CANCELLED' || row.status === 'REFUNDED'"
              >
                <el-icon><Setting /></el-icon>
              </el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-wrapper">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.size"
          :page-sizes="[10, 20, 50]"
          :total="pagination.total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="fetchData"
          @current-change="fetchData"
          background
        />
      </div>
    </div>

    <!-- 状态修改对话框 -->
    <el-dialog
      v-model="statusDialogVisible"
      title="修改订单状态"
      width="480px"
      class="modern-dialog"
      :close-on-click-modal="false"
    >
      <div class="status-dialog-content">
        <div class="order-preview" v-if="currentOrder">
          <div class="preview-header">
            <el-icon class="preview-icon"><Document /></el-icon>
            <span class="preview-order-no">{{ currentOrder.orderNo }}</span>
          </div>
          <div class="preview-details">
            <div class="detail-item">
              <span class="detail-label">用户</span>
              <span class="detail-value">{{ currentOrder.userName || '-' }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">车辆</span>
              <span class="detail-value">{{ currentOrder.vehicleBrand }} {{ currentOrder.vehicleModel }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">金额</span>
              <span class="detail-value price">¥{{ currentOrder.totalAmount }}</span>
            </div>
          </div>
        </div>

        <div class="status-row">
          <span class="status-label">当前状态</span>
          <span :class="['status-badge', getStatusClass(currentOrder?.status)]">
            <span class="status-indicator"></span>
            {{ getStatusText(currentOrder?.status) }}
          </span>
        </div>
        <div class="status-row">
          <span class="status-label">修改为</span>
          <el-select v-model="newStatus" class="status-select">
            <el-option label="待支付" value="PENDING" />
            <el-option label="已支付" value="PAID" />
            <el-option label="使用中" value="IN_USE" />
            <el-option label="已完成" value="COMPLETED" />
            <el-option label="已取消" value="CANCELLED" />
            <el-option label="已退款" value="REFUNDED" />
          </el-select>
        </div>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="statusDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitStatus" :loading="statusLoading">
            确定修改
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Search, Refresh, Setting, Filter, Timer, List, Clock, Document, Right } from '@element-plus/icons-vue'
import * as orderApi from '@/api/admin/order'

// 搜索表单
const searchForm = reactive({
  keyword: '',
  status: ''
})

// 分页
const pagination = reactive({
  page: 1,
  size: 10,
  total: 0
})

// 表格数据
const tableData = ref([])
const loading = ref(false)

// 获取数据
async function fetchData() {
  loading.value = true
  try {
    const res = await orderApi.getOrderList({
      page: pagination.page - 1,
      size: pagination.size,
      keyword: searchForm.keyword || undefined,
      status: searchForm.status || undefined
    })
    tableData.value = res.records || []
    pagination.total = res.total || 0
  } catch (e) {
    // 错误已在拦截器处理
  } finally {
    loading.value = false
  }
}

// 重置搜索
function resetSearch() {
  searchForm.keyword = ''
  searchForm.status = ''
  pagination.page = 1
  fetchData()
}

// 表格行样式
function tableRowClassName({ row, rowIndex }) {
  return rowIndex % 2 === 0 ? '' : 'even-row'
}

// 状态样式类
function getStatusClass(status) {
  const map = {
    'PENDING': 'pending',
    'PAID': 'paid',
    'IN_USE': 'in-use',
    'COMPLETED': 'completed',
    'CANCELLED': 'cancelled',
    'REFUNDED': 'refunded'
  }
  return map[status] || ''
}

// 状态文本
function getStatusText(status) {
  const map = {
    'PENDING': '待支付',
    'PAID': '已支付',
    'IN_USE': '使用中',
    'COMPLETED': '已完成',
    'CANCELLED': '已取消',
    'REFUNDED': '已退款'
  }
  return map[status] || status
}

// 格式化日期
function formatDate(dateStr) {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 状态修改
const statusDialogVisible = ref(false)
const statusLoading = ref(false)
const currentOrder = ref(null)
const newStatus = ref('')

function handleStatus(row) {
  currentOrder.value = row
  newStatus.value = row.status
  statusDialogVisible.value = true
}

async function submitStatus() {
  statusLoading.value = true
  try {
    await orderApi.updateOrderStatus(currentOrder.value.id, newStatus.value)
    ElMessage.success('状态修改成功')
    statusDialogVisible.value = false
    fetchData()
  } catch (e) {
    // 错误已处理
  } finally {
    statusLoading.value = false
  }
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped>
.order-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* 页面头部 */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 28px;
  background: linear-gradient(135deg, #065f46 0%, #10b981 100%);
  border-radius: 16px;
  color: #fff;
  box-shadow: 0 4px 20px rgba(16, 185, 129, 0.25);
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

.header-stats {
  display: flex;
  gap: 24px;
}

.stat-item {
  text-align: center;
  padding: 12px 20px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
}

.stat-value {
  display: block;
  font-size: 24px;
  font-weight: 700;
}

.stat-label {
  font-size: 12px;
  opacity: 0.8;
}

/* 搜索区域 */
.search-section {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.search-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px 24px;
  background: #f8fafc;
  border-bottom: 1px solid #f1f5f9;
  color: #475569;
  font-weight: 600;
  font-size: 14px;
}

.search-icon {
  font-size: 16px;
}

.search-form {
  padding: 20px 24px;
}

.search-row {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 16px;
}

.search-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.search-item label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #64748b;
  font-weight: 500;
}

.search-item label .el-icon {
  font-size: 14px;
  color: #94a3b8;
}

.search-item :deep(.el-input),
.search-item :deep(.el-select) {
  width: 200px;
}

.search-item :deep(.el-input__wrapper) {
  border-radius: 8px;
  box-shadow: 0 0 0 1px #e2e8f0;
  transition: all 0.2s;
}

.search-item :deep(.el-input__wrapper:hover) {
  box-shadow: 0 0 0 1px #10b981;
}

.search-item :deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.2), 0 0 0 1px #10b981;
}

.search-actions {
  display: flex;
  gap: 10px;
  padding-top: 4px;
}

.search-actions .el-button {
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 500;
}

.search-actions .el-button--primary {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  border: none;
}

/* 表格区域 */
.table-section {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.table-header {
  padding: 16px 24px;
  border-bottom: 1px solid #f1f5f9;
}

.table-title {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #1e293b;
  font-weight: 600;
  font-size: 15px;
}

.table-title .el-icon {
  color: #10b981;
}

.total-count {
  margin-left: auto;
  font-size: 13px;
  color: #94a3b8;
  font-weight: 400;
}

.modern-table {
  border-radius: 0;
}

.modern-table :deep(.el-table__row) {
  transition: background-color 0.15s;
}

.modern-table :deep(.el-table__row:hover > td) {
  background-color: #f8fafc !important;
}

.modern-table :deep(.even-row) {
  background-color: #fafbfc;
}

/* ID文本 */
.id-text {
  color: #94a3b8;
  font-size: 13px;
  font-weight: 500;
}

/* 订单号单元格 */
.order-no-cell {
  display: flex;
  align-items: center;
  gap: 8px;
}

.order-icon {
  color: #10b981;
  font-size: 16px;
}

.order-no {
  font-family: 'SF Mono', 'Courier New', monospace;
  font-weight: 600;
  color: #1e293b;
  font-size: 13px;
  letter-spacing: 0.3px;
}

/* 用户单元格 */
.user-cell {
  display: flex;
  align-items: center;
  gap: 10px;
}

.user-avatar {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: #fff;
  font-size: 12px;
  font-weight: 600;
}

.user-name {
  color: #1e293b;
  font-weight: 500;
}

/* 车辆信息 */
.vehicle-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.vehicle-name {
  color: #1e293b;
  font-weight: 600;
  font-size: 14px;
}

.license-plate {
  font-family: 'SF Mono', 'Courier New', monospace;
  background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 11px;
  color: #64748b;
  font-weight: 500;
  width: fit-content;
}

/* 时间范围 */
.time-range {
  display: flex;
  align-items: center;
  gap: 8px;
}

.time-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.time-label {
  font-size: 10px;
  color: #94a3b8;
  font-weight: 600;
  text-transform: uppercase;
}

.time-value {
  font-size: 12px;
  color: #475569;
}

.time-arrow {
  color: #cbd5e1;
  font-size: 14px;
}

/* 价格单元格 */
.price-cell {
  display: flex;
  align-items: baseline;
  justify-content: flex-end;
  gap: 2px;
}

.price-symbol {
  color: #10b981;
  font-size: 13px;
  font-weight: 500;
}

.price-value {
  color: #059669;
  font-size: 16px;
  font-weight: 700;
}

/* 状态徽章 */
.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

.status-indicator {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
}

.status-badge.pending {
  background: #fef3c7;
  color: #d97706;
}

.status-badge.paid {
  background: #dbeafe;
  color: #2563eb;
}

.status-badge.in-use {
  background: #e0e7ff;
  color: #4f46e5;
}

.status-badge.completed {
  background: #dcfce7;
  color: #16a34a;
}

.status-badge.cancelled {
  background: #f1f5f9;
  color: #64748b;
}

.status-badge.refunded {
  background: #fee2e2;
  color: #dc2626;
}

/* 时间单元格 */
.time-cell {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #64748b;
  font-size: 13px;
}

.time-cell .el-icon {
  color: #94a3b8;
  font-size: 14px;
}

/* 操作按钮 */
.action-btn {
  width: 32px !important;
  height: 32px !important;
  border-radius: 8px !important;
  border: none !important;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: #fff;
  transition: all 0.2s;
}

.action-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

.action-btn.disabled {
  background: #e2e8f0;
  color: #94a3b8;
}

/* 分页 */
.pagination-wrapper {
  padding: 16px 24px;
  display: flex;
  justify-content: flex-end;
  border-top: 1px solid #f1f5f9;
}

/* 对话框 */
.status-dialog-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.order-preview {
  background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
  border-radius: 12px;
  padding: 16px;
}

.preview-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(16, 185, 129, 0.2);
}

.preview-icon {
  color: #10b981;
  font-size: 20px;
}

.preview-order-no {
  font-family: 'SF Mono', monospace;
  font-weight: 600;
  color: #1e293b;
  font-size: 14px;
}

.preview-details {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.detail-label {
  color: #64748b;
  font-size: 13px;
}

.detail-value {
  color: #1e293b;
  font-weight: 500;
  font-size: 13px;
}

.detail-value.price {
  color: #059669;
  font-weight: 700;
  font-size: 15px;
}

.status-row {
  display: flex;
  align-items: center;
  gap: 16px;
}

.status-label {
  width: 80px;
  color: #64748b;
  font-size: 14px;
  font-weight: 500;
}

.status-select {
  width: 180px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

/* 响应式 */
@media (max-width: 768px) {
  .search-row {
    flex-direction: column;
    align-items: stretch;
  }

  .search-item :deep(.el-input),
  .search-item :deep(.el-select) {
    width: 100%;
  }

  .page-header {
    flex-direction: column;
    gap: 16px;
    text-align: center;
  }

  .header-info {
    flex-direction: column;
  }

  .header-stats {
    width: 100%;
    justify-content: center;
  }
}
</style>
