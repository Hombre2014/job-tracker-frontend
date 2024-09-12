import TextEditor from './TextEditor';
import ColorPicker from './ColorPicker';
import InputElement from './InputElement';
import { Card, CardContent } from '@/components/ui/card';

const JobInfo = () => {
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
                  defaultValue="Amazon"
                />
                <InputElement
                  stylings="space-y-1 w-1/2"
                  labelName="Job Title"
                  id="job-title"
                  defaultValue="Full Stack Web Developer"
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
                  defaultValue=""
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
              <TextEditor />
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
