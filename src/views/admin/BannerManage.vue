<template>
  <div class="banner-list">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-info">
        <div class="header-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <path d="M21 15l-5-5L5 21" />
          </svg>
        </div>
        <div class="header-text">
          <h2 class="title">轮播图管理</h2>
          <p class="subtitle">管理首页轮播图展示</p>
        </div>
      </div>
      <el-button type="primary" class="add-btn" @click="handleAdd">
        <el-icon><Plus /></el-icon>
        新增轮播图
      </el-button>
    </div>

    <!-- 数据表格 -->
    <div class="table-section">
      <div class="table-header">
        <div class="table-title">
          <el-icon><List /></el-icon>
          <span>轮播图列表</span>
          <span class="total-count">共 {{ tableData.length }} 条记录</span>
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
            <span class="id-text">#{{ row.id }}</span>
          </template>
        </el-table-column>
        <el-table-column label="图片" width="200" align="center">
          <template #default="{ row }">
            <el-image
                :src="row.imageUrl"
                :preview-src-list="[row.imageUrl]"
                fit="cover"
                class="preview-img"
            >
              <template #error>
                <div class="image-placeholder">
                  <el-icon><Picture /></el-icon>
                </div>
              </template>
            </el-image>

            <div class="banner-image"></div>
          </template>
        </el-table-column>
        <el-table-column prop="title" label="标题" min-width="150">
          <template #default="{ row }">
            <span class="title-text">{{ row.title || '-' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="sort" label="排序" width="100" align="center">
          <template #default="{ row }">
            <span class="sort-badge">{{ row.sort }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100" align="center">
          <template #default="{ row }">
            <el-switch
              v-model="row.status"
              :active-value="1"
              :inactive-value="0"
              active-text="启用"
              inactive-text="禁用"
              inline-prompt
              @change="handleStatusChange(row)"
            />
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
        <el-table-column label="操作" fixed="right" width="150" align="center">
          <template #default="{ row }">
            <div class="action-buttons">
              <el-tooltip content="编辑" placement="top">
                <el-button circle size="small" class="action-btn edit" @click="handleEdit(row)">
                  <el-icon><Edit /></el-icon>
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
    </div>

    <!-- 新增/编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? '编辑轮播图' : '新增轮播图'"
      width="500px"
      class="modern-dialog"
      :close-on-click-modal="false"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="80px"
        class="banner-form"
      >
        <el-form-item label="图片" prop="imageUrl">
          <div class="upload-area">
            <el-image
              v-if="form.imageUrl"
              :src="form.imageUrl"
              fit="cover"
              class="uploaded-image"
            />
            <el-upload
              :show-file-list="false"
              :before-upload="beforeUpload"
              :http-request="handleUpload"
              accept="image/*"
              class="upload-btn"
            >
              <el-button type="primary">
                <el-icon><Upload /></el-icon>
                {{ form.imageUrl ? '更换图片' : '上传图片' }}
              </el-button>
            </el-upload>
          </div>
        </el-form-item>
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入标题（可选）" />
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input-number v-model="form.sort" :min="0" :max="999" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio :value="1">启用</el-radio>
            <el-radio :value="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" :loading="submitLoading" @click="handleSubmit">
            确定
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, List, Picture, Clock, Edit, Delete, Upload } from '@element-plus/icons-vue'
import * as bannerApi from '@/api/admin/banner'

// 表格数据
const tableData = ref([])
const loading = ref(false)

// 对话框
const dialogVisible = ref(false)
const isEdit = ref(false)
const submitLoading = ref(false)
const formRef = ref(null)

const form = reactive({
  id: null,
  imageUrl: '',
  title: '',
  sort: 0,
  status: 1
})

const rules = {
  imageUrl: [
    { required: true, message: '请上传图片', trigger: 'change' }
  ]
}

// 获取数据
async function fetchData() {
  loading.value = true
  try {
    const res = await bannerApi.getBannerList()
    tableData.value = res || []
  } catch (e) {
    // 错误已在拦截器处理
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

// 新增
function handleAdd() {
  isEdit.value = false
  form.id = null
  form.imageUrl = ''
  form.title = ''
  form.sort = 0
  form.status = 1
  dialogVisible.value = true
}

// 编辑
function handleEdit(row) {
  isEdit.value = true
  form.id = row.id
  form.imageUrl = row.imageUrl
  form.title = row.title
  form.sort = row.sort
  form.status = row.status
  dialogVisible.value = true
}

// 上传前校验
function beforeUpload(file) {
  const isImage = file.type.startsWith('image/')
  const isLt5M = file.size / 1024 / 1024 < 5

  if (!isImage) {
    ElMessage.error('只能上传图片文件!')
    return false
  }
  if (!isLt5M) {
    ElMessage.error('图片大小不能超过 5MB!')
    return false
  }
  return true
}

// 上传图片
async function handleUpload(options) {
  try {
    const res = await bannerApi.uploadBannerImage(options.file)
    form.imageUrl = res
    ElMessage.success('上传成功')
  } catch (e) {
    ElMessage.error('上传失败')
  }
}

// 提交
async function handleSubmit() {
  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) return

  submitLoading.value = true
  try {
    if (isEdit.value) {
      await bannerApi.updateBanner(form.id, form)
      ElMessage.success('更新成功')
    } else {
      await bannerApi.createBanner(form)
      ElMessage.success('新增成功')
    }
    dialogVisible.value = false
    fetchData()
  } catch (e) {
    // 错误已处理
  } finally {
    submitLoading.value = false
  }
}

// 状态切换
async function handleStatusChange(row) {
  try {
    await bannerApi.updateBanner(row.id, { status: row.status })
    ElMessage.success('状态更新成功')
  } catch (e) {
    // 恢复原状态
    row.status = row.status === 1 ? 0 : 1
  }
}

// 删除
async function handleDelete(row) {
  try {
    await ElMessageBox.confirm(
      '确定要删除该轮播图吗？',
      '删除确认',
      {
        type: 'warning',
        confirmButtonText: '确定删除',
        cancelButtonText: '取消'
      }
    )
    await bannerApi.deleteBanner(row.id)
    ElMessage.success('删除成功')
    fetchData()
  } catch (e) {
    // 用户取消或请求失败
  }
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped>
.banner-list {
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

/* ID文本 */
.id-text {
  color: #94a3b8;
  font-size: 13px;
  font-weight: 500;
}

/* 轮播图图片 */
.banner-image {
  display: flex;
  justify-content: center;
}

.preview-img {
  width: 160px;
  height: 80px;
  border-radius: 8px;
  object-fit: cover;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.image-placeholder {
  width: 160px;
  height: 80px;
  border-radius: 8px;
  background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #cbd5e1;
  font-size: 24px;
}

/* 标题 */
.title-text {
  font-weight: 500;
  color: #1e293b;
}

/* 排序徽章 */
.sort-badge {
  display: inline-block;
  padding: 4px 12px;
  background: #f1f5f9;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 600;
  color: #475569;
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

.action-btn.delete {
  background: #fee2e2;
  color: #dc2626;
}

.action-btn.delete:hover {
  background: #dc2626;
  color: #fff;
}

/* 对话框 */
.banner-form {
  padding: 20px 0;
}

.upload-area {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.uploaded-image {
  width: 200px;
  height: 100px;
  border-radius: 8px;
  object-fit: cover;
  border: 1px solid #e2e8f0;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>
