'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const HomeLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      router.push('/login');
    }
    setAccessToken(accessToken);
  }, [router]);

  return (
    <>
      {accessToken && (
        <div className="mx-auto w-full h-full text-slate-700 dark:text-slate-300">
          {children}
        </div>
      )}
    </>
  );
};

export default HomeLayout;
