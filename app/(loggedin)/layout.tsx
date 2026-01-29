'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

import { getUser } from '@/redux/user/userSlice';
import { getBoards } from '@/redux/boards/boardsThunk';
import { useAuth } from '@/components/auth/AuthProvider';
import Sidebar from '@/components/HomePage/SideBar/Sidebar';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';

const HomeLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { authState } = useAuth();
  const { accessToken } = useAppSelector((state) => state.user);

  useEffect(() => {
    if (authState.isLoading) return;

    if (!authState.isAuthenticated) {
      router.push('/login');
    } else {
      // Sync Boards and User data if authenticated
      const token = accessToken || localStorage.getItem('accessToken');
      if (token) {
        dispatch(getBoards(token));
        dispatch(getUser());
      }
    }
  }, [authState.isAuthenticated, authState.isLoading, accessToken, router, dispatch]);
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
      <ToastContainer
        draggable
        rtl={false}
        pauseOnHover
        closeOnClick
        theme="colored"
        className="mr-4"
        pauseOnFocusLoss
        autoClose={3000}
        newestOnTop={false}
        position="top-right"
        hideProgressBar={false}
      />
    </div>
  );
};

export default HomeLayout;
