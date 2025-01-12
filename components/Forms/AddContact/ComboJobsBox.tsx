'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';

import { cn } from '@/lib/utils';
import { useAppSelector } from '@/redux/hooks';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Command,
  CommandItem,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandInput,
} from '@/components/ui/command';

// type JobPost = {
//   id: string;
//   title: string;
//   color: string;
//   company: {
//     name: string;
//   };
// };

interface ComboJobsBoxProps {
  jobPosts: JobApplication[];
  buttonWidth: string;
}

const ComboJobsBox = ({ jobPosts, buttonWidth }: ComboJobsBoxProps) => {
  const { job_id } = useParams();
  const [value, setValue] = useState('');
  const [open, setOpen] = useState(false);
  const jobs = useAppSelector((state) => state.jobs);

  const handleJobPostSelect = (jobPost: JobApplication) => {
    setValue(jobPost.title);
    setOpen(false);
  };

  console.log('value: ', value);

  console.log('jobPosts: ', jobPosts);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          role="combobox"
          variant="outline"
          aria-expanded={open}
          className={cn(
            'justify-between border border-dashed border-muted-foreground rounded-md py-1 pl-2 text-muted-foreground text-left',
            buttonWidth ? buttonWidth : 'w-full'
          )}
        >
          {value ? value : '+ Link Job'}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search jobs" className="h-9" />
          <CommandList>
            <CommandEmpty>No Job found.</CommandEmpty>
            <CommandGroup>
              {jobPosts
                .filter((jobPost) => jobPost.id !== job_id)
                .map((jobPost) => (
                  <CommandItem
                    key={jobPost.id}
                    value={jobPost.title}
                    onSelect={(currentValue) => {
                      setValue(currentValue === value ? '' : currentValue);
                      setOpen(false);
                    }}
                  >
                    <p style={{ color: `${jobPost.color}` }}>
                      {jobPost.title} @ {jobPost.company.name}
                    </p>
                  </CommandItem>
                ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default ComboJobsBox;
