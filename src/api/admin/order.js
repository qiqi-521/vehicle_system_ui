import request from '@/utils/request'

// 获取订单列表（分页）
export function getOrderList(params) {
  return request.get('/admin/orders', { params })
}

// 更新订单状态
export function updateOrderStatus(id, status) {
  return request.put(`/admin/orders/${id}/status`, { status })
}
