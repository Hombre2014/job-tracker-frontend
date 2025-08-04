'use client';

import { useEffect, useRef, useCallback } from 'react';
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
  const { userId, email } = useAppSelector((state) => state.user);
  const hasInitializedRef = useRef(false);

  // With HTTP-only cookies, authentication is determined by user data
  const isAuthenticated = Boolean(userId && email);

  useEffect(() => {
    if (hasInitializedRef.current) return;

    if (isAuthenticated) {
      // User is authenticated, fetch data
      hasInitializedRef.current = true;
      console.log('Initializing user data in HomeLayout...');
      dispatch(getBoards());
      dispatch(getUser());
    } else {
      // Check if user data exists in localStorage (page refresh scenario)
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          if (userData.userId && userData.email) {
            // User data exists, dispatch getUser to validate with server
            dispatch(getUser());
            return;
          }
        } catch (error) {
          console.error('Error parsing stored user data:', error);
        }
      }

      // No authentication data found, redirect to login
      router.push('/login');
    }
  }, [isAuthenticated, router, dispatch]);

  return (
    <div className="flex h-full">
      <aside className="min-w-60">
        <Sidebar />
      </aside>
      {isAuthenticated && (
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
