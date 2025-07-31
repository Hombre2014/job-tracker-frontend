'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import MonitoringDashboard from '@/components/admin/MonitoringDashboard';
import { useAppSelector } from '@/redux/hooks';
import PerformanceMonitor from '@/utils/PerformanceMonitor';

const DevTools: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showMonitoring, setShowMonitoring] = useState(false);
  const [position, setPosition] = useState({ x: 20, y: 20 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [loggingEnabled, setLoggingEnabled] = useState(false);

  const user = useAppSelector((state) => state.user);

  // Only show in development mode
  useEffect(() => {
    setIsVisible(process.env.NODE_ENV === 'development');
  }, []);

  // Keyboard shortcut to toggle (Ctrl+Shift+D)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.shiftKey && event.key === 'D') {
        event.preventDefault();
        setIsVisible((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Mouse drag handlers
  const handleMouseDown = (event: React.MouseEvent) => {
    setIsDragging(true);
    setDragOffset({
      x: event.clientX - position.x,
      y: event.clientY - position.y,
    });
  };

  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      if (isDragging) {
        setPosition({
          x: event.clientX - dragOffset.x,
          y: event.clientY - dragOffset.y,
        });
      }
    },
    [isDragging, dragOffset]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragOffset, handleMouseMove, handleMouseUp]);

  const clearLocalStorage = () => {
    const confirmClear = window.confirm(
      'Are you sure you want to clear all localStorage data?'
    );
    if (confirmClear) {
      localStorage.clear();
      window.location.reload();
    }
  };

  const simulateError = () => {
    throw new Error('Simulated error for testing');
  };

  const toggleLogging = () => {
    if (loggingEnabled) {
      PerformanceMonitor.disableAllLogging();
      setLoggingEnabled(false);
      console.log('🔇 Performance monitoring console logs disabled');
    } else {
      PerformanceMonitor.setLogging({
        api: true,
        memory: false, // Keep memory logs disabled (too noisy)
        user: false,
        auth: true,
      });
      setLoggingEnabled(true);
      console.log(
        '🔊 Performance monitoring console logs enabled (API + Auth only)'
      );
    }
  };

  const logUserState = () => {
    console.log('Current User State:', user);
    try {
      console.log('LocalStorage user:', localStorage.getItem('user'));
      console.log('LocalStorage tokens:', {
        accessToken: localStorage.getItem('accessToken'),
        refreshToken: localStorage.getItem('refreshToken'),
      });
    } catch (error) {
      console.log('LocalStorage access failed:', error);
    }
  };

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
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      console.log('Test API Response:', response.status, await response.json());
    } catch (error) {
      console.error('Test API Error:', error);
    }
  };

  if (!isVisible) return null;

  return (
    <>
      <div
        className="fixed z-50 bg-gray-900 text-white p-2 rounded-lg shadow-lg cursor-move select-none"
        style={{
          left: position.x,
          top: position.y,
          minWidth: '200px',
        }}
        onMouseDown={handleMouseDown}
      >
        <div className="text-xs font-bold mb-2 text-center">🛠️ Dev Tools</div>

        <div className="space-y-1">
          <Button
            size="sm"
            variant="outline"
            className="w-full text-xs h-6"
            onClick={() => setShowMonitoring(true)}
          >
            📊 Monitoring
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={logUserState}
            className="w-full text-xs h-6"
          >
            👤 Log User State
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={testApiCall}
            className="w-full text-xs h-6"
          >
            🌐 Test API
          </Button>

          <Button
            size="sm"
            variant="destructive"
            onClick={clearLocalStorage}
            className="w-full text-xs h-6"
          >
            🗑️ Clear Storage
          </Button>

          <Button
            size="sm"
            variant="destructive"
            onClick={simulateError}
            className="w-full text-xs h-6"
          >
            💥 Simulate Error
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={toggleLogging}
            className="w-full text-xs h-6"
          >
            {loggingEnabled ? '🔇 Disable Logs' : '🔊 Enable Logs'}
          </Button>

          <div className="border-t border-gray-600 pt-1 mt-1">
            <div className="text-xs text-gray-300">
              User: {user.firstName || 'Not logged in'}
            </div>
            <div className="text-xs text-gray-300">
              Token:{' '}
              {(() => {
                try {
                  return localStorage.getItem('accessToken') ? '✅' : '❌';
                } catch {
                  return '❌';
                }
              })()}
            </div>
          </div>

          <Button
            size="sm"
            variant="ghost"
            onClick={() => setIsVisible(false)}
            className="w-full text-xs h-6 text-gray-400 hover:text-white"
          >
            ✕ Hide
          </Button>
        </div>

        <div className="text-xs text-gray-400 text-center mt-1">
          Ctrl+Shift+D to toggle
        </div>
      </div>

      <MonitoringDashboard
        isVisible={showMonitoring}
        onClose={() => setShowMonitoring(false)}
      />
    </>
  );
};

export default DevTools;
