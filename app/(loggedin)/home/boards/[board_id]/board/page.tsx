'use client';

import { useEffect } from 'react';

import { useAppDispatch } from '@/redux/hooks';
import { getBoards } from '@/redux/boards/boardsThunk';
import { setStatusToIdle } from '@/redux/user/userSlice';
import BoardColumns from '@/components/HomePage/Kanban/Column/BoardColumns';

const KanbanBoard = () => {
  const dispatch = useAppDispatch();
  const accessToken = localStorage.getItem('accessToken');

  useEffect(() => {
    dispatch(getBoards(accessToken as string));
  }, [dispatch, accessToken]);

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
