// @ts-ignore
/* eslint-disable */
import { handleRequest } from '@/services/ant-design-pro/response_handler';
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
  return request<Record<string, any>>('/api/login/outLogin', {
    method: 'POST',
    ...(options || {}),
  });
}

/** 登录接口 POST /api/login/account */
export async function login_old(body: API.LoginParams, options?: { [key: string]: any }) {
  return request<API.LoginResult>('/api/login/account', {
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
  return request<API.NoticeIconList>('/api/notices', {
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
  return request<API.RuleList>('/api/rule', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 更新规则 PUT /api/rule */
export async function updateRule(options?: { [key: string]: any }) {
  return request<API.RuleListItem>('/api/rule', {
    method: 'POST',
    data: {
      method: 'update',
      ...(options || {}),
    },
  });
}

/** 新建规则 POST /api/rule */
export async function addRule(options?: { [key: string]: any }) {
  return request<API.RuleListItem>('/api/rule', {
    method: 'POST',
    data: {
      method: 'post',
      ...(options || {}),
    },
  });
}

/** 删除规则 DELETE /api/rule */
export async function removeRule(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/rule', {
    method: 'POST',
    data: {
      method: 'delete',
      ...(options || {}),
    },
  });
}
