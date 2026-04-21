<template>
  <div class="vehicle-list">
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
          <h2 class="title">车辆管理</h2>
          <p class="subtitle">管理所有租赁车辆信息</p>
        </div>
      </div>
      <el-button type="primary" class="add-btn" @click="router.push('/admin/vehicles/add')">
        <el-icon><Plus /></el-icon>
        新增车辆
      </el-button>
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
              <el-icon><Van /></el-icon>
              品牌
            </label>
            <el-input
              v-model="searchForm.brand"
              placeholder="输入品牌名称"
              clearable
              @keyup.enter="fetchData"
            />
          </div>
          <div class="search-item">
            <label>
              <el-icon><Collection /></el-icon>
              车型
            </label>
            <el-input
              v-model="searchForm.model"
              placeholder="输入车型名称"
              clearable
              @keyup.enter="fetchData"
            />
          </div>
          <div class="search-item">
            <label>
              <el-icon><Postcard /></el-icon>
              车牌号
            </label>
            <el-input
              v-model="searchForm.licensePlate"
              placeholder="输入车牌号"
              clearable
              @keyup.enter="fetchData"
            />
          </div>
          <div class="search-item">
            <label>
              <el-icon><CircleCheck /></el-icon>
              状态
            </label>
            <el-select v-model="searchForm.status" placeholder="全部状态" clearable>
              <el-option label="可用" value="available" />
              <el-option label="维修中" value="maintenance" />
              <el-option label="不可用" value="unavailable" />
            </el-select>
          </div>
        </div>
        <div class="search-actions">
          <el-button type="primary" @click="handleSearch">
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
          <span>车辆列表</span>
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
        <el-table-column label="车辆图片" width="110" align="center">
          <template #default="{ row }">
            <div class="vehicle-image">
              <el-image
                v-if="row.images && row.images.length > 0"
                :src="row.images[0]"
                :preview-src-list="row.images"
                fit="cover"
                class="car-image"
              >
                <template #error>
                  <div class="image-placeholder">
                    <el-icon><Picture /></el-icon>
                  </div>
                </template>
              </el-image>
              <div v-else class="image-placeholder">
                <el-icon><Picture /></el-icon>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="brand" label="品牌" min-width="110">
          <template #default="{ row }">
            <span class="brand-text">{{ row.brand }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="model" label="车型" min-width="130" />
        <el-table-column prop="licensePlate" label="车牌号" min-width="110">
          <template #default="{ row }">
            <span class="license-plate">{{ row.licensePlate }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="price" label="日租金" min-width="100" align="right">
          <template #default="{ row }">
            <div class="price-cell">
              <span class="price-symbol">¥</span>
              <span class="price-value">{{ row.price }}</span>
              <span class="price-unit">/天</span>
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
        <el-table-column label="操作" fixed="right" width="180" align="center">
          <template #default="{ row }">
            <div class="action-buttons">
              <el-tooltip content="编辑" placement="top">
                <el-button circle size="small" class="action-btn edit" @click="handleEdit(row)">
                  <el-icon><Edit /></el-icon>
                </el-button>
              </el-tooltip>
              <el-tooltip content="修改状态" placement="top">
                <el-button circle size="small" class="action-btn status" @click="handleStatus(row)">
                  <el-icon><Setting /></el-icon>
                </el-button>
              </el-tooltip>
              <el-tooltip content="删除" placement="top">
                <el-button circle size="small" class="action-btn delete" @click="handleDelete(row)">
                  <el-icon><Delete /></el-icon>
                </el-button>
              </el-tooltip>
            </div>
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
      title="修改车辆状态"
      width="420px"
      class="modern-dialog"
      :close-on-click-modal="false"
    >
      <div class="status-dialog-content">
        <div class="vehicle-preview" v-if="currentVehicle">
          <div class="preview-image">
            <el-image
              v-if="currentVehicle.images && currentVehicle.images.length > 0"
              :src="currentVehicle.images[0]"
              fit="cover"
              class="preview-img"
            />
            <div v-else class="preview-placeholder">
              <el-icon><Picture /></el-icon>
            </div>
          </div>
          <div class="preview-info">
            <span class="preview-name">{{ currentVehicle.brand }} {{ currentVehicle.model }}</span>
            <span class="preview-plate">{{ currentVehicle.licensePlate }}</span>
          </div>
        </div>

        <div class="status-row">
          <span class="status-label">当前状态</span>
          <span :class="['status-badge', getStatusClass(currentVehicle?.status)]">
            <span class="status-indicator"></span>
            {{ getStatusText(currentVehicle?.status) }}
          </span>
        </div>
        <div class="status-row">
          <span class="status-label">修改为</span>
          <el-select v-model="newStatus" class="status-select">
            <el-option label="可用" value="available" />
            <el-option label="维修中" value="maintenance" />
            <el-option label="不可用" value="unavailable" />
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
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Search, Refresh, Edit, Delete, Setting, Picture, Filter, Van, Collection, Postcard, CircleCheck, List, Clock } from '@element-plus/icons-vue'
import * as vehicleApi from '@/api/admin/vehicle'

const router = useRouter()

// 搜索表单
const searchForm = reactive({
  brand: '',
  model: '',
  licensePlate: '',
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
    const res = await vehicleApi.getVehicleList({
      page: pagination.page,
      size: pagination.size,
      brand: searchForm.brand || undefined,
      model: searchForm.model || undefined,
      licensePlate: searchForm.licensePlate || undefined,
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
  searchForm.brand = ''
  searchForm.model = ''
  searchForm.licensePlate = ''
  searchForm.status = ''
  pagination.page = 1
  fetchData()
}

// 搜索（重置到第一页）
function handleSearch() {
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
    'available': 'available',
    'maintenance': 'maintenance',
    'unavailable': 'unavailable'
  }
  return map[status] || ''
}

// 状态文本
function getStatusText(status) {
  const map = {
    'available': '可用',
    'maintenance': '维修中',
    'unavailable': '不可用'
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

// 编辑
function handleEdit(row) {
  router.push(`/admin/vehicles/edit/${row.id}`)
}

// 删除
async function handleDelete(row) {
  try {
    await ElMessageBox.confirm(
      `确定要删除车辆「${row.brand} ${row.model}」吗？`,
      '删除确认',
      {
        type: 'warning',
        confirmButtonText: '确定删除',
        cancelButtonText: '取消'
      }
    )
    await vehicleApi.deleteVehicle(row.id)
    ElMessage.success('删除成功')
    fetchData()
  } catch (e) {
    // 用户取消或请求失败
  }
}

// 状态修改
const statusDialogVisible = ref(false)
const statusLoading = ref(false)
const currentVehicle = ref(null)
const newStatus = ref('')

function handleStatus(row) {
  currentVehicle.value = row
  newStatus.value = row.status
  statusDialogVisible.value = true
}

async function submitStatus() {
  statusLoading.value = true
  try {
    await vehicleApi.updateVehicleStatus(currentVehicle.value.id, newStatus.value)
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
.vehicle-list {
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
  background: linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%);
  border-radius: 16px;
  color: #fff;
  box-shadow: 0 4px 20px rgba(37, 99, 235, 0.25);
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

.add-btn {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.3);
  font-weight: 600;
  padding: 12px 24px;
  border-radius: 10px;
}

.add-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  border-color: rgba(255, 255, 255, 0.4);
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
  width: 180px;
}

.search-item :deep(.el-input__wrapper) {
  border-radius: 8px;
  box-shadow: 0 0 0 1px #e2e8f0;
  transition: all 0.2s;
}

.search-item :deep(.el-input__wrapper:hover) {
  box-shadow: 0 0 0 1px #3b82f6;
}

.search-item :deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2), 0 0 0 1px #3b82f6;
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
  color: #3b82f6;
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

/* 车辆图片 */
.vehicle-image {
  display: flex;
  justify-content: center;
}

.car-image {
  width: 72px;
  height: 54px;
  border-radius: 8px;
  object-fit: cover;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.image-placeholder {
  width: 72px;
  height: 54px;
  border-radius: 8px;
  background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #cbd5e1;
  font-size: 20px;
}

/* 品牌文本 */
.brand-text {
  font-weight: 600;
  color: #1e293b;
}

/* 车牌号 */
.license-plate {
  font-family: 'SF Mono', 'Courier New', monospace;
  background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 12px;
  color: #475569;
  font-weight: 500;
  letter-spacing: 0.5px;
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

.price-unit {
  color: #94a3b8;
  font-size: 12px;
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

.status-badge.available {
  background: #dcfce7;
  color: #16a34a;
}

.status-badge.maintenance {
  background: #fef3c7;
  color: #d97706;
}

.status-badge.unavailable {
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
.action-buttons {
  display: flex;
  gap: 8px;
  justify-content: center;
}

.action-btn {
  width: 32px !important;
  height: 32px !important;
  border-radius: 8px !important;
  border: none !important;
  transition: all 0.2s;
}

.action-btn.edit {
  background: #eff6ff;
  color: #3b82f6;
}

.action-btn.edit:hover {
  background: #3b82f6;
  color: #fff;
}

.action-btn.status {
  background: #fef3c7;
  color: #d97706;
}

.action-btn.status:hover {
  background: #d97706;
  color: #fff;
}

.action-btn.delete {
  background: #fee2e2;
  color: #dc2626;
}

.action-btn.delete:hover {
  background: #dc2626;
  color: #fff;
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

.vehicle-preview {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: #f8fafc;
  border-radius: 12px;
}

.preview-image {
  width: 80px;
  height: 60px;
  border-radius: 8px;
  overflow: hidden;
}

.preview-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.preview-placeholder {
  width: 100%;
  height: 100%;
  background: #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #94a3b8;
  font-size: 24px;
}

.preview-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.preview-name {
  font-weight: 600;
  color: #1e293b;
  font-size: 15px;
}

.preview-plate {
  font-size: 13px;
  color: #64748b;
  font-family: 'SF Mono', monospace;
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
@media (max-width: 1200px) {
  .search-row {
    gap: 16px;
  }

  .search-item :deep(.el-input),
  .search-item :deep(.el-select) {
    width: 160px;
  }
}

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
}
</style>
