import { TOKEN_CONFIG } from './config';
import { TokenManager } from './tokenManager';

export class TokenMonitor {
  private static instance: TokenMonitor;
  private checkInterval: NodeJS.Timeout | null = null;
  private tokenManager = TokenManager.getInstance();

  static getInstance(): TokenMonitor {
    if (!TokenMonitor.instance) {
      TokenMonitor.instance = new TokenMonitor();
    }
    return TokenMonitor.instance;
  }

  start(): void {
    // 使用配置的检查间隔
    this.checkInterval = setInterval(() => {
      this.checkTokenValidity();
    }, TOKEN_CONFIG.checkInterval);
  }

  stop(): void {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
  }

  private async checkTokenValidity(): Promise<void> {
    if (this.tokenManager.isTokenExpired()) {
      try {
        await this.tokenManager.refreshToken();
        console.log('Token refreshed successfully');
      } catch (error) {
        console.error('Token refresh failed:', error);
      }
    }
  }
}
