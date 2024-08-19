'use client';

import { useEffect } from 'react';

import { useAppDispatch } from '@/redux/hooks';
import { getBoards } from '@/redux/boards/boardsThunk';
import { setStatusToIdle } from '@/redux/user/userSlice';
import BoardColumns from '@/components/HomePage/Kanban/BoardColumns';

const KanbanBoard = () => {
  const dispatch = useAppDispatch();
  const accessToken = localStorage.getItem('accessToken');

  useEffect(() => {
    dispatch(setStatusToIdle());
    dispatch(getBoards(accessToken as string));
  }, [dispatch]);

  return (
    <div className="h-full">
      <BoardColumns />
    </div>
  );
};

export default KanbanBoard;
