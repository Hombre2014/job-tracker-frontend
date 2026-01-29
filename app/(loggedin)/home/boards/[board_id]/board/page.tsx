'use client';

import { useEffect, Suspense } from 'react';

import { getBoards } from '@/redux/boards/boardsThunk';
import { setStatusToIdle } from '@/redux/user/userSlice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import BoardColumns from '@/components/HomePage/Kanban/Column/BoardColumns';

const KanbanBoard = () => {
  const dispatch = useAppDispatch();
  const accessToken = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  const { jobPosts } = useAppSelector((state) => state.jobs);

  // Check it out. It reduces the number of requests to the server.
  useEffect(() => {
    if (jobPosts.length >= 0 && accessToken) {
      dispatch(getBoards(accessToken));
    }
  }, [dispatch, accessToken, jobPosts]);

  useEffect(() => {
    return () => {
      dispatch(setStatusToIdle());
    };
  }, [dispatch]);

  return (
    <div className="h-full">
      <Suspense fallback={<div className="p-8 text-center text-slate-500">Loading board...</div>}>
        <BoardColumns />
      </Suspense>
    </div>
  );
};

export default KanbanBoard;
