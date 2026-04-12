<template>
  <div class="contact-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <h1>联系我们</h1>
        <p>如有任何问题或建议，欢迎随时与我们联系</p>
      </div>
    </div>

    <div class="page-content">
      <!-- 联系信息卡片 -->
      <div class="contact-cards">
        <div class="contact-card">
          <div class="card-icon phone">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
          </div>
          <div class="card-content">
            <h3>联系电话</h3>
            <p>400-888-8888</p>
          </div>
        </div>

        <div class="contact-card">
          <div class="card-icon email">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
          </div>
          <div class="card-content">
            <h3>电子邮箱</h3>
            <p>contact@vehicle.com</p>
          </div>
        </div>

        <div class="contact-card">
          <div class="card-icon location">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
          </div>
          <div class="card-content">
            <h3>公司地址</h3>
            <p>北京市朝阳区建国路88号</p>
          </div>
        </div>

        <div class="contact-card">
          <div class="card-icon time">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </div>
          <div class="card-content">
            <h3>营业时间</h3>
            <p>周一至周日 9:00-18:00</p>
          </div>
        </div>
      </div>

      <!-- 地图区域（预留） -->
      <div class="map-section">
        <div class="map-placeholder">
          <div class="placeholder-content">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <p>地图加载区域</p>
            <span>高德地图 API 接入后显示</span>
          </div>
        </div>
      </div>

      <!-- 留言表单 -->
      <div class="message-section">
        <div class="section-header">
          <h2>在线留言</h2>
          <p>填写以下表单，我们会尽快与您联系</p>
        </div>

        <el-form
          ref="formRef"
          :model="form"
          :rules="rules"
          label-position="top"
          class="message-form"
          @submit.prevent="handleSubmit"
        >
          <div class="form-row">
            <el-form-item label="姓名" prop="name">
              <el-input v-model="form.name" placeholder="请输入您的姓名" />
            </el-form-item>
            <el-form-item label="电话" prop="phone">
              <el-input v-model="form.phone" placeholder="请输入您的联系电话" />
            </el-form-item>
          </div>

          <el-form-item label="邮箱" prop="email">
            <el-input v-model="form.email" placeholder="请输入您的邮箱地址" />
          </el-form-item>

          <el-form-item label="留言主题" prop="subject">
            <el-input v-model="form.subject" placeholder="请输入留言主题" />
          </el-form-item>

          <el-form-item label="留言内容" prop="content">
            <el-input
              v-model="form.content"
              type="textarea"
              :rows="5"
              placeholder="请输入您的留言内容"
            />
          </el-form-item>

          <el-form-item>
            <el-button
              type="primary"
              size="large"
              :loading="loading"
              @click="handleSubmit"
            >
              提交留言
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { submitContact } from '@/api/user/contact'

const formRef = ref(null)
const loading = ref(false)

const form = reactive({
  name: '',
  phone: '',
  email: '',
  subject: '',
  content: ''
})

const rules = {
  name: [
    { required: true, message: '请输入您的姓名', trigger: 'blur' }
  ],
  subject: [
    { required: true, message: '请输入留言主题', trigger: 'blur' }
  ],
  content: [
    { required: true, message: '请输入留言内容', trigger: 'blur' }
  ]
}

async function handleSubmit() {
  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) return

  loading.value = true
  try {
    await submitContact(form)
    ElMessage.success('留言提交成功，我们会尽快与您联系')
    formRef.value.resetFields()
  } catch (error) {
    ElMessage.error(error.message || '提交失败，请稍后重试')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.contact-page {
  min-height: calc(100vh - 72px - 120px);
}

/* 页面头部 */
.page-header {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  padding: 60px 32px;
  text-align: center;
}

.header-content h1 {
  font-size: 36px;
  font-weight: 700;
  color: #fff;
  margin: 0 0 12px 0;
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
  padding: 48px 32px;
}

/* 联系信息卡片 */
.contact-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  margin-bottom: 48px;
}

.contact-card {
  background: #fff;
  border-radius: 16px;
  padding: 24px;
  display: flex;
  align-items: flex-start;
  gap: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
}

.contact-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
}

.card-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.card-icon svg {
  width: 24px;
  height: 24px;
  color: #fff;
}

.card-icon.phone {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
}

.card-icon.email {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
}

.card-icon.location {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
}

.card-icon.time {
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
}

.card-content h3 {
  font-size: 14px;
  font-weight: 500;
  color: #64748b;
  margin: 0 0 4px 0;
}

.card-content p {
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

/* 地图区域 */
.map-section {
  margin-bottom: 48px;
}

.map-placeholder {
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  border-radius: 16px;
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px dashed #cbd5e1;
}

.placeholder-content {
  text-align: center;
  color: #94a3b8;
}

.placeholder-content svg {
  width: 48px;
  height: 48px;
  margin-bottom: 12px;
}

.placeholder-content p {
  font-size: 16px;
  font-weight: 500;
  margin: 0 0 4px 0;
  color: #64748b;
}

.placeholder-content span {
  font-size: 13px;
}

/* 留言表单 */
.message-section {
  background: #fff;
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
}

.section-header {
  text-align: center;
  margin-bottom: 32px;
}

.section-header h2 {
  font-size: 24px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 8px 0;
}

.section-header p {
  font-size: 14px;
  color: #64748b;
  margin: 0;
}

.message-form {
  max-width: 600px;
  margin: 0 auto;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.message-form :deep(.el-form-item__label) {
  font-weight: 500;
  color: #374151;
}

.message-form :deep(.el-input__wrapper),
.message-form :deep(.el-textarea__inner) {
  border-radius: 10px;
}

.message-form :deep(.el-button--primary) {
  width: 100%;
  height: 48px;
  font-size: 16px;
  border-radius: 10px;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  border: none;
}

/* 响应式 */
@media (max-width: 1024px) {
  .contact-cards {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .page-header {
    padding: 40px 20px;
  }

  .header-content h1 {
    font-size: 28px;
  }

  .page-content {
    padding: 32px 20px;
  }

  .contact-cards {
    grid-template-columns: 1fr;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .message-section {
    padding: 24px;
  }
}
</style>
