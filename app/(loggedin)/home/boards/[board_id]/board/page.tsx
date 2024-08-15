'use client';

import { useEffect } from 'react';

import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setStatusToIdle } from '@/redux/user/userSlice';
import BoardColumns from '@/components/HomePage/Kanban/BoardColumns';

const KanbanBoard = () => {
  const dispatch = useAppDispatch();
  const { boards, boardsStatus } = useAppSelector((state) => state.boards);

  useEffect(() => {
    dispatch(setStatusToIdle());
  }, [dispatch]);

  console.log('Boards: ', boards);

  return (
    <div className="h-full">
      <BoardColumns />
    </div>
  );
};

export default KanbanBoard;
