import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { BsThreeDots } from 'react-icons/bs';

import ComboJobsBox from './ComboJobsBox';
import { useAppDispatch } from '@/redux/hooks';
import { getBoardWithColumns } from '@/redux/boards/boardsThunk';
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const ContactSideBar = ({
  jobs,
  user,
  job_id,
  onJobsChange,
  jobsConnectedToContact,
}: ContactSideBarProps) => {
  const { board_id } = useParams();
  const dispatch = useAppDispatch();
  const accessToken = localStorage.getItem('accessToken');
  const [boardJobs, setBoardJobs] = useState<JobApplication[]>([]);

  useEffect(() => {
    const fetchBoardJobs = async () => {
      if (board_id && accessToken) {
        try {
          const boardData = await dispatch(
            getBoardWithColumns({ boardId: board_id, accessToken })
          ).unwrap();
          const allJobsFromBoard = boardData.columns.flatMap(
            (column: Column) => column.jobApplications || []
          );
          setBoardJobs(allJobsFromBoard);
        } catch (error) {
          console.error('Error fetching board data:', error);
          setBoardJobs([]);
        }
      }
    };
    fetchBoardJobs();
  }, [board_id, dispatch, accessToken]);

  useEffect(() => {
    if (job_id) {
      const currentJob = jobs.jobPosts.find(
        (job: JobApplication) => job.id === job_id
      );
      if (currentJob) {
        onJobsChange([currentJob]);
      }
    } else {
      onJobsChange([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [job_id, jobs.jobPosts]);

  const handleAddJob = (jobTitle: string, jobId: string) => {
    const jobsList = board_id ? boardJobs : jobs.jobPosts;
    const jobToAdd = jobsList.find(
      (job: JobApplication) => job.title === jobTitle && job.id === jobId
    );
    if (
      jobToAdd &&
      !jobsConnectedToContact.some(
        (job: JobApplication) => job.id === jobToAdd.id
      )
    ) {
      onJobsChange([...jobsConnectedToContact, jobToAdd]);
    }
  };

  const handleUnlinkJob = (jobId: string) => {
    onJobsChange(
      jobsConnectedToContact.filter((job: JobApplication) => job.id !== jobId)
    );
  };

  return (
    <div className="w-1/4 h-full flex-col">
      <p className="text-left mb-2 font-semibold text-muted-foreground">
        Linked to
      </p>
      <hr></hr>
      <p className="text-left font-semibold mt-6 mb-2">Jobs</p>
      {jobsConnectedToContact.length > 0 ? (
        <div className="flex flex-col gap-2">
          {jobsConnectedToContact.map((jobPost) => (
            <div
              key={jobPost.id}
              className="flex flex-row justify-between items-center border border-gray-300 rounded-lg p-[5px]"
            >
              <p
                style={{ color: `${jobPost.color}` }}
                className="text-left text-sm"
              >
                {jobPost.title} @{' '}
                {jobPost.company ? jobPost.company.name : 'Unknown Company'}
              </p>
              <div className="flex flex-row gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      title="Remove"
                      className="text-left text-muted-foreground"
                    >
                      <BsThreeDots className="border border-gray-300 rounded-sm p-[2px] h-6 w-6" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="!absolute !-right-4">
                    <DropdownMenuItem
                      onClick={() => handleUnlinkJob(jobPost.id)}
                    >
                      Unlink Job
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-left text-muted-foreground">No jobs</p>
      )}
      <div className="m-0 p-0 mt-2">
        <ComboJobsBox
          buttonWidth="w-full"
          onJobSelect={handleAddJob}
          jobPosts={board_id ? boardJobs : jobs.jobPosts}
          jobsConnectedToContact={jobsConnectedToContact}
        />
      </div>
      <p className="text-left font-semibold mt-6 text-muted-foreground">
        Created by
      </p>
      <hr></hr>
      <div className="flex flex-col gap-2 border rounded-md p-2 mt-4">
        <div className="flex justify-start gap-2">
          <p className="text-left text-sm font-semibold">{user.firstName}</p>
          <p className="text-left text-sm font-semibold">{user.lastName}</p>
        </div>
        <p className="text-left text-sm text-muted-foreground">{user.email}</p>
      </div>
    </div>
  );
};

export default ContactSideBar;
