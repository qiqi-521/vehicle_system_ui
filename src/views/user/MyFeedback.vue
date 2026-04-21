<template>
  <div class="feedback-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-info">
        <div class="header-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        </div>
        <div class="header-text">
          <h2 class="title">留言反馈</h2>
          <p class="subtitle">查看您的留言及回复</p>
        </div>
      </div>
    </div>

    <!-- 筛选区域 -->
    <div class="filter-section">
      <div class="filter-tabs">
        <button
          :class="['filter-tab', { active: filterStatus === null }]"
          @click="filterStatus = null; fetchData()"
        >
          全部
        </button>
        <button
          :class="['filter-tab', { active: filterStatus === '未回复' }]"
          @click="filterStatus = '未回复'; fetchData()"
        >
          未回复
        </button>
        <button
          :class="['filter-tab', { active: filterStatus === '已回复' }]"
          @click="filterStatus = '已回复'; fetchData()"
        >
          已回复
        </button>
      </div>
    </div>

    <!-- 留言列表 -->
    <div class="feedback-list" v-loading="loading">
      <template v-if="feedbackList.length > 0">
        <div
          v-for="item in feedbackList"
          :key="item.id"
          class="feedback-card"
          @click="showDetail(item)"
        >
          <div class="card-header">
            <div class="subject">{{ item.subject || '无主题' }}</div>
            <div :class="['status-badge', item.replyStatus === '已回复' ? 'replied' : 'pending']">
              {{ item.replyStatus }}
            </div>
          </div>
          <div class="card-content">
            {{ truncateContent(item.content) }}
          </div>
          <div class="card-footer">
            <div class="time">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              <span>{{ formatDate(item.createdAt) }}</span>
            </div>
            <div class="view-detail">
              <span>查看详情</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </div>
          </div>
        </div>
      </template>
      <template v-else>
        <div class="empty-state">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          <p>暂无留言记录</p>
          <router-link to="/contact" class="submit-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            <span>提交留言</span>
          </router-link>
        </div>
      </template>
    </div>

    <!-- 分页 -->
    <div class="pagination-wrapper" v-if="pagination.total > 0">
      <el-pagination
        v-model:current-page="pagination.page"
        v-model:page-size="pagination.size"
        :page-sizes="[10, 20, 50]"
        :total="pagination.total"
        layout="total, sizes, prev, pager, next"
        @size-change="fetchData"
        @current-change="fetchData"
        background
      />
    </div>

    <!-- 详情弹窗 -->
    <el-dialog
      v-model="detailVisible"
      title="留言详情"
      width="500px"
      class="detail-dialog"
    >
      <div class="detail-content" v-if="currentItem">
        <div class="detail-row">
          <span class="label">主题</span>
          <span class="value">{{ currentItem.subject || '无主题' }}</span>
        </div>
        <div class="detail-row">
          <span class="label">内容</span>
          <span class="value content">{{ currentItem.content }}</span>
        </div>
        <div class="detail-row">
          <span class="label">提交时间</span>
          <span class="value">{{ formatDate(currentItem.createdAt) }}</span>
        </div>
        <div class="detail-row">
          <span class="label">状态</span>
          <span :class="['value', 'status', currentItem.replyStatus === '已回复' ? 'replied' : 'pending']">
            {{ currentItem.replyStatus }}
          </span>
        </div>
        <div class="detail-row reply-row" v-if="currentItem.reply">
          <span class="label">管理员回复</span>
          <div class="reply-content">
            {{ currentItem.reply }}
          </div>
        </div>
      </div>
      <template #footer>
        <el-button @click="detailVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { getMyContacts } from '@/api/user/contact'

// 筛选状态
const filterStatus = ref(null)

// 分页
const pagination = reactive({
  page: 1,
  size: 10,
  total: 0
})

// 列表数据
const feedbackList = ref([])
const loading = ref(false)

// 详情弹窗
const detailVisible = ref(false)
const currentItem = ref(null)

// 获取数据
async function fetchData() {
  loading.value = true
  try {
    const res = await getMyContacts({
      page: pagination.page,
      size: pagination.size
    })
    let records = res.records || []
    // 前端筛选
    if (filterStatus.value) {
      records = records.filter(item => item.replyStatus === filterStatus.value)
    }
    feedbackList.value = records
    pagination.total = res.total || 0
  } catch (e) {
    // 错误已处理
  } finally {
    loading.value = false
  }
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
  return content.length > 50 ? content.substring(0, 50) + '...' : content
}

// 显示详情
function showDetail(item) {
  currentItem.value = item
  detailVisible.value = true
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped>
.feedback-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 32px 24px;
}

/* 页面头部 */
.page-header {
  margin-bottom: 24px;
}

.header-info {
  display: flex;
  align-items: center;
  gap: 16px;
}

.header-icon {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
}

.header-icon svg {
  width: 24px;
  height: 24px;
  color: #fff;
}

.header-text .title {
  font-size: 24px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 4px 0;
}

.header-text .subtitle {
  font-size: 14px;
  color: #64748b;
  margin: 0;
}

/* 筛选区域 */
.filter-section {
  margin-bottom: 20px;
}

.filter-tabs {
  display: flex;
  gap: 8px;
  background: #fff;
  padding: 6px;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.filter-tab {
  padding: 10px 20px;
  border: none;
  background: transparent;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s;
}

.filter-tab:hover {
  color: #8b5cf6;
  background: rgba(139, 92, 246, 0.05);
}

.filter-tab.active {
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
  color: #fff;
}

/* 留言列表 */
.feedback-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-height: 200px;
}

.feedback-card {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  transition: all 0.2s;
}

.feedback-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.subject {
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
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

.status-badge.replied {
  background: #dcfce7;
  color: #16a34a;
}

.card-content {
  font-size: 14px;
  color: #64748b;
  line-height: 1.6;
  margin-bottom: 16px;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.time {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #94a3b8;
}

.time svg {
  width: 16px;
  height: 16px;
}

.view-detail {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: #8b5cf6;
  font-weight: 500;
}

.view-detail svg {
  width: 16px;
  height: 16px;
}

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.empty-state svg {
  width: 64px;
  height: 64px;
  color: #cbd5e1;
  margin-bottom: 16px;
}

.empty-state p {
  font-size: 16px;
  color: #64748b;
  margin: 0 0 20px 0;
}

.submit-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
  transition: all 0.2s;
}

.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(139, 92, 246, 0.4);
}

.submit-btn svg {
  width: 18px;
  height: 18px;
}

/* 分页 */
.pagination-wrapper {
  display: flex;
  justify-content: flex-end;
  margin-top: 24px;
}

/* 详情弹窗 */
.detail-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.detail-row {
  display: flex;
  gap: 12px;
}

.detail-row .label {
  min-width: 80px;
  font-size: 14px;
  color: #64748b;
  font-weight: 500;
}

.detail-row .value {
  flex: 1;
  font-size: 14px;
  color: #1e293b;
}

.detail-row .value.content {
  line-height: 1.6;
}

.detail-row .value.status {
  font-weight: 500;
}

.detail-row .value.status.pending {
  color: #d97706;
}

.detail-row .value.status.replied {
  color: #16a34a;
}

.reply-row {
  flex-direction: column;
  gap: 8px;
  padding-top: 16px;
  border-top: 1px solid #f1f5f9;
}

.reply-content {
  background: #f8fafc;
  padding: 16px;
  border-radius: 8px;
  font-size: 14px;
  color: #1e293b;
  line-height: 1.6;
}
</style>
