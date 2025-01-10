'use client';

import { useState } from 'react';

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

type JobPost = {
  id: string;
  title: string;
  color: string;
};

interface ComboJobsBoxProps {
  jobPosts: JobPost[];
}

const ComboJobsBox = ({ jobPosts }: ComboJobsBoxProps) => {
  const [value, setValue] = useState('');
  const [open, setOpen] = useState(false);

  const handleJobPostSelect = (jobPost: JobPost) => {
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
          className="w-[200px] justify-between border border-dashed border-muted-foreground rounded-md py-1 pl-2 text-muted-foreground text-left"
        >
          {value ? value : '+ Link Job'}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search jobs" className="h-9" />
          <CommandList>
            <CommandEmpty>No framework found.</CommandEmpty>
            <CommandGroup>
              {jobPosts.map((jobPost) => (
                <CommandItem
                  key={jobPost.id}
                  value={jobPost.title}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? '' : currentValue);
                    setOpen(false);
                  }}
                >
                  <p style={{ color: `${jobPost.color}` }}>{jobPost.title}</p>
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
