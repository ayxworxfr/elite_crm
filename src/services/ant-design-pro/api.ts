// @ts-ignore
/* eslint-disable */
import { handleRequest } from '@/services/ant-design-pro/response_handler';
import type { RequestData } from '@ant-design/pro-table/es';
import { request as mockRequest } from '@umijs/max';
import { extend } from 'umi-request';

const BASE_URL = 'http://localhost:8888';

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

export async function getRoleList(
  params: API.PageParams & { keyword?: string }
): Promise<Partial<RequestData<API.Role>>> {
  const response = await handleRequest(
    async () => {
      return request<API.APIResult<API.Role[]>>('/api/protected/role/list', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        params: {
          // 转换 ProTable 参数到 getRoleList 期望的参数
          offset: (params.current! - 1) * params.pageSize!,
          limit: params.pageSize,
          // 添加其他需要的参数
          ...params,
        }
      });
    }
  );

  if (!response) {
    return {
      total: 0,
      data: []
    }
  }

  return {
    total: 100,
    data: response.data,
  };
}


/**
 * 获取权限列表
 */
export async function getPermissionList(params: API.PermissionPageParams) {
  return request<API.APIResult<API.Permission[]>>('/api/protected/permission/list', {
    method: 'GET',
    params: {
      offset: (params.current! - 1) * params.pageSize!,
      limit: params.pageSize,
      keyword: params.keyword,
      status: params.status,
    },
  });
}

/**
 * 添加权限
 */
export async function addPermission(data: API.Permission) {
  return request('/api/protected/permission/add', {
    method: 'POST',
    data,
  });
}

/**
 * 更新权限
 */
export async function updatePermission(data: API.Permission) {
  return request(`/api/protected/permission/${data.ID}`, {
    method: 'PUT',
    data,
  });
}

/**
 * 删除权限
 */
export async function removePermission(params: { ids: number[] }) {
  return request('/api/protected/permission/delete', {
    method: 'DELETE',
    params,
  });
}