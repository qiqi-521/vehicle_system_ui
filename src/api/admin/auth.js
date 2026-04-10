import request from '@/utils/request'

// 管理员登录
export function login(data) {
  return request.post('/admin/auth/login', data)
}

// 获取管理员信息
export function getAdminInfo() {
  return request.get('/admin/auth/me')
}

// 修改密码
export function updatePassword(data) {
  return request.post('/admin/auth/password', data)
}

// 退出登录
export function logout() {
  return request.post('/admin/auth/logout')
}
