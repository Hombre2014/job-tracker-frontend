# 🛠️ DevTools and Monitoring System Guide

## 🆕 Recent Improvements (31/01/2025)

### Critical Bug Fixes and Enhancements

#### 🔧 **DevTools API Testing Improvements**

- **Enhanced Error Handling**: Added comprehensive validation for API calls
- **Environment Validation**: Checks for `NEXT_PUBLIC_API_URL` configuration before making requests
- **Token Validation**: Validates access token availability before API calls
- **Better Error Messages**: Provides specific error messages for different failure scenarios

```typescript
// Enhanced API testing with proper validation
const testApiCall = async () => {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) {
      console.error('API URL not configured');
      return;
    }

    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      console.error('No access token available');
      return;
    }

    const response = await fetch(`${apiUrl}/users`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    console.log('Test API Response:', response.status, await response.json());
  } catch (error) {
    console.error('Test API Error:', error);
  }
};
```

#### 🛡️ **Memory Leak Prevention**

- **Fixed Event Listener Cleanup**: Proper cleanup of event listeners to prevent memory leaks
- **Timer Management**: Added proper cleanup for all interval timers
- **Resource Management**: Enhanced cleanup methods for all monitoring components

#### 📊 **Type Safety Improvements**

- **SecurityEvent Interface**: Proper TypeScript typing for security events in monitoring dashboard
- **Performance Memory Interface**: Added proper typing for browser memory API
- **Error Boundary Enhancement**: Better error handling with proper type safety

#### 🔄 **Retry Logic Enhancements**

- **Request Queue Improvements**: Fixed race conditions in retry processing
- **Exponential Backoff**: Implemented proper delay calculation with maximum caps
- **Better Error Recovery**: Enhanced retry mechanisms for failed requests

## Table of Contents

