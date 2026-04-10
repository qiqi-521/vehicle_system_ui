import request from '@/utils/request'

// 获取车辆列表（分页）
export function getVehicleList(params) {
  return request.get('/admin/vehicles', { params })
}

// 获取车辆详情
export function getVehicleDetail(id) {
  return request.get(`/admin/vehicles/${id}`)
}

// 新增车辆
export function createVehicle(data) {
  return request.post('/admin/vehicles', data)
}

// 更新车辆信息
export function updateVehicle(id, data) {
  return request.put(`/admin/vehicles/${id}`, data)
}

// 更新车辆状态
export function updateVehicleStatus(id, status) {
  return request.put(`/admin/vehicles/${id}/status`, { status })
}

// 删除车辆
export function deleteVehicle(id) {
  return request.delete(`/admin/vehicles/${id}`)
}

// 上传车辆图片
export function uploadVehicleImage(file) {
  const formData = new FormData()
  formData.append('file', file)
  return request.post('/admin/vehicles/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}
