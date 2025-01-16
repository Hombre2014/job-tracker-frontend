'use client';

import { useState } from 'react';

import { cn } from '@/lib/utils';
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

interface ComboJobsBoxProps {
  buttonWidth: string;
  jobPosts: JobApplication[];
  jobsConnectedToContact: JobApplication[];
  onJobSelect: (jobTitle: string, jobId: string) => void;
}

const ComboJobsBox = ({
  jobPosts,
  buttonWidth,
  onJobSelect,
  jobsConnectedToContact,
}: ComboJobsBoxProps) => {
  const [value, setValue] = useState('');
  const [open, setOpen] = useState(false);

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
                .filter(
                  (jobPost) =>
                    !jobsConnectedToContact.some(
                      (connectedJob) => connectedJob.id === jobPost.id
                    )
                )
                .map((jobPost) => (
                  <CommandItem
                    key={jobPost.id}
                    value={jobPost.id}
                    onSelect={() => {
                      setValue('');
                      setOpen(false);
                      onJobSelect(jobPost.title, jobPost.id);
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
