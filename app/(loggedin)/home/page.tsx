'use client';

import { useEffect } from 'react';

import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import BoardColumn from '@/components/HomePage/BoardColumn';
import HomeNavbar from '@/components/HomePage/HomeNavbar';
import Sidebar from '@/components/HomePage/Sidebar';
import { isLoggedIn } from '@/redux/user/userThunk';

const HomePage = () => {
  const dispatch = useAppDispatch();
  const isLoggedInStatus = useAppSelector((state) => state.user.status);
  useEffect(() => {
    if (isLoggedInStatus === 'idle') {
      dispatch(isLoggedIn());
    }
  }, [isLoggedInStatus, dispatch]);

  return (
    <div className="flex h-full">
      <aside className="min-w-52">
        <Sidebar />
      </aside>
      <section className="flex w-full">
        <div className="flex flex-col w-full">
          <div className="w-full">
            <HomeNavbar />
          </div>
          <main>
            <BoardColumn />
          </main>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
