'use client';

import { useParams } from 'next/navigation';
import { ChangeEvent, useEffect, useState } from 'react';

import ThreeDotsMenu from './ThreeDotsMenu';
import { Input } from '@/components/ui/input';
import JobPostCard from './JobPosts/JobPostCard';
import { returnBoardIcon } from '@/utils/ReturnIcons';
import { createJobPost } from '@/redux/jobs/jobsThunk';
import AlertDialogModal from '../../Boards/AlertDialogModal';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { getBoards, updateColumnName } from '@/redux/boards/boardsThunk';
import AddJobShortForm from '@/components/Forms/AddJobShort/AddJobShortForm';

const BoardColumns = () => {
  const { board_id } = useParams();
  const dispatch = useAppDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const columnId = localStorage.getItem('columnId');
  const accessToken = localStorage.getItem('accessToken');
  const [currentColumnId, setCurrentColumnId] = useState('');
  const { boards } = useAppSelector((state) => state.boards);
  const { jobPosts } = useAppSelector((state) => state.jobs);
  const [renamedColumnName, setRenamedColumnName] = useState('');
  const currentBoard = boards.find((board) => board.id === board_id);

  useEffect(() => {
    if (isEditing) {
      const currentInputElement = document.getElementById(currentColumnId);
      if (currentColumnId === currentInputElement!.id) {
        currentInputElement!.focus();
        currentInputElement!.select();
      }
    } else {
      dispatch(getBoards(accessToken as string));
    }
  }, [isEditing, currentColumnId, accessToken, dispatch, jobPosts]);

  console.log('jobPosts: ', jobPosts);

  if (!currentBoard) return null;

  const { columns: boardColumns } = currentBoard;

  const handleColumnNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setRenamedColumnName(e.target.value);
  };

  const confirmColumnNameChange = () => {
    setIsEditing(false);
    dispatch(
      updateColumnName({
        accessToken,
        name: renamedColumnName,
        id: currentColumnId,
      })
    );
    dispatch(getBoards(accessToken as string));
  };

  const checkForEnter = (e: any) => {
    if (e.key === 'Enter') {
      confirmColumnNameChange();
    }
  };

  const createJobApplication = () => {
    const jobPost = {
      title: localStorage.getItem('jobTitle'),
      companyName: localStorage.getItem('company'),
      columnId,
      accessToken: accessToken as string,
    };

    dispatch(createJobPost(jobPost));
  };

  return (
    <div className="w-full flex h-full">
      {boardColumns &&
        boardColumns.map((column) => (
          <section
            key={column.order + 1}
            className="flex flex-col border-r border-slate-200 w-1/5"
          >
            <div className="flex items-center justify-between px-4 pt-8">
              {returnBoardIcon(column.order + 1)}
              <p className="hover:bg-slate-200 px-2 py-1 rounded-md cursor-text transition duration-300 delay-150 mx-2">
                <Input
                  id={column.id}
                  value={
                    column.id === currentColumnId
                      ? renamedColumnName.toUpperCase()
                      : column.name.toUpperCase()
                  }
                  className="text-lg font-semibold text-center w-full border-none outline-none shadow-none active:outline-none active:shadow-none active:border-none"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsEditing(true);
                    setRenamedColumnName(column.name);
                    setCurrentColumnId(column.id);
                  }}
                  onChange={(e) => handleColumnNameChange(e)}
                  onKeyDown={(e) => checkForEnter(e)}
                  onBlur={confirmColumnNameChange}
                />
              </p>
              <ThreeDotsMenu columnOrder={column.order} />
            </div>
            <div className="w-full flex justify-center">
              <p className="mb-8 text-center">
                {column.jobApplications && column.jobApplications.length} JOBS
              </p>
            </div>
            <AlertDialogModal
              buttonLabel="+"
              buttonVariant="outline"
              dialogTitle="Add Job"
              buttonCancel="Discard"
              buttonConfirm="Save Job"
              actionFunction={createJobApplication}
              stylings="w-11/12 flex justify-center text-2xl border py-3 mb-4 mx-auto rounded-md hover:border-blue-500 transition duration-300 delay-150 cursor-pointer"
            >
              <AddJobShortForm columnOrder={column.order} />
            </AlertDialogModal>
            {column.jobApplications &&
              column.jobApplications.map((job) => (
                <JobPostCard
                  key={job.id}
                  id={job.id}
                  columnId={column.id}
                  title={job.title}
                  companyName={
                    jobPosts.find((jobPost) => jobPost.id === job.id)?.company
                      .name!
                  }
                  status="Job Moved"
                  timeStamp="August 30th 2024, 10:44 am"
                />
              ))}
          </section>
        ))}
    </div>
  );
};

export default BoardColumns;
