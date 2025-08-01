import React from 'react';

/**
 * DevTools wrapper that conditionally imports DevTools only in development
 * This ensures DevTools code is completely excluded from production bundles
 */
export default function DevToolsWrapper() {
  if (process.env.NODE_ENV === 'development') {
    const DevTools = require('./DevTools').default;
    return <DevTools />;
  }
  return null;
}
