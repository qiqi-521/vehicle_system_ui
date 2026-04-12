<template>
  <div class="vehicle-form-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-left">
        <el-button link class="back-btn" @click="router.back()">
          <el-icon><ArrowLeft /></el-icon>
          返回列表
        </el-button>
        <h2 class="title">{{ isEdit ? '编辑车辆' : '新增车辆' }}</h2>
      </div>
    </div>

    <!-- 表单卡片 -->
    <div class="form-container">
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-position="top"
        class="modern-form"
      >
        <div class="form-section">
          <h3 class="section-title">基本信息</h3>
          <div class="form-grid">
            <el-form-item label="品牌" prop="brand">
              <el-input
                v-model="form.brand"
                placeholder="请输入品牌名称"
                maxlength="50"
                show-word-limit
              />
            </el-form-item>

            <el-form-item label="车型" prop="model">
              <el-input
                v-model="form.model"
                placeholder="请输入车型名称"
                maxlength="50"
                show-word-limit
              />
            </el-form-item>

            <el-form-item label="车牌号" prop="licensePlate">
              <el-input
                v-model="form.licensePlate"
                placeholder="请输入车牌号，如：京A12345"
                maxlength="10"
              />
            </el-form-item>

            <el-form-item label="日租金（元）" prop="price">
              <el-input-number
                v-model="form.price"
                :min="1"
                :max="99999"
                :precision="2"
                :step="10"
                controls-position="right"
                class="price-input"
              />
            </el-form-item>
          </div>
        </div>

        <div class="form-section">
          <h3 class="section-title">车辆状态</h3>
          <el-form-item prop="status">
            <div class="status-options">
              <div
                v-for="option in statusOptions"
                :key="option.value"
                :class="['status-option', { active: form.status === option.value }]"
                @click="form.status = option.value"
              >
                <span :class="['status-icon', option.class]">
                  <el-icon><component :is="option.icon" /></el-icon>
                </span>
                <span class="status-label">{{ option.label }}</span>
                <span class="status-desc">{{ option.desc }}</span>
              </div>
            </div>
          </el-form-item>
        </div>

        <div class="form-section">
          <h3 class="section-title">车辆图片</h3>
          <el-form-item>
            <el-upload
              v-model:file-list="fileList"
              action="#"
              list-type="picture-card"
              :auto-upload="false"
              :on-change="handleImageChange"
              :on-remove="handleImageRemove"
              accept="image/*"
              :limit="5"
            >
              <div class="upload-trigger">
                <el-icon class="upload-icon"><Plus /></el-icon>
                <span class="upload-text">上传图片</span>
              </div>
            </el-upload>
            <div class="upload-tip">
              <el-icon><InfoFilled /></el-icon>
              最多上传5张图片，建议尺寸 800x600，支持 JPG、PNG 格式
            </div>
          </el-form-item>
        </div>

        <div class="form-section">
          <h3 class="section-title">车辆描述</h3>
          <el-form-item prop="description">
            <el-input
              v-model="form.description"
              type="textarea"
              :rows="4"
              placeholder="请输入车辆描述信息，如配置、特点等"
              maxlength="500"
              show-word-limit
            />
          </el-form-item>
        </div>

        <div class="form-actions">
          <el-button @click="router.back()">取消</el-button>
          <el-button type="primary" @click="handleSubmit" :loading="loading">
            <el-icon><Check /></el-icon>
            {{ isEdit ? '保存修改' : '创建车辆' }}
          </el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Plus, ArrowLeft, Check, InfoFilled, CircleCheck, Tools, CircleClose } from '@element-plus/icons-vue'
import * as vehicleApi from '@/api/admin/vehicle'

const router = useRouter()
const route = useRoute()

// 是否编辑模式
const isEdit = computed(() => !!route.params.id)

// 状态选项
const statusOptions = [
  { value: 'AVAILABLE', label: '可用', desc: '车辆可正常出租', class: 'available', icon: CircleCheck },
  { value: 'MAINTENANCE', label: '维修中', desc: '车辆正在维护保养', class: 'maintenance', icon: Tools },
  { value: 'UNAVAILABLE', label: '不可用', desc: '车辆暂停出租', class: 'unavailable', icon: CircleClose }
]

// 表单
const formRef = ref(null)
const loading = ref(false)
const form = reactive({
  brand: '',
  model: '',
  licensePlate: '',
  price: 100,
  status: 'AVAILABLE',
  description: '',
  images: []
})

// 图片列表
const fileList = ref([])

