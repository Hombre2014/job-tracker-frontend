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
    console.log('HomePage/SideBar/Job Board useEffect getBoards dispatched');
  }, [accessToken, dispatch]);

  return (
    <div className="flex flex-col">
      {boards.map((board) => (
        <JobBoardTitle
          key={board.id}
          id={board.id}
          name={board.name}
          columns={[]}
          isArchived={board.isArchived}
          userId={board.userId}
        />
      ))}
    </div>
  );
};

export default JobBoard;
