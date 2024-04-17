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

  const { userId, email, accessToken, refreshToken } = useAppSelector(
    (state) => state.user
  );

  return (
    <div className="flex h-full">
      <aside className="w-52">
        <Sidebar />
      </aside>
      <section className="flex w-5/6">
        <div className="flex flex-col">
          <nav>
            <HomeNavbar />
          </nav>
          <main>
            <BoardColumn />
          </main>
          <p>User ID: {userId}</p>
          <p>Email: {email}</p>
          <p>AccessToken: {accessToken}</p>
          <p>RefreshToken: {refreshToken}</p>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
