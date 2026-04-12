import request from '@/utils/request'

// 获取车辆列表
export function getVehicleList(params) {
  return request.get('/user/vehicles', { params })
}

// 获取车辆详情
export function getVehicleDetail(id) {
  return request.get(`/user/vehicles/${id}`)
}
