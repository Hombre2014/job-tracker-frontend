'use client';

import JobBoardTitle from './JobBoardTitle';
import { useAppSelector } from '@/redux/hooks';

const JobBoard = () => {
  const { boards } = useAppSelector((state) => state.boards);

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
