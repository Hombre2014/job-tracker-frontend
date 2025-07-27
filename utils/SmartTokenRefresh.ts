import TokenManager from './TokenManager';
import RequestQueue from './RequestQueue';
// import AuthErrorHandler from './AuthErrorHandler'; // Temporarily disabled to fix circular dependency

export interface RefreshConfig {
  refreshBufferMs: number; // How early to refresh before expiration
  maxRetries: number; // Max retry attempts for failed refresh
  retryDelayMs: number; // Delay between retry attempts
  visibilityCheckIntervalMs: number; // How often to check on visibility change
}

const DEFAULT_CONFIG: RefreshConfig = {
  refreshBufferMs: 60000, // 1 minute before expiration
  maxRetries: 3,
  retryDelayMs: 5000, // 5 seconds
  visibilityCheckIntervalMs: 30000, // 30 seconds
};

/**
 * Smart Token Refresh Manager
 * Handles proactive token refresh and production-specific scenarios
 */
class SmartTokenRefreshClass {
  private config: RefreshConfig;
  private refreshTimer: NodeJS.Timeout | null = null;
  private visibilityTimer: NodeJS.Timeout | null = null;
  private retryCount = 0;
  private isRefreshing = false;
  private isClient = typeof window !== 'undefined';

  constructor(config: Partial<RefreshConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };

