// Token相关配置
export const TOKEN_CONFIG = {
  // 提前5分钟刷新token
  refreshThreshold: 5 * 60 * 1000,
  
  // 最大重试次数
  maxRetries: 3,
  
  // 检查间隔（5分钟）
  checkInterval: 5 * 60 * 1000,
  
  // 是否自动刷新
  autoRefresh: true,
  
  // 刷新token的API路径
  refreshApiPath: '/api/refresh/token',
  
  // 登录页面路径
  loginPath: '/user/login',
  
  // 本地存储的key
  storageKeys: {
    accessToken: 'access_token',
    refreshToken: 'refresh_token',
    role: 'role',
  },
  
  // 请求头名称
  headerNames: {
    authorization: 'Authorization',
    contentType: 'Content-Type',
  },
  
  // 错误状态码
  errorCodes: {
    unauthorized: 401,
    forbidden: 403,
  },
};
