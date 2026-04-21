---
name: method-signature-check
description: 在调用现有方法前，必须先确认方法签名（返回类型、参数类型），防止类型不匹配错误。适用于调用Service层方法、Mapper方法、或任何现有API时。
---

# 方法签名检查

## 核心规则

**在调用任何现有方法前，必须先查看该方法的签名。**

## 检查清单

### 1. 调用 Service 层方法时
- 使用 Grep 或 Read 工具查看 Service 接口定义
- 确认返回类型是 **实体(Entity)** 还是 **DTO**
- 确认参数类型和数量

### 2. 调用 Mapper 层方法时
- 查看 Mapper 接口定义
- 确认返回类型（实体、列表、分页对象等）

### 3. 调用工具类方法时
- 查看工具类的方法签名
- 确认静态方法还是实例方法
- 确认返回类型

## 常见错误示例

### 错误：假设返回类型
```java
// 错误：假设 getUserById 返回 User 实体
User user = userService.getUserById(id);

// 实际：该方法返回 UserInfoDTO
UserInfoDTO user = userService.getUserById(id);
```

### 正确做法
```java
// 先查看 Service 接口
// public interface UserService {
//     UserInfoDTO getUserById(Long id);  // 返回 DTO，不是实体
// }

// 然后正确使用
UserInfoDTO user = userService.getUserById(id);
```

## 执行步骤

1. **识别要调用的方法** - 明确方法名和所属类
2. **查找方法定义** - 使用 Grep 搜索接口或类文件
3. **确认签名** - 检查返回类型、参数类型、参数数量
4. **正确调用** - 使用正确的类型接收返回值

## 特别注意

- `getXxx` 方法可能返回 DTO 而非实体
- `listXxx` 方法可能返回 `Page<T>` 或 `List<T>`
- 分页方法的页码从 0 还是从 1 开始
- 枚举类型的方法参数（如状态值）

## 适用场景

- 在 Controller 中调用 Service 方法
- 在 Service 中调用其他 Service 或 Mapper 方法
- 在任何地方调用工具类方法
- 使用不熟悉的 API 时
