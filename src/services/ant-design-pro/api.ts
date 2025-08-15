// @ts-ignore
/* eslint-disable */
import { handleRequest } from '@/services/ant-design-pro/response_handler';
import type { RequestData } from '@ant-design/pro-table/es';
import { request as mockRequest } from '@umijs/max';
import { List } from 'lodash';
import { extend } from 'umi-request';

// 根据环境设置不同的API地址
const BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://crm.heron-sense.com' 
  : 'http://localhost:8888';

const request = extend({
  prefix: BASE_URL, // 设置基础 URL
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 添加拦截器
request.interceptors.request.use((url, options) => {
  const token = localStorage.getItem('access_token');
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
      localStorage.setItem('access_token', data.access_token ?? '');
      localStorage.setItem('refresh_token', data.refresh_token ?? '');
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
 * 获取客户列表
 */
export const getCustomerList = createPageQuery<API.Customer>('/api/protected/customer/list');

/**
 * 添加客户
 */
export async function addCustomer(data: API.CreateCustomerRequest): Promise<API.APIResult<any>> {
  return request('/api/protected/customer', {
    method: 'POST',
    data,
  });
}

/**
 * 更新客户
 */
export async function updateCustomer(data: API.UpdateCustomerRequest): Promise<API.APIResult<any>> {
  return request(`/api/protected/customer`, {
    method: 'PUT',
    data,
  });
}

/**
 * 删除客户
 */
export async function removeCustomer(params: { ids: number[] }) {
  return request('/api/protected/customer', {
    method: 'DELETE',
    data: params
  });
}