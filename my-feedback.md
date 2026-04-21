# 用户留言反馈功能需求分析

## 一、功能概述

在用户界面右上角的用户菜单下拉框中，新增"留言反馈"入口，用户可查看自己提交的留言及管理员的回复状态。

## 二、需求分析

### 2.1 功能入口
- 位置：用户头像下拉菜单
- 排序：个人中心 → 我的订单 → **留言反馈** → 退出登录

### 2.2 功能描述
用户点击"留言反馈"后，进入留言反馈列表页面，展示：
- 用户提交的所有留言记录
- 每条留言的主题、内容、提交时间
- 回复状态：未回复 / 已回复
- 管理员回复内容（如有）

### 2.3 状态判断逻辑
- **未回复**：`reply` 字段为空（null 或 空字符串）
- **已回复**：`reply` 字段有内容

## 三、数据库设计

### 3.1 现有表结构（无需修改）

```sql
-- contacts 表已有字段
CREATE TABLE contacts (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT,              -- 用户ID（可空，登录用户留言时关联）
    name VARCHAR(50),            -- 联系人姓名
    phone VARCHAR(20),           -- 联系电话
    email VARCHAR(100),          -- 邮箱
    subject VARCHAR(200),        -- 留言主题
    content TEXT,                -- 留言内容
    status INT DEFAULT 0,        -- 状态：0-未处理，1-已处理
    reply TEXT,                  -- 管理员回复
    created_at DATETIME,         -- 创建时间
    updated_at DATETIME          -- 更新时间
);
```

**说明**：现有表结构已满足需求，无需修改。`user_id` 字段用于关联登录用户，`reply` 字段用于判断回复状态。

## 四、后端开发

### 4.1 新增接口

在 `ContactController.java` (用户端) 新增接口：

| 接口 | 方法 | 路径 | 描述 |
|------|------|------|------|
| 查询用户留言列表 | GET | `/api/user/contact/my` | 分页查询当前登录用户的留言记录 |

### 4.2 接口详情

#### 4.2.1 查询用户留言列表

**请求**：
```http
GET /api/user/contact/my?page=1&size=10
```

**响应**：
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "records": [
      {
        "id": 1,
        "subject": "租车咨询",
        "content": "请问有自动挡车型吗？",
        "status": 1,
        "reply": "您好，我们有多种自动挡车型可供选择...",
        "replyStatus": "已回复",
        "createdAt": "2024-01-15 10:30:00"
      }
    ],
    "total": 5,
    "current": 1,
    "size": 10
  }
}
```

### 4.3 需修改文件

1. **ContactController.java** - 新增 `getMyContacts` 接口
2. **ContactService.java** - 新增 `listUserContacts` 方法声明
3. **ContactServiceImpl.java** - 实现 `listUserContacts` 方法
4. **ContactResponseDTO.java** - 新增 `replyStatus` 字段（计算字段，不存数据库）

## 五、前端开发

### 5.1 需修改文件

1. **UserLayout.vue** - 在用户下拉菜单中添加"留言反馈"入口
2. **router/index.js** - 添加留言反馈页面路由
3. **src/api/user/contact.js** - 新增查询用户留言接口（如不存在则新建）

### 5.2 新增文件

1. **src/views/user/MyFeedback.vue** - 用户留言反馈列表页面

### 5.3 页面设计

#### 留言反馈列表页面

**布局**：
- 页面标题：留言反馈
- 筛选：按回复状态筛选（全部 / 未回复 / 已回复）
- 列表展示：
  - 主题
  - 内容（过长截断，点击展开）
  - 提交时间
  - 回复状态标签
  - 操作：查看详情

**详情弹窗**：
- 留言主题
- 留言内容
- 提交时间
- 回复状态
- 管理员回复（如有）

## 六、开发步骤

### 6.1 后端
1. ContactResponseDTO 新增 `replyStatus` 字段
2. ContactService 新增 `listUserContacts` 方法
3. ContactServiceImpl 实现查询逻辑
4. ContactController 新增接口

### 6.2 前端
1. 创建 API 接口文件
2. 创建留言反馈页面组件
3. 添加路由配置
4. 修改 UserLayout 添加菜单入口

## 七、注意事项

1. 用户只能查看自己提交的留言（通过 `user_id` 过滤）
2. 未登录用户提交的留言（`user_id` 为空）不会出现在用户反馈列表中
3. 回复状态为计算字段，根据 `reply` 是否有值动态判断
