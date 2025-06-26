'use client';

import TokenRefreshProvider from '@/utils/TokenRefreshProvider';

export default function AppClientProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return <TokenRefreshProvider>{children}</TokenRefreshProvider>;
}
