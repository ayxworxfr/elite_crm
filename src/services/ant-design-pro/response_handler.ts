import { message } from 'antd';

/**
 * 判断API请求是否成功
 * @param result API响应结果
 * @returns 是否成功
 */
export function isRequestSuccess<T>(result: API.APIResult<T>): boolean {
  return result.code >= 100000 && result.code < 200000;
}

/**
 * 处理成功的API响应
 * @param result API响应结果
 * @param onSuccess 成功回调函数
 */
export function handleSuccess<T>(
  result: API.APIResult<T>,
  onSuccess?: (data: T) => void
): void {
  if (isRequestSuccess(result)) {
    onSuccess?.(result.data);
    // message.success(result.message || '操作成功');
  } else {
    handleError(result);
  }
}

/**
 * 处理失败的API响应
 * @param result API响应结果
 * @param onError 错误回调函数
 */
export function handleError<T>(
  result: API.APIResult<T>,
  onError?: (error: string) => void
): void {
  const errorMessage = result.message || '操作失败，请稍后再试';
  message.error(errorMessage);
  onError?.(errorMessage);
}

/**
 * 通用API请求处理函数
 * @param requestFn API请求函数
 * @param onSuccess 成功回调
 * @param onError 失败回调
 * @returns 请求结果
 */
export async function handleRequest<T>(
  requestFn: () => Promise<API.APIResult<T>>,
  onSuccess?: (data: T) => void,
  onError?: (error: string) => void
): Promise<API.APIResult<T> | null> {
  try {
    const result = await requestFn();
    handleSuccess(result, onSuccess);
    return result;
  } catch (error: any) {
    const errorMessage = error.message || '请求失败，请检查网络连接';
    message.error(errorMessage);
    onError?.(errorMessage);
    return null;
  }
}