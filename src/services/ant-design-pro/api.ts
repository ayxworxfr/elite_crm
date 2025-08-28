// @ts-ignore
/* eslint-disable */
import { handleRequest } from '@/services/ant-design-pro/response_handler';
import { TokenManager } from '@/services/auth/tokenManager';
import { API_BASE_URL } from '@/services/config';
import type { RequestData } from '@ant-design/pro-table/es';
import { request as mockRequest } from '@umijs/max';
import { extend } from 'umi-request';

const BASE_URL = API_BASE_URL;

const tokenManager = TokenManager.getInstance();

const request = extend({
  prefix: BASE_URL, // 设置基础 URL
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
request.interceptors.request.use((url, options) => {
  const token = tokenManager.getAccessToken();
  return {
    url,
    options: {
      ...options,
      headers: {
        ...options.headers,
        Authorization: token ? `Bearer ${token}` : '',
      },
    },
  };
});

// 使用中间件方式处理token刷新
request.use(async (ctx, next) => {
  await next();
  
  // 检查响应状态，如果是401则尝试刷新token
  if (ctx.res?.status === 401 && 
      !ctx.req.url.includes('/api/refresh')) {
    
    try {
      // 尝试刷新token
      const newToken = await tokenManager.refreshToken();
      
      // 更新请求头并重试原请求
      const retryOptions = {
        ...ctx.req.options,
        headers: {
          ...ctx.req.options.headers,
          Authorization: `Bearer ${newToken}`,
        },
      };
      
      // 重试原请求
      const retryResponse = await request(ctx.req.url, retryOptions);
      ctx.res = retryResponse;
    } catch (refreshError) {
      // 刷新失败，跳转登录页
      tokenManager.clearTokens();
      window.location.href = '/user/login';
      throw refreshError;
    }
  }
});


/**
 * 创建通用分页查询函数
 * @param apiPath - API路径
 * @param transformParams - 参数转换函数
 * @returns 分页查询函数
 */
export function createPageQuery<T, P extends object = {}>(
  apiPath: string,
  transformParams: (params: P & { current?: number; pageSize?: number }) => any = defaultTransformParams
) {
  return async (params: P & { current?: number; pageSize?: number }): Promise<Partial<RequestData<T>>> => {
    try {
      const response = await request(apiPath, {
        method: 'GET',
        params: transformParams(params),
      });

      return {
        total: response?.data?.total || 0,
        data: response?.data?.records || [],
      };
    } catch (error) {
      return {
        total: 0,
        data: [],
      };
    }
  };
}

/** 默认的参数转换函数 */
function defaultTransformParams(params: { current?: number; pageSize?: number } & Record<string, any>) {
  let result: Record<string, any> = {}; // 将 result 的类型设置为 Record<string, any>
  for (const key in params) {
    if (key !== 'current' && key !== 'pageSize') {
      result[key] = params[key];
    }
  }
  return {
    offset: (params.current! - 1) * params.pageSize!,
    limit: params.pageSize,
    ...result,
  };
}

/** 获取当前的用户 GET /api/currentUser */
export async function currentUser(options?: { [key: string]: any }) {
  return request<{
    data: API.CurrentUser;
  }>('/api/protected/user/current', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 退出登录接口 POST /api/login/outLogin */
export async function outLogin(options?: { [key: string]: any }) {
  return mockRequest<Record<string, any>>('/api/login/outLogin', {
    method: 'POST',
    ...(options || {}),
  });
}

/** 登录接口 POST /api/login/account */
export async function login_old(body: API.LoginParams, options?: { [key: string]: any }) {
  return mockRequest<API.LoginResult>('/api/login/account', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 刷新Token接口 POST /api/refresh */
export async function refreshToken(refreshToken: string) {
  return request<API.RefreshTokenResult>('/api/refresh/token', {
    method: 'POST',
    data: { refresh_token: refreshToken },
  });
}

export async function login(
  params: API.LoginParams
): Promise<API.APIResult<API.LoginResult> | null> {
  return handleRequest(
    async () => {
      return request<API.APIResult<API.LoginResult>>('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        data: params,
      });
    },
    (data) => {
      // 登录成功后的处理逻辑
      localStorage.setItem('role', data.currentAuthority ?? '');
      // 使用TokenManager设置token
      if (data.access_token && data.refresh_token) {
        tokenManager.setTokens(data.access_token, data.refresh_token);
      }
    }
  );
}

/** 此处后端没有提供注释 GET /api/notices */
export async function getNotices(options?: { [key: string]: any }) {
  return mockRequest<API.NoticeIconList>('/api/notices', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 获取规则列表 GET /api/rule */
export async function rule(
  params: {
    // query
    /** 当前的页码 */
    current?: number;
    /** 页面的容量 */
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  return mockRequest<API.RuleList>('/api/rule', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 更新规则 PUT /api/rule */
export async function updateRule(options?: { [key: string]: any }) {
  return mockRequest<API.RuleListItem>('/api/rule', {
    method: 'POST',
    data: {
      method: 'update',
      ...(options || {}),
    },
  });
}

/** 新建规则 POST /api/rule */
export async function addRule(options?: { [key: string]: any }) {
  return mockRequest<API.RuleListItem>('/api/rule', {
    method: 'POST',
    data: {
      method: 'post',
      ...(options || {}),
    },
  });
}

/** 删除规则 DELETE /api/rule */
export async function removeRule(options?: { [key: string]: any }) {
  return mockRequest<Record<string, any>>('/api/rule', {
    method: 'POST',
    data: {
      method: 'delete',
      ...(options || {}),
    },
  });
}

export const getRoleList = createPageQuery<API.Role>('/api/protected/role/list');

/**
 * 添加角色
 */
export async function addRole(data: API.Role) {
  return request('/api/protected/role', {
    method: 'POST',
    data,
  });
}

/**
 * 更新角色
 */
export async function updateRole(data: API.Role) {
  return request(`/api/protected/role`, {
    method: 'PUT',
    data,
  });
}

/**
 * 删除角色
 */
export async function removeRole(params: { ids: number[] }) {
  return request('/api/protected/role', {
    method: 'DELETE',
    data: params
  });
}


export async function getRolePermissionList(
  params: API.PageParams & { keyword?: string }
): Promise<API.Permission[]> {
  const response = await handleRequest(
    async () => {
      return request<API.APIResult<API.Permission[]>>('/api/protected/role/permissions', {
        method: 'GET',
        params: defaultTransformParams(params)
      });
    }
  );

  return response?.data ?? [];
}

/**
 * 获取权限列表
 */
export const getPermissionList = createPageQuery<API.Permission>('/api/protected/permission/list');

/**
 * 添加权限
 */
export async function addPermission(data: API.Permission) {
  return request('/api/protected/permission', {
    method: 'POST',
    data,
  });
}

/**
 * 更新权限
 */
export async function updatePermission(data: API.Permission) {
  return request(`/api/protected/permission`, {
    method: 'PUT',
    data,
  });
}

/**
 * 删除权限
 */
export async function removePermission(params: { ids: number[] }) {
  return request('/api/protected/permission', {
    method: 'DELETE',
    data: params
  });
}

/**
 * 用户管理
 */
export const getUserList = createPageQuery<API.User>('/api/protected/user/list');

export async function addUser(data: API.User) {
  return request('/api/protected/user', {
    method: 'POST',
    data,
  });
}

export async function updateUser(data: API.User) {
  return request('/api/protected/user', {
    method: 'PUT',
    data,
  });
}

export async function removeUser(params: { ids: number[] }) {
  return request('/api/protected/user', {
    method: 'DELETE',
    data: params,
  });
}

/**
 * 客户管理
 */
export const getCustomerList = createPageQuery<API.Customer>('/api/protected/customer/list');

/**
 * 获取销售机会列表
 */
export const getSalesOpportunityList = createPageQuery<API.SalesOpportunity>('/api/protected/sales/opportunity/list');

/**
 * 获取销售机会详情
 */
export async function getSalesOpportunity(id: number) {
  return request(`/api/protected/sales/opportunity`, {
    method: 'GET',
    params: { id },
  });
}

/**
 * 创建销售机会
 */
export async function addSalesOpportunity(data: API.SalesOpportunity) {
  return request('/api/protected/sales/opportunity', {
    method: 'POST',
    data,
  });
}

/**
 * 更新销售机会
 */
export async function updateSalesOpportunity(data: API.SalesOpportunity) {
  return request(`/api/protected/sales/opportunity`, {
    method: 'PUT',
    data,
  });
}

/**
 * 删除销售机会
 */
export async function removeSalesOpportunity(params: { ids: number[] }) {
  return request('/api/protected/sales/opportunity', {
    method: 'DELETE',
    data: params
  });
}

/**
 * 推进商机阶段
 */
export async function advanceOpportunityStage(data: { opportunity_id: number; new_status: number }) {
  return request('/api/protected/sales/opportunity/advance-stage', {
    method: 'POST',
    data,
  });
}

/**
 * 标记商机失败
 */
export async function loseOpportunity(data: { opportunity_id: number; reason: string }) {
  return request('/api/protected/sales/opportunity/lose', {
    method: 'POST',
    data,
  });
}

/**
 * 添加商机活动
 */
export async function addOpportunityActivity(data: { opportunity_id: number; action_type: string; description: string }) {
  return request('/api/protected/sales/opportunity/activity', {
    method: 'POST',
    data,
  });
}

/**
 * 获取销售分析数据
 */
export async function getSalesAnalytics(params: { start_date: string; end_date: string; owner_id?: number; department_id?: number; customer_id?: number; source_id?: number; group_by: string }) {
  return request('/api/protected/sales/opportunity/analytics', {
    method: 'GET',
    params,
  });
}

// ==================== 合同管理模块 ====================

/**
 * 获取合同列表
 */
export const getContractList = createPageQuery<API.Contract>('/api/protected/contract/list');

/**
 * 获取合同详情
 */
export async function getContract(id: number) {
  return request<API.APIResult<API.Contract>>(`/api/protected/contract`, {
    method: 'GET',
    params: { id },
  });
}

/**
 * 创建合同
 */
export async function createContract(data: API.CreateContractRequest) {
  return request<API.APIResult<API.Contract>>('/api/protected/contract', {
    method: 'POST',
    data,
  });
}

/**
 * 更新合同
 */
export async function updateContract(data: API.UpdateContractRequest) {
  return request<API.APIResult<API.Contract>>('/api/protected/contract', {
    method: 'PUT',
    data,
  });
}

/**
 * 删除合同
 */
export async function removeContract(params: { ids: number[] }) {
  return request<API.APIResult<null>>('/api/protected/contract', {
    method: 'DELETE',
    data: params,
  });
}

/**
 * 更新合同状态
 */
export async function updateContractStatus(data: { contract_id: number; status: number }) {
  return request<API.APIResult<API.Contract>>('/api/protected/contract/status', {
    method: 'PUT',
    data,
  });
}

/**
 * 获取合同项目条目列表
 */
export const getContractItemList = createPageQuery<API.ContractItem>('/api/protected/contract/item/list');

/**
 * 获取合同项目条目详情
 */
export async function getContractItem(id: number) {
  return request<API.APIResult<API.Contract>>(`/api/protected/contract/item`, {
    method: 'GET',
    params: { id },
  });
}

/**
 * 创建合同项目条目
 */
export async function createContractItem(data: Omit<API.ContractItem, 'item_id' | 'create_time' | 'update_time'>) {
  return request<API.APIResult<API.ContractItem>>('/api/protected/contract/item', {
    method: 'POST',
    data,
  });
}

/**
 * 更新合同项目条目
 */
export async function updateContractItem(data: Partial<API.ContractItem> & { item_id: number }) {
  return request<API.APIResult<API.ContractItem>>('/api/protected/contract/item', {
    method: 'PUT',
    data,
  });
}

/**
 * 删除合同项目条目
 */
export async function removeContractItem(params: { ids: number[] }) {
  return request<API.APIResult<null>>('/api/protected/contract/item', {
    method: 'DELETE',
    data: params,
  });
}