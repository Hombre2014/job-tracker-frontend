import { BsThreeDots } from 'react-icons/bs';

import ComboJobsBox from './ComboJobsBox';

interface ContactSideBarProps {
  job_id: string;
  jobs: { jobPosts: JobApplication[] };
  handleRemoveJob: (jobId: string) => void;
  user: { firstName: string; lastName: string; email: string };
}

const ContactSideBar = ({
  jobs,
  user,
  job_id,
  handleRemoveJob,
}: ContactSideBarProps) => {
  return (
    <div className="w-1/4 h-full flex-col">
      <p className="text-left mb-2 font-semibold text-muted-foreground">
        Linked to
      </p>
      <hr></hr>
      <p className="text-left font-semibold mt-6 mb-2">Jobs</p>
      {jobs.jobPosts.length > 0 ? (
        <div className="flex flex-col gap-2">
          {jobs.jobPosts.map(
            (jobPost) =>
              jobPost.id === job_id && (
                <div
                  key={jobPost.id}
                  className="flex flex-row justify-between items-center border border-gray-300 rounded-lg p-[5px]"
                >
                  <p
                    style={{ color: `${jobPost.color}` }}
                    className="text-left text-muted-foreground text-sm"
                  >
                    {jobPost.title} @ {jobPost.company.name}
                  </p>
                  <div className="flex flex-row gap-2">
                    <button
                      type="button"
                      title="Remove"
                      className="text-left text-muted-foreground"
                      onClick={() => handleRemoveJob(jobPost.id)}
                    >
                      <BsThreeDots className="border border-gray-300 rounded-sm p-[2px] h-6 w-6" />
                    </button>
                  </div>
                </div>
              )
          )}
        </div>
      ) : (
        <p className="text-left text-muted-foreground">No jobs</p>
      )}
      <div className="m-0 p-0 mt-2">
        <ComboJobsBox jobPosts={jobs.jobPosts} buttonWidth="w-full" />
      </div>
      <p className="text-left font-semibold mt-6 text-muted-foreground">
        Created by
      </p>
      <hr></hr>
      <div className="flex flex-col gap-2 border rounded-md p-2 mt-4">
        <div className="flex justify-start gap-2">
          <p className="text-left font-semibold">{user.firstName}</p>
          <p className="text-left font-semibold">{user.lastName}</p>
        </div>
        <p className="text-left text-muted-foreground">{user.email}</p>
      </div>
    </div>
  );
};

export default ContactSideBar;
