import { API_BASE_URL } from '@/services/config';
import { request } from '@umijs/max';
import { TOKEN_CONFIG } from './config';

export class TokenManager {
  private static instance: TokenManager;
  private refreshPromise: Promise<string> | null = null;

  static getInstance(): TokenManager {
    if (!TokenManager.instance) {
      TokenManager.instance = new TokenManager();
    }
    return TokenManager.instance;
  }

  // 获取访问令牌
  getAccessToken(): string | null {
    return localStorage.getItem(TOKEN_CONFIG.storageKeys.accessToken);
  }

  // 获取刷新令牌
  getRefreshToken(): string | null {
    return localStorage.getItem(TOKEN_CONFIG.storageKeys.refreshToken);
  }

  // 设置令牌
  setTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem(TOKEN_CONFIG.storageKeys.accessToken, accessToken);
    localStorage.setItem(TOKEN_CONFIG.storageKeys.refreshToken, refreshToken);
  }

  // 清除令牌
  clearTokens(): void {
    localStorage.removeItem(TOKEN_CONFIG.storageKeys.accessToken);
    localStorage.removeItem(TOKEN_CONFIG.storageKeys.refreshToken);
    localStorage.removeItem(TOKEN_CONFIG.storageKeys.role);
  }

  // 检查令牌是否过期
  isTokenExpired(): boolean {
    const token = this.getAccessToken();
    if (!token) return true;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  }

  // 刷新令牌
  async refreshToken(): Promise<string> {
    // 防止重复刷新
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    this.refreshPromise = this.performRefresh();
    try {
      const newToken = await this.refreshPromise;
      return newToken;
    } finally {
      this.refreshPromise = null;
    }
  }

  private async performRefresh(): Promise<string> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      const response = await request<API.APIResult<API.RefreshTokenResult>>(
        `${API_BASE_URL}${TOKEN_CONFIG.refreshApiPath}`, {
          method: 'POST',
          data: { refresh_token: refreshToken },
        });

      const data = response.data;
      if (!response) {
        throw new Error('Refresh failed');
      }

      if (data.access_token) {
        this.setTokens(data.access_token, data.refresh_token || refreshToken);
        return data.access_token;
      } else {
        throw new Error('Invalid refresh response');
      }
    } catch (error) {
      this.clearTokens();
      window.location.href = TOKEN_CONFIG.loginPath;
      throw error;
    }
  }
}
