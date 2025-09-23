/**
 * Performance Monitoring System
 * Tracks API performance, memory usage, and user interactions
 */

interface PerformanceMetric {
  id: string;
  type: 'api' | 'memory' | 'user' | 'auth';
  name: string;
  duration?: number;
  timestamp: number;
  success: boolean;
  metadata?: Record<string, any>;
}

interface ApiMetric extends PerformanceMetric {
  type: 'api';
  method: string;
  url: string;
  statusCode?: number;
  responseSize?: number;
}

interface MemoryMetric extends PerformanceMetric {
  type: 'memory';
  usedJSHeapSize: number;
  totalJSHeapSize: number;
  jsHeapSizeLimit: number;
}

interface UserMetric extends PerformanceMetric {
  type: 'user';
  action: string;
  component?: string;
}

interface AuthMetric extends PerformanceMetric {
  type: 'auth';
  action: 'login' | 'logout' | 'refresh' | 'validate';
  userId?: string;
}

interface PerformanceConfig {
  maxMetrics: number;
  enableMemoryTracking: boolean;
  enableApiTracking: boolean;
  enableUserTracking: boolean;
  enableAuthTracking: boolean;
  reportingInterval: number;
  debugMode: boolean;
  // Granular logging controls
  logApiRequests: boolean;
  logMemoryUsage: boolean;
  logUserActions: boolean;
  logAuthEvents: boolean;
}

const DEFAULT_CONFIG: PerformanceConfig = {
  maxMetrics: 1000,
  enableMemoryTracking: true,
  enableApiTracking: true,
  enableUserTracking: true,
  enableAuthTracking: true,
  reportingInterval: 60000, // 1 minute
  debugMode:
    typeof process !== 'undefined' && process.env?.NODE_ENV === 'development',
  // Granular logging controls - disable noisy logs by default
  logApiRequests: false,
  logMemoryUsage: false,
  logUserActions: false,
  logAuthEvents: false,
};

class PerformanceMonitorClass {
  private metrics: PerformanceMetric[] = [];
  private config: PerformanceConfig;
  private reportingTimer?: NodeJS.Timeout;

  constructor(config: Partial<PerformanceConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };

