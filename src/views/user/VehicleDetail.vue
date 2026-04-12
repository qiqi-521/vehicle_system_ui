<template>
  <div class="vehicle-detail-page">
    <div v-loading="loading" class="detail-container">
      <template v-if="vehicle">
        <!-- 面包屑导航 -->
        <div class="breadcrumb">
          <router-link to="/">首页</router-link>
          <span class="separator">/</span>
          <router-link to="/vehicles">浏览车辆</router-link>
          <span class="separator">/</span>
          <span class="current">{{ vehicle.brand }} {{ vehicle.model }}</span>
        </div>

        <div class="detail-content">
          <!-- 左侧图片区域 -->
          <div class="image-section">
            <div class="main-image">
              <img :src="currentImage" :alt="vehicle.brand + ' ' + vehicle.model" />
            </div>
            <div v-if="vehicle.images && vehicle.images.length > 1" class="image-thumbnails">
              <div
                v-for="(img, index) in vehicle.images"
                :key="index"
                class="thumbnail"
                :class="{ active: currentImage === img }"
                @click="currentImage = img"
              >
                <img :src="img" :alt="`图片${index + 1}`" />
              </div>
            </div>
          </div>

          <!-- 右侧信息区域 -->
          <div class="info-section">
            <div class="vehicle-header">
              <h1 class="vehicle-title">{{ vehicle.brand }} {{ vehicle.model }}</h1>
              <div class="vehicle-status">
                <span class="status-badge available">可租用</span>
              </div>
            </div>

            <div class="price-section">
              <div class="price-main">
                <span class="currency">¥</span>
                <span class="amount">{{ vehicle.price }}</span>
                <span class="unit">/天</span>
              </div>
            </div>

            <div class="info-list">
              <div class="info-item">
                <div class="info-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <line x1="3" y1="9" x2="21" y2="9" />
                    <line x1="9" y1="21" x2="9" y2="9" />
                  </svg>
                </div>
                <div class="info-content">
                  <span class="info-label">车牌号</span>
                  <span class="info-value">{{ vehicle.licensePlate }}</span>
                </div>
              </div>
              <div class="info-item">
                <div class="info-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
                    <circle cx="7" cy="17" r="2" />
                    <path d="M9 17h6" />
                    <circle cx="17" cy="17" r="2" />
                  </svg>
                </div>
                <div class="info-content">
                  <span class="info-label">品牌</span>
                  <span class="info-value">{{ vehicle.brand }}</span>
                </div>
              </div>
              <div class="info-item">
                <div class="info-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                </div>
                <div class="info-content">
                  <span class="info-label">车型</span>
                  <span class="info-value">{{ vehicle.model }}</span>
                </div>
              </div>
            </div>

            <div class="description-section">
              <h3>车辆描述</h3>
              <p>{{ vehicle.description || '暂无描述' }}</p>
            </div>

            <div class="action-section">
              <el-button type="primary" size="large" class="rent-btn" @click="handleRent">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
                  <circle cx="7" cy="17" r="2" />
                  <path d="M9 17h6" />
                  <circle cx="17" cy="17" r="2" />
                </svg>
                立即租赁
              </el-button>
              <el-button size="large" @click="goBack">
                返回列表
              </el-button>
            </div>
          </div>
        </div>
      </template>

      <el-empty v-else-if="!loading" description="车辆不存在或已下架" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { getVehicleDetail } from '@/api/user/vehicle'

const route = useRoute()
const router = useRouter()
const loading = ref(false)
const vehicle = ref(null)

const defaultImage = 'https://via.placeholder.com/600x400?text=No+Image'

const currentImage = computed(() => {
  if (vehicle.value?.images && vehicle.value.images.length > 0) {
    return vehicle.value.images[0]
  }
  return defaultImage
})

onMounted(() => {
  fetchVehicleDetail()
})

