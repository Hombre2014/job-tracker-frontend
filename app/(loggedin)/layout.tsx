'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { getUser } from '@/redux/user/userSlice';
import { getBoards } from '@/redux/boards/boardsThunk';
import Sidebar from '@/components/HomePage/SideBar/Sidebar';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';

const HomeLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { accessToken: reduxAccessToken } = useAppSelector(
    (state) => state.user
  );
  const accessToken = reduxAccessToken || localStorage.getItem('accessToken');

  useEffect(() => {
    if (!accessToken) {
      router.push('/login');
    } else {
      dispatch(getBoards(accessToken));
      dispatch(getUser(accessToken as string));
    }
  }, [accessToken, router, dispatch]);
  return (
    <div className="flex h-full">
      <aside className="min-w-60">
        <Sidebar />
      </aside>
      {accessToken && (
        <div className="mx-auto w-full h-full text-slate-700 dark:text-slate-300">
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
