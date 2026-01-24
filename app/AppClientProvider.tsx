'use client';

import AuthProvider from '@/components/auth/AuthProvider';

export default function AppClientProviders({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <AuthProvider>{children}</AuthProvider>;
}
