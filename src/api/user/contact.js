import request from '@/utils/request'

// 提交留言
export function submitContact(data) {
  return request.post('/user/contact', data)
}

// 查询我的留言列表
export function getMyContacts(params) {
  return request.get('/user/contact/my', { params })
}