    if (this.isClient) {
      this.setupVisibilityHandlers();
      this.startProactiveRefresh();
    }
  }

  /**
   * Setup visibility change handlers for dormancy detection
   */
  private setupVisibilityHandlers(): void {
    if (!this.isClient) return;

    // Handle page visibility changes (tab switching, app backgrounding)
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        this.handleAppBecameVisible();
      } else {
        this.handleAppBecameHidden();
      }
    });

    // Handle window focus/blur (additional layer)
    window.addEventListener('focus', () => {
      this.handleAppBecameVisible();
    });

    window.addEventListener('blur', () => {
      this.handleAppBecameHidden();
    });

    // Handle page unload cleanup
    window.addEventListener('beforeunload', () => {
      this.cleanup();
    });
  }

  /**
   * Handle app becoming visible (user returned)
   */
  private handleAppBecameVisible(): void {
    console.log('SmartTokenRefresh: App became visible, checking token status');

    // Clear any existing visibility timer
    if (this.visibilityTimer) {
      clearTimeout(this.visibilityTimer);
      this.visibilityTimer = null;
    }

    // Check if token needs refresh immediately
    this.checkAndRefreshToken();

    // Restart proactive refresh
    this.startProactiveRefresh();
  }

  /**
   * Handle app becoming hidden (user left)
   */
  private handleAppBecameHidden(): void {
    console.log(
      'SmartTokenRefresh: App became hidden, setting up periodic checks'
    );

    // Clear main refresh timer to save resources
    this.clearRefreshTimer();

    // Set up periodic checks while hidden (for long-running background tabs)
    this.visibilityTimer = setInterval(() => {
      this.checkAndRefreshToken();
    }, this.config.visibilityCheckIntervalMs);
  }

  /**
   * Perform token refresh with retry logic
   */
  private async performTokenRefresh(): Promise<boolean> {
    if (this.isRefreshing) {
      console.log('SmartTokenRefresh: Refresh already in progress');
      return false;
    }

    this.isRefreshing = true;

    try {
      const refreshToken = TokenManager.getRefreshToken();

      if (!refreshToken) {
        console.warn('SmartTokenRefresh: No refresh token available');
        return false;
      }

      console.log('SmartTokenRefresh: Starting proactive token refresh');

      // Use the same refresh logic as the axios client
      // Create timeout signal with fallback for older browsers
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${refreshToken}`,
              'Content-Type': 'application/json',
            },
            signal: controller.signal,
          }
        );

        clearTimeout(timeoutId);

        if (response.ok) {
          const data = await response.json();

          TokenManager.setTokens({
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
          });

          console.log('SmartTokenRefresh: Token refresh successful');
          this.retryCount = 0; // Reset retry count on success
          return true;
        } else {
          throw new Error(`Refresh failed with status: ${response.status}`);
        }
      } catch (fetchError) {
        clearTimeout(timeoutId);
        throw fetchError;
      }
    } catch (error) {
      console.error('SmartTokenRefresh: Token refresh failed:', error);

      this.retryCount++;

      if (this.retryCount < this.config.maxRetries) {
        console.log(
          `SmartTokenRefresh: Retrying in ${this.config.retryDelayMs}ms (attempt ${this.retryCount}/${this.config.maxRetries})`
        );

        setTimeout(() => {
          this.performTokenRefresh();
        }, this.config.retryDelayMs);
      } else {
        console.error(
          'SmartTokenRefresh: Max retries reached, clearing tokens'
        );
        TokenManager.clearTokens();

        if (this.isClient) {
          window.location.href = '/login';
        }
      }

      return false;
    } finally {
      this.isRefreshing = false;
    }
  }

  /**
   * Check if token needs refresh and perform it
   */
  private async checkAndRefreshToken(): Promise<void> {
    if (!TokenManager.hasValidTokens()) {
      console.log('SmartTokenRefresh: No valid tokens found');
      return;
    }

    const isExpired = TokenManager.isAccessTokenExpired(
      this.config.refreshBufferMs
    );

    if (isExpired) {
      console.log('SmartTokenRefresh: Token needs refresh');
      await this.performTokenRefresh();
    }
  }

  /**
   * Start proactive refresh timer
   */
  private startProactiveRefresh(): void {
    this.clearRefreshTimer();

    const timeUntilExpiration = TokenManager.getTimeUntilExpiration();

    if (!timeUntilExpiration) {
      console.log('SmartTokenRefresh: No token expiration info available');
      return;
    }

    // Calculate when to refresh (buffer time before expiration)
    const refreshTime = Math.max(
      timeUntilExpiration - this.config.refreshBufferMs,
      5000 // Minimum 5 seconds
    );

    console.log(
      `SmartTokenRefresh: Scheduling refresh in ${Math.round(
        refreshTime / 1000
      )} seconds`
    );

    this.refreshTimer = setTimeout(() => {
      this.checkAndRefreshToken().then(() => {
        // Schedule next refresh after successful refresh
        this.startProactiveRefresh();
      });
    }, refreshTime);
  }

  /**
   * Clear refresh timer
   */
  private clearRefreshTimer(): void {
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
      this.refreshTimer = null;
    }
  }

  /**
   * Clear visibility timer
   */
  private clearVisibilityTimer(): void {
    if (this.visibilityTimer) {
      clearInterval(this.visibilityTimer);
      this.visibilityTimer = null;
    }
  }

  /**
   * Manual token refresh trigger
   */
  async refreshNow(): Promise<boolean> {
    return this.performTokenRefresh();
  }

  /**
   * Get current refresh status
   */
  getStatus(): {
    isRefreshing: boolean;
    retryCount: number;
    hasValidTokens: boolean;
    timeUntilExpiration: number | null;
    nextRefreshIn: number | null;
  } {
    const timeUntilExpiration = TokenManager.getTimeUntilExpiration();
    const nextRefreshIn = timeUntilExpiration
      ? Math.max(timeUntilExpiration - this.config.refreshBufferMs, 0)
      : null;

    return {
      isRefreshing: this.isRefreshing,
      retryCount: this.retryCount,
      hasValidTokens: TokenManager.hasValidTokens(),
      timeUntilExpiration,
      nextRefreshIn,
    };
  }

  /**
   * Update configuration
   */
  updateConfig(newConfig: Partial<RefreshConfig>): void {
    this.config = { ...this.config, ...newConfig };

    // Restart with new config
    this.startProactiveRefresh();
  }

  /**
   * Restart the token refresh system (public method)
   */
  restart(): void {
    console.log('SmartTokenRefresh: Restarting token refresh system');
    this.clearRefreshTimer();
    this.clearVisibilityTimer();
    this.retryCount = 0;
    this.startProactiveRefresh();
  }

  /**
   * Cleanup timers and event listeners
   */
  cleanup(): void {
    this.clearRefreshTimer();
    this.clearVisibilityTimer();

    if (this.isClient) {
      document.removeEventListener(
        'visibilitychange',
        this.handleAppBecameVisible
      );
      window.removeEventListener('focus', this.handleAppBecameVisible);
      window.removeEventListener('blur', this.handleAppBecameHidden);
      window.removeEventListener('beforeunload', this.cleanup);
    }
  }

  /**
   * Debug method to log current state
   */
  debugState(): void {
    const status = this.getStatus();
    const tokenInfo = TokenManager.getAccessToken();

    console.log('SmartTokenRefresh State:', {
      ...status,
      config: this.config,
      hasRefreshTimer: !!this.refreshTimer,
      hasVisibilityTimer: !!this.visibilityTimer,
      tokenExists: !!tokenInfo,
      pageVisible: this.isClient
        ? document.visibilityState === 'visible'
        : 'unknown',
    });
  }
}

// Export singleton instance
export const SmartTokenRefresh = new SmartTokenRefreshClass();
export default SmartTokenRefresh;
