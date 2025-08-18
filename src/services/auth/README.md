# 🔐 Token自动刷新功能使用说明

## 功能概述

本功能实现了JWT Token的自动刷新机制，当Token过期时，系统会自动使用Refresh Token获取新的Access Token，并重试失败的请求，用户完全无感知。

## 🚀 主要特性

- ✅ **自动刷新**：检测到401错误时自动刷新Token
- ✅ **智能重试**：刷新成功后自动重试失败的请求
- ✅ **防重复刷新**：同一时间只允许一个刷新请求
- ✅ **定时检查**：定期检查Token有效性
- ✅ **安全退出**：刷新失败时自动跳转登录页
- ✅ **配置化**：所有参数都可以通过配置文件调整

## 📁 文件结构

```
src/services/auth/
├── config.ts          # 配置文件
├── tokenManager.ts    # Token管理器
├── tokenMonitor.ts    # Token监控器
└── README.md         # 使用说明
```

## 🔧 配置说明

### 基础配置 (config.ts)

```typescript
export const TOKEN_CONFIG = {
  // 提前5分钟刷新token
  refreshThreshold: 5 * 60 * 1000,
  
  // 检查间隔（5分钟）
  checkInterval: 5 * 60 * 1000,
  
  // 是否自动刷新
  autoRefresh: true,
  
  // 刷新token的API路径
  refreshApiPath: '/api/refresh/token',
  
  // 登录页面路径
  loginPath: '/user/login',
};
```

## 📖 使用方法

### 1. 自动使用（推荐）

系统已经集成，无需额外代码：

```typescript
// 登录成功后，Token会自动存储
const result = await login(username, password);

// 后续所有API请求都会自动携带Token
// 如果Token过期，系统会自动刷新并重试
const userInfo = await currentUser();
```

### 2. 手动管理Token

```typescript
import { TokenManager } from '@/services/auth/tokenManager';

const tokenManager = TokenManager.getInstance();

// 设置Token
tokenManager.setTokens(accessToken, refreshToken);

// 获取Token
const token = tokenManager.getAccessToken();

// 检查是否过期
const isExpired = tokenManager.isTokenExpired();

// 手动刷新
const newToken = await tokenManager.refreshToken();

// 清除Token
tokenManager.clearTokens();
```

### 3. 启动Token监控

```typescript
import { TokenMonitor } from '@/services/auth/tokenMonitor';

// 启动监控（应用启动时自动执行）
TokenMonitor.getInstance().start();

// 停止监控
TokenMonitor.getInstance().stop();
```

## 🔄 工作流程

1. **请求发送**：所有API请求自动携带Access Token
2. **响应检查**：检查响应状态码
3. **Token过期**：如果返回401错误
4. **自动刷新**：使用Refresh Token获取新Token
5. **重试请求**：使用新Token重试原请求
6. **返回结果**：返回成功响应给用户

## 🛡️ 安全特性

- **防重复刷新**：避免多个请求同时刷新Token
- **自动清理**：刷新失败时自动清除所有Token
- **重定向保护**：防止无限重定向循环
- **错误处理**：完善的错误处理和用户提示

## 📝 注意事项

1. **后端支持**：需要后端提供`/api/refresh/token`接口
2. **Token格式**：Refresh Token需要包含在登录响应中
3. **存储方式**：Token存储在localStorage中
4. **自动启动**：应用启动时自动启动Token监控

## 🐛 故障排除

### 常见问题

1. **Token刷新失败**
   - 检查Refresh Token是否有效
   - 确认后端刷新接口是否正常
   - 查看浏览器控制台错误信息

2. **无限重定向**
   - 检查登录页面路径配置
   - 确认Token清除逻辑是否正确

3. **请求仍然失败**
   - 检查网络请求拦截器配置
   - 确认Token格式是否正确

### 调试模式

```typescript
// 在浏览器控制台中查看Token状态
const tokenManager = TokenManager.getInstance();
console.log('Access Token:', tokenManager.getAccessToken());
console.log('Refresh Token:', tokenManager.getRefreshToken());
console.log('Token Expired:', tokenManager.isTokenExpired());
```

## 🔄 更新日志

- **v1.0.0**：基础自动刷新功能
- **v1.1.0**：添加配置化管理
- **v1.2.0**：完善错误处理和监控

## 📞 技术支持

如有问题，请检查：
1. 浏览器控制台错误信息
2. 网络请求状态
3. Token存储状态
4. 配置文件设置
