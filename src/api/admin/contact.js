import request from '@/utils/request'

// 获取留言列表（分页）
export function getContactList(params) {
  return request.get('/admin/contacts', { params })
}

// 回复留言
export function replyContact(id, data) {
  return request.put(`/admin/contacts/${id}/reply`, data)
}

// 更新留言状态
export function updateContactStatus(id, status) {
  return request.put(`/admin/contacts/${id}/status`, null, { params: { status } })
}
