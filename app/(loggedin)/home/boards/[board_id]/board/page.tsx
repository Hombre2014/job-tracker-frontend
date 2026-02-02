'use client';

import { useEffect, Suspense } from 'react';

import { getBoards } from '@/redux/boards/boardsThunk';
import { setStatusToIdle } from '@/redux/user/userSlice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import BoardColumns from '@/components/HomePage/Kanban/Column/BoardColumns';

const KanbanBoard = () => {
  const dispatch = useAppDispatch();
  const { jobPosts } = useAppSelector((state) => state.jobs);
  const { accessToken } = useAppSelector((state) => state.user);

  // Fetch boards only when no job posts are loaded yet to reduce server requests
  useEffect(() => {
    if (jobPosts.length === 0 && accessToken) {
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
      <Suspense
        fallback={
          <div className="p-8 text-center text-slate-500">Loading board...</div>
        }
      >
        <BoardColumns />
      </Suspense>
    </div>
  );
};

export default KanbanBoard;