async function fetchVehicleDetail() {
  const id = route.params.id
  if (!id) {
    router.push('/vehicles')
    return
  }

  loading.value = true
  try {
    const res = await getVehicleDetail(id)
    vehicle.value = res
  } catch (error) {
    console.error('获取车辆详情失败:', error)
    ElMessage.error('获取车辆详情失败')
  } finally {
    loading.value = false
  }
}

function handleRent() {
  const userToken = localStorage.getItem('userToken')
  if (!userToken) {
    ElMessage.warning('请先登录')
    router.push({ path: '/login', query: { redirect: `/rent/${route.params.id}` } })
    return
  }
  router.push(`/rent/${route.params.id}`)
}

function goBack() {
  router.push('/vehicles')
}
</script>

<style scoped>
.vehicle-detail-page {
  min-height: calc(100vh - 72px - 120px);
  background: #f8fafc;
  padding: 24px;
}

.detail-container {
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

/* 详情内容 */
.detail-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
  background: #fff;
  border-radius: 20px;
  padding: 32px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
}

/* 图片区域 */
.image-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.main-image {
  width: 100%;
  height: 400px;
  border-radius: 16px;
  overflow: hidden;
  background: #f1f5f9;
}

.main-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-thumbnails {
  display: flex;
  gap: 12px;
  overflow-x: auto;
  padding-bottom: 8px;
}

.thumbnail {
  flex-shrink: 0;
  width: 80px;
  height: 60px;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  border: 2px solid transparent;
  transition: all 0.2s;
}

.thumbnail:hover {
  border-color: #93c5fd;
}

.thumbnail.active {
  border-color: #3b82f6;
}

.thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* 信息区域 */
.info-section {
  display: flex;
  flex-direction: column;
}

.vehicle-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
}

.vehicle-title {
  font-size: 28px;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

.status-badge {
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
}

.status-badge.available {
  background: #dcfce7;
  color: #16a34a;
}

/* 价格区域 */
.price-section {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  border-radius: 12px;
  padding: 20px 24px;
  margin-bottom: 24px;
}

.price-main {
  display: flex;
  align-items: baseline;
  color: #fff;
}

.price-main .currency {
  font-size: 20px;
  font-weight: 500;
}

.price-main .amount {
  font-size: 36px;
  font-weight: 700;
  margin: 0 4px;
}

.price-main .unit {
  font-size: 16px;
  opacity: 0.9;
}

/* 信息列表 */
.info-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: #f8fafc;
  border-radius: 12px;
}

.info-icon {
  width: 44px;
  height: 44px;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.info-icon svg {
  width: 22px;
  height: 22px;
  color: #fff;
}

.info-content {
  display: flex;
  flex-direction: column;
}

.info-label {
  font-size: 12px;
  color: #64748b;
  margin-bottom: 2px;
}

.info-value {
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
}

/* 描述区域 */
.description-section {
  margin-bottom: 32px;
}

.description-section h3 {
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 12px 0;
}

.description-section p {
  font-size: 14px;
  color: #64748b;
  line-height: 1.7;
  margin: 0;
}

/* 操作区域 */
.action-section {
  display: flex;
  gap: 16px;
  margin-top: auto;
}

.rent-btn {
  flex: 1;
  height: 52px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 12px;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.rent-btn svg {
  width: 20px;
  height: 20px;
}

.rent-btn:hover {
  background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
}

.action-section .el-button:not(.rent-btn) {
  width: 120px;
  height: 52px;
  border-radius: 12px;
}

/* 响应式 */
@media (max-width: 900px) {
  .detail-content {
    grid-template-columns: 1fr;
    padding: 24px;
  }

  .main-image {
    height: 300px;
  }

  .vehicle-title {
    font-size: 24px;
  }

  .price-main .amount {
    font-size: 28px;
  }
}

@media (max-width: 600px) {
  .vehicle-detail-page {
    padding: 16px;
  }

  .detail-content {
    padding: 16px;
  }

  .main-image {
    height: 220px;
  }

  .vehicle-header {
    flex-direction: column;
    gap: 12px;
  }

  .action-section {
    flex-direction: column;
  }

  .action-section .el-button:not(.rent-btn) {
    width: 100%;
  }
}
</style>
