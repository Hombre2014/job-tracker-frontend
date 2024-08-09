'use client';

import { useEffect } from 'react';

import { useAppDispatch } from '@/redux/hooks';
import { setStatusToIdle } from '@/redux/user/userSlice';
import BoardColumns from '@/components/HomePage/Kanban/BoardColumns';

const KanbanBoard = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setStatusToIdle());
  }, [dispatch]);

  return (
    <div className="h-full">
      <BoardColumns />
    </div>
  );
};

export default KanbanBoard;
