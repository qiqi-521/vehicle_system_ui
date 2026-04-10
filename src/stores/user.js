import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import * as authApi from '@/api/user/auth'

export const useUserStore = defineStore('user', () => {
  // 状态
  const token = ref(localStorage.getItem('userToken') || '')
  const userInfo = ref(JSON.parse(localStorage.getItem('userInfo') || 'null'))

  // 计算属性
  const isLoggedIn = computed(() => !!token.value)

  // 注册
  async function register(data) {
    return await authApi.register(data)
  }

  // 登录
  async function login(username, password) {
    const res = await authApi.login({ username, password })
    token.value = res.token
    localStorage.setItem('userToken', res.token)
    return res
  }

  // 获取用户信息
  async function fetchUserInfo() {
    const res = await authApi.getUserInfo()
    userInfo.value = res
    localStorage.setItem('userInfo', JSON.stringify(res))
    return res
  }

  // 修改密码
  async function changePassword(oldPassword, newPassword) {
    return await authApi.updatePassword({
      oldPassword,
      newPassword
    })
  }

  // 退出登录
  async function logout() {
    try {
      await authApi.logout()
    } catch (e) {
      // 忽略退出登录的错误
    }
    token.value = ''
    userInfo.value = null
    localStorage.removeItem('userToken')
    localStorage.removeItem('userInfo')
  }

  return {
    token,
    userInfo,
    isLoggedIn,
    register,
    login,
    fetchUserInfo,
    changePassword,
    logout
  }
})
