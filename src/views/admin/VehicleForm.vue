<template>
  <div class="vehicle-form">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>{{ isEdit ? '编辑车辆' : '新增车辆' }}</span>
        </div>
      </template>

      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="100px"
        style="max-width: 600px;"
      >
        <el-form-item label="品牌" prop="brand">
          <el-input v-model="form.brand" placeholder="请输入品牌" />
        </el-form-item>

        <el-form-item label="车型" prop="model">
          <el-input v-model="form.model" placeholder="请输入车型" />
        </el-form-item>

        <el-form-item label="车牌号" prop="licensePlate">
          <el-input v-model="form.licensePlate" placeholder="请输入车牌号" />
        </el-form-item>

        <el-form-item label="租金(元/天)" prop="price">
          <el-input-number v-model="form.price" :min="0" :precision="2" style="width: 100%;" />
        </el-form-item>

        <el-form-item label="状态" prop="status">
          <el-select v-model="form.status" placeholder="请选择状态">
            <el-option label="可用" value="AVAILABLE" />
            <el-option label="维修中" value="MAINTENANCE" />
            <el-option label="不可用" value="UNAVAILABLE" />
          </el-select>
        </el-form-item>

        <el-form-item label="车辆图片">
          <el-upload
            v-model:file-list="fileList"
            action="#"
            list-type="picture-card"
            :auto-upload="false"
            :on-change="handleImageChange"
            :on-remove="handleImageRemove"
            accept="image/*"
          >
            <el-icon><Plus /></el-icon>
          </el-upload>
          <div class="upload-tip">支持上传多张图片，建议尺寸 800x600</div>
        </el-form-item>

        <el-form-item label="描述" prop="description">
          <el-input
            v-model="form.description"
            type="textarea"
            :rows="4"
            placeholder="请输入车辆描述"
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleSubmit" :loading="loading">
            {{ isEdit ? '保存' : '创建' }}
          </el-button>
          <el-button @click="router.back()">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import * as vehicleApi from '@/api/admin/vehicle'

const router = useRouter()
const route = useRoute()

// 是否编辑模式
const isEdit = computed(() => !!route.params.id)

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
  brand: [{ required: true, message: '请输入品牌', trigger: 'blur' }],
  model: [{ required: true, message: '请输入车型', trigger: 'blur' }],
  licensePlate: [{ required: true, message: '请输入车牌号', trigger: 'blur' }],
  price: [{ required: true, message: '请输入租金', trigger: 'blur' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }]
}

// 图片变化
function handleImageChange(file, list) {
  // 这里可以添加图片上传逻辑
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
.vehicle-form {
  max-width: 800px;
}

.card-header {
  font-size: 16px;
  font-weight: 500;
}

.upload-tip {
  color: #999;
  font-size: 12px;
  margin-top: 8px;
}
</style>
