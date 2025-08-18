// 全局 API 基础地址配置
// 优先级：window.API_BASE_URL > 环境变量 > 默认值
// 说明：生产环境推荐通过 .env 或部署时注入 window.API_BASE_URL

const DEFAULT_API_BASE_URL = 'http://localhost:8888';

// Umi 中可通过 .env 文件注入，例如：UMI_APP_API_BASE_URL
// 这里同时兼容 process.env.API_BASE_URL 与 process.env.UMI_APP_API_BASE_URL
// 以及通过 window.API_BASE_URL 在运行时注入
const runtimeBaseUrl = (typeof window !== 'undefined' && (window as any).API_BASE_URL) || '';
const envBaseUrl = (process.env.API_BASE_URL || process.env.UMI_APP_API_BASE_URL || '').trim();

export const API_BASE_URL: string = (runtimeBaseUrl || envBaseUrl || DEFAULT_API_BASE_URL) as string;
