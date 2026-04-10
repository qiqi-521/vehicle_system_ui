/**
 * 公共常量定义
 */

// 订单状态
export const ORDER_STATUS = {
  PENDING: 'pending',
  PAID: 'paid',
  IN_USE: 'in_use',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  REFUNDED: 'refunded'
}

// 订单状态中文映射
export const ORDER_STATUS_TEXT = {
  [ORDER_STATUS.PENDING]: '待支付',
  [ORDER_STATUS.PAID]: '已支付',
  [ORDER_STATUS.IN_USE]: '使用中',
  [ORDER_STATUS.COMPLETED]: '已完成',
  [ORDER_STATUS.CANCELLED]: '已取消',
  [ORDER_STATUS.REFUNDED]: '已退款'
}

// 订单状态颜色映射 (Element Plus Tag 类型)
export const ORDER_STATUS_TYPE = {
  [ORDER_STATUS.PENDING]: 'warning',
  [ORDER_STATUS.PAID]: 'success',
  [ORDER_STATUS.IN_USE]: 'primary',
  [ORDER_STATUS.COMPLETED]: 'info',
  [ORDER_STATUS.CANCELLED]: 'danger',
  [ORDER_STATUS.REFUNDED]: 'danger'
}

// 车辆状态
export const VEHICLE_STATUS = {
  AVAILABLE: 'available',
  MAINTENANCE: 'maintenance',
  UNAVAILABLE: 'unavailable'
}

// 车辆状态中文映射
export const VEHICLE_STATUS_TEXT = {
  [VEHICLE_STATUS.AVAILABLE]: '可用',
  [VEHICLE_STATUS.MAINTENANCE]: '维修中',
  [VEHICLE_STATUS.UNAVAILABLE]: '不可用'
}

// 车辆状态颜色映射
export const VEHICLE_STATUS_TYPE = {
  [VEHICLE_STATUS.AVAILABLE]: 'success',
  [VEHICLE_STATUS.MAINTENANCE]: 'warning',
  [VEHICLE_STATUS.UNAVAILABLE]: 'danger'
}

// 用户状态
export const USER_STATUS = {
  DISABLED: 0,
  ENABLED: 1
}

// 用户状态中文映射
export const USER_STATUS_TEXT = {
  [USER_STATUS.DISABLED]: '已禁用',
  [USER_STATUS.ENABLED]: '正常'
}

// 管理员状态
export const ADMIN_STATUS = {
  DISABLED: 0,
  ENABLED: 1
}

// 管理员状态中文映射
export const ADMIN_STATUS_TEXT = {
  [ADMIN_STATUS.DISABLED]: '已禁用',
  [ADMIN_STATUS.ENABLED]: '正常'
}

// Token 存储键名
export const TOKEN_KEY = {
  USER: 'userToken',
  ADMIN: 'adminToken',
  USER_INFO: 'userInfo',
  ADMIN_INFO: 'adminInfo'
}
