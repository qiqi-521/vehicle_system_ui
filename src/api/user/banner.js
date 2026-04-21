import request from '@/utils/request'

// 获取启用的轮播图列表
export function getBannerList() {
  return request.get('/banners')
}
