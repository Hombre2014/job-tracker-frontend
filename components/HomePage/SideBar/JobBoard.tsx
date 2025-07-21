'use client';

import { useEffect } from 'react';

import JobBoardTitle from './JobBoardTitle';
import { getBoards } from '@/redux/boards/boardsThunk';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';

const JobBoard = () => {
  const dispatch = useAppDispatch();
  const { boards } = useAppSelector((state) => state.boards);
  const { accessToken } = useAppSelector((state) => state.user);

  useEffect(() => {
    dispatch(getBoards(accessToken as string));
  }, [accessToken, dispatch]);

  return (
    <div className="flex flex-col">
      {boards.map((board) => (
        <JobBoardTitle
          columns={[]}
          id={board.id}
          key={board.id}
          name={board.name}
          userId={board.userId}
          isArchived={board.isArchived}
        />
      ))}
    </div>
  );
};

export default JobBoard;
