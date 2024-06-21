'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { getBoards } from '@/redux/boards/boardsThunk';
import Sidebar from '@/components/HomePage/SideBar/Sidebar';

const HomeLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { accessToken } = useAppSelector((state) => state.user);
  // const accessToken = localStorage.getItem('accessToken');
  console.log('accessToken in loggedIn layout', accessToken);

  useEffect(() => {
    if (!accessToken) {
      router.push('/login');
    } else {
      dispatch(getBoards(accessToken));
    }
  }, [accessToken, router, dispatch]);

  return (
    <div className="flex h-full">
      <aside className="min-w-52">
        <Sidebar />
      </aside>
      {accessToken && (
        <div className="mx-auto w-full h-full text-slate-700 dark:text-slate-300">
          {children}
        </div>
      )}
    </div>
  );
};

export default HomeLayout;
