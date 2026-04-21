<template>
  <div class="contact-list">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-info">
        <div class="header-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        </div>
        <div class="header-text">
          <h2 class="title">留言管理</h2>
          <p class="subtitle">管理用户留言与反馈</p>
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
              姓名
            </label>
            <el-input
              v-model="searchForm.name"
              placeholder="输入姓名"
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
              <el-option label="未处理" :value="0" />
              <el-option label="已处理" :value="1" />
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
          <span>留言列表</span>
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
        <el-table-column prop="name" label="姓名" min-width="100">
          <template #default="{ row }">
            <span class="name-text">{{ row.name || '-' }}</span>
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
        <el-table-column prop="subject" label="主题" min-width="150">
          <template #default="{ row }">
            <span class="subject-text">{{ row.subject || '-' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="content" label="内容" min-width="200">
          <template #default="{ row }">
            <el-tooltip :content="row.content" placement="top" :disabled="!row.content || row.content.length < 30">
              <span class="content-text">{{ truncateContent(row.content) }}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100" align="center">
          <template #default="{ row }">
            <span :class="['status-badge', row.status === 1 ? 'processed' : 'pending']">
              {{ row.status === 1 ? '已处理' : '未处理' }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="留言时间" min-width="150">
          <template #default="{ row }">
            <div class="time-cell">
              <el-icon><Clock /></el-icon>
              <span>{{ formatDate(row.createdAt) }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="150" align="center">
          <template #default="{ row }">
            <div class="action-buttons">
              <el-tooltip content="查看详情" placement="top">
                <el-button circle size="small" class="action-btn view" @click="handleView(row)">
                  <el-icon><View /></el-icon>
                </el-button>
              </el-tooltip>
              <el-tooltip content="回复" placement="top">
                <el-button circle size="small" class="action-btn reply" @click="handleReply(row)">
                  <el-icon><ChatDotRound /></el-icon>
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

    <!-- 详情对话框 -->
    <el-dialog
      v-model="detailDialogVisible"
      title="留言详情"
      width="600px"
      class="modern-dialog"
    >
      <div class="detail-content" v-if="currentContact">
        <div class="detail-row">
          <span class="detail-label">姓名：</span>
          <span class="detail-value">{{ currentContact.name || '-' }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">手机号：</span>
          <span class="detail-value">{{ currentContact.phone || '-' }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">邮箱：</span>
          <span class="detail-value">{{ currentContact.email || '-' }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">主题：</span>
          <span class="detail-value">{{ currentContact.subject || '-' }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">留言内容：</span>
          <span class="detail-value content-full">{{ currentContact.content }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">留言时间：</span>
          <span class="detail-value">{{ formatDate(currentContact.createdAt) }}</span>
        </div>
        <div class="detail-row" v-if="currentContact.reply">
          <span class="detail-label">管理员回复：</span>
          <span class="detail-value reply-content">{{ currentContact.reply }}</span>
        </div>
      </div>
      <template #footer>
        <el-button @click="detailDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>

    <!-- 回复对话框 -->
    <el-dialog
      v-model="replyDialogVisible"
      title="回复留言"
      width="500px"
      class="modern-dialog"
      :close-on-click-modal="false"
    >
      <div class="reply-form">
        <div class="original-message" v-if="currentContact">
          <div class="message-label">原留言：</div>
          <div class="message-content">{{ currentContact.content }}</div>
        </div>
        <el-form :model="replyForm" label-position="top">
          <el-form-item label="回复内容">
            <el-input
              v-model="replyForm.reply"
              type="textarea"
              :rows="5"
              placeholder="请输入回复内容"
            />
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <el-button @click="replyDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="replyLoading" @click="submitReply">
          提交回复
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Filter, User, Phone, CircleCheck, Search, Refresh, List, Clock, View, ChatDotRound } from '@element-plus/icons-vue'
import * as contactApi from '@/api/admin/contact'

// 搜索表单
const searchForm = reactive({
  name: '',
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

// 详情对话框
const detailDialogVisible = ref(false)
const currentContact = ref(null)

// 回复对话框
const replyDialogVisible = ref(false)
const replyLoading = ref(false)
const replyForm = reactive({
  reply: ''
})

// 获取数据
async function fetchData() {
  loading.value = true
  try {
    const res = await contactApi.getContactList({
      page: pagination.page,
      size: pagination.size,
      name: searchForm.name || undefined,
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
  searchForm.name = ''
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

// 截断内容
function truncateContent(content) {
  if (!content) return '-'
  return content.length > 30 ? content.substring(0, 30) + '...' : content
}

// 查看详情
function handleView(row) {
  currentContact.value = row
  detailDialogVisible.value = true
}

// 回复
function handleReply(row) {
  currentContact.value = row
  replyForm.reply = row.reply || ''
  replyDialogVisible.value = true
}

// 提交回复
async function submitReply() {
  if (!replyForm.reply.trim()) {
    ElMessage.warning('请输入回复内容')
    return
  }

  replyLoading.value = true
  try {
    await contactApi.replyContact(currentContact.value.id, { reply: replyForm.reply })
    ElMessage.success('回复成功')
    replyDialogVisible.value = false
    fetchData()
  } catch (e) {
    // 错误已处理
  } finally {
    replyLoading.value = false
  }
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped>
.contact-list {
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
  background: linear-gradient(135deg, #7c3aed 0%, #8b5cf6 100%);
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
}

.search-item :deep(.el-input__wrapper:hover) {
  box-shadow: 0 0 0 1px #8b5cf6;
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
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
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
  color: #8b5cf6;
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

.modern-table :deep(.el-table__row:hover > td) {
  background-color: #f8fafc !important;
}

/* ID文本 */
.id-text {
  color: #94a3b8;
  font-size: 13px;
  font-weight: 500;
}

/* 姓名 */
.name-text {
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

/* 主题 */
.subject-text {
  color: #1e293b;
  font-weight: 500;
}

/* 内容 */
.content-text {
  color: #64748b;
  font-size: 13px;
}

/* 状态徽章 */
.status-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.status-badge.pending {
  background: #fef3c7;
  color: #d97706;
}

.status-badge.processed {
  background: #dcfce7;
  color: #16a34a;
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

.action-btn.view {
  background: #eff6ff;
  color: #3b82f6;
}

.action-btn.view:hover {
  background: #3b82f6;
  color: #fff;
}

.action-btn.reply {
  background: #f3e8ff;
  color: #8b5cf6;
}

.action-btn.reply:hover {
  background: #8b5cf6;
  color: #fff;
}

/* 分页 */
.pagination-wrapper {
  padding: 16px 24px;
  display: flex;
  justify-content: flex-end;
  border-top: 1px solid #f1f5f9;
}

/* 详情对话框 */
.detail-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.detail-row {
  display: flex;
  gap: 8px;
}

.detail-label {
  color: #64748b;
  font-size: 14px;
  min-width: 80px;
}

.detail-value {
  color: #1e293b;
  font-size: 14px;
}

.content-full {
  flex: 1;
  line-height: 1.6;
}

.reply-content {
  color: #8b5cf6;
}

/* 回复对话框 */
.reply-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.original-message {
  background: #f8fafc;
  padding: 16px;
  border-radius: 8px;
}

.message-label {
  color: #64748b;
  font-size: 13px;
  margin-bottom: 8px;
}

.message-content {
  color: #1e293b;
  font-size: 14px;
  line-height: 1.6;
}
</style>
