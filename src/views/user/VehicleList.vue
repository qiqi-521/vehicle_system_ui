<template>
  <div class="vehicle-list-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <h1>浏览车辆</h1>
        <p>选择您心仪的车辆，开启美好旅程</p>
      </div>
    </div>

    <div class="page-content">
      <!-- 筛选区域 -->
      <div class="filter-section">
        <div class="filter-card">
          <div class="filter-row">
            <div class="filter-item">
              <label>品牌</label>
              <el-input
                v-model="filters.brand"
                placeholder="请输入品牌"
                clearable
                @clear="handleSearch"
                @keyup.enter="handleSearch"
              />
            </div>
            <div class="filter-item">
              <label>车型</label>
              <el-input
                v-model="filters.model"
                placeholder="请输入车型"
                clearable
                @clear="handleSearch"
                @keyup.enter="handleSearch"
              />
            </div>
            <div class="filter-item price-range">
              <label>价格区间</label>
              <div class="price-inputs">
                <el-input-number
                  v-model="filters.minPrice"
                  :min="0"
                  :precision="0"
                  placeholder="最低价"
                  controls-position="right"
                />
                <span class="separator">-</span>
                <el-input-number
                  v-model="filters.maxPrice"
                  :min="0"
                  :precision="0"
                  placeholder="最高价"
                  controls-position="right"
                />
              </div>
            </div>
            <div class="filter-actions">
              <el-button type="primary" @click="handleSearch">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
                搜索
              </el-button>
              <el-button @click="handleReset">
                重置
              </el-button>
            </div>
          </div>
        </div>
      </div>

      <!-- 车辆列表 -->
      <div class="vehicle-section">
        <div class="section-header">
          <span class="total">共 {{ total }} 辆可租车辆</span>
        </div>

        <div v-if="vehicles.length > 0" v-loading="loading" class="vehicle-grid">
          <div
            v-for="vehicle in vehicles"
            :key="vehicle.id"
            class="vehicle-card"
            @click="goToDetail(vehicle.id)"
          >
            <div class="card-image">
              <img
                :src="vehicle.images && vehicle.images.length > 0 ? vehicle.images[0] : defaultImage"
                :alt="vehicle.brand + ' ' + vehicle.model"
              />
              <div class="price-tag">
                <span class="price">¥{{ vehicle.price }}</span>
                <span class="unit">/天</span>
              </div>
            </div>
            <div class="card-content">
              <h3 class="vehicle-name">{{ vehicle.brand }} {{ vehicle.model }}</h3>
              <p class="vehicle-plate">{{ vehicle.licensePlate }}</p>
              <p class="vehicle-desc">{{ vehicle.description || '暂无描述' }}</p>
              <div class="card-footer">
                <span class="status available">可租用</span>
                <span class="action">
                  查看详情
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- 空状态 -->
        <div v-if="!loading && vehicles.length === 0" class="empty-state">
          <div class="empty-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
              <circle cx="7" cy="17" r="2" />
              <path d="M9 17h6" />
              <circle cx="17" cy="17" r="2" />
            </svg>
          </div>
          <h3>暂无可租车辆</h3>
          <p>目前没有可租赁的车辆，请稍后再来看看</p>
        </div>

        <!-- 分页 -->
        <div v-if="total > 0" class="pagination-wrapper">
          <el-pagination
            v-model:current-page="pagination.page"
            v-model:page-size="pagination.size"
            :page-sizes="[8, 16, 24, 32]"
            :total="total"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="fetchVehicles"
            @current-change="fetchVehicles"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getVehicleList } from '@/api/user/vehicle'

const router = useRouter()
const loading = ref(false)
const vehicles = ref([])
const total = ref(0)

const defaultImage = 'https://via.placeholder.com/400x250?text=No+Image'

const filters = reactive({
  brand: '',
  model: '',
  minPrice: null,
  maxPrice: null
})

const pagination = reactive({
  page: 1,
  size: 8
})

onMounted(() => {
  fetchVehicles()
})

async function fetchVehicles() {
  loading.value = true
  try {
    const params = {
      page: pagination.page,
      size: pagination.size,
      ...filters
    }
    // 过滤空值
    Object.keys(params).forEach(key => {
      if (params[key] === '' || params[key] === null) {
        delete params[key]
      }
    })

    const res = await getVehicleList(params)
    vehicles.value = res.records || []
    total.value = res.total || 0
  } catch (error) {
    console.error('获取车辆列表失败:', error)
  } finally {
    loading.value = false
  }
}

function handleSearch() {
  pagination.page = 1
  fetchVehicles()
}

