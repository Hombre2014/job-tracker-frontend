'use client';

import { useEffect } from 'react';

import { getBoards } from '@/redux/boards/boardsThunk';
import { setStatusToIdle } from '@/redux/user/userSlice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import BoardColumns from '@/components/HomePage/Kanban/Column/BoardColumns';

const KanbanBoard = () => {
  const dispatch = useAppDispatch();
  const { jobPosts } = useAppSelector((state) => state.jobs);

  // Check it out. It reduces the number of requests to the server.
  useEffect(() => {
    if (jobPosts.length >= 0) {
      dispatch(getBoards());
    }
  }, [dispatch, jobPosts]);

  useEffect(() => {
    return () => {
      dispatch(setStatusToIdle());
    };
  }, [dispatch]);

  return (
    <div className="h-full">
      <BoardColumns />
    </div>
  );
};

export default KanbanBoard;
