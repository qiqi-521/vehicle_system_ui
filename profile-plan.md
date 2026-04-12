# 用户个人中心页面实现计划

## Context
用户查看个人信息，支持修改密码功能。

## 实现方案

### 后端接口（已有）

| 接口 | 方法 | 说明 |
|------|------|------|
| `/api/user/auth/me` | GET | 获取当前用户信息 |
| `/api/user/auth/password` | POST | 修改密码 |

**用户信息字段：**
- id、username、name、phone、email、avatar
- status、lastLoginAt、createdAt

**修改密码参数：**
- oldPassword - 旧密码
- newPassword - 新密码
- confirmPassword - 确认密码

### 前端实现

**页面内容：**

1. 用户信息卡片
   - 头像、用户名、姓名
   - 手机号、邮箱
   - 注册时间、最后登录时间

2. 修改密码卡片
   - 旧密码输入框
   - 新密码输入框
   - 确认密码输入框
   - 提交按钮

### 文件修改清单

#### 前端新建文件（1个）
1. `src/views/user/Profile.vue` - 个人中心页面

#### 前端修改文件（1个）
1. `src/router/index.js` - 添加/profile路由

## 验证方式
1. 登录后访问个人中心页面
2. 查看用户信息
3. 修改密码功能正常
