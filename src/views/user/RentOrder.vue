<template>
  <div class="rent-order-page">
    <div v-loading="loading" class="order-container">
      <!-- 面包屑 -->
      <div class="breadcrumb">
        <router-link to="/vehicles">浏览车辆</router-link>
        <span class="separator">/</span>
        <router-link :to="`/vehicle/${vehicleId}`">车辆详情</router-link>
        <span class="separator">/</span>
        <span class="current">立即租赁</span>
      </div>

      <div class="order-content">
        <!-- 左侧车辆信息 -->
        <div class="vehicle-info-card">
          <div class="card-header">
            <h2>车辆信息</h2>
          </div>
          <div class="vehicle-image">
            <img :src="vehicle?.images?.[0] || defaultImage" :alt="vehicle?.brand" />
          </div>
          <div class="vehicle-details">
            <h3 class="vehicle-name">{{ vehicle?.brand }} {{ vehicle?.model }}</h3>
            <div class="detail-item">
              <span class="label">车牌号</span>
              <span class="value">{{ vehicle?.licensePlate }}</span>
            </div>
            <div class="detail-item">
              <span class="label">日租金</span>
              <span class="value price">¥{{ vehicle?.price }}/天</span>
            </div>
            <div class="detail-item">
              <span class="label">车辆状态</span>
              <span class="value status">可租用</span>
            </div>
          </div>
        </div>

        <!-- 右侧租赁表单 -->
        <div class="rent-form-card">
          <div class="card-header">
            <h2>租赁信息</h2>
          </div>

          <el-form ref="formRef" :model="form" :rules="rules" label-position="top" class="rent-form">
            <div class="form-row">
              <el-form-item label="开始时间" prop="startTime">
                <el-date-picker
                  v-model="form.startTime"
                  type="datetime"
                  placeholder="选择开始时间"
                  format="YYYY-MM-DD HH:mm"
                  value-format="YYYY-MM-DD HH:mm:ss"
                  :disabled-date="disabledStartDate"
                  style="width: 100%"
                />
              </el-form-item>
              <el-form-item label="结束时间" prop="endTime">
                <el-date-picker
                  v-model="form.endTime"
                  type="datetime"
                  placeholder="选择结束时间"
                  format="YYYY-MM-DD HH:mm"
                  value-format="YYYY-MM-DD HH:mm:ss"
                  :disabled-date="disabledEndDate"
                  style="width: 100%"
                />
              </el-form-item>
            </div>

            <!-- 费用明细 -->
            <div class="cost-section">
              <h3>费用明细</h3>
              <div class="cost-item">
                <span class="cost-label">租赁天数</span>
                <span class="cost-value">{{ rentDays }} 天</span>
              </div>
              <div class="cost-item">
                <span class="cost-label">租金小计</span>
                <span class="cost-value">¥{{ rentCost }}</span>
              </div>
              <div class="cost-item">
                <span class="cost-label">押金（预估）</span>
                <span class="cost-value">¥{{ deposit }}</span>
              </div>
              <div class="cost-divider"></div>
              <div class="cost-item total">
                <span class="cost-label">总计</span>
                <span class="cost-value">¥{{ totalCost }}</span>
              </div>
            </div>

            <el-form-item>
              <el-button
                type="primary"
                size="large"
                class="submit-btn"
                :loading="submitting"
                @click="handleSubmit"
              >
                提交订单
              </el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { getVehicleDetail } from '@/api/user/vehicle'
import { createOrder } from '@/api/user/order'

const route = useRoute()
const router = useRouter()

const vehicleId = computed(() => route.params.vehicleId)
const loading = ref(false)
const submitting = ref(false)
const vehicle = ref(null)
const formRef = ref(null)

const defaultImage = 'https://via.placeholder.com/400x250?text=No+Image'

const form = reactive({
  startTime: '',
  endTime: ''
})

