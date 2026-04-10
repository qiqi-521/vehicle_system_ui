import axios from 'axios'
import { ElMessage } from 'element-plus'

// 创建 axios 实例
const request = axios.create({
  baseURL: '/api',
  timeout: 15000,
})

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    // 根据 URL 判断是用户端还是管理端
    const url = config.url || ''
    let token = null

    if (url.startsWith('/admin')) {
      token = localStorage.getItem('adminToken')
    } else {
      token = localStorage.getItem('userToken')
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  (response) => {
    const res = response.data
    // 后端返回格式: { code, message, data }
    if (res.code === 200 || res.code === 0) {
      return res.data
    }
    // 业务错误
    ElMessage.error(res.message || '请求失败')
    return Promise.reject(new Error(res.message || '请求失败'))
  },
  (error) => {
    // HTTP 错误处理
    if (error.response) {
      const { status, data } = error.response
      const url = error.config?.url || ''

      switch (status) {
        case 401:
          ElMessage.error('登录已过期，请重新登录')
          // 根据 URL 清除对应的 token
          if (url.startsWith('/admin')) {
            localStorage.removeItem('adminToken')
            localStorage.removeItem('adminInfo')
            window.location.href = '/login?type=admin'
          } else {
            localStorage.removeItem('userToken')
            localStorage.removeItem('userInfo')
            window.location.href = '/login'
          }
          break
        case 403:
          ElMessage.error('没有权限访问')
          break
        case 404:
          ElMessage.error('请求的资源不存在')
          break
        case 500:
          ElMessage.error(data?.message || '服务器错误')
          break
        default:
          ElMessage.error(data?.message || `请求失败 (${status})`)
      }
    } else {
      ElMessage.error('网络连接失败，请检查网络')
    }
    return Promise.reject(error)
  }
)

export default request