1. [Overview](#overview)
2. [DevTools Component](#devtools-component)
3. [Monitoring Dashboard](#monitoring-dashboard)
4. [Performance Monitoring](#performance-monitoring)
5. [Security Monitoring](#security-monitoring)
6. [Configuration](#configuration)
7. [Troubleshooting](#troubleshooting)

---

## Overview

The Job Tracker includes a comprehensive development and monitoring system that provides real-time insights into application performance, security events, and system health. This system consists of two main components:

1. **DevTools Component** - A floating development panel for quick system inspection
2. **Monitoring Dashboard** - A comprehensive analytics dashboard for detailed system monitoring

### When Are These Tools Available?

- **DevTools Component**: Automatically available in **development mode only** (`NODE_ENV=development`)
- **Monitoring Dashboard**: Available in **both development and production** (can be configured)
- **Performance Monitoring**:
  - **Development**: Enabled by default with full features
  - **Production**: Essential monitoring only (disabled by default, can be enabled)
  - **Configurable**: Use `PerformanceMonitor.updateConfig()` to enable/disable
- **Security Monitoring**: Always active for production security

---

## DevTools Component

### 🚀 **Quick Access**

The DevTools component is a floating, draggable panel that provides instant access to system information and debugging tools.

#### **How to Open/Close DevTools**

1. **Keyboard Shortcut**: Press `Ctrl+Shift+D` to toggle the DevTools panel
2. **Manual Close**: Click the "✕ Hide" button in the panel
3. **Auto-Hide**: The panel automatically hides in production mode

#### **DevTools Interface**

```text
┌─────────────────────┐
│    🛠️ Dev Tools     │
├─────────────────────┤
│ 📊 Monitoring       │
│ 👤 Log User State   │
│ 🌐 Test API         │
│ 🗑️ Clear Storage    │
│ 💥 Simulate Error   │
├─────────────────────┤
│ User: Yuriy         │
│ Token: ✅           │
├─────────────────────┤
│ ✕ Hide              │
│ Ctrl+Shift+D toggle │
└─────────────────────┘
```

### 🔧 **DevTools Features**

#### **1. 📊 Monitoring Button**

- **Purpose**: Opens the comprehensive Monitoring Dashboard
- **What it shows**: Real-time performance metrics, security events, system health
- **When to use**: When you need detailed analytics and system insights

#### **2. 👤 Log User State Button**

- **Purpose**: Logs current authentication state to browser console
- **What it logs**:

  ```javascript
  // Console output example
  Current User State: {
    userId: "04bed41d-008e-4d06-8ac9-07fb637a2fbb",
    email: "user@example.com",
    firstName: "Yuriy",
    lastName: "The Great",
    isAuthenticated: true,
    accessToken: "eyJhbGciOiJIUzI1NiIs...",
    refreshToken: "eyJhbGciOiJIUzI1NiIs..."
  }
  LocalStorage user: {...}
  LocalStorage tokens: {...}
  ```

- **When to use**: Debugging authentication issues, checking token status

#### **3. 🌐 Test API Button**

- **Purpose**: Tests API connectivity and authentication
- **What it does**: Makes a test request to `/users` endpoint with current token
- **Console output**:

  ```javascript
  // Success
  Test API Response: 200 {id: "...", email: "...", firstName: "..."}

  // Failure
  Test API Error: AxiosError {...}
  ```

- **When to use**: Verifying API connectivity, testing token validity

#### **4. 🗑️ Clear Storage Button**

- **Purpose**: Clears all authentication data and resets the application
- **What it clears**:
  - All localStorage data (tokens, user data, cache)
  - Redux authentication state
  - Performance metrics
  - Security event logs
- **Effect**: Page automatically reloads after clearing
- **When to use**: Resetting authentication state, clearing corrupted data

#### **5. 💥 Simulate Error Button**

- **Purpose**: Throws a test error for testing error handling
- **What it does**: `throw new Error('Simulated error for testing')`
- **When to use**: Testing error boundaries, error logging, error recovery

#### **6. 🔊/🔇 Toggle Logs Button**

- **Purpose**: Enable/disable performance monitoring console logs
- **What it does**:
  - **Enable**: Turns on API and Auth logging (memory logs stay disabled)
  - **Disable**: Turns off all performance monitoring console logs
- **When to use**: When console is cluttered with monitoring logs
- **Quick access**: Instantly control noisy console output

### 📱 **DevTools Behavior**

#### **Draggable Interface**

- **Drag to move**: Click and drag the panel to reposition it
- **Position persistence**: Panel remembers its position during the session
- **Default position**: Top-left corner (20px, 20px)

#### **Auto-Hide Logic**

- **Development**: Always visible when toggled on
- **Production**: Automatically hidden (security feature)
- **Keyboard toggle**: Works in development mode only

---

## Monitoring Dashboard

### 🎯 **Accessing the Dashboard**

1. **From DevTools**: Click the "📊 Monitoring" button
2. **Direct access**: The dashboard component can be integrated anywhere in the app
3. **Keyboard shortcut**: `Ctrl+Shift+D` → Click "📊 Monitoring"

### 📊 **Dashboard Interface**

```text
┌─────────────────────────────────────────────────────────────┐
│                System Monitoring Dashboard                  │
│  [Refresh] [Export Data] [Clear All] [Close]               │
├─────────────────────────────────────────────────────────────┤
│ ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐ │
│ │ Performance     │ │ Security        │ │ Deduplication   │ │
│ │ Metrics         │ │ Metrics         │ │ Stats           │ │
│ │                 │ │                 │ │                 │ │
│ │ Total: 150      │ │ Events: 25      │ │ Cache: 45       │ │
│ │ API Calls: 120  │ │ Critical: 0     │ │ Pending: 3      │ │
│ │ Success: 95%    │ │ High: 2         │ │ Hit Rate: 78%   │ │
│ │ Avg: 245ms      │ │ Suspicious: 1   │ │                 │ │
│ │ Memory: 85MB    │ │ Rate Limits: 0  │ │                 │ │
│ └─────────────────┘ └─────────────────┘ └─────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│                    Recent Security Events                   │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ [MEDIUM] token_validation - Invalid JWT structure      │ │
│ │ [LOW] rate_limit - Request within limits               │ │
│ │ [HIGH] login_attempt - Multiple failed attempts        │ │
│ └─────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│                    Slowest API Request                     │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ GET /users - 1,245ms - Status: 200                     │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### 🔄 **Dashboard Controls**

#### **1. Refresh Button**

- **Purpose**: Manually refresh all metrics and statistics
- **Auto-refresh**: Dashboard automatically refreshes every 5 seconds
- **When to use**: Getting latest data immediately

#### **2. Export Data Button**

- **Purpose**: Downloads comprehensive system data as JSON file
- **File format**: `monitoring-data-{timestamp}.json`
- **Contents**:

  ```json
  {
    "performance": [...], // All performance metrics
    "security": {...},    // Security statistics
    "timestamp": "2025-01-27T..."
  }
  ```

- **When to use**: Analyzing historical data, sharing with team, debugging

#### **3. Clear All Button**

- **Purpose**: Clears all monitoring data
- **What it clears**:
  - Performance metrics
  - Security events
  - Cache data
  - Request statistics
- **Effect**: Resets all counters to zero
- **When to use**: Starting fresh monitoring session

#### **4. Close Button**

- **Purpose**: Closes the monitoring dashboard
- **Effect**: Returns to normal application view
- **Data persistence**: All data remains in memory

---

## Performance Monitoring

### 📈 **What Is Monitored**

#### **1. API Performance**

```javascript
// Tracked metrics
{
  method: "GET",
  url: "/users",
  duration: 245,        // Response time in ms
  success: true,        // Success/failure status
  statusCode: 200,      // HTTP status code
  responseSize: 1024,   // Response size in bytes
  timestamp: 1753622891000
}
```

#### **2. Memory Usage**

```javascript
// Memory metrics
{
  usedJSHeapSize: 89456640,    // Used memory in bytes
  totalJSHeapSize: 134217728,  // Total allocated memory
  jsHeapSizeLimit: 2147483648, // Memory limit
  timestamp: 1753622891000
}
```

#### **3. User Interactions**

```javascript
// User action tracking
{
  action: "Login Button Click",
  component: "LoginForm",
  duration: 150,        // Action duration
  metadata: {...}       // Additional context
}
```

#### **4. Authentication Events**

```javascript
// Auth event tracking
{
  action: "login",      // login, logout, refresh, validate
  success: true,
  duration: 1200,       // Time taken
  userId: "user-id",
  metadata: {...}
}
```

### ⚙️ **Performance Configuration**

```javascript
// Default configuration
const performanceConfig = {
  maxMetrics: 1000, // Maximum stored metrics
  enableMemoryTracking: true, // Track memory usage
  enableApiTracking: true, // Track API calls
  enableUserTracking: true, // Track user actions
  enableAuthTracking: true, // Track auth events
  reportingInterval: 60000, // Report every minute
  debugMode: true, // Development logging
  // Granular logging controls (NEW)
  logApiRequests: false, // Log API calls to console
  logMemoryUsage: false, // Log memory usage to console
  logUserActions: false, // Log user actions to console
  logAuthEvents: false, // Log auth events to console
};
```

### 🔇 **Controlling Console Logs**

**Problem**: Too many console logs cluttering your development console?

**Quick Fix**: Run this command in your browser console to stop all noisy logs immediately:

```javascript
// Stop all performance monitoring console logs
PerformanceMonitor.disableAllLogging();
```

**Solution**: Use the new granular logging controls:

```javascript
// First, ensure PerformanceMonitor is available in the console
// In development, you can access it via:
// window.PerformanceMonitor or import it from '@/utils/PerformanceMonitor'

// Disable all console logging (recommended for cleaner console)
PerformanceMonitor.disableAllLogging();

// Enable only specific types of logging
PerformanceMonitor.setLogging({
  api: true, // Enable API request logging
  memory: false, // Disable memory usage logging (noisy)
  user: false, // Disable user action logging
  auth: true, // Enable auth event logging
});

// Enable all logging (for debugging)
PerformanceMonitor.enableAllLogging();
```

### 📊 **Performance Statistics**

The system provides comprehensive statistics:

```javascript
// Available statistics
{
  totalMetrics: 150,
  apiMetrics: {
    total: 120,
    successful: 114,
    failed: 6,
    averageDuration: 245,
    slowestRequest: {...}
  },
  memoryMetrics: {
    total: 30,
    currentUsage: 89456640,
    peakUsage: 95123456
  },
  authMetrics: {
    total: 25,
    successful: 23,
    failed: 2,
    averageDuration: 1200
  },
  userMetrics: {
    total: 45,
    uniqueActions: 12
  }
}
```

---

## Security Monitoring

### 🛡️ **Security Features**

#### **1. Rate Limiting**

```javascript
// Rate limit configuration
{
  maxRequestsPerWindow: 100,     // Max requests
  rateLimitWindow: 900000,       // 15 minutes
  enableRateLimiting: true
}

// Rate limit check
const result = SecurityValidator.checkRateLimit('client-ip');
// Returns: { allowed: true, remainingRequests: 95, resetTime: 1753623791000 }
```

#### **2. Login Attempt Tracking**

```javascript
// Login attempt configuration
{
  maxLoginAttempts: 5,           // Max failed attempts
  lockoutDuration: 3600000,      // 1 hour lockout (configurable)
}

// Track login attempt
const result = SecurityValidator.trackLoginAttempt('user-ip', false);
// Returns: { allowed: true, attemptsRemaining: 3, lockoutTime: null }
```

#### **3. Token Validation**

```javascript
// Token validation
const result = SecurityValidator.validateToken(token);
// Returns: { isValid: true, payload: {...} }
// Or: { isValid: false, reason: "Token expired" }
```

#### **4. Suspicious Activity Detection**

```javascript
// Activity detection
const result = SecurityValidator.detectSuspiciousActivity('client', {
  type: 'rapid_requests',
  metadata: { requestCount: 55 },
});
// Returns: {
//   isSuspicious: true,
//   riskLevel: 'high',
//   actions: ['rate_limit', 'temporary_block']
// }
```

### 🚨 **Security Events**

#### **Event Types**

- `rate_limit` - Rate-limiting violations
- `suspicious_activity` - Detected suspicious behavior
- `token_validation` - Token validation failures
- `login_attempt` - Login attempt tracking

#### **Severity Levels**

- `low` - Normal security events, informational
- `medium` - Potential security concerns, monitor
- `high` - Security threats, take action
- `critical` - Immediate security threats, block/alert

#### **Event Structure**

```javascript
{
  type: 'login_attempt',
  severity: 'high',
  message: 'Max login attempts exceeded',
  timestamp: 1753622891000,
  metadata: {
    identifier: 'client-ip',
    attemptCount: 5,
    lockoutTime: 1753626491000
  }
}
```

---

## 🧹 Memory Management and Cleanup (31/01/2025)

### Resource Cleanup Methods

The monitoring system now includes comprehensive cleanup methods to prevent memory leaks in long-running applications.

#### **RequestDeduplicator Cleanup**

```typescript
// Proper cleanup for request deduplicator
import { RequestDeduplicator } from '@/utils/RequestDeduplicator';

// Clean up when component unmounts or app shuts down
useEffect(() => {
  return () => {
    RequestDeduplicator.destroy(); // Cleans up intervals and clears cache
  };
}, []);
```

#### **RequestQueue Timer Management**

```typescript
// Manage cleanup timers
import { RequestQueue } from '@/utils/RequestQueue';

// Start cleanup timer
RequestQueue.startCleanupTimer();

// Stop cleanup timer (e.g., during testing or shutdown)
RequestQueue.stopCleanupTimer();
```

#### **SmartTokenRefresh Event Cleanup**

```typescript
// Automatic cleanup on component unmount
import { SmartTokenRefresh } from '@/utils/SmartTokenRefresh';

useEffect(() => {
  return () => {
    SmartTokenRefresh.cleanup(); // Removes all event listeners and timers
  };
}, []);
```

#### **PerformanceMonitor Memory Tracking**

```typescript
// Memory tracking with proper cleanup
import { PerformanceMonitor } from '@/utils/PerformanceMonitor';

// The memory tracking interval is now properly managed
// and cleaned up automatically when the monitor is destroyed
```

#### **SecurityValidator Resource Cleanup**

```typescript
// SecurityValidator cleanup for memory leak prevention
import { SecurityValidator } from '@/utils/SecurityValidator';

// The SecurityValidator now includes proper cleanup for interval timers
// preventing memory leaks in long-running applications

// Manual cleanup (if needed)
SecurityValidator.destroy(); // Clears interval timer and all data

// Automatic cleanup in components
useEffect(() => {
  return () => {
    SecurityValidator.destroy(); // Cleanup on unmount
  };
}, []);
```

### Best Practices for Memory Management

#### **Component Cleanup**

```typescript
// Example: Proper cleanup in React components
const MyComponent = () => {
  useEffect(() => {
    // Setup monitoring
    const cleanup = () => {
      RequestDeduplicator.destroy();
      RequestQueue.stopCleanupTimer();
      SmartTokenRefresh.cleanup();
      SecurityValidator.destroy();
    };

    // Cleanup on unmount
    return cleanup;
  }, []);

  return <div>Component content</div>;
};
```

#### **Testing Environment Cleanup**

```typescript
// Example: Cleanup between tests
beforeEach(() => {
  RequestQueue.startCleanupTimer();
});

afterEach(() => {
  RequestDeduplicator.destroy();
  RequestQueue.stopCleanupTimer();
  SmartTokenRefresh.cleanup();
  SecurityValidator.destroy();
});
```

#### **Application Shutdown**

```typescript
// Example: Graceful shutdown
process.on('SIGTERM', () => {
  console.log('Shutting down gracefully...');
  RequestDeduplicator.destroy();
  RequestQueue.stopCleanupTimer();
  SmartTokenRefresh.cleanup();
  process.exit(0);
});
```

---

## Configuration

### 🔧 **Environment Configuration**

#### **Development Mode**

```env
NODE_ENV=development
NEXT_PUBLIC_DEBUG_MODE=true
```

**Features enabled:**

- ✅ DevTools component visible
- ✅ Comprehensive console logging
- ✅ All monitoring features active
- ✅ Debug information displayed

#### **Production Mode**

```env
NODE_ENV=production
NEXT_PUBLIC_DEBUG_MODE=false
```

**Features enabled:**

- ❌ DevTools component hidden
- ✅ Essential monitoring only
- ✅ Security monitoring active
- ❌ Debug logging disabled

### ⚙️ **System Configuration**

#### **Enable/Disable Monitoring**

```javascript
// Disable performance monitoring
PerformanceMonitor.updateConfig({
  enableApiTracking: false,
  enableMemoryTracking: false,
});

// Disable security monitoring
SecurityValidator.updateConfig({
  enableRateLimiting: false,
  enableSuspiciousActivityDetection: false,
});
```

#### **Adjust Monitoring Intervals**

```javascript
// Change reporting frequency
PerformanceMonitor.updateConfig({
  reportingInterval: 30000, // Report every 30 seconds
});

// Change memory tracking frequency
// (Memory is tracked every 30 seconds by default)
```

#### **Configure Security Thresholds**

```javascript
// Adjust security settings
SecurityValidator.updateConfig({
  maxLoginAttempts: 3, // Stricter login limits
  rateLimitWindow: 600000, // 10 minute window
  maxRequestsPerWindow: 50, // Lower rate limit
});
```

---

## Troubleshooting

### 🔍 **Common Issues**

#### **DevTools Not Appearing**

**Problem**: DevTools panel doesn't show when pressing Ctrl+Shift+D

**Solutions**:

1. **Check environment**: Ensure `NODE_ENV=development`
2. **Check console**: Look for JavaScript errors
3. **Try manual toggle**: Check if DevTools component is mounted
4. **Clear cache**: Refresh page with Ctrl+F5

#### **Monitoring Dashboard Empty**

**Problem**: Dashboard shows no data or zero metrics

**Solutions**:

1. **Wait for data**: Metrics accumulate over time
2. **Check configuration**: Ensure monitoring is enabled
3. **Trigger activity**: Make API calls, perform actions
4. **Check console**: Look for monitoring errors

#### **Performance Issues**

**Problem**: Application feels slow with monitoring enabled

**Solutions**:

1. **Reduce metrics**: Lower `maxMetrics` configuration
2. **Disable features**: Turn off unnecessary monitoring
3. **Increase intervals**: Reduce reporting frequency
4. **Clear data**: Use "Clear All" button in dashboard

#### **Memory Usage High**

**Problem**: High memory usage reported in monitoring

**Solutions**:

1. **Check metrics limit**: Ensure `maxMetrics` is reasonable (default: 1000)
2. **Clear old data**: Use dashboard "Clear All" button
3. **Disable tracking**: Turn off memory tracking if not needed
4. **Monitor trends**: Check if usage is increasing over time

### 🛠️ **Debug Commands**

#### **Console Commands**

```javascript
// Check monitoring status
PerformanceMonitor.getStats();
SecurityValidator.getSecurityStats();

// Clear monitoring data
PerformanceMonitor.clear();
SecurityValidator.clear();

// Export data for analysis
const data = PerformanceMonitor.exportMetrics();
console.log(JSON.stringify(data, null, 2));

// Control console logging
PerformanceMonitor.disableAllLogging(); // Stop all console logs
PerformanceMonitor.setLogging({ api: true }); // Enable only API logs
PerformanceMonitor.enableAllLogging(); // Enable all logs
```

#### **Manual Testing**

```javascript
// Test security features
SecurityValidator.checkRateLimit('test-user');
SecurityValidator.trackLoginAttempt('test-user', false);

// Test performance tracking
PerformanceMonitor.trackApiRequest('GET', '/test', 100, true);
PerformanceMonitor.trackUserAction('Test Action', 'TestComponent');
```

---

## Best Practices

### 📋 **Development Workflow**

1. **Start Development**: DevTools automatically available
2. **Monitor Performance**: Use dashboard to track API performance
3. **Debug Issues**: Use "Log User State" and "Test API" buttons
4. **Clear Data**: Reset monitoring data when needed
5. **Export Data**: Save monitoring data for analysis

### 🚀 **Production Deployment**

1. **Disable DevTools**: Ensure `NODE_ENV=production`
2. **Configure Monitoring**: Enable essential monitoring only
3. **Set Thresholds**: Configure appropriate security limits
4. **Monitor Alerts**: Watch for security events and performance issues

### 🔒 **Security Considerations**

1. **Production Safety**: DevTools automatically hidden in production
2. **Data Privacy**: Monitoring data stays in browser memory
3. **Security Events**: Monitor for suspicious activity
4. **Rate Limiting**: Configure appropriate limits for your API

---

**The DevTools and Monitoring system provides comprehensive insights into your application's performance and security. Use these tools to debug issues, optimize performance, and maintain system health.** 🚀
