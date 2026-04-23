'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getUser } from '@/redux/user/userSlice';
import { getBoards } from '@/redux/boards/boardsThunk';
import Sidebar from '@/components/HomePage/SideBar/Sidebar';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';

const HomeLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector((state) => state.user) ? true : false;

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('user') ? true : false;
    if (!isAuthenticated) {
      router.push('/login');
    } else {
      dispatch(getBoards());
      dispatch(getUser());
    }
  }, [router, dispatch]);
  return (
    <div className="flex h-screen bg-white dark:bg-slate-900">
      <aside className="min-w-60">
        <Sidebar />
      </aside>
      {isAuthenticated && (
        <div className="mx-auto w-full h-full text-slate-700 dark:text-slate-300 flex flex-col">
          {children}
        </div>
      )}
    </div>
  );
};

export default HomeLayout;
