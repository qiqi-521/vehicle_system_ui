import request from '@/utils/request'

// 用户登录
export function login(data) {
  return request.post('/user/auth/login', data)
}

// 用户注册
export function register(data) {
  return request.post('/user/auth/register', data)
}

// 获取用户信息
export function getUserInfo() {
  return request.get('/user/auth/me')
}

// 修改密码
export function updatePassword(data) {
  return request.post('/user/auth/password', data)
}

// 退出登录
export function logout() {
  return request.post('/user/auth/logout')
}
