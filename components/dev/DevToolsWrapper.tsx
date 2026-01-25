import React from 'react';

/**
 * DevTools wrapper that conditionally imports DevTools only in development
 * This ensures DevTools code is completely excluded from production bundles
 *
 * DevTools will only show if NEXT_PUBLIC_ENABLE_DEVTOOLS is set to 'true'
 * Use 'npm run dev:tools' to run with DevTools enabled
 */
export default function DevToolsWrapper() {
  if (
    process.env.NODE_ENV === 'development' &&
    process.env.NEXT_PUBLIC_ENABLE_DEVTOOLS === 'true'
  ) {
    const DevTools = require('./DevTools').default;
    return <DevTools />;
  }
  return null;
}
