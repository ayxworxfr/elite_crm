# 国际化 (i18n) 使用指南

## 概述

本项目使用 `@umijs/max` 提供的国际化功能，支持中文和英文两种语言。

## 文件结构

```
src/locales/
├── zh-CN/           # 中文配置
│   ├── common.ts    # 通用配置
│   ├── pages.ts     # 页面配置
│   ├── menu.ts      # 菜单配置
│   └── ...
├── en-US/           # 英文配置
│   ├── common.ts    # 通用配置
│   ├── pages.ts     # 页面配置
│   ├── menu.ts      # 菜单配置
│   └── ...
└── index.ts         # 主入口文件
```

## 通用国际化配置 (common.ts)

### 设计原则

为了减少重复代码和提高维护性，我们创建了通用国际化配置，包含：

1. **通用状态** - 如：关闭、运行中、已上线、异常等
2. **通用操作** - 如：编辑、删除、添加、更新等
3. **通用字段标签** - 如：名称、编码、描述、状态等
4. **通用占位符** - 如：请输入名称、请选择等
5. **通用验证消息** - 如：必填项验证、长度限制等
6. **通用操作消息** - 如：添加中、更新中、删除中等
7. **通用提示** - 如：确认删除、操作成功等
8. **通用数量** - 如：已选择、项、总计等
9. **通用时间** - 如：今天、昨天、本周等
10. **通用按钮** - 如：提交、重置、搜索等

### 使用方式

#### 1. 在组件中使用

```tsx
import { useIntl } from '@umijs/max';

const MyComponent: React.FC = () => {
  const intl = useIntl();
  
  return (
    <div>
      {/* 使用通用状态 */}
      <span>{intl.formatMessage({ id: 'common.status.running' })}</span>
      
      {/* 使用通用操作 */}
      <button>{intl.formatMessage({ id: 'common.action.edit' })}</button>
      
      {/* 使用通用字段标签 */}
      <label>{intl.formatMessage({ id: 'common.field.name' })}</label>
      
      {/* 使用通用占位符 */}
      <input placeholder={intl.formatMessage({ id: 'common.placeholder.name' })} />
      
      {/* 使用通用验证消息 */}
      <span>{intl.formatMessage({ id: 'common.validation.nameRequired' })}</span>
      
      {/* 使用通用操作消息 */}
      <span>{intl.formatMessage({ id: 'common.message.adding' })}</span>
    </div>
  );
};
```

#### 2. 在表单验证中使用

```tsx
<ProFormText
  label={intl.formatMessage({ id: 'common.field.name' })}
  placeholder={intl.formatMessage({ id: 'common.placeholder.name' })}
  rules={[
    {
      required: true,
      message: intl.formatMessage({ id: 'common.validation.nameRequired' }),
    },
    {
      max: 50,
      message: intl.formatMessage({ id: 'common.validation.nameMax' }),
    },
  ]}
/>
```

#### 3. 在状态枚举中使用

```tsx
valueEnum: {
  0: {
    text: intl.formatMessage({ id: 'common.status.default' }),
    status: 'Default',
  },
  1: {
    text: intl.formatMessage({ id: 'common.status.running' }),
    status: 'Processing',
  },
}
```

#### 4. 在操作按钮中使用

```tsx
<Button onClick={handleEdit}>
  {intl.formatMessage({ id: 'common.action.edit' })}
</Button>

<Button onClick={handleDelete}>
  {intl.formatMessage({ id: 'common.action.delete' })}
</Button>
```

## 页面特定国际化配置

对于页面特定的内容，仍然使用 `pages.` 前缀：

```tsx
// 页面标题
intl.formatMessage({ id: 'pages.role.list.title' })

// 页面特定字段
intl.formatMessage({ id: 'pages.role.field.roleType' })

// 页面特定验证
intl.formatMessage({ id: 'pages.role.validation.roleTypeRequired' })
```

## 最佳实践

### 1. 优先使用通用配置

```tsx
// ✅ 推荐：使用通用配置
intl.formatMessage({ id: 'common.field.name' })

// ❌ 不推荐：重复定义
intl.formatMessage({ id: 'pages.role.field.name' })
```

### 2. 保持键名一致性

```tsx
// 字段标签
'common.field.name'
'common.field.code'
'common.field.description'

// 验证消息
'common.validation.nameRequired'
'common.validation.codeRequired'
'common.validation.descriptionRequired'
```

### 3. 使用语义化的键名

```tsx
// ✅ 推荐：语义化键名
'common.action.batchDelete'
'common.message.addSuccess'

// ❌ 不推荐：缩写键名
'common.act.batchDel'
'common.msg.addSuc'
```

### 4. 分组管理

```tsx
// 按功能分组
'common.status.*'      // 状态相关
'common.action.*'      // 操作相关
'common.field.*'       // 字段相关
'common.validation.*'  // 验证相关
'common.message.*'     // 消息相关
```

## 添加新的通用配置

### 1. 在 `src/locales/zh-CN/common.ts` 中添加中文配置

```tsx
export default {
  // ... 现有配置
  
  // 新增配置
  'common.newCategory.key': '中文值',
};
```

### 2. 在 `src/locales/en-US/common.ts` 中添加英文配置

```tsx
export default {
  // ... 现有配置
  
  // 新增配置
  'common.newCategory.key': 'English Value',
};
```

### 3. 确保键名一致

```tsx
// 中文
'common.newCategory.key': '中文值'

// 英文
'common.newCategory.key': 'English Value'
```

## 注意事项

1. **键名唯一性**：确保所有国际化键名在项目中是唯一的
2. **类型安全**：使用 TypeScript 时，建议为国际化键名创建类型定义
3. **性能考虑**：`intl.formatMessage` 会缓存结果，但避免在渲染函数中重复调用
4. **默认值**：为重要的国际化键提供默认值，避免显示键名
5. **测试覆盖**：确保国际化配置在不同语言环境下都能正常工作

## 示例项目

参考以下组件的国际化实现：
- `src/pages/RoleList/index.tsx` - 角色管理
- `src/pages/PermissionList/index.tsx` - 权限管理
- `src/pages/SalesOpportunityList/index.tsx` - 销售机会管理
