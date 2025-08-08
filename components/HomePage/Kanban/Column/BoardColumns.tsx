'use client';

import { CSS } from '@dnd-kit/utilities';
import { useParams, useRouter } from 'next/navigation';
import { ChangeEvent, useEffect, useState, useMemo } from 'react';
import {
  useSensor,
  DndContext,
  useSensors,
  DragOverlay,
  useDraggable,
  useDroppable,
  PointerSensor,
  closestCorners,
} from '@dnd-kit/core';

import ThreeDotsMenu from './ThreeDotsMenu';
import { Input } from '@/components/ui/input';
import JobPostCard from './JobPosts/JobPostCard';
import { cleanupAfterJobPost } from '@/utils/helpers';
import { returnBoardIcon } from '@/utils/ReturnIcons';
import { createJobPost } from '@/redux/jobs/jobsThunk';
import { updateJobPost } from '@/redux/jobs/jobsThunk';
import AlertDialogModal from '../../Boards/AlertDialogModal';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { getBoards, updateColumnName } from '@/redux/boards/boardsThunk';
import AddJobShortForm from '@/components/Forms/AddJobShort/AddJobShortForm';

const BoardColumns = () => {
  const router = useRouter();
  const { board_id } = useParams();
  const dispatch = useAppDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const accessToken = localStorage.getItem('accessToken');
  const [overId, setOverId] = useState<string | null>(null);
  const [currentColumnId, setCurrentColumnId] = useState('');
  const { boards } = useAppSelector((state) => state.boards);
  const { jobPosts } = useAppSelector((state) => state.jobs);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [renamedColumnName, setRenamedColumnName] = useState('');

  // Memoize currentBoard to prevent unnecessary re-renders
  const currentBoard = useMemo(() => {
    return boards.find((board) => board.id === board_id);
  }, [boards, board_id]);

  // Memoize boardColumns to prevent forms from re-mounting
  const boardColumns = useMemo(() => {
    return currentBoard?.columns || [];
  }, [currentBoard?.columns]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  useEffect(() => {
    console.log(
      '🔄 BoardColumns effect triggered - isEditing:',
      isEditing,
      'currentColumnId:',
      currentColumnId
    );

    if (isEditing) {
      const currentInputElement = document.getElementById(
        currentColumnId
      ) as HTMLInputElement | null;
      if (currentColumnId === currentInputElement!.id) {
        currentInputElement!.focus();
        currentInputElement!.select();
      }
    } else {
      console.log('📡 Dispatching getBoards from BoardColumns effect');
      dispatch(getBoards(accessToken as string));
    }
  }, [isEditing, currentColumnId, accessToken, dispatch]);

  if (!currentBoard) return null;

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
    console.log('🚀 Creating job application');
    
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

  const handleDragStart = (event: any) => {
    console.log('🖱️ Drag started:', event.active.id);
    setActiveId(event.active.id);
  };

  const handleDragOver = (event: any) => {
    const { over } = event;
    console.log('🖱️ Drag over:', over?.id);
    setOverId(over?.id || null);
  };

  const handleDragEnd = (event: any) => {
    console.log('🖱️ Drag ended');
    const { active, over } = event;
    setActiveId(null);
    setOverId(null);

    if (!over) return;

    // Find the dragged job
    let draggedJob = null;
    for (const column of boardColumns) {
      const job = column.jobApplications?.find((job) => job.id === active.id);
      if (job) {
        draggedJob = job;
        break;
      }
    }

    const targetColumn = boardColumns.find((col) => col.id === over.id);

    if (!draggedJob || !targetColumn) return;

    // Find current column
    const currentColumn = boardColumns.find((col) =>
      col.jobApplications?.some((job) => job.id === draggedJob.id)
    );

    if (!currentColumn || currentColumn.id === targetColumn.id) return;

    const currentColumnOrder = currentColumn.order;
    const newColumnOrder = targetColumn.order;

    // Apply same status logic as handleSelectList from layout.tsx
    let newStatus: jobPostStatus = draggedJob.status;

    if (newColumnOrder === 4 || newColumnOrder < currentColumnOrder) {
      newStatus = 'Job Moved';
    } else {
      switch (newColumnOrder) {
        case 0:
          newStatus = 'Job Created';
          break;
        case 1:
          newStatus = 'Applied';
          break;
        case 2:
          newStatus = 'Interview';
          break;
        case 3:
          newStatus = 'Offer Received';
          break;
        default:
          newStatus = draggedJob.status;
      }
    }

    dispatch(
      updateJobPost({
        accessToken,
        status: newStatus,
        jobPostId: draggedJob.id,
        columnId: targetColumn.id,
        statusChangedTime: new Date().toISOString(),
        company: {
          name: draggedJob.company.name,
        },
      })
    );
  };

  const DraggableJobPostCard = (props: JobPostCardProps) => {
    const { attributes, listeners, setNodeRef, transform, isDragging } =
      useDraggable({ id: props.id });

    const style = {
      transform: CSS.Translate.toString(transform),
      opacity: isDragging ? 0.5 : 1,
    };

    return (
      <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
        <JobPostCard {...props} />
      </div>
    );
  };

  const DroppableColumn = ({
    column,
    children,
  }: {
    column: any;
    children: React.ReactNode;
  }) => {
    const { setNodeRef, isOver } = useDroppable({
      id: column.id,
    });

    return (
      <section
        ref={setNodeRef}
        key={column.order + 1}
        className={`flex flex-col border-r border-slate-200 w-1/5 transition-all duration-200 min-h-[600px] flex-1 ${
          isOver
            ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-600'
            : ''
        }`}
      >
        {children}
      </section>
    );
  };

  return (
    <DndContext
      sensors={sensors}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      onDragStart={handleDragStart}
      collisionDetection={closestCorners}
    >
      <div className="w-full flex h-full">
        {boardColumns &&
          boardColumns.map((column) => (
            <DroppableColumn key={column.id} column={column}>
              <div className="flex items-center justify-between px-4 pt-8">
                {returnBoardIcon(column.order + 1)}
                <p className="hover:bg-slate-200 dark:hover:bg-slate-700 px-2 py-1 rounded-md cursor-text transition duration-300 delay-150 mx-2">
                  <Input
                    id={column.id}
                    value={
                      column.id === currentColumnId
                        ? renamedColumnName.toUpperCase()
                        : column.name.toUpperCase()
                    }
                    className="text-lg font-semibold text-center w-full border-none outline-none shadow-none active:outline-none active:shadow-none active:border-none dark:text-white dark:bg-transparent focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-400"
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
                <p className="mb-8 text-center dark:text-white">
                  {column.jobApplications?.length}{' '}
                  {column.jobApplications?.length === 1 ? 'JOB' : 'JOBS'}
                </p>
              </div>
              <AlertDialogModal
                buttonLabel="+"
                cleanupType="job"
                dialogTitle="Add Job"
                buttonCancel="Discard"
                buttonVariant="outline"
                buttonConfirm="Save Job"
                actionFunction={createJobApplication}
                stylings="w-11/12 flex justify-center text-2xl border py-3 mb-4 mx-auto rounded-md hover:border-blue-500 transition duration-300 delay-150 cursor-pointer"
              >
                <AddJobShortForm
                  columnOrder={column.order}
                />
              </AlertDialogModal>
              {column.jobApplications &&
                column.jobApplications.map((job) =>
                  job.company !== null ? (
                    <DraggableJobPostCard
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
            </DroppableColumn>
          ))}
      </div>
      <DragOverlay>
        {activeId ? (
          <div className="transform rotate-3 opacity-90">
            {(() => {
              const draggedJob = jobPosts.find((job) => job.id === activeId);
              return draggedJob ? (
                <JobPostCard
                  id={draggedJob.id}
                  notes={draggedJob.notes}
                  title={draggedJob.title}
                  color={draggedJob.color}
                  status={draggedJob.status}
                  postUrl={draggedJob.postUrl}
                  deadline={draggedJob.deadline}
                  columnId={draggedJob.column_id}
                  timeStamp={draggedJob.createdAt}
                  companyName={draggedJob.company.name}
                  statusChangedTime={draggedJob.statusChangedAt}
                />
              ) : null;
            })()}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default BoardColumns;
