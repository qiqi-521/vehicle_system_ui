import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import * as authApi from '@/api/admin/auth'

export const useAdminStore = defineStore('admin', () => {
  // 状态
  const token = ref(localStorage.getItem('adminToken') || '')
  const adminInfo = ref(JSON.parse(localStorage.getItem('adminInfo') || 'null'))

  // 计算属性
  const isLoggedIn = computed(() => !!token.value)

  // 登录
  async function login(username, password) {
    const res = await authApi.login({ username, password })
    token.value = res.token
    localStorage.setItem('adminToken', res.token)
    return res
  }

  // 获取管理员信息
  async function fetchAdminInfo() {
    const res = await authApi.getAdminInfo()
    adminInfo.value = res
    localStorage.setItem('adminInfo', JSON.stringify(res))
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
    adminInfo.value = null
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminInfo')
  }

  return {
    token,
    adminInfo,
    isLoggedIn,
    login,
    fetchAdminInfo,
    changePassword,
    logout
  }
})
