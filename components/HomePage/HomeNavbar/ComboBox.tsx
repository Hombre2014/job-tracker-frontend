'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useParams } from 'next/navigation';
import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons';

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
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';

export function ComboBox({ items, searchItem }: ComboBoxProps) {
  const { board_id } = useParams();
  const [value, setValue] = useState('');
  const [open, setOpen] = useState(false);
  const { boardsStatus } = useAppSelector((state) => state.boards);
  const currentBoardName = items.find((item) => item.id === board_id)?.name;

  return (
    boardsStatus === 'succeeded' && (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-fit justify-between"
          >
            {currentBoardName}{' '}
            <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-fit p-0">
          <Command>
            <CommandInput
              placeholder={`Search ${searchItem}`}
              className="h-9"
            />
            <CommandList>
              <CommandEmpty>Nothing found.</CommandEmpty>
              <CommandGroup>
                {items.map((item) => (
                  <CommandItem
                    key={item.id}
                    value={item.name}
                    onSelect={() => {
                      setValue(item.name);
                      setOpen(false);
                    }}
                  >
                    <CheckIcon
                      key={item.id}
                      className={cn(
                        'mr-2 h-4 w-4',
                        value === item.name ? 'opacity-100' : 'opacity-0'
                      )}
                    />
                    <Link href={`/home/boards/${item.id}/board`}>
                      <div>
                        <span>{item.name}&nbsp;</span>
                        {/* Bellow line is the user's name, which we do not have so far */}
                        {/* TODO: Resolve the issue with user's name! */}
                        {/* <span className="opacity-40">{item.label}</span> */}
                      </div>
                    </Link>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    )
  );
}
