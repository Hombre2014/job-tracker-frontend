'use client';

import { toast } from 'react-toastify';
import { CSS } from '@dnd-kit/utilities';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { ChangeEvent, useEffect, useState, useMemo, useRef } from 'react';
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
import AlertDialogModal from '../../Boards/AlertDialogModal';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { createCompany } from '@/redux/companies/companiesThunk';
import { createJobPost, updateJobPost } from '@/redux/jobs/jobsThunk';
import { retrieveJobDraftFromExtension } from '@/lib/extensionBridge';
import { getBoards, updateColumnName } from '@/redux/boards/boardsThunk';
import AddJobShortForm from '@/components/Forms/AddJobShort/AddJobShortForm';
import {
  getSearchSummary,
  countFilteredJobs,
  filterBoardColumns,
} from '@/utils/searchUtils';

// Draggable wrapper component for job post cards
const DraggableJobPostCard = (props: JobPostCardProps) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id: props.id });

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0 : 1, // Make original invisible when dragging (DragOverlay shows preview)
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <JobPostCard {...props} />
    </div>
  );
};

// Column interface for type checking
interface Column {
  id: string;
  order: number;
  name: string;
  jobApplications?: { id: string }[];
}

// Droppable wrapper component for columns
const DroppableColumn = ({
  column,
  children,
}: {
  column: Column;
  children: React.ReactNode;
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  });

  return (
    <section
      ref={setNodeRef}
      key={column.order + 1}
      className={`flex flex-col border-r border-slate-200 w-1/5 transition-all duration-200 flex-1 ${
        isOver
          ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-600'
          : ''
      }`}
    >
      {children}
    </section>
  );
};

