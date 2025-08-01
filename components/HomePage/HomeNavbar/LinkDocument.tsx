'use client';

import { useState } from 'react';
import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { documentCategoryColors } from '@/utils/documentHelpers';
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
  onDocumentSelect,
}: LinkDocumentProps) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');

  // Truncate filename if too long - simple truncation with ellipsis at the end
  const truncateFilename = (filename: string, maxLength: number = 20) => {
    if (filename.length <= maxLength) return filename;
    return filename.substring(0, maxLength - 3) + '...';
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          role="combobox"
          variant="outline"
          aria-expanded={open}
          className="w-fit justify-between dark:bg-slate-800 dark:text-white dark:border-slate-600 dark:hover:bg-slate-700"
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
      <PopoverContent className="w-fit p-0 dark:bg-slate-800 dark:border-slate-600">
        <Command>
          <CommandInput placeholder={`Search ${searchItem}`} className="h-9" />
          <CommandList>
            <CommandEmpty>Nothing found.</CommandEmpty>
            <CommandGroup>
              {docs.map((doc) => {
                const categoryColor =
                  documentCategoryColors[
                    doc.category as keyof typeof documentCategoryColors
                  ] || documentCategoryColors.Other;

                return (
                  <CommandItem
                    key={doc.id}
                    value={doc.title}
                    onSelect={() => {
                      setValue(doc.title);
                      setOpen(false);
                      // Call the callback if provided
                      if (onDocumentSelect) {
                        onDocumentSelect(doc.title, doc.id);
                      }
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
                    <div className="flex items-center justify-between w-full">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {truncateFilename(doc.title)}
                      </span>
                      <span
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-white ml-2"
                        style={{ backgroundColor: categoryColor }}
                      >
                        {doc.category}
                      </span>
                    </div>
                    {/* </Link> */}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
