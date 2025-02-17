'use client';

import { useParams, useRouter } from 'next/navigation';
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
import { cleanupAfterJobPost } from '@/utils/helpers';

const BoardColumns = () => {
  const router = useRouter();
  const { board_id } = useParams();
  const dispatch = useAppDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const accessToken = localStorage.getItem('accessToken');
  const [currentColumnId, setCurrentColumnId] = useState('');
  const { boards } = useAppSelector((state) => state.boards);
  const { jobPosts } = useAppSelector((state) => state.jobs);
  const [renamedColumnName, setRenamedColumnName] = useState('');
  const currentBoard = boards.find((board) => board.id === board_id);

  useEffect(() => {
    if (isEditing) {
      const currentInputElement = document.getElementById(
        currentColumnId
      ) as HTMLInputElement | null;
      if (currentColumnId === currentInputElement!.id) {
        currentInputElement!.focus();
        currentInputElement!.select();
      }
    } else {
      dispatch(getBoards(accessToken as string));
    }
  }, [isEditing, currentColumnId, accessToken, dispatch, jobPosts]);

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
        id: currentColumnId,
        name: renamedColumnName,
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
    if (!isFormValid) return;

    const jobPost = {
      status: 'Job Created',
      accessToken: accessToken as string,
      title: localStorage.getItem('jobTitle'),
      columnId: localStorage.getItem('columnId'),
      companyId: localStorage.getItem('companyId'),
    };

    dispatch(createJobPost(jobPost)).then((result) => {
      const newJobPostId = result.payload.id;
      router.push(`/home/boards/${board_id}/job/${newJobPostId}/job-details`);
    });
    dispatch(getBoards(accessToken as string));

    cleanupAfterJobPost();
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
                    setCurrentColumnId(column.id);
                    setRenamedColumnName(column.name);
                  }}
                  onBlur={confirmColumnNameChange}
                  onKeyDown={(e) => checkForEnter(e)}
                  onChange={(e) => handleColumnNameChange(e)}
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
              dialogTitle="Add Job"
              buttonCancel="Discard"
              buttonVariant="outline"
              buttonConfirm="Save Job"
              isFormValid={isFormValid}
              actionFunction={createJobApplication}
              stylings="w-11/12 flex justify-center text-2xl border py-3 mb-4 mx-auto rounded-md hover:border-blue-500 transition duration-300 delay-150 cursor-pointer"
            >
              <AddJobShortForm
                columnOrder={column.order}
                onValidationChange={setIsFormValid}
              />
            </AlertDialogModal>
            {column.jobApplications &&
              column.jobApplications.map((job) =>
                job.company !== null ? (
                  <JobPostCard
                    id={job.id}
                    key={job.id}
                    notes={job.notes}
                    title={job.title}
                    color={job.color}
                    status={job.status}
                    columnId={column.id}
                    postUrl={job.postUrl}
                    deadline={job.deadline}
                    timeStamp={job.createdAt}
                    companyName={job.company.name}
                    statusChangedTime={job.statusChangedAt}
                  />
                ) : null
              )}
          </section>
        ))}
    </div>
  );
};

export default BoardColumns;
