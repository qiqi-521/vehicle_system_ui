import request from '@/utils/request'

// 创建订单
export function createOrder(data) {
  return request.post('/user/orders', data)
}

// 获取我的订单列表
export function getMyOrders(params) {
  return request.get('/user/orders', { params })
}

// 获取订单详情
export function getOrderDetail(id) {
  return request.get(`/user/orders/${id}`)
}

// 支付订单
export function payOrder(id) {
  return request.post(`/user/orders/${id}/pay`)
}

// 取消订单
export function cancelOrder(id) {
  return request.put(`/user/orders/${id}/cancel`)
}
