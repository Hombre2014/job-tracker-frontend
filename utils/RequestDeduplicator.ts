/**
 * Request Deduplication System
 * Prevents duplicate API calls and provides intelligent caching
 */

interface PendingRequest {
  promise: Promise<any>;
  timestamp: number;
  requestKey: string;
}

interface CacheEntry {
  data: any;
  timestamp: number;
  expiresAt: number;
}

interface DeduplicationConfig {
  cacheTTL: number; // Cache time-to-live in milliseconds
  maxPendingRequests: number;
  enableCaching: boolean;
  debugMode: boolean;
}

const DEFAULT_CONFIG: DeduplicationConfig = {
  cacheTTL: 5 * 60 * 1000, // 5 minutes
  maxPendingRequests: 100,
  enableCaching: true,
  debugMode: process.env.NODE_ENV === 'development',
};

class RequestDeduplicatorClass {
  private pendingRequests = new Map<string, PendingRequest>();
  private cache = new Map<string, CacheEntry>();
  private config: DeduplicationConfig;

  constructor(config: Partial<DeduplicationConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    
    // Cleanup expired entries periodically
    setInterval(() => {
      this.cleanup();
    }, 60000); // Every minute
  }

  /**
   * Generate a unique key for the request
   */
  private generateRequestKey(
    method: string,
    url: string,
    data?: any,
    headers?: any
  ): string {
    const normalizedMethod = method.toUpperCase();
    const normalizedUrl = url.toLowerCase();
    
    // For GET requests, include query parameters in the key
    if (normalizedMethod === 'GET') {
      return `${normalizedMethod}:${normalizedUrl}`;
    }
    
    // For other methods, include data hash if present
    const dataHash = data ? this.hashObject(data) : '';
    const authHeader = headers?.Authorization || '';
    
    return `${normalizedMethod}:${normalizedUrl}:${dataHash}:${authHeader.slice(-10)}`;
  }

  /**
   * Simple object hash function
   */
  private hashObject(obj: any): string {
    const str = JSON.stringify(obj, Object.keys(obj).sort());
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString(36);
  }

  /**
   * Check if we have a cached response
   */
  private getCachedResponse(requestKey: string): any | null {
    if (!this.config.enableCaching) return null;
    
    const entry = this.cache.get(requestKey);
    if (!entry) return null;
    
    // Check if cache entry is still valid
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(requestKey);
      return null;
    }
    
    if (this.config.debugMode) {
      console.log(`RequestDeduplicator: Cache hit for ${requestKey}`);
    }
    
    return entry.data;
  }

  /**
   * Cache a response
   */
  private cacheResponse(requestKey: string, data: any): void {
    if (!this.config.enableCaching) return;
    
    const entry: CacheEntry = {
      data,
      timestamp: Date.now(),
      expiresAt: Date.now() + this.config.cacheTTL,
    };
    
    this.cache.set(requestKey, entry);
    
    if (this.config.debugMode) {
      console.log(`RequestDeduplicator: Cached response for ${requestKey}`);
    }
  }

  /**
   * Deduplicate a request
   */
  async deduplicateRequest<T>(
    requestFn: () => Promise<T>,
    method: string,
    url: string,
    data?: any,
    headers?: any
  ): Promise<T> {
    const requestKey = this.generateRequestKey(method, url, data, headers);
    
    // Check cache first
    const cachedResponse = this.getCachedResponse(requestKey);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Check if request is already pending
    const pendingRequest = this.pendingRequests.get(requestKey);
    if (pendingRequest) {
      if (this.config.debugMode) {
        console.log(`RequestDeduplicator: Deduplicating request ${requestKey}`);
      }
      return pendingRequest.promise;
    }
    
    // Create new request
    const promise = requestFn()
      .then((response) => {
        // Cache successful responses
        this.cacheResponse(requestKey, response);
        return response;
      })
      .finally(() => {
        // Remove from pending requests
        this.pendingRequests.delete(requestKey);
      });
    
    // Store pending request
    this.pendingRequests.set(requestKey, {
      promise,
      timestamp: Date.now(),
      requestKey,
    });
    
    if (this.config.debugMode) {
      console.log(`RequestDeduplicator: New request ${requestKey}`);
    }
    
    return promise;
  }

  /**
   * Cleanup expired entries
   */
  private cleanup(): void {
    const now = Date.now();
    
    // Cleanup expired cache entries
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        this.cache.delete(key);
      }
    }
    
    // Cleanup old pending requests (older than 5 minutes)
    for (const [key, request] of this.pendingRequests.entries()) {
      if (now - request.timestamp > 5 * 60 * 1000) {
        this.pendingRequests.delete(key);
      }
    }
    
    // Limit pending requests
    if (this.pendingRequests.size > this.config.maxPendingRequests) {
      const sortedRequests = Array.from(this.pendingRequests.entries())
        .sort(([, a], [, b]) => a.timestamp - b.timestamp);
      
      const toRemove = sortedRequests.slice(0, this.pendingRequests.size - this.config.maxPendingRequests);
      toRemove.forEach(([key]) => this.pendingRequests.delete(key));
    }
    
    if (this.config.debugMode && (this.cache.size > 0 || this.pendingRequests.size > 0)) {
      console.log(`RequestDeduplicator: Cache size: ${this.cache.size}, Pending: ${this.pendingRequests.size}`);
    }
  }

  /**
   * Clear all cache and pending requests
   */
  clear(): void {
    this.cache.clear();
    this.pendingRequests.clear();
    
    if (this.config.debugMode) {
      console.log('RequestDeduplicator: Cleared all cache and pending requests');
    }
  }

  /**
   * Get statistics
   */
  getStats(): {
    cacheSize: number;
    pendingRequests: number;
    cacheHitRate: number;
  } {
    return {
      cacheSize: this.cache.size,
      pendingRequests: this.pendingRequests.size,
      cacheHitRate: 0, // TODO: Implement hit rate tracking
    };
  }

  /**
   * Update configuration
   */
  updateConfig(newConfig: Partial<DeduplicationConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }
}

// Export singleton instance
export const RequestDeduplicator = new RequestDeduplicatorClass();
export default RequestDeduplicator;
