/**
 * Security Validation System
 * Provides security checks and validation for authentication
 */

interface SecurityConfig {
  enableTokenValidation: boolean;
  enableRateLimiting: boolean;
  enableSuspiciousActivityDetection: boolean;
  maxLoginAttempts: number;
  rateLimitWindow: number; // in milliseconds
  maxRequestsPerWindow: number;
  debugMode: boolean;
}

interface RateLimitEntry {
  count: number;
  firstRequest: number;
  lastRequest: number;
}

interface SecurityEvent {
  type: 'rate_limit' | 'suspicious_activity' | 'token_validation' | 'login_attempt';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  timestamp: number;
  metadata?: Record<string, any>;
}

const DEFAULT_CONFIG: SecurityConfig = {
  enableTokenValidation: true,
  enableRateLimiting: true,
  enableSuspiciousActivityDetection: true,
  maxLoginAttempts: 5,
  rateLimitWindow: 15 * 60 * 1000, // 15 minutes
  maxRequestsPerWindow: 100,
  debugMode: process.env.NODE_ENV === 'development',
};

class SecurityValidatorClass {
  private config: SecurityConfig;
  private rateLimitMap = new Map<string, RateLimitEntry>();
  private loginAttempts = new Map<string, { count: number; lastAttempt: number }>();
  private securityEvents: SecurityEvent[] = [];
  private suspiciousIPs = new Set<string>();

  constructor(config: Partial<SecurityConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    
    // Cleanup old entries periodically
    setInterval(() => {
      this.cleanup();
    }, 60000); // Every minute
  }

  /**
   * Validate JWT token structure and content
   */
  validateToken(token: string): {
    isValid: boolean;
    reason?: string;
    payload?: any;
  } {
    if (!this.config.enableTokenValidation) {
      return { isValid: true };
    }

    try {
      // Basic JWT structure validation
      const parts = token.split('.');
      if (parts.length !== 3) {
        this.logSecurityEvent('token_validation', 'medium', 'Invalid JWT structure');
        return { isValid: false, reason: 'Invalid token structure' };
      }

      // Decode payload (without verification for structure check)
      const payload = JSON.parse(atob(parts[1]));
      
      // Check required fields
      if (!payload.sub || !payload.exp || !payload.iat) {
        this.logSecurityEvent('token_validation', 'medium', 'Missing required JWT fields');
        return { isValid: false, reason: 'Missing required fields' };
      }

      // Check expiration
      const now = Math.floor(Date.now() / 1000);
      if (payload.exp < now) {
        this.logSecurityEvent('token_validation', 'low', 'Token expired');
        return { isValid: false, reason: 'Token expired' };
      }

      // Check if token is issued in the future (clock skew tolerance: 5 minutes)
      if (payload.iat > now + 300) {
        this.logSecurityEvent('token_validation', 'high', 'Token issued in future');
        return { isValid: false, reason: 'Token issued in future' };
      }

      return { isValid: true, payload };
    } catch (error) {
      this.logSecurityEvent('token_validation', 'medium', 'Token parsing error', { error: error.message });
      return { isValid: false, reason: 'Token parsing error' };
    }
  }

  /**
   * Check rate limiting for requests
   */
  checkRateLimit(identifier: string): {
    allowed: boolean;
    remainingRequests?: number;
    resetTime?: number;
  } {
    if (!this.config.enableRateLimiting) {
      return { allowed: true };
    }

    const now = Date.now();
    const entry = this.rateLimitMap.get(identifier);

    if (!entry) {
      // First request from this identifier
      this.rateLimitMap.set(identifier, {
        count: 1,
        firstRequest: now,
        lastRequest: now,
      });
      return { 
        allowed: true, 
        remainingRequests: this.config.maxRequestsPerWindow - 1,
        resetTime: now + this.config.rateLimitWindow,
      };
    }

    // Check if window has expired
    if (now - entry.firstRequest > this.config.rateLimitWindow) {
      // Reset the window
      this.rateLimitMap.set(identifier, {
        count: 1,
        firstRequest: now,
        lastRequest: now,
      });
      return { 
        allowed: true, 
        remainingRequests: this.config.maxRequestsPerWindow - 1,
        resetTime: now + this.config.rateLimitWindow,
      };
    }

    // Check if limit exceeded
    if (entry.count >= this.config.maxRequestsPerWindow) {
      this.logSecurityEvent('rate_limit', 'medium', 'Rate limit exceeded', { identifier });
      return { 
        allowed: false, 
        remainingRequests: 0,
        resetTime: entry.firstRequest + this.config.rateLimitWindow,
      };
    }

    // Update count
    entry.count++;
    entry.lastRequest = now;

    return { 
      allowed: true, 
      remainingRequests: this.config.maxRequestsPerWindow - entry.count,
      resetTime: entry.firstRequest + this.config.rateLimitWindow,
    };
  }

