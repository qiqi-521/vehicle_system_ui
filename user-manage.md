# 用户管理功能需求文档

## 功能描述
管理员可以管理系统用户，支持查看用户列表、搜索、禁用/启用用户。

## 数据库设计

用户表 `users` 已存在，无需新建表。

## 后端实现

### Controller
- AdminUserController.java（管理员接口）
  - GET /admin/users - 分页查询用户列表
  - GET /admin/users/{id} - 查询用户详情
  - PUT /admin/users/{id}/status - 更新用户状态（启用/禁用）

## 前端实现

### 管理员端
- 新增 src/views/admin/UserManage.vue
  - 表格展示用户列表
  - 搜索（用户名、手机号）
  - 启用/禁用开关
  - 查看用户详情

### API
- src/api/admin/user.js

### 路由
- /admin/users - 用户管理页面
