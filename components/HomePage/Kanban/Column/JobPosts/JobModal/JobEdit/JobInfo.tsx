import { useParams } from 'next/navigation';

import TextEditor from './TextEditor';
import ColorPicker from './ColorPicker';
import InputElement from './InputElement';
import { useAppSelector } from '@/redux/hooks';
import { Card, CardContent } from '@/components/ui/card';

const JobInfo = () => {
  const { jobPosts } = useAppSelector((state) => state.jobs);
  const { board_id, job_id } = useParams();

  const currentJobPost = jobPosts.find((jobPost) => jobPost.id === job_id);

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
                  defaultValue={currentJobPost?.salary}
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