  /**
   * Track login attempts and detect brute force
   */
  trackLoginAttempt(identifier: string, success: boolean): {
    allowed: boolean;
    attemptsRemaining?: number;
    lockoutTime?: number;
  } {
    const now = Date.now();
    const attempts = this.loginAttempts.get(identifier);

    if (success) {
      // Successful login, reset attempts
      this.loginAttempts.delete(identifier);
      return { allowed: true };
    }

    if (!attempts) {
      // First failed attempt
      this.loginAttempts.set(identifier, { count: 1, lastAttempt: now });
      return { 
        allowed: true, 
        attemptsRemaining: this.config.maxLoginAttempts - 1,
      };
    }

    // Check if lockout period has expired (1 hour)
    if (now - attempts.lastAttempt > 60 * 60 * 1000) {
      // Reset attempts after 1 hour
      this.loginAttempts.set(identifier, { count: 1, lastAttempt: now });
      return { 
        allowed: true, 
        attemptsRemaining: this.config.maxLoginAttempts - 1,
      };
    }

    // Increment failed attempts
    attempts.count++;
    attempts.lastAttempt = now;

    if (attempts.count >= this.config.maxLoginAttempts) {
      this.logSecurityEvent('login_attempt', 'high', 'Max login attempts exceeded', { identifier });
      this.suspiciousIPs.add(identifier);
      return { 
        allowed: false, 
        attemptsRemaining: 0,
        lockoutTime: now + 60 * 60 * 1000, // 1 hour lockout
      };
    }

    return { 
      allowed: true, 
      attemptsRemaining: this.config.maxLoginAttempts - attempts.count,
    };
  }

  /**
   * Detect suspicious activity patterns
   */
  detectSuspiciousActivity(
    identifier: string,
    activity: {
      type: 'rapid_requests' | 'unusual_timing' | 'multiple_failures' | 'token_manipulation';
      metadata?: Record<string, any>;
    }
  ): {
    isSuspicious: boolean;
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
    actions: string[];
  } {
    if (!this.config.enableSuspiciousActivityDetection) {
      return { isSuspicious: false, riskLevel: 'low', actions: [] };
    }

    const actions: string[] = [];
    let riskLevel: 'low' | 'medium' | 'high' | 'critical' = 'low';
    let isSuspicious = false;

    // Check if IP is already flagged
    if (this.suspiciousIPs.has(identifier)) {
      riskLevel = 'high';
      isSuspicious = true;
      actions.push('monitor_closely');
    }

    // Analyze activity type
    switch (activity.type) {
      case 'rapid_requests':
        if (activity.metadata?.requestCount > 50) {
          riskLevel = 'high';
          isSuspicious = true;
          actions.push('rate_limit', 'temporary_block');
        }
        break;

      case 'unusual_timing':
        // Requests at unusual hours (2 AM - 5 AM)
        const hour = new Date().getHours();
        if (hour >= 2 && hour <= 5) {
          riskLevel = 'medium';
          actions.push('monitor');
        }
        break;

      case 'multiple_failures':
        if (activity.metadata?.failureCount > 10) {
          riskLevel = 'high';
          isSuspicious = true;
          actions.push('temporary_block', 'alert_admin');
        }
        break;

      case 'token_manipulation':
        riskLevel = 'critical';
        isSuspicious = true;
        actions.push('immediate_block', 'alert_admin', 'log_incident');
        break;
    }

    if (isSuspicious) {
      this.logSecurityEvent('suspicious_activity', riskLevel, `Suspicious activity detected: ${activity.type}`, {
        identifier,
        activity,
      });
    }

    return { isSuspicious, riskLevel, actions };
  }

  /**
   * Log security events
   */
  private logSecurityEvent(
    type: SecurityEvent['type'],
    severity: SecurityEvent['severity'],
    message: string,
    metadata?: Record<string, any>
  ): void {
    const event: SecurityEvent = {
      type,
      severity,
      message,
      timestamp: Date.now(),
      metadata,
    };

    this.securityEvents.push(event);

    // Limit events collection size
    if (this.securityEvents.length > 1000) {
      this.securityEvents = this.securityEvents.slice(-1000);
    }

    if (this.config.debugMode || severity === 'critical') {
      console.warn(`SecurityValidator: [${severity.toUpperCase()}] ${message}`, metadata);
    }
  }

  /**
   * Get security statistics
   */
  getSecurityStats(): {
    totalEvents: number;
    eventsBySeverity: Record<string, number>;
    suspiciousIPs: number;
    activeRateLimits: number;
    recentEvents: SecurityEvent[];
  } {
    const eventsBySeverity = this.securityEvents.reduce((acc, event) => {
      acc[event.severity] = (acc[event.severity] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const recentEvents = this.securityEvents
      .filter(event => Date.now() - event.timestamp < 60 * 60 * 1000) // Last hour
      .slice(-10);

    return {
      totalEvents: this.securityEvents.length,
      eventsBySeverity,
      suspiciousIPs: this.suspiciousIPs.size,
      activeRateLimits: this.rateLimitMap.size,
      recentEvents,
    };
  }

  /**
   * Cleanup old entries
   */
  private cleanup(): void {
    const now = Date.now();

    // Cleanup rate limit entries
    for (const [key, entry] of this.rateLimitMap.entries()) {
      if (now - entry.firstRequest > this.config.rateLimitWindow) {
        this.rateLimitMap.delete(key);
      }
    }

    // Cleanup old login attempts
    for (const [key, attempts] of this.loginAttempts.entries()) {
      if (now - attempts.lastAttempt > 60 * 60 * 1000) { // 1 hour
        this.loginAttempts.delete(key);
      }
    }

    // Cleanup old security events (keep last 24 hours)
    this.securityEvents = this.securityEvents.filter(
      event => now - event.timestamp < 24 * 60 * 60 * 1000
    );
  }

  /**
   * Clear all data
   */
  clear(): void {
    this.rateLimitMap.clear();
    this.loginAttempts.clear();
    this.securityEvents = [];
    this.suspiciousIPs.clear();
  }

  /**
   * Update configuration
   */
  updateConfig(newConfig: Partial<SecurityConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }
}

// Export singleton instance
export const SecurityValidator = new SecurityValidatorClass();
export default SecurityValidator;
