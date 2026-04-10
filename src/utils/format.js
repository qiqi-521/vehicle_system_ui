/**
 * 格式化工具函数
 */

/**
 * 格式化日期时间
 * @param {string|Date} date 日期
 * @param {string} format 格式，默认 'YYYY-MM-DD HH:mm:ss'
 */
export function formatDateTime(date, format = 'YYYY-MM-DD HH:mm:ss') {
  if (!date) return '-'

  const d = new Date(date)
  if (isNaN(d.getTime())) return '-'

  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')
  const seconds = String(d.getSeconds()).padStart(2, '0')

  return format
    .replace('YYYY', year)
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds)
}

/**
 * 格式化日期
 * @param {string|Date} date 日期
 */
export function formatDate(date) {
  return formatDateTime(date, 'YYYY-MM-DD')
}

/**
 * 格式化时间
 * @param {string|Date} date 日期
 */
export function formatTime(date) {
  return formatDateTime(date, 'HH:mm:ss')
}

/**
 * 格式化金额
 * @param {number} amount 金额
 * @param {number} decimals 小数位数，默认 2
 */
export function formatMoney(amount, decimals = 2) {
  if (amount === null || amount === undefined) return '-'
  const num = Number(amount)
  if (isNaN(num)) return '-'
  return num.toFixed(decimals)
}

/**
 * 格式化金额（带货币符号）
 * @param {number} amount 金额
 */
export function formatCurrency(amount) {
  const formatted = formatMoney(amount)
  return formatted === '-' ? '-' : `¥${formatted}`
}

/**
 * 格式化手机号（隐藏中间4位）
 * @param {string} phone 手机号
 */
export function formatPhone(phone) {
  if (!phone) return '-'
  return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
}

/**
 * 格式化车牌号
 * @param {string} plate 车牌号
 */
export function formatPlate(plate) {
  if (!plate) return '-'
  return plate.toUpperCase()
}

/**
 * 计算天数差
 * @param {string|Date} startDate 开始日期
 * @param {string|Date} endDate 结束日期
 */
export function diffDays(startDate, endDate) {
  if (!startDate || !endDate) return 0
  const start = new Date(startDate)
  const end = new Date(endDate)
  const diff = end - start
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

/**
 * 格式化文件大小
 * @param {number} bytes 字节数
 */
export function formatFileSize(bytes) {
  if (!bytes) return '0 B'
  const units = ['B', 'KB', 'MB', 'GB']
  let i = 0
  let size = bytes
  while (size >= 1024 && i < units.length - 1) {
    size /= 1024
    i++
  }
  return `${size.toFixed(2)} ${units[i]}`
}
