import request from '@/utils/request'

// 提交留言
export function submitContact(data) {
  return request.post('/user/contact', data)
}
