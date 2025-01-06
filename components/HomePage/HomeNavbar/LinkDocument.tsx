'use client';

import { useState } from 'react';
import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons';

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

export function LinkDocument({
  docs,
  searchItem,
  initialString,
}: LinkDocumentProps) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          role="combobox"
          variant="outline"
          aria-expanded={open}
          className="w-fit justify-between"
        >
          {initialString !== ''
            ? initialString
            : value
            ? docs.find((doc: { title: string }) => doc.title === value)?.title
            : `${docs[0].title}`}{' '}
          {/* This line is the default value and when 2 or more boards it is not correct! TODO: Must be fixed! */}
          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-fit p-0">
        <Command>
          <CommandInput placeholder={`Search ${searchItem}`} className="h-9" />
          <CommandList>
            <CommandEmpty>Nothing found.</CommandEmpty>
            <CommandGroup>
              {docs.map((doc) => (
                <CommandItem
                  key={doc.id}
                  value={doc.title}
                  onSelect={() => {
                    setValue(doc.title);
                    setOpen(false);
                  }}
                >
                  <CheckIcon
                    key={doc.id}
                    className={cn(
                      'mr-2 h-4 w-4',
                      value === doc.title ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  {/* TODO: Implement file upload */}
                  <div>
                    <span>{doc.title}&nbsp;</span>
                    <span className="opacity-40">{doc.category}</span>
                  </div>
                  {/* </Link> */}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