const rules = {
  startTime: [
    { required: true, message: '请选择开始时间', trigger: 'change' }
  ],
  endTime: [
    { required: true, message: '请选择结束时间', trigger: 'change' }
  ]
}

// 计算租赁天数
const rentDays = computed(() => {
  if (!form.startTime || !form.endTime) return 0
  const start = new Date(form.startTime)
  const end = new Date(form.endTime)
  const diff = end - start
  if (diff <= 0) return 0
  // 按天计算，不足1天按1天算
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
})

// 租金小计
const rentCost = computed(() => {
  if (!vehicle.value || rentDays.value === 0) return 0
  return (vehicle.value.price * rentDays.value).toFixed(2)
})

// 押金（预估，按日租金的3倍）
const deposit = computed(() => {
  if (!vehicle.value) return 0
  return (vehicle.value.price * 3).toFixed(2)
})

// 总计
const totalCost = computed(() => {
  return (parseFloat(rentCost.value) + parseFloat(deposit.value)).toFixed(2)
})

// 禁用过去的日期
function disabledStartDate(date) {
  return date.getTime() < Date.now() - 24 * 60 * 60 * 1000
}

function disabledEndDate(date) {
  if (!form.startTime) return disabledStartDate(date)
  return date.getTime() < new Date(form.startTime).getTime()
}

onMounted(() => {
  fetchVehicle()
})

async function fetchVehicle() {
  loading.value = true
  try {
    const res = await getVehicleDetail(vehicleId.value)
    vehicle.value = res
  } catch (error) {
    ElMessage.error('获取车辆信息失败')
    router.push('/vehicles')
  } finally {
    loading.value = false
  }
}

async function handleSubmit() {
  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) return

  if (rentDays.value === 0) {
    ElMessage.warning('结束时间必须大于开始时间')
    return
  }

  submitting.value = true
  try {
    const res = await createOrder({
      vehicleId: Number(vehicleId.value),
      startTime: form.startTime,
      endTime: form.endTime
    })
    ElMessage.success('订单创建成功')
    router.push(`/order/${res.id}`)
  } catch (error) {
    ElMessage.error(error.message || '订单创建失败')
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.rent-order-page {
  min-height: calc(100vh - 72px - 120px);
  background: #f8fafc;
  padding: 24px;
}

.order-container {
  max-width: 1200px;
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

/* 内容区域 */
.order-content {
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  gap: 24px;
}

/* 卡片通用样式 */
.vehicle-info-card,
.rent-form-card {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  overflow: hidden;
}

.card-header {
  padding: 20px 24px;
  border-bottom: 1px solid #e2e8f0;
}

.card-header h2 {
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

/* 车辆信息卡片 */
.vehicle-image {
  height: 200px;
  overflow: hidden;
}

.vehicle-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.vehicle-details {
  padding: 20px 24px;
}

.vehicle-name {
  font-size: 20px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 16px 0;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f1f5f9;
}

.detail-item:last-child {
  border-bottom: none;
}

.detail-item .label {
  font-size: 14px;
  color: #64748b;
}

.detail-item .value {
  font-size: 14px;
  font-weight: 500;
  color: #1e293b;
}

.detail-item .value.price {
  color: #3b82f6;
  font-weight: 600;
}

.detail-item .value.status {
  color: #10b981;
}

/* 租赁表单 */
.rent-form {
  padding: 20px 24px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

/* 费用明细 */
.cost-section {
  background: #f8fafc;
  border-radius: 12px;
  padding: 20px;
  margin: 24px 0;
}

.cost-section h3 {
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 16px 0;
}

.cost-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
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
  margin: 12px 0;
}

.cost-item.total .cost-label {
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
}

.cost-item.total .cost-value {
  font-size: 20px;
  font-weight: 700;
  color: #3b82f6;
}

.submit-btn {
  width: 100%;
  height: 48px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 10px;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  border: none;
}

/* 响应式 */
@media (max-width: 900px) {
  .order-content {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 600px) {
  .rent-order-page {
    padding: 16px;
  }

  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>
