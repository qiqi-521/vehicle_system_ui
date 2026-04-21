import request from '@/utils/request'

// 获取轮播图列表
export function getBannerList() {
  return request.get('/admin/banners')
}

// 获取轮播图详情
export function getBannerDetail(id) {
  return request.get(`/admin/banners/${id}`)
}

// 新增轮播图
export function createBanner(data) {
  return request.post('/admin/banners', data)
}

// 更新轮播图
export function updateBanner(id, data) {
  return request.put(`/admin/banners/${id}`, data)
}

// 删除轮播图
export function deleteBanner(id) {
  return request.delete(`/admin/banners/${id}`)
}

// 上传轮播图图片
export function uploadBannerImage(file) {
  const formData = new FormData()
  formData.append('file', file)
  return request.post('/admin/banners/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}
