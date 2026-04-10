/**
 * Token 认证工具
 */
import { TOKEN_KEY } from './constants'

/**
 * 获取用户 Token
 */
export function getUserToken() {
  return localStorage.getItem(TOKEN_KEY.USER) || ''
}

/**
 * 设置用户 Token
 */
export function setUserToken(token) {
  localStorage.setItem(TOKEN_KEY.USER, token)
}

/**
 * 移除用户 Token
 */
export function removeUserToken() {
  localStorage.removeItem(TOKEN_KEY.USER)
}

/**
 * 获取管理员 Token
 */
export function getAdminToken() {
  return localStorage.getItem(TOKEN_KEY.ADMIN) || ''
}

/**
 * 设置管理员 Token
 */
export function setAdminToken(token) {
  localStorage.setItem(TOKEN_KEY.ADMIN, token)
}

/**
 * 移除管理员 Token
 */
export function removeAdminToken() {
  localStorage.removeItem(TOKEN_KEY.ADMIN)
}

/**
 * 获取用户信息
 */
export function getUserInfo() {
  const info = localStorage.getItem(TOKEN_KEY.USER_INFO)
  return info ? JSON.parse(info) : null
}

/**
 * 设置用户信息
 */
export function setUserInfo(info) {
  localStorage.setItem(TOKEN_KEY.USER_INFO, JSON.stringify(info))
}

/**
 * 移除用户信息
 */
export function removeUserInfo() {
  localStorage.removeItem(TOKEN_KEY.USER_INFO)
}

/**
 * 获取管理员信息
 */
export function getAdminInfo() {
  const info = localStorage.getItem(TOKEN_KEY.ADMIN_INFO)
  return info ? JSON.parse(info) : null
}

/**
 * 设置管理员信息
 */
export function setAdminInfo(info) {
  localStorage.setItem(TOKEN_KEY.ADMIN_INFO, JSON.stringify(info))
}

/**
 * 移除管理员信息
 */
export function removeAdminInfo() {
  localStorage.removeItem(TOKEN_KEY.ADMIN_INFO)
}

/**
 * 清除用户登录状态
 */
export function clearUserAuth() {
  removeUserToken()
  removeUserInfo()
}

/**
 * 清除管理员登录状态
 */
export function clearAdminAuth() {
  removeAdminToken()
  removeAdminInfo()
}

/**
 * 检查用户是否登录
 */
export function isUserLoggedIn() {
  return !!getUserToken()
}

/**
 * 检查管理员是否登录
 */
export function isAdminLoggedIn() {
  return !!getAdminToken()
}
