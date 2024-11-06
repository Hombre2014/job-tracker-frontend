import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import TextEditor from './TextEditor';
import ColorPicker from './ColorPicker';
import InputElement from './InputElement';
import { updateJobPost } from '@/redux/jobs/jobsThunk';
import { Card, CardContent } from '@/components/ui/card';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';

const JobInfo = () => {
  const { job_id } = useParams();
  const dispatch = useAppDispatch();
  const { jobPosts } = useAppSelector((state) => state.jobs);
  const currentJobPost = jobPosts.find((jobPost) => jobPost.id === job_id);

  const [editedJobPost, setEditedJobPost] = useState({
    title: '',
    company: '',
    location: '',
    salary: '',
    description: '',
    deadline: '',
    postUrl: '',
    color: '#8b5cf6',
  });

  const handleSalaryChange = (data: string) => {
    if (data === '') return;

    setEditedJobPost({ ...editedJobPost, salary: data });

    dispatch(
      updateJobPost({
        accessToken: localStorage.getItem('accessToken'),
        title: currentJobPost?.title,
        companyName: currentJobPost?.company.name,
        columnId: localStorage.getItem('columnId'),
        jobPostId: job_id,
        postUrl: '',
        salary: data,
        location: '',
        color: '',
        deadline: '',
        description: '',
      })
    );
  };

  console.log('editedJobPost: ', editedJobPost);

  useEffect(() => {}, []);

  return (
    <Card>
      <CardContent className="space-y-2">
        <div className="flex gap-4 items-start">
          <div className="flex w-2/3 pt-8">
            <div className="flex flex-col w-full gap-4">
              <div className="flex gap-2">
                <InputElement
                  stylings="space-y-1 w-1/2"
                  labelName="Company"
                  id="company"
                  defaultValue={currentJobPost?.company.name}
                />
                <InputElement
                  stylings="space-y-1 w-1/2"
                  labelName="Job Title"
                  id="job-title"
                  defaultValue={currentJobPost?.title}
                />
              </div>
              <div className="flex gap-2">
                <InputElement
                  stylings="space-y-1 w-2/3"
                  labelName="Post URL"
                  id="post-url"
                  defaultValue=""
                  placeholderName="+ add URL"
                />
                <InputElement
                  stylings="space-y-1 w-1/3"
                  labelName="Salary"
                  id="salary"
                  sendData={handleSalaryChange}
                  value={editedJobPost.salary}
                  // defaultValue={currentJobPost?.salary}
                  placeholderName="+ add Salary"
                />
              </div>
              <div className="flex gap-2">
                <InputElement
                  stylings="space-y-1 w-2/3"
                  labelName="Location"
                  id="location"
                  defaultValue=""
                  placeholderName="+ add location"
                />
                <ColorPicker />
              </div>
              <TextEditor
                initialText="Type your description here..."
                title="Description"
                buttonVisibility={false}
              />
            </div>
          </div>
          <InputElement
            stylings="w-1/3 pt-8"
            labelName="Deadline"
            id="deadline"
            defaultValue=""
            placeholderName="Deadline + set date"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default JobInfo;