    if (typeof window !== 'undefined') {
      this.startReporting();
      this.setupMemoryTracking();
    }
  }

  /**
   * Generate unique metric ID
   */
  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
  }

  /**
   * Add metric to collection
   */
  private addMetric(metric: PerformanceMetric): void {
    this.metrics.push(metric);

    // Limit metrics collection size
    if (this.metrics.length > this.config.maxMetrics) {
      this.metrics = this.metrics.slice(-this.config.maxMetrics);
    }

    // Granular logging based on metric type
    if (this.config.debugMode) {
      const shouldLog =
        (metric.type === 'api' && this.config.logApiRequests) ||
        (metric.type === 'memory' && this.config.logMemoryUsage) ||
        (metric.type === 'user' && this.config.logUserActions) ||
        (metric.type === 'auth' && this.config.logAuthEvents);

      if (shouldLog) {
        console.log(
          `PerformanceMonitor: ${metric.type} - ${metric.name}`,
          metric
        );
      }
    }
  }

  /**
   * Track API request performance
   */
  trackApiRequest(
    method: string,
    url: string,
    duration: number,
    success: boolean,
    statusCode?: number,
    responseSize?: number
  ): void {
    if (!this.config.enableApiTracking) return;

    const metric: ApiMetric = {
      id: this.generateId(),
      type: 'api',
      name: `${method.toUpperCase()} ${url}`,
      method: method.toUpperCase(),
      url,
      duration,
      timestamp: Date.now(),
      success,
      statusCode,
      responseSize,
    };

    this.addMetric(metric);
  }

  /**
   * Track memory usage
   */
  trackMemoryUsage(): void {
    if (!this.config.enableMemoryTracking || typeof window === 'undefined')
      return;

    interface PerformanceMemory {
      usedJSHeapSize: number;
      totalJSHeapSize: number;
      jsHeapSizeLimit: number;
    }

    const memory = (performance as Performance & { memory?: PerformanceMemory })
      .memory;
    if (!memory) return;

    const metric: MemoryMetric = {
      id: this.generateId(),
      type: 'memory',
      name: 'Memory Usage',
      timestamp: Date.now(),
      success: true,
      usedJSHeapSize: memory.usedJSHeapSize,
      totalJSHeapSize: memory.totalJSHeapSize,
      jsHeapSizeLimit: memory.jsHeapSizeLimit,
    };

    this.addMetric(metric);
  }

  /**
   * Track user interactions
   */
  trackUserAction(
    action: string,
    component?: string,
    duration?: number,
    metadata?: Record<string, any>
  ): void {
    if (!this.config.enableUserTracking) return;

    const metric: UserMetric = {
      id: this.generateId(),
      type: 'user',
      name: action,
      action,
      component,
      duration,
      timestamp: Date.now(),
      success: true,
      metadata,
    };

    this.addMetric(metric);
  }

  /**
   * Track authentication events
   */
  trackAuthEvent(
    action: 'login' | 'logout' | 'refresh' | 'validate',
    success: boolean,
    duration?: number,
    userId?: string,
    metadata?: Record<string, any>
  ): void {
    if (!this.config.enableAuthTracking) return;

    const metric: AuthMetric = {
      id: this.generateId(),
      type: 'auth',
      name: `Auth ${action}`,
      action,
      duration,
      timestamp: Date.now(),
      success,
      userId,
      metadata,
    };

    this.addMetric(metric);
  }

  /**
   * Get performance statistics
   */
  getStats(): {
    totalMetrics: number;
    apiMetrics: {
      total: number;
      successful: number;
      failed: number;
      averageDuration: number;
      slowestRequest: ApiMetric | null;
    };
    memoryMetrics: {
      total: number;
      currentUsage: number;
      peakUsage: number;
    };
    authMetrics: {
      total: number;
      successful: number;
      failed: number;
      averageDuration: number;
    };
    userMetrics: {
      total: number;
      uniqueActions: number;
    };
  } {
    const apiMetrics = this.metrics.filter(
      (m) => m.type === 'api'
    ) as ApiMetric[];
    const memoryMetrics = this.metrics.filter(
      (m) => m.type === 'memory'
    ) as MemoryMetric[];
    const authMetrics = this.metrics.filter(
      (m) => m.type === 'auth'
    ) as AuthMetric[];
    const userMetrics = this.metrics.filter(
      (m) => m.type === 'user'
    ) as UserMetric[];

    return {
      totalMetrics: this.metrics.length,
      apiMetrics: {
        total: apiMetrics.length,
        successful: apiMetrics.filter((m) => m.success).length,
        failed: apiMetrics.filter((m) => !m.success).length,
        averageDuration:
          apiMetrics.length > 0
            ? apiMetrics.reduce((sum, m) => sum + (m.duration || 0), 0) /
              apiMetrics.length
            : 0,
        slowestRequest: apiMetrics.reduce(
          (slowest, current) =>
            !slowest || (current.duration || 0) > (slowest.duration || 0)
              ? current
              : slowest,
          null as ApiMetric | null
        ),
      },
      memoryMetrics: {
        total: memoryMetrics.length,
        currentUsage:
          memoryMetrics[memoryMetrics.length - 1]?.usedJSHeapSize || 0,
        peakUsage: Math.max(...memoryMetrics.map((m) => m.usedJSHeapSize), 0),
      },
      authMetrics: {
        total: authMetrics.length,
        successful: authMetrics.filter((m) => m.success).length,
        failed: authMetrics.filter((m) => !m.success).length,
        averageDuration:
          authMetrics.length > 0
            ? authMetrics.reduce((sum, m) => sum + (m.duration || 0), 0) /
              authMetrics.length
            : 0,
      },
      userMetrics: {
        total: userMetrics.length,
        uniqueActions: new Set(userMetrics.map((m) => m.action)).size,
      },
    };
  }

  private memoryTrackingInterval?: NodeJS.Timeout;

  /**
   * Setup automatic memory tracking
   */
  private setupMemoryTracking(): void {
    if (!this.config.enableMemoryTracking) return;

    // Track memory every 30 seconds
    this.memoryTrackingInterval = setInterval(() => {
      this.trackMemoryUsage();
    }, 30000);
  }

  /**
   * Start periodic reporting
   */
  private startReporting(): void {
    if (this.reportingTimer) {
      clearInterval(this.reportingTimer);
    }

    this.reportingTimer = setInterval(() => {
      if (this.config.debugMode) {
        const stats = this.getStats();
        console.log('PerformanceMonitor: Periodic Report', stats);
      }
    }, this.config.reportingInterval);
  }

  /**
   * Export metrics for analysis
   */
  exportMetrics(): PerformanceMetric[] {
    return [...this.metrics];
  }

  /**
   * Clear all metrics
   */
  clear(): void {
    this.metrics = [];

    if (this.config.debugMode) {
      console.log('PerformanceMonitor: Cleared all metrics');
    }
  }

  /**
   * Update configuration
   */
  updateConfig(newConfig: Partial<PerformanceConfig>): void {
    this.config = { ...this.config, ...newConfig };

    if (typeof window !== 'undefined') {
      this.startReporting();
    }
  }

  /**
   * Enable/disable specific logging types
   */
  setLogging(options: {
    api?: boolean;
    memory?: boolean;
    user?: boolean;
    auth?: boolean;
  }): void {
    if (options.api !== undefined) this.config.logApiRequests = options.api;
    if (options.memory !== undefined)
      this.config.logMemoryUsage = options.memory;
    if (options.user !== undefined) this.config.logUserActions = options.user;
    if (options.auth !== undefined) this.config.logAuthEvents = options.auth;
  }

  /**
   * Disable all console logging
   */
  disableAllLogging(): void {
    this.config.logApiRequests = false;
    this.config.logMemoryUsage = false;
    this.config.logUserActions = false;
    this.config.logAuthEvents = false;
  }

  /**
   * Enable all console logging
   */
  enableAllLogging(): void {
    this.config.logApiRequests = true;
    this.config.logMemoryUsage = true;
    this.config.logUserActions = true;
    this.config.logAuthEvents = true;
  }

  /**
   * Cleanup resources
   */
  destroy(): void {
    if (this.reportingTimer) {
      clearInterval(this.reportingTimer);
    }
    if (this.memoryTrackingInterval) {
      clearInterval(this.memoryTrackingInterval);
    }
    this.clear();
  }
}

// Export singleton instance
export const PerformanceMonitor = new PerformanceMonitorClass();
export default PerformanceMonitor;
