import request from '@/utils/request'

// 获取订单趋势数据
export function getOrderTrend(days = 7) {
  return request.get('/admin/statistics/order-trend', { params: { days } })
}

// 获取订单状态分布
export function getOrderStatus() {
  return request.get('/admin/statistics/order-status')
}

// 获取收入趋势数据
export function getRevenueTrend(days = 7) {
  return request.get('/admin/statistics/revenue-trend', { params: { days } })
}

// 获取今日概览
export function getTodayOverview() {
  return request.get('/admin/statistics/today-overview')
}

// 获取车辆热度排行
export function getVehiclePopularity() {
  return request.get('/admin/statistics/vehicle-popularity')
}

// 获取车辆状态分布
export function getVehicleStatus() {
  return request.get('/admin/statistics/vehicle-status')
}

// 获取车辆概览
export function getVehicleOverview() {
  return request.get('/admin/statistics/vehicle-overview')
}

// 获取用户注册趋势数据
export function getUserTrend(days = 7) {
  return request.get('/admin/statistics/user-trend', { params: { days } })
}

// 获取用户状态分布
export function getUserStatus() {
  return request.get('/admin/statistics/user-status')
}

// 获取用户概览
export function getUserOverview() {
  return request.get('/admin/statistics/user-overview')
}