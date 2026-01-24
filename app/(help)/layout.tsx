'use client';

import { useAppSelector } from '@/redux/hooks';
import Navbar from '@/components/LandingPage/Navbar';
import Sidebar from '@/components/HomePage/SideBar/Sidebar';

const HelpLayout = ({ children }: { children: React.ReactNode }) => {
  // Check authentication state
  const { accessToken: reduxAccessToken } = useAppSelector(
    (state) => state.user
  );
  const accessToken =
    reduxAccessToken || (typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null);

  const isAuthenticated = !!accessToken;

  // Logged-in users: Render with Sidebar (like home pages)
  if (isAuthenticated) {
    return (
      <div className="flex h-full bg-white dark:bg-slate-900">
        <aside className="min-w-60">
          <Sidebar />
        </aside>
        <div className="mx-auto w-full h-full text-slate-700 dark:text-slate-300 overflow-auto">
          {children}
        </div>
      </div>
    );
  }

  // Not logged-in: Render with Navbar (like landing pages)
  return (
    <>
      <Navbar />
      {children}
    </>
  );
};

export default HelpLayout;
