# 联系我们功能实现计划

## Context
用户需要实现"联系我们"页面，前后端都没有做。功能包括：留言表单、联系信息展示、高德地图定位。

## 实现方案

### 后端实现

**1. 数据库表设计（直接执行以下SQL）**

```sql
CREATE TABLE contacts (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT COMMENT '用户ID（可空，未登录用户也可留言）',
    name VARCHAR(50) NOT NULL COMMENT '联系人姓名',
    phone VARCHAR(20) COMMENT '联系电话',
    email VARCHAR(100) COMMENT '邮箱',
    subject VARCHAR(100) NOT NULL COMMENT '留言主题',
    content TEXT NOT NULL COMMENT '留言内容',
    status TINYINT DEFAULT 0 COMMENT '状态：0-未处理，1-已处理',
    reply TEXT COMMENT '管理员回复',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) COMMENT '联系留言表';
```

**2. 需要创建的文件**

| 文件路径 | 说明 |
|---------|------|
| `entity/Contact.java` | 联系留言实体 |
| `mapper/ContactMapper.java` | Mapper接口 |
| `dto/request/ContactCreateDTO.java` | 创建留言请求DTO |
| `dto/request/ContactQueryDTO.java` | 查询留言请求DTO |
| `dto/response/ContactResponseDTO.java` | 留言响应DTO |
| `service/ContactService.java` | 服务接口 |
| `service/impl/ContactServiceImpl.java` | 服务实现 |
| `controller/user/ContactController.java` | 用户端控制器（提交留言） |
| `controller/admin/ContactAdminController.java` | 管理端控制器（查看/回复留言） |

**3. API接口设计**

用户端：
- `POST /api/user/contact` - 提交留言（无需登录）

管理端：
- `GET /api/admin/contacts` - 分页查询留言列表
- `PUT /api/admin/contacts/{id}/reply` - 回复留言
- `PUT /api/admin/contacts/{id}/status` - 更新状态

### 前端实现

**1. 路由配置**
- `/contact` - 联系我们页面

**2. 需要创建的文件**

| 文件路径 | 说明 |
|---------|------|
| `src/views/user/Contact.vue` | 联系我们页面 |
| `src/api/user/contact.js` | 用户端API |

**3. 页面内容**
- **头部**：页面标题和简介
- **联系信息卡片**：
  - 电话号码
  - 邮箱地址
  - 公司地址
  - 营业时间
- **地图区域**：使用高德地图展示位置
- **留言表单**：
  - 姓名、电话、邮箱
  - 留言主题
  - 留言内容
  - 提交按钮

## 文件修改清单

### 后端新建文件（9个）
1. `entity/Contact.java`
2. `mapper/ContactMapper.java`
3. `dto/request/ContactCreateDTO.java`
4. `dto/request/ContactQueryDTO.java`
5. `dto/response/ContactResponseDTO.java`
6. `service/ContactService.java`
7. `service/impl/ContactServiceImpl.java`
8. `controller/user/ContactController.java`
9. `controller/admin/ContactAdminController.java`

### 前端新建文件（2个）
1. `src/views/user/Contact.vue`
2. `src/api/user/contact.js`

### 前端修改文件（1个）
1. `src/router/index.js` - 添加/contact路由

## 验证方式
1. 启动后端，执行SQL创建表
2. 访问前端/contact页面
3. 检查地图是否正常显示
4. 提交留言，检查数据库是否有新记录
5. 管理端查看留言列表
