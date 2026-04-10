<template>
  <div class="vehicle-list">
    <!-- 搜索和操作区 -->
    <el-card class="search-card">
      <el-form :inline="true" :model="searchForm">
        <el-form-item label="品牌">
          <el-input v-model="searchForm.brand" placeholder="请输入品牌" clearable />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="全部状态" clearable>
            <el-option label="可用" value="AVAILABLE" />
            <el-option label="维修中" value="MAINTENANCE" />
            <el-option label="不可用" value="UNAVAILABLE" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="fetchData">搜索</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 表格 -->
    <el-card>
      <template #header>
        <div class="card-header">
          <span>车辆列表</span>
          <el-button type="primary" @click="router.push('/admin/vehicles/add')">
            新增车辆
          </el-button>
        </div>
      </template>

      <el-table :data="tableData" v-loading="loading" stripe>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column label="图片" width="100">
          <template #default="{ row }">
            <el-image
              v-if="row.images && row.images.length > 0"
              :src="row.images[0]"
              :preview-src-list="row.images"
              fit="cover"
              style="width: 60px; height: 45px; border-radius: 4px;"
            />
            <span v-else class="no-image">暂无图片</span>
          </template>
        </el-table-column>
        <el-table-column prop="brand" label="品牌" width="120" />
        <el-table-column prop="model" label="车型" width="150" />
        <el-table-column prop="licensePlate" label="车牌号" width="120" />
        <el-table-column prop="price" label="租金(元/天)" width="120">
          <template #default="{ row }">
            ¥{{ row.price }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="创建时间" width="180">
          <template #default="{ row }">
            {{ formatDate(row.createdAt) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="200">
          <template #default="{ row }">
            <el-button link type="primary" @click="handleEdit(row)">编辑</el-button>
            <el-button link type="primary" @click="handleStatus(row)">状态</el-button>
            <el-button link type="danger" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.size"
          :page-sizes="[10, 20, 50]"
          :total="pagination.total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="fetchData"
          @current-change="fetchData"
        />
      </div>
    </el-card>

    <!-- 状态修改对话框 -->
    <el-dialog v-model="statusDialogVisible" title="修改车辆状态" width="400px">
      <el-form label-width="80px">
        <el-form-item label="当前状态">
          <el-tag :type="getStatusType(currentVehicle?.status)">
            {{ getStatusText(currentVehicle?.status) }}
          </el-tag>
        </el-form-item>
        <el-form-item label="新状态">
          <el-select v-model="newStatus">
            <el-option label="可用" value="AVAILABLE" />
            <el-option label="维修中" value="MAINTENANCE" />
            <el-option label="不可用" value="UNAVAILABLE" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="statusDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitStatus" :loading="statusLoading">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import * as vehicleApi from '@/api/admin/vehicle'

const router = useRouter()

// 搜索表单
const searchForm = reactive({
  brand: '',
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
      page: pagination.page - 1,
      size: pagination.size,
      brand: searchForm.brand || undefined,
      status: searchForm.status || undefined
    })
    tableData.value = res.content || []
    pagination.total = res.totalElements || 0
  } catch (e) {
    // 错误已在拦截器处理
  } finally {
    loading.value = false
  }
}

// 重置搜索
function resetSearch() {
  searchForm.brand = ''
  searchForm.status = ''
  pagination.page = 1
  fetchData()
}

// 状态映射
function getStatusType(status) {
  const map = {
    'AVAILABLE': 'success',
    'MAINTENANCE': 'warning',
    'UNAVAILABLE': 'danger'
  }
  return map[status] || 'info'
}

function getStatusText(status) {
  const map = {
    'AVAILABLE': '可用',
    'MAINTENANCE': '维修中',
    'UNAVAILABLE': '不可用'
  }
  return map[status] || status
}

// 格式化日期
function formatDate(dateStr) {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  return date.toLocaleString('zh-CN')
}

// 编辑
function handleEdit(row) {
  router.push(`/admin/vehicles/edit/${row.id}`)
}

// 删除
async function handleDelete(row) {
  try {
    await ElMessageBox.confirm(
      `确定要删除车辆 "${row.brand} ${row.model}" 吗？`,
      '提示',
      { type: 'warning' }
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
  gap: 16px;
}

.search-card {
  margin-bottom: 0;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.pagination {
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
}

.no-image {
  color: #999;
  font-size: 12px;
}
</style>
