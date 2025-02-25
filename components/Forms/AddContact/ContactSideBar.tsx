import { useState, useEffect } from 'react';
import { BsThreeDots } from 'react-icons/bs';

import ComboJobsBox from './ComboJobsBox';
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const ContactSideBar = ({ jobs, user, job_id }: ContactSideBarProps) => {
  const [jobsConnectedToContact, setJobsConnectedToContact] = useState<
    JobApplication[]
  >([]);

  console.log('Job_id: ', job_id);

  useEffect(() => {
    if (job_id) {
      // Only set initial job if job_id exists
      const currentJob = jobs.jobPosts.find((job) => job.id === job_id);
      if (currentJob) {
        setJobsConnectedToContact([currentJob]);
        localStorage.setItem(
          'jobsConnectedToContact',
          JSON.stringify([currentJob])
        );
      }
    } else {
      // Clear jobs connected to contact when no job_id
      setJobsConnectedToContact([]);
      localStorage.setItem('jobsConnectedToContact', JSON.stringify([]));
    }
  }, [job_id, jobs.jobPosts]);

  const handleAddJob = (jobTitle: string, jobId: string) => {
    const jobToAdd = jobs.jobPosts.find(
      (job) => job.title === jobTitle && job.id === jobId
    );
    if (
      jobToAdd &&
      !jobsConnectedToContact.some((job) => job.id === jobToAdd.id)
    ) {
      setJobsConnectedToContact([...jobsConnectedToContact, jobToAdd]);
      localStorage.setItem(
        'jobsConnectedToContact',
        JSON.stringify([...jobsConnectedToContact, jobToAdd])
      );
    }
  };

  const handleUnlinkJob = (jobId: string) => {
    setJobsConnectedToContact((prevJobs) =>
      prevJobs.filter((job) => job.id !== jobId)
    );
    localStorage.setItem(
      'jobsConnectedToContact',
      JSON.stringify(jobsConnectedToContact.filter((job) => job.id !== jobId))
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
                {jobPost.title} @ {jobPost.company.name}
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
          jobPosts={jobs.jobPosts}
          onJobSelect={handleAddJob}
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
