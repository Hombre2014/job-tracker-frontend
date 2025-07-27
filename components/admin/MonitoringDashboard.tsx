'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import PerformanceMonitor from '@/utils/PerformanceMonitor';
import SecurityValidator from '@/utils/SecurityValidator';
import RequestDeduplicator from '@/utils/RequestDeduplicator';

interface MonitoringDashboardProps {
  isVisible?: boolean;
  onClose?: () => void;
}

const MonitoringDashboard: React.FC<MonitoringDashboardProps> = ({
  isVisible = false,
  onClose,
}) => {
  const [stats, setStats] = useState<any>(null);
  const [securityStats, setSecurityStats] = useState<any>(null);
  const [deduplicatorStats, setDeduplicatorStats] = useState<any>(null);
  const [refreshInterval, setRefreshInterval] = useState<NodeJS.Timeout | null>(null);

  const refreshStats = () => {
    setStats(PerformanceMonitor.getStats());
    setSecurityStats(SecurityValidator.getSecurityStats());
    setDeduplicatorStats(RequestDeduplicator.getStats());
  };

  useEffect(() => {
    if (isVisible) {
      refreshStats();
      
      // Auto-refresh every 5 seconds
      const interval = setInterval(refreshStats, 5000);
      setRefreshInterval(interval);
      
      return () => {
        if (interval) clearInterval(interval);
      };
    } else {
      if (refreshInterval) {
        clearInterval(refreshInterval);
        setRefreshInterval(null);
      }
    }
  }, [isVisible]);

  const clearAllData = () => {
    PerformanceMonitor.clear();
    SecurityValidator.clear();
    RequestDeduplicator.clear();
    refreshStats();
  };

  const exportData = () => {
    const data = {
      performance: PerformanceMonitor.exportMetrics(),
      security: SecurityValidator.getSecurityStats(),
      timestamp: new Date().toISOString(),
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `monitoring-data-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">System Monitoring Dashboard</h2>
            <div className="flex gap-2">
              <Button onClick={refreshStats} variant="outline" size="sm">
                Refresh
              </Button>
              <Button onClick={exportData} variant="outline" size="sm">
                Export Data
              </Button>
              <Button onClick={clearAllData} variant="destructive" size="sm">
                Clear All
              </Button>
              {onClose && (
                <Button onClick={onClose} variant="outline" size="sm">
                  Close
                </Button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Performance Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                {stats ? (
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Total Metrics:</span>
                      <span className="font-mono">{stats.totalMetrics}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>API Requests:</span>
                      <span className="font-mono">{stats.apiMetrics.total}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Success Rate:</span>
                      <span className="font-mono">
                        {stats.apiMetrics.total > 0
                          ? Math.round((stats.apiMetrics.successful / stats.apiMetrics.total) * 100)
                          : 0}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Avg Duration:</span>
                      <span className="font-mono">
                        {Math.round(stats.apiMetrics.averageDuration)}ms
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Memory Usage:</span>
                      <span className="font-mono">
                        {Math.round(stats.memoryMetrics.currentUsage / 1024 / 1024)}MB
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Peak Memory:</span>
                      <span className="font-mono">
                        {Math.round(stats.memoryMetrics.peakUsage / 1024 / 1024)}MB
                      </span>
                    </div>
                  </div>
                ) : (
                  <div>Loading...</div>
                )}
              </CardContent>
            </Card>

            {/* Security Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>Security Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                {securityStats ? (
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Total Events:</span>
                      <span className="font-mono">{securityStats.totalEvents}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Critical Events:</span>
                      <span className="font-mono text-red-600">
                        {securityStats.eventsBySeverity.critical || 0}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>High Severity:</span>
                      <span className="font-mono text-orange-600">
                        {securityStats.eventsBySeverity.high || 0}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Medium Severity:</span>
                      <span className="font-mono text-yellow-600">
                        {securityStats.eventsBySeverity.medium || 0}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Suspicious IPs:</span>
                      <span className="font-mono">{securityStats.suspiciousIPs}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Active Rate Limits:</span>
                      <span className="font-mono">{securityStats.activeRateLimits}</span>
                    </div>
                  </div>
                ) : (
                  <div>Loading...</div>
                )}
              </CardContent>
            </Card>

            {/* Request Deduplication */}
            <Card>
              <CardHeader>
                <CardTitle>Request Deduplication</CardTitle>
              </CardHeader>
              <CardContent>
                {deduplicatorStats ? (
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Cache Size:</span>
                      <span className="font-mono">{deduplicatorStats.cacheSize}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Pending Requests:</span>
                      <span className="font-mono">{deduplicatorStats.pendingRequests}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Cache Hit Rate:</span>
                      <span className="font-mono">
                        {Math.round(deduplicatorStats.cacheHitRate * 100)}%
                      </span>
                    </div>
                  </div>
                ) : (
                  <div>Loading...</div>
                )}
              </CardContent>
            </Card>

            {/* Recent Security Events */}
            <Card className="md:col-span-2 lg:col-span-3">
              <CardHeader>
                <CardTitle>Recent Security Events</CardTitle>
              </CardHeader>
              <CardContent>
                {securityStats?.recentEvents?.length > 0 ? (
                  <div className="space-y-2 max-h-60 overflow-auto">
                    {securityStats.recentEvents.map((event: any, index: number) => (
                      <div
                        key={index}
                        className={`p-2 rounded text-sm ${
                          event.severity === 'critical'
                            ? 'bg-red-100 text-red-800'
                            : event.severity === 'high'
                            ? 'bg-orange-100 text-orange-800'
                            : event.severity === 'medium'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="font-semibold">{event.type}</span>
                            <span className="ml-2">{event.message}</span>
                          </div>
                          <span className="text-xs">
                            {new Date(event.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                        {event.metadata && (
                          <div className="mt-1 text-xs opacity-75">
                            {JSON.stringify(event.metadata)}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-gray-500">No recent security events</div>
                )}
              </CardContent>
            </Card>

            {/* API Performance Details */}
            {stats?.apiMetrics?.slowestRequest && (
              <Card className="md:col-span-2 lg:col-span-3">
                <CardHeader>
                  <CardTitle>Slowest API Request</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-50 p-3 rounded">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="font-semibold">Method:</span>
                        <div className="font-mono">{stats.apiMetrics.slowestRequest.method}</div>
                      </div>
                      <div>
                        <span className="font-semibold">URL:</span>
                        <div className="font-mono truncate">{stats.apiMetrics.slowestRequest.url}</div>
                      </div>
                      <div>
                        <span className="font-semibold">Duration:</span>
                        <div className="font-mono">{stats.apiMetrics.slowestRequest.duration}ms</div>
                      </div>
                      <div>
                        <span className="font-semibold">Status:</span>
                        <div className="font-mono">{stats.apiMetrics.slowestRequest.statusCode}</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonitoringDashboard;
