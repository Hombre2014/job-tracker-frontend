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
  const { accessToken } = useAppSelector((state) => state.user);

  useEffect(() => {
    let token: string | null | undefined = accessToken;
    if (!token) {
      try {
        token = localStorage.getItem('accessToken');
      } catch {
        token = null;
      }
    }

    if (!token) {
      router.push('/login');
    } else {
      dispatch(getBoards(token));
      dispatch(getUser());
    }
  }, [accessToken, router, dispatch]);
  return (
    <div className="flex h-screen bg-white dark:bg-slate-900">
      <aside className="min-w-60">
        <Sidebar />
      </aside>
      {accessToken && (
        <div className="mx-auto w-full h-full text-slate-700 dark:text-slate-300 flex flex-col">
          {children}
        </div>
      )}
    </div>
  );
};

export default HomeLayout;
