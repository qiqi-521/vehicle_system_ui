import request from '@/utils/request'

// 获取用户列表（分页）
export function getUserList(params) {
  return request.get('/admin/users', { params })
}

// 获取用户详情
export function getUserDetail(id) {
  return request.get(`/admin/users/${id}`)
}

// 更新用户状态
export function updateUserStatus(id, status) {
  return request.put(`/admin/users/${id}/status`, null, { params: { status } })
}