function handleReset() {
  filters.brand = ''
  filters.model = ''
  filters.minPrice = null
  filters.maxPrice = null
  pagination.page = 1
  fetchVehicles()
}

function goToDetail(id) {
  router.push(`/vehicle/${id}`)
}
</script>

<style scoped>
.vehicle-list-page {
  min-height: calc(100vh - 72px - 120px);
}

/* 页面头部 */
.page-header {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  padding: 48px 32px;
  text-align: center;
}

.header-content h1 {
  font-size: 32px;
  font-weight: 700;
  color: #fff;
  margin: 0 0 8px 0;
}

.header-content p {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.85);
  margin: 0;
}

/* 页面内容 */
.page-content {
  max-width: 1280px;
  margin: 0 auto;
  padding: 32px;
}

/* 筛选区域 */
.filter-section {
  margin-bottom: 32px;
}

.filter-card {
  background: #fff;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
}

.filter-row {
  display: flex;
  align-items: flex-end;
  gap: 20px;
  flex-wrap: wrap;
}

.filter-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.filter-item label {
  font-size: 13px;
  font-weight: 500;
  color: #64748b;
}

.filter-item :deep(.el-input) {
  width: 180px;
}

.filter-item.price-range {
  flex: 1;
}

.price-inputs {
  display: flex;
  align-items: center;
  gap: 8px;
}

.price-inputs :deep(.el-input-number) {
  width: 120px;
}

.separator {
  color: #94a3b8;
  font-weight: 500;
}

.filter-actions {
  display: flex;
  gap: 12px;
  margin-left: auto;
}

.filter-actions .el-button--primary {
  display: flex;
  align-items: center;
  gap: 6px;
}

.filter-actions .el-button--primary svg {
  width: 16px;
  height: 16px;
}

/* 车辆列表区域 */
.vehicle-section {
  background: #fff;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
}

.section-header {
  margin-bottom: 24px;
}

.total {
  font-size: 14px;
  color: #64748b;
}

/* 车辆网格 */
.vehicle-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  min-height: 200px;
}

/* 车辆卡片 */
.vehicle-card {
  background: #f8fafc;
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid #e2e8f0;
}

.vehicle-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12);
  border-color: #3b82f6;
}

.card-image {
  position: relative;
  height: 160px;
  overflow: hidden;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.vehicle-card:hover .card-image img {
  transform: scale(1.05);
}

.price-tag {
  position: absolute;
  bottom: 12px;
  right: 12px;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: #fff;
  padding: 6px 12px;
  border-radius: 20px;
  font-weight: 600;
}

.price-tag .price {
  font-size: 18px;
}

.price-tag .unit {
  font-size: 12px;
  opacity: 0.9;
}

.card-content {
  padding: 16px;
}

.vehicle-name {
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 4px 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.vehicle-plate {
  font-size: 13px;
  color: #64748b;
  margin: 0 0 8px 0;
}

.vehicle-desc {
  font-size: 13px;
  color: #94a3b8;
  margin: 0 0 12px 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.5;
  height: 39px;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.status {
  font-size: 12px;
  padding: 4px 10px;
  border-radius: 12px;
  font-weight: 500;
}

.status.available {
  background: #dcfce7;
  color: #16a34a;
}

.action {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: #3b82f6;
  font-weight: 500;
}

.action svg {
  width: 14px;
  height: 14px;
  transition: transform 0.2s ease;
}

.vehicle-card:hover .action svg {
  transform: translateX(4px);
}

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  text-align: center;
}

.empty-icon {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
}

.empty-icon svg {
  width: 40px;
  height: 40px;
  color: #94a3b8;
}

.empty-state h3 {
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 8px 0;
}

.empty-state p {
  font-size: 14px;
  color: #64748b;
  margin: 0;
}

/* 分页 */
.pagination-wrapper {
  margin-top: 32px;
  display: flex;
  justify-content: center;
}

/* 响应式 */
@media (max-width: 1200px) {
  .vehicle-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 900px) {
  .vehicle-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .filter-row {
    flex-direction: column;
    align-items: stretch;
  }

  .filter-item {
    width: 100%;
  }

  .filter-item :deep(.el-input) {
    width: 100%;
  }

  .price-inputs {
    width: 100%;
  }

  .price-inputs :deep(.el-input-number) {
    flex: 1;
  }

  .filter-actions {
    margin-left: 0;
    width: 100%;
  }

  .filter-actions .el-button {
    flex: 1;
  }
}

@media (max-width: 600px) {
  .page-content {
    padding: 20px;
  }

  .vehicle-grid {
    grid-template-columns: 1fr;
  }

  .filter-card {
    padding: 16px;
  }
}
</style>
