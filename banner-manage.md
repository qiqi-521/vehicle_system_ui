# 轮播图管理功能需求文档

## 功能描述
管理员可以管理首页轮播图，支持增删改查、排序、启用/禁用。

## 数据库设计

### banner 表
```sql
CREATE TABLE banner (
  id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '主键',
  image_url VARCHAR(500) NOT NULL COMMENT '图片URL',
  title VARCHAR(100) COMMENT '标题',
  sort INT DEFAULT 0 COMMENT '排序（数字越小越靠前）',
  status TINYINT DEFAULT 1 COMMENT '状态：1启用 0禁用',
  create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间'
) COMMENT '轮播图表';
```

## 后端实现

### 实体类
- Banner.java

### Mapper
- BannerMapper.java

### Service
- BannerService.java
  - list(): 查询启用的轮播图（按sort排序）
  - listAll(): 查询所有轮播图（管理员用）
  - add(Banner): 新增
  - update(Banner): 更新
  - delete(id): 删除

### Controller
- AdminBannerController.java（管理员接口）
  - GET /admin/banner/list - 查询所有
  - POST /admin/banner - 新增
  - PUT /admin/banner - 更新
  - DELETE /admin/banner/{id} - 删除

- BannerController.java（用户接口）
  - GET /banner/list - 查询启用的轮播图

## 前端实现

### 用户端
- Home.vue: 从接口获取轮播图数据

### 管理员端
- 新增 src/views/admin/BannerManage.vue
  - 表格展示轮播图列表
  - 新增/编辑弹窗
  - 图片上传
  - 排序调整
  - 启用/禁用开关
  - 删除功能

### API
- src/api/admin/banner.js
- src/api/user/banner.js

### 路由
- /admin/banner - 轮播图管理页面
