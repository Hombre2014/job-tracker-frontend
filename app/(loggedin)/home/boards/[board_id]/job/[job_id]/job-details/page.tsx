'use client';

import jobPostMenuItems from '@/data/job-post-menu-items';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  returnJobPostMenuIcon,
  returnMenuComponent,
} from '@/utils/ReturnIcons';

const JobDetails = () => {
  return (
    <Tabs defaultValue="Job Info" className="w-full">
      <TabsList className="grid w-full grid-cols-5">
        {jobPostMenuItems.map((item) => (
          <TabsTrigger key={item.id} value={item.title}>
            {returnJobPostMenuIcon(item.icon)}
            {item.title}
          </TabsTrigger>
        ))}
      </TabsList>
      {jobPostMenuItems.map((item) => (
        <TabsContent key={item.id} value={item.title} className="mt-8">
          {returnMenuComponent(item.title)}
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default JobDetails;