const BoardColumns = () => {
  const router = useRouter();
  const { board_id } = useParams();
  const dispatch = useAppDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const accessToken = localStorage.getItem('accessToken');
  const [currentColumnId, setCurrentColumnId] = useState('');
  const { boards } = useAppSelector((state) => state.boards);
  const focusTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [renamedColumnName, setRenamedColumnName] = useState('');
  const { query, isActive } = useAppSelector((state) => state.search);

  // Memoize currentBoard to prevent unnecessary re-renders
  const currentBoard = useMemo(() => {
    return boards.find((board) => board.id === board_id);
  }, [boards, board_id]);

  // Memoize boardColumns to prevent forms from re-mounting
  const boardColumns = useMemo(() => {
    return currentBoard?.columns || [];
  }, [currentBoard?.columns]);

  // Apply search filtering to columns
  const filteredColumns = useMemo(() => {
    // If no query at all, show all columns
    if (!query.trim()) {
      return boardColumns;
    }
    // If query exists but not active (< 2 characters), show no filtering applied
    if (!isActive) {
      // For development: log when we have a query but it's not active
      if (process.env.NODE_ENV === 'development') {
        console.log(
          `Search not active for query "${query}" (length: ${query.length})`,
        );
      }
      return boardColumns;
    }
    // Apply actual filtering for active searches
    return filterBoardColumns(boardColumns, query);
  }, [boardColumns, query, isActive]);

  const searchParams = useSearchParams();
  const arrivalProcessed = useRef(false);

  // Get search summary for status indicators
  const searchSummary = useMemo(() => {
    // Only compute search summary for active searches
    if (!isActive || !query.trim() || query.trim().length < 2) {
      return {
        totalJobs: countFilteredJobs(boardColumns),
        filteredJobs: countFilteredJobs(boardColumns),
        isFiltering: false,
        hasResults: true,
        keywords: [],
      };
    }
    return getSearchSummary(boardColumns, filteredColumns, query);
  }, [boardColumns, filteredColumns, query, isActive]);

  // Handle Arrival Auto-Save from Extension
  useEffect(() => {
    const autoSave = searchParams.get('autoSave') === 'true';
    const company = searchParams.get('company');
    const companyDomain = searchParams.get('companyDomain');
    const companyLogo = searchParams.get('companyLogo');
    const title = searchParams.get('title');
    const jobDataKey = searchParams.get('jobDataKey'); // NEW: Storage key for full data

    if (
      autoSave &&
      company &&
      title &&
      !arrivalProcessed.current &&
      accessToken &&
      boardColumns.length > 0
    ) {
      arrivalProcessed.current = true;

      const handleArrivalAutoSave = async () => {
        setIsSubmittingJob(true);
        try {
          // NEW: Try to retrieve full data from extension if jobDataKey exists
          let jobData = null;
          if (jobDataKey) {
            jobData = await retrieveJobDraftFromExtension(jobDataKey);
          }

          // Use data from extension storage (full description) or fallback to URL params (truncated)
          const finalDescription =
            jobData?.description || searchParams.get('description') || '';
          const finalLocation =
            jobData?.location || searchParams.get('location') || '';
          const finalSalary =
            jobData?.salary || searchParams.get('salary') || '';
          const finalPostUrl = jobData?.url || searchParams.get('url') || '';
          const finalCompanyDomain =
            jobData?.companyDomain || companyDomain || '';
          // Handle logo: prefer explicit null over empty string
          const finalCompanyLogo =
            jobData?.companyLogo !== undefined
              ? jobData.companyLogo
              : companyLogo || null;

          // Create company first if needed
          let companyId = '';
          const createCompanyResult = await dispatch(
            createCompany({
              accessToken,
              name: company,
              url: finalCompanyDomain,
              logo: finalCompanyLogo,
            }),
          ).unwrap();
          companyId = createCompanyResult.id;

          // Create the job application in the specified column or first column
          const selectedColumnId =
            searchParams.get('columnId') || boardColumns[0].id;
          const selectedColumn =
            boardColumns.find((c) => c.id === selectedColumnId) ||
            boardColumns[0];

          const result = await dispatch(
            createJobPost({
              status: 'Job Created',
              accessToken: accessToken as string,
              title: title,
              columnId: selectedColumn.id,
              companyId: companyId,
              location: finalLocation,
              description: finalDescription, // Full description if retrieved from extension!
              postUrl: finalPostUrl,
              salary: finalSalary,
            }),
          ).unwrap();

          if (result?.id) {
            // Set required localStorage for the details layout
            localStorage.setItem('columnId', selectedColumn.id);
            localStorage.setItem('chosenColumn', selectedColumn.name);
            localStorage.setItem('chosenBoardId', board_id as string);

            // Clear URL parameters and navigate to details
            router.replace(
              `/home/boards/${board_id}/job/${result.id}/job-details`,
            );

            // Show toast after a tiny delay to avoid conflict with navigation
            setTimeout(() => {
              toast.success('Job saved automatically!');
            }, 100);
          }
        } catch (error) {
          console.error('Auto-save failed:', error);
          toast.error('Failed to auto-save job. Use the manual form.');
          arrivalProcessed.current = false; // Allow retry on next render
        } finally {
          setIsSubmittingJob(false);
        }
      };

      handleArrivalAutoSave();
    }
  }, [searchParams, accessToken, boardColumns, board_id, dispatch, router]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  );

  useEffect(() => {
    if (isEditing) {
      const currentInputElement = document.getElementById(
        currentColumnId,
      ) as HTMLInputElement;
      if (currentInputElement) {
        currentInputElement.focus();
      }
    } else {
      dispatch(getBoards(accessToken as string));
    }
  }, [isEditing, currentColumnId, accessToken, dispatch]);
  // Draft + submission guard hooks must appear before any early return
  const jobDraftRef = useRef<{
    company?: string;
    jobTitle?: string;
    companyId?: string;
    location?: string;
    description?: string;
    postUrl?: string;
    salary?: string;
  } | null>(null);
  const [isSubmittingJob, setIsSubmittingJob] = useState(false);

  if (!currentBoard) return null;

  const handleColumnNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setRenamedColumnName(e.target.value);

    // Maintain focus after state changes (handles double render focus loss)
    if (focusTimeoutRef.current) clearTimeout(focusTimeoutRef.current);
    focusTimeoutRef.current = setTimeout(() => {
      const input = document.getElementById(
        currentColumnId,
      ) as HTMLInputElement;
      if (input && document.activeElement !== input) {
        input.focus();
        const len = input.value.length;
        input.setSelectionRange(len, len);
      }
    }, 0);
  };

  const confirmColumnNameChange = () => {
    setIsEditing(false);

    // Skip rename dispatch if the name didn't change
    const current =
      boards
        .find((b) => b.id === board_id)
        ?.columns?.find((c) => c.id === currentColumnId)?.name ?? '';
    if (renamedColumnName.trim() === current.trim()) {
      return;
    }

    dispatch(
      updateColumnName({
        accessToken,
        id: currentColumnId,
        name: renamedColumnName,
      }),
    );
    dispatch(getBoards(accessToken as string));
  };

  const checkForEnter = (e: any) => {
    if (e.key === 'Enter') {
      confirmColumnNameChange();
    }
  };

  const createJobApplication = async () => {
    if (isSubmittingJob) return;
    setIsSubmittingJob(true);
    const legacyTitle = localStorage.getItem('jobTitle');
    const legacyCompanyId = localStorage.getItem('companyId');
    const draft = jobDraftRef.current || {};

    let finalCompanyId = draft.companyId || legacyCompanyId;

    // If no companyId but company name exists, create the company first
    if (!finalCompanyId && draft.company) {
      try {
        const result = await dispatch(
          createCompany({
            accessToken,
            name: draft.company,
          }),
        ).unwrap();
        finalCompanyId = result.id;
      } catch (error) {
        console.error('Error creating company:', error);
        toast.error('Failed to create company. Please try again.');
        setIsSubmittingJob(false);
        return;
      }
    }

    const jobPost = {
      status: 'Job Created',
      accessToken: accessToken as string,
      title: draft.jobTitle || legacyTitle,
      columnId: localStorage.getItem('columnId'),
      companyId: finalCompanyId,
      location: draft.location || localStorage.getItem('jobLocation') || '',
      description:
        draft.description || localStorage.getItem('jobDescription') || '',
      postUrl: draft.postUrl || localStorage.getItem('jobPostUrl') || '',
      salary: draft.salary || localStorage.getItem('jobSalary') || '',
    };

    dispatch(createJobPost(jobPost))
      .then((result) => {
        if (!result.payload?.id) {
          console.error('Failed to create job post');
          setIsSubmittingJob(false);
          return;
        }
        const newJobPostId = result.payload.id;
        const selectedBoardId =
          localStorage.getItem('chosenBoardId') || (board_id as string);
        const targetPath = `/home/boards/${selectedBoardId}/job/${newJobPostId}/job-details`;
        router.push(targetPath);
        setIsSubmittingJob(false);
        dispatch(getBoards(accessToken as string));
        cleanupAfterJobPost();
      })
      .catch((error) => {
        console.error('Error creating job post:', error);
        setIsSubmittingJob(false);
      });
  };

  const handleDragStart = (event: any) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    // Find the dragged job from filtered columns
    let draggedJob = null;
    for (const column of filteredColumns) {
      const job = column.jobApplications?.find((job) => job.id === active.id);
      if (job) {
        draggedJob = job;
        break;
      }
    }

    const targetColumn = boardColumns.find((col) => col.id === over.id);

    if (!draggedJob || !targetColumn) return;

    // Find current column from all columns
    const currentColumn = boardColumns.find((col) =>
      col.jobApplications?.some((job) => job.id === draggedJob.id),
    );

    if (!currentColumn || currentColumn.id === targetColumn.id) return;

    const currentColumnOrder = currentColumn.order;
    const newColumnOrder = targetColumn.order;

    // Apply same status logic as handleSelectList from layout.tsx
    let newStatus: jobPostStatus;

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
      }),
    );
  };

  return (
    <DndContext
      sensors={sensors}
      onDragEnd={handleDragEnd}
      onDragStart={handleDragStart}
      collisionDetection={closestCorners}
    >
      <div className="w-full h-full flex flex-col">
        {/* Search Results Header */}
        {isActive && searchSummary.isFiltering && (
          <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-blue-50 dark:bg-blue-900/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="text-sm text-gray-700 dark:text-gray-300">
                  <span className="font-medium">
                    {searchSummary.filteredJobs} of {searchSummary.totalJobs}{' '}
                    jobs
                  </span>{' '}
                  match{searchSummary.filteredJobs === 1 ? '' : 'es'}{' '}
                  <span className="font-mono text-xs bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
                    &ldquo;{query}&rdquo;
                  </span>
                </div>
                {searchSummary.keywords.length > 1 && (
                  <div className="text-xs text-gray-500">
                    ({searchSummary.keywords.length} keywords)
                  </div>
                )}
              </div>
              <div className="flex items-center gap-4">
                {!searchSummary.hasResults && (
                  <div className="text-sm text-amber-600 dark:text-amber-400">
                    No matching jobs found
                  </div>
                )}
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Press{' '}
                  <kbd className="px-1 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-xs">
                    Esc
                  </kbd>{' '}
                  to clear
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Board Columns */}
        <div className="w-full flex h-full flex-1">
          {filteredColumns?.map((column) => (
            <DroppableColumn key={column.id} column={column}>
              {/* Fixed Header */}
              <div className="flex-shrink-0">
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
                    {isActive && (
                      <span className="text-xs text-gray-500 block">
                        {searchSummary.isFiltering ? 'filtered' : 'total'}
                      </span>
                    )}
                  </p>
                </div>
                <AlertDialogModal
                  buttonLabel="+"
                  cleanupType="job"
                  dialogTitle="Add Job"
                  buttonCancel="Discard"
                  buttonVariant="outline"
                  actionFunction={createJobApplication}
                  buttonConfirm={isSubmittingJob ? 'Saving...' : 'Save Job'}
                  stylings="w-11/12 flex justify-center text-2xl border py-3 mb-4 mx-auto rounded-md hover:border-blue-500 transition duration-300 delay-150 cursor-pointer"
                >
                  <AddJobShortForm
                    columnOrder={column.order}
                    onDraftChange={(d) => {
                      jobDraftRef.current = { ...jobDraftRef.current, ...d };
                    }}
                  />
                </AlertDialogModal>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto min-h-0">
                {column.jobApplications?.map((job) =>
                  job.company === null ? null : (
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
                      companyUrl={job.company.url}
                      companyName={job.company.name}
                      statusChangedTime={job.statusChangedAt}
                    />
                  ),
                )}
              </div>
            </DroppableColumn>
          ))}
        </div>

        {/* Empty Search Results Message */}
        {isActive && !searchSummary.hasResults && (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center py-12">
              <div className="text-gray-500 dark:text-gray-400 mb-4">
                <svg
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="w-12 h-12 mx-auto mb-4 opacity-50"
                >
                  <path
                    strokeWidth={1.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                No jobs found
              </h3>
              <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
                No job applications match your search for{' '}
                <span className="font-mono text-sm bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
                  &ldquo;{query}&rdquo;
                </span>
              </p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                Try adjusting your search terms or clearing the filter.
              </p>
            </div>
          </div>
        )}
      </div>
      <DragOverlay>
        {activeId ? (
          <div className="transform rotate-3 opacity-90">
            {(() => {
              // Find the job in boardColumns instead of jobPosts
              let draggedJob = null;
              for (const column of boardColumns) {
                const job = column.jobApplications?.find(
                  (job) => job.id === activeId,
                );
                if (job) {
                  draggedJob = job;
                  break;
                }
              }
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
                  companyUrl={draggedJob.company.url}
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
