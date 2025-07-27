import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

export interface QueuedRequest {
  id: string;
  config: AxiosRequestConfig;
  resolve: (value: AxiosResponse) => void;
  reject: (reason: any) => void;
  retryCount: number;
  timestamp: number;
}

export interface RefreshPromiseInfo {
  promise: Promise<string>;
  timestamp: number;
}

export interface QueueStatus {
  isRefreshing: boolean;
  queueLength: number;
  refreshTimestamp: number | null;
  isRefreshStale: boolean;
}

export interface QueuedRequestInfo {
  id: string;
  url?: string;
  method?: string;
  retryCount: number;
  age: number;
}

/**
 * Request Queue Manager
 * Handles request queuing during token refresh to prevent race conditions
 * Ensures no requests are lost during authentication renewal
 */
class RequestQueueClass {
  private queue: QueuedRequest[] = [];
  private isRefreshing = false;
  private refreshPromise: RefreshPromiseInfo | null = null;
  private readonly maxRetries = 3;
  private readonly maxQueueSize = 50;
  private readonly requestTimeout = 30000; // 30 seconds
  private readonly refreshTimeout = 10000; // 10 seconds for refresh

  /**
   * Generate unique request ID
   */
  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Add request to queue
   */
  private addToQueue(config: AxiosRequestConfig): Promise<AxiosResponse> {
    return new Promise((resolve, reject) => {
      // Check queue size limit
      if (this.queue.length >= this.maxQueueSize) {
        reject(new Error('Request queue is full. Please try again later.'));
        return;
      }

      const queuedRequest: QueuedRequest = {
        id: this.generateRequestId(),
        config,
        resolve,
        reject,
        retryCount: 0,
        timestamp: Date.now(),
      };

      this.queue.push(queuedRequest);

      // Set timeout for queued request
      setTimeout(() => {
        this.removeFromQueue(queuedRequest.id, 'Request timeout');
      }, this.requestTimeout);
    });
  }

  /**
   * Remove request from queue
   */
  private removeFromQueue(requestId: string, reason?: string): void {
    const index = this.queue.findIndex((req) => req.id === requestId);
    if (index !== -1) {
      const request = this.queue[index];
      this.queue.splice(index, 1);

      if (reason) {
        request.reject(new Error(reason));
      }
    }
  }

  /**
   * Process all queued requests with new token
   */
  private async processQueue(newAccessToken: string): Promise<void> {
    const requestsToProcess = [...this.queue];
    this.queue = [];

    const processPromises = requestsToProcess.map(async (queuedRequest) => {
      try {
        // Update request with new token
        const updatedConfig = {
          ...queuedRequest.config,
          headers: {
            ...queuedRequest.config.headers,
            Authorization: `Bearer ${newAccessToken}`,
          },
        };

        // Retry the request
        const response = await axios(updatedConfig);
        queuedRequest.resolve(response);
      } catch (error) {
        // Handle retry logic
        if (queuedRequest.retryCount < this.maxRetries) {
          queuedRequest.retryCount++;
          this.queue.push(queuedRequest);
        } else {
          queuedRequest.reject(error);
        }
      }
    });

    await Promise.allSettled(processPromises);
  }

  /**
   * Reject all queued requests with error
   */
  private rejectAllQueued(error: any): void {
    const requestsToReject = [...this.queue];
    this.queue = [];

    requestsToReject.forEach((request) => {
      request.reject(error);
    });
  }

  /**
   * Check if refresh promise is stale
   */
  private isRefreshPromiseStale(): boolean {
    if (!this.refreshPromise) return false;
    return Date.now() - this.refreshPromise.timestamp > this.refreshTimeout;
  }

  /**
   * Set refresh promise
   */
  setRefreshPromise(promise: Promise<string>): void {
    this.isRefreshing = true;
    this.refreshPromise = {
      promise,
      timestamp: Date.now(),
    };

    // Handle refresh completion
    promise
      .then(async (newAccessToken) => {
        await this.processQueue(newAccessToken);
      })
      .catch((error) => {
        this.rejectAllQueued(error);
      })
      .finally(() => {
        this.isRefreshing = false;
        this.refreshPromise = null;
      });
  }

  /**
   * Add request to queue or wait for existing refresh
   */
  async enqueueRequest(config: AxiosRequestConfig): Promise<AxiosResponse> {
    // If not refreshing, this shouldn't be called
    if (!this.isRefreshing) {
      throw new Error('Request queue called when not refreshing');
    }

    // If refresh promise is stale, reject
    if (this.isRefreshPromiseStale()) {
      throw new Error('Token refresh timeout');
    }

    // Add to queue and wait
    return this.addToQueue(config);
  }

  /**
   * Wait for existing refresh to complete
   */
  async waitForRefresh(): Promise<string> {
    if (!this.refreshPromise) {
      throw new Error('No refresh in progress');
    }

    // Check if refresh promise is stale
    if (this.isRefreshPromiseStale()) {
      this.isRefreshing = false;
      this.refreshPromise = null;
      throw new Error('Token refresh timeout');
    }

    return this.refreshPromise.promise;
  }

  /**
   * Check if currently refreshing
   */
  isCurrentlyRefreshing(): boolean {
    return this.isRefreshing && !this.isRefreshPromiseStale();
  }

  /**
   * Get queue status for debugging
   */
  getQueueStatus(): QueueStatus {
    return {
      isRefreshing: this.isRefreshing,
      queueLength: this.queue.length,
      refreshTimestamp: this.refreshPromise?.timestamp || null,
      isRefreshStale: this.isRefreshPromiseStale(),
    };
  }

  /**
   * Clear queue and reset state (for cleanup)
   */
  reset(): void {
    this.rejectAllQueued(new Error('Request queue reset'));
    this.isRefreshing = false;
    this.refreshPromise = null;
  }

  /**
   * Get retry delay with exponential backoff
   */
  private getRetryDelay(retryCount: number): number {
    const baseDelay = 1000; // 1 second
    const maxDelay = 10000; // 10 seconds
    const delay = Math.min(baseDelay * Math.pow(2, retryCount), maxDelay);

    // Add jitter to prevent thundering herd
    const jitter = Math.random() * 0.1 * delay;
    return delay + jitter;
  }

  /**
   * Clean up old requests from queue
   */
  private cleanupStaleRequests(): void {
    const now = Date.now();
    const staleRequests = this.queue.filter(
      (req) => now - req.timestamp > this.requestTimeout
    );

    staleRequests.forEach((req) => {
      this.removeFromQueue(req.id, 'Request expired');
    });
  }

  /**
   * Debug method to log queue state
   */
  debugQueueState(): void {
    const status = this.getQueueStatus();
    console.log('RequestQueue State:', {
      ...status,
      queuedRequests: this.queue.map((req) => ({
        id: req.id,
        url: req.config.url,
        method: req.config.method,
        retryCount: req.retryCount,
        age: Date.now() - req.timestamp,
      })),
    });
  }

  /**
   * Periodic cleanup of stale requests
   */
  startCleanupTimer(): void {
    setInterval(() => {
      this.cleanupStaleRequests();
    }, 30000); // Clean up every 30 seconds
  }
}

// Export singleton instance
export const RequestQueue = new RequestQueueClass();

// Start cleanup timer
if (typeof window !== 'undefined') {
  RequestQueue.startCleanupTimer();
}

export default RequestQueue;
