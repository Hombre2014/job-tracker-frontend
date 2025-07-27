import { store } from '@/redux/store';
import { updateUserTokens } from '@/redux/user/userSlice';

// Storage key constants for maintainability
const STORAGE_KEYS = {
  USER: 'user',
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
} as const;

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface TokenInfo {
  token: string;
  expiresAt: number;
  isExpired: boolean;
  expiresInMs: number;
}

/**
 * Centralized Token Manager
 * Single source of truth for all token operations
 * Handles localStorage ↔ Redux synchronization
 */
class TokenManagerClass {
  private isClient = typeof window !== 'undefined';

  /**
   * Get token expiration timestamp from JWT
   */
  private getTokenExpiration(token: string): number | null {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp ? payload.exp * 1000 : null;
    } catch {
      return null;
    }
  }

  /**
   * Get access token from localStorage
   */
  getAccessToken(): string | null {
    if (!this.isClient) return null;
    return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  }

  /**
   * Get refresh token from localStorage
   */
  getRefreshToken(): string | null {
    if (!this.isClient) return null;
    return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
  }

  /**
   * Get both tokens as a pair
   */
  getTokenPair(): TokenPair | null {
    const accessToken = this.getAccessToken();
    const refreshToken = this.getRefreshToken();

    if (!accessToken || !refreshToken) return null;

    return { accessToken, refreshToken };
  }

  /**
   * Get detailed token information including expiration
   */
  getTokenInfo(token: string): TokenInfo | null {
    if (!token) return null;

    const expiresAt = this.getTokenExpiration(token);
    if (!expiresAt) return null;

    const now = Date.now();
    const expiresInMs = expiresAt - now;
    const isExpired = expiresInMs <= 0;

    return {
      token,
      expiresAt,
      isExpired,
      expiresInMs,
    };
  }

  /**
   * Check if access token is expired or about to expire
   */
  isAccessTokenExpired(bufferMs: number = 60000): boolean {
    const accessToken = this.getAccessToken();
    if (!accessToken) return true;

    const tokenInfo = this.getTokenInfo(accessToken);
    if (!tokenInfo) return true;

    // Consider expired if within buffer time (default 1 minute)
    return tokenInfo.expiresInMs <= bufferMs;
  }

  /**
   * Set tokens in both localStorage and Redux
   * This ensures synchronization between storage and state
   */
  setTokens(tokens: TokenPair): void {
    if (!this.isClient) return;

    // Update localStorage
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, tokens.accessToken);
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, tokens.refreshToken);

    // Update Redux state
    store.dispatch(
      updateUserTokens({
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      })
    );
  }

  /**
   * Clear all tokens from localStorage and Redux
   */
  clearTokens(): void {
    if (!this.isClient) return;

    // Clear localStorage
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);

    // Clear Redux state
    store.dispatch(
      updateUserTokens({
        accessToken: '',
        refreshToken: '',
      })
    );
  }

  /**
   * Validate token format (basic JWT structure check)
   */
  isValidTokenFormat(token: string): boolean {
    if (!token) return false;
    const parts = token.split('.');
    return parts.length === 3;
  }

  /**
   * Get authorization header value
   */
  getAuthHeader(): string | null {
    const accessToken = this.getAccessToken();
    return accessToken ? `Bearer ${accessToken}` : null;
  }

  /**
   * Check if user has valid tokens
   */
  hasValidTokens(): boolean {
    const tokens = this.getTokenPair();
    if (!tokens) return false;

    return (
      this.isValidTokenFormat(tokens.accessToken) &&
      this.isValidTokenFormat(tokens.refreshToken)
    );
  }

  /**
   * Sync tokens from localStorage to Redux (useful on app startup)
   */
  syncTokensToRedux(): void {
    const tokens = this.getTokenPair();
    if (tokens) {
      store.dispatch(updateUserTokens(tokens));
    }
  }

  /**
   * Get time until token expires (in milliseconds)
   */
  getTimeUntilExpiration(): number | null {
    const accessToken = this.getAccessToken();
    if (!accessToken) return null;

    const tokenInfo = this.getTokenInfo(accessToken);
    return tokenInfo ? tokenInfo.expiresInMs : null;
  }

  /**
   * Debug method to log current token state
   */
  debugTokenState(): void {
    if (!this.isClient) {
      console.log('TokenManager: Running on server, no tokens available');
      return;
    }

    const tokens = this.getTokenPair();
    if (!tokens) {
      console.log('TokenManager: No tokens found');
      return;
    }

    const accessTokenInfo = this.getTokenInfo(tokens.accessToken);
    const refreshTokenInfo = this.getTokenInfo(tokens.refreshToken);

    console.log('TokenManager State:', {
      hasTokens: !!tokens,
      accessToken: {
        exists: !!tokens.accessToken,
        valid: this.isValidTokenFormat(tokens.accessToken),
        expired: accessTokenInfo?.isExpired,
        expiresInMs: accessTokenInfo?.expiresInMs,
      },
      refreshToken: {
        exists: !!tokens.refreshToken,
        valid: this.isValidTokenFormat(tokens.refreshToken),
        expired: refreshTokenInfo?.isExpired,
        expiresInMs: refreshTokenInfo?.expiresInMs,
      },
    });
  }
}

// Export singleton instance
export const TokenManager = new TokenManagerClass();
export default TokenManager;
