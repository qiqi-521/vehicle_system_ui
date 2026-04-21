<template>
  <div class="user-list">
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
          <h2 class="title">用户管理</h2>
          <p class="subtitle">管理系统注册用户</p>
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
              <el-icon><User /></el-icon>
              用户名
            </label>
            <el-input
              v-model="searchForm.username"
              placeholder="输入用户名"
              clearable
              @keyup.enter="fetchData"
            />
          </div>
          <div class="search-item">
            <label>
              <el-icon><Phone /></el-icon>
              手机号
            </label>
            <el-input
              v-model="searchForm.phone"
              placeholder="输入手机号"
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
              <el-option label="正常" :value="1" />
              <el-option label="禁用" :value="0" />
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
          <span>用户列表</span>
          <span class="total-count">共 {{ pagination.total }} 条记录</span>
        </div>
      </div>

      <el-table
        :data="tableData"
        v-loading="loading"
        class="modern-table"
        :header-cell-style="{ background: '#f8fafc', color: '#475569', fontWeight: '600', fontSize: '13px' }"
      >
        <el-table-column prop="id" label="ID" width="70" align="center">
          <template #default="{ row }">
            <span class="id-text">{{ row.id }}</span>
          </template>
        </el-table-column>
        <el-table-column label="头像" width="80" align="center">
          <template #default="{ row }">
            <el-avatar :size="40" class="user-avatar">
              {{ row.name?.charAt(0) || row.username?.charAt(0) || 'U' }}
            </el-avatar>
          </template>
        </el-table-column>
        <el-table-column prop="username" label="用户名" min-width="120">
          <template #default="{ row }">
            <span class="username-text">{{ row.username }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="姓名" min-width="100">
          <template #default="{ row }">
            <span>{{ row.name || '-' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="phone" label="手机号" min-width="120">
          <template #default="{ row }">
            <span class="phone-text">{{ row.phone || '-' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="email" label="邮箱" min-width="180">
          <template #default="{ row }">
            <span class="email-text">{{ row.email || '-' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="120" align="center">
          <template #default="{ row }">
            <div class="status-cell">
              <span :class="['status-badge', row.status === 1 ? 'enabled' : 'disabled']">
                {{ row.status === 1 ? '正常' : '禁用' }}
              </span>
              <el-switch
                v-model="row.status"
                :active-value="1"
                :inactive-value="0"
                size="small"
                @change="handleStatusChange(row)"
              />
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="注册时间" min-width="150">
          <template #default="{ row }">
            <div class="time-cell">
              <el-icon><Clock /></el-icon>
              <span>{{ formatDate(row.createdAt) }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="lastLoginAt" label="最后登录" min-width="150">
          <template #default="{ row }">
            <div class="time-cell">
              <el-icon><Clock /></el-icon>
              <span>{{ formatDate(row.lastLoginAt) }}</span>
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
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Filter, User, Phone, CircleCheck, Search, Refresh, List, Clock } from '@element-plus/icons-vue'
import * as userApi from '@/api/admin/user'

// 搜索表单
const searchForm = reactive({
  username: '',
  phone: '',
  status: null
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
    const res = await userApi.getUserList({
      pageNum: pagination.page,
      pageSize: pagination.size,
      username: searchForm.username || undefined,
      phone: searchForm.phone || undefined,
      status: searchForm.status
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
  searchForm.username = ''
  searchForm.phone = ''
  searchForm.status = null
  pagination.page = 1
  fetchData()
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

// 状态切换
async function handleStatusChange(row) {
  try {
    await userApi.updateUserStatus(row.id, row.status)
    ElMessage.success('状态更新成功')
  } catch (e) {
    // 恢复原状态
    row.status = row.status === 1 ? 0 : 1
  }
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped>
.user-list {
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
  background: linear-gradient(135deg, #059669 0%, #10b981 100%);
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

/* ID文本 */
.id-text {
  color: #94a3b8;
  font-size: 13px;
  font-weight: 500;
}

/* 用户头像 */
.user-avatar {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: #fff;
  font-weight: 600;
}

/* 状态单元格 */
.status-cell {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

.status-badge {
  display: inline-block;
  padding: 2px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.status-badge.enabled {
  background: #dcfce7;
  color: #16a34a;
}

.status-badge.disabled {
  background: #fee2e2;
  color: #dc2626;
}

/* 用户名 */
.username-text {
  font-weight: 600;
  color: #1e293b;
}

/* 手机号 */
.phone-text {
  font-family: 'SF Mono', 'Courier New', monospace;
  color: #475569;
}

/* 邮箱 */
.email-text {
  color: #64748b;
  font-size: 13px;
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

/* 分页 */
.pagination-wrapper {
  padding: 16px 24px;
  display: flex;
  justify-content: flex-end;
  border-top: 1px solid #f1f5f9;
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
}
</style>