// 表单验证规则
const rules = {
  brand: [
    { required: true, message: '请输入品牌名称', trigger: 'blur' },
    { min: 1, max: 50, message: '品牌名称长度在 1 到 50 个字符', trigger: 'blur' }
  ],
  model: [
    { required: true, message: '请输入车型名称', trigger: 'blur' },
    { min: 1, max: 50, message: '车型名称长度在 1 到 50 个字符', trigger: 'blur' }
  ],
  licensePlate: [
    { required: true, message: '请输入车牌号', trigger: 'blur' },
    { pattern: /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z][A-Z0-9]{5,6}$/, message: '请输入正确的车牌号格式', trigger: 'blur' }
  ],
  price: [
    { required: true, message: '请输入日租金', trigger: 'blur' }
  ],
  status: [
    { required: true, message: '请选择车辆状态', trigger: 'change' }
  ]
}

// 图片变化
function handleImageChange(file, list) {
  // 可以添加图片预览或验证逻辑
}

// 图片移除
function handleImageRemove(file, list) {
  const index = form.images.indexOf(file.url || file.response?.data)
  if (index > -1) {
    form.images.splice(index, 1)
  }
}

// 提交表单
async function handleSubmit() {
  try {
    await formRef.value.validate()
    loading.value = true

    // 处理图片上传
    const uploadedImages = []
    for (const file of fileList.value) {
      if (file.raw) {
        // 新上传的图片
        const res = await vehicleApi.uploadVehicleImage(file.raw)
        uploadedImages.push(res)
      } else if (file.url) {
        // 已有的图片
        uploadedImages.push(file.url)
      }
    }
    form.images = uploadedImages

    if (isEdit.value) {
      await vehicleApi.updateVehicle(route.params.id, form)
      ElMessage.success('保存成功')
    } else {
      await vehicleApi.createVehicle(form)
      ElMessage.success('创建成功')
    }
    router.push('/admin/vehicles')
  } catch (e) {
    // 验证失败或请求失败
  } finally {
    loading.value = false
  }
}

// 获取车辆详情（编辑模式）
async function fetchDetail() {
  if (!isEdit.value) return

  try {
    const res = await vehicleApi.getVehicleDetail(route.params.id)
    Object.assign(form, res)
    // 设置图片列表
    if (res.images && res.images.length > 0) {
      fileList.value = res.images.map((url, index) => ({
        name: `image-${index}`,
        url
      }))
    }
  } catch (e) {
    // 错误已处理
  }
}

onMounted(() => {
  fetchDetail()
})
</script>

<style scoped>
.vehicle-form-page {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* 页面头部 */
.page-header {
  background: #fff;
  border-radius: 12px;
  padding: 16px 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.back-btn {
  color: #6b7280;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.back-btn:hover {
  color: #3b82f6;
}

.title {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

/* 表单容器 */
.form-container {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.modern-form {
  max-width: 800px;
}

/* 表单分区 */
.form-section {
  margin-bottom: 32px;
  padding-bottom: 24px;
  border-bottom: 1px solid #f3f4f6;
}

.form-section:last-of-type {
  border-bottom: none;
  margin-bottom: 24px;
}

.section-title {
  font-size: 15px;
  font-weight: 600;
  color: #374151;
  margin: 0 0 20px 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.section-title::before {
  content: '';
  width: 3px;
  height: 16px;
  background: #3b82f6;
  border-radius: 2px;
}

/* 表单网格 */
.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.form-grid .el-form-item {
  margin-bottom: 0;
}

/* 价格输入框 */
.price-input {
  width: 100%;
}

/* 状态选项 */
.status-options {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.status-option {
  flex: 1;
  min-width: 160px;
  max-width: 200px;
  padding: 16px;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.status-option:hover {
  border-color: #93c5fd;
  background: #f0f9ff;
}

.status-option.active {
  border-color: #3b82f6;
  background: #eff6ff;
}

.status-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}

.status-icon.available {
  background: #dcfce7;
  color: #16a34a;
}

.status-icon.maintenance {
  background: #fef3c7;
  color: #d97706;
}

.status-icon.unavailable {
  background: #fee2e2;
  color: #dc2626;
}

.status-label {
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
}

.status-desc {
  font-size: 12px;
  color: #6b7280;
  text-align: center;
}

/* 上传区域 */
.upload-trigger {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.upload-icon {
  font-size: 24px;
  color: #9ca3af;
}

.upload-text {
  font-size: 12px;
  color: #6b7280;
}

.upload-tip {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #9ca3af;
  font-size: 12px;
  margin-top: 8px;
}

/* 表单操作 */
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 16px;
  border-top: 1px solid #f3f4f6;
}

.form-actions .el-button {
  min-width: 100px;
}

/* 响应式 */
@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
  }

  .status-options {
    flex-direction: column;
  }

  .status-option {
    max-width: none;
    flex-direction: row;
    justify-content: flex-start;
    gap: 12px;
  }

  .status-icon {
    width: 40px;
    height: 40px;
    font-size: 20px;
  }
}
</style>
