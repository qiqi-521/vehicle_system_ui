# 汽车租赁系统前端开发计划

## 项目概述

基于 Vue 3 + Vite 开发汽车租赁管理系统前端，对接后端 Spring Boot API。

## 技术栈

| 技术 | 版本 | 说明 |
|------|------|------|
| Vue | 3.5 | 前端框架 |
| Vite | 8.0 | 构建工具 |
| Vue Router | 5.0 | 路由管理 |
| Pinia | 3.0 | 状态管理 |
| Element Plus | 最新 | UI组件库 |
| Axios | 最新 | HTTP请求库 |

## 项目结构

```
src/
├── api/                    # API接口
│   ├── admin/              # 管理端接口
│   │   ├── auth.js         # 管理员认证
│   │   ├── vehicle.js      # 车辆管理
│   │   └── order.js        # 订单管理
│   └── user/               # 用户端接口
│       ├── auth.js         # 用户认证
│       ├── vehicle.js      # 车辆浏览
│       └── order.js        # 订单功能
├── assets/                 # 静态资源
├── components/             # 公共组件
├── layouts/                # 布局组件
│   ├── AdminLayout.vue     # 管理端布局
│   └── UserLayout.vue      # 用户端布局
├── router/                 # 路由配置
│   └── index.js
├── stores/                 # Pinia状态管理
│   ├── admin.js            # 管理员状态
│   └── user.js             # 用户状态
├── utils/                  # 工具函数
│   ├── request.js          # Axios封装
│   └── auth.js             # Token处理
└── views/                  # 页面组件
    ├── admin/              # 管理端页面
    │   ├── Login.vue       # 登录页
    │   ├── VehicleList.vue # 车辆列表
    │   ├── VehicleForm.vue # 车辆表单
    │   └── OrderList.vue   # 订单列表
    └── user/               # 用户端页面
        ├── Login.vue       # 登录页
        ├── Register.vue    # 注册页
        ├── VehicleList.vue # 车辆列表
        ├── VehicleDetail.vue # 车辆详情
        ├── OrderCreate.vue # 下单页
        └── MyOrders.vue    # 我的订单
```

## 开发步骤

### 第一阶段：基础搭建

1. **安装依赖**
   - Element Plus UI组件库
   - Axios HTTP请求库

2. **配置项目**
   - 配置 Vite 代理（解决跨域）
   - 配置 Element Plus 按需引入

3. **封装 Axios**
   - 创建 request.js 统一请求封装
   - 配置请求/响应拦截器
   - 自动携带 JWT Token

### 第二阶段：管理端开发

1. **管理员认证模块**
   - 登录页面
   - Token 存储与管理
   - 路由守卫

2. **车辆管理模块**
   - 车辆列表（分页、搜索、筛选）
   - 新增车辆
   - 编辑车辆
   - 删除车辆
   - 车辆状态管理
   - 图片上传

3. **订单管理模块**
   - 订单列表（分页、搜索、状态筛选）
   - 订单状态更新

### 第三阶段：用户端开发

1. **用户认证模块**
   - 注册页面
   - 登录页面
   - 个人信息展示

2. **车辆浏览模块**
   - 车辆列表（分页、搜索）
   - 车辆详情

3. **订单功能模块**
   - 创建订单（选择时间、计算价格）
   - 我的订单列表
   - 订单详情
   - 支付订单
   - 取消订单

### 第四阶段：优化完善

1. **UI美化**
   - 响应式布局适配
   - 加载状态处理
   - 错误提示优化

2. **功能完善**
   - 表单验证
   - 权限控制
   - 退出登录

## API 接口对照

### 管理端接口

| 功能 | 方法 | 接口 |
|------|------|------|
| 管理员登录 | POST | /api/admin/auth/login |
| 获取管理员信息 | GET | /api/admin/auth/info |
| 修改密码 | PUT | /api/admin/auth/password |
| 车辆列表 | GET | /api/admin/vehicles |
| 车辆详情 | GET | /api/admin/vehicles/{id} |
| 新增车辆 | POST | /api/admin/vehicles |
| 更新车辆 | PUT | /api/admin/vehicles/{id} |
| 删除车辆 | DELETE | /api/admin/vehicles/{id} |
| 更新车辆状态 | PUT | /api/admin/vehicles/{id}/status |
| 上传图片 | POST | /api/admin/vehicles/upload |
| 订单列表 | GET | /api/admin/orders |
| 更新订单状态 | PUT | /api/admin/orders/{id}/status |

### 用户端接口

| 功能 | 方法 | 接口 |
|------|------|------|
| 用户注册 | POST | /api/user/auth/register |
| 用户登录 | POST | /api/user/auth/login |
| 获取用户信息 | GET | /api/user/auth/info |
| 修改密码 | PUT | /api/user/auth/password |
| 退出登录 | POST | /api/user/auth/logout |
| 车辆列表 | GET | /api/user/vehicles |
| 车辆详情 | GET | /api/user/vehicles/{id} |
| 创建订单 | POST | /api/user/orders |
| 我的订单 | GET | /api/user/orders |
| 订单详情 | GET | /api/user/orders/{id} |
| 支付订单 | POST | /api/user/orders/{id}/pay |
| 取消订单 | PUT | /api/user/orders/{id}/cancel |

## 订单状态说明

| 状态值 | 中文 | 说明 |
|--------|------|------|
| pending | 待支付 | 订单已创建，等待支付 |
| paid | 已支付 | 用户已完成支付 |
| in_use | 使用中 | 车辆正在使用中 |
| completed | 已完成 | 订单已完成 |
| cancelled | 已取消 | 订单已取消 |
| refunded | 已退款 | 订单已退款 |

## 车辆状态说明

| 状态值 | 中文 | 说明 |
|--------|------|------|
| available | 可用 | 可出租 |
| rented | 已出租 | 正在出租中 |
| maintenance | 维修中 | 维护保养中 |

## 后端配置

- 后端地址：http://localhost:8080
- API文档：http://localhost:8080/doc.html
- 认证方式：JWT Bearer Token
