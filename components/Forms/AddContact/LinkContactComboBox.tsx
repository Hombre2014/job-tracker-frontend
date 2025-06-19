'use client';

import Image from 'next/image';
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

interface LinkContactComboBoxProps {
  buttonWidth?: string;
  linkedContactIds: string[];
  availableContacts: Contact[];
  onContactSelect: (contact: Contact) => void;
}

const LinkContactComboBox = ({
  buttonWidth,
  onContactSelect,
  linkedContactIds,
  availableContacts,
}: LinkContactComboBoxProps) => {
  const [open, setOpen] = useState(false);

  // Filter out contacts that are already linked to this job
  const unlinkedContacts = availableContacts.filter(
    (contact) => !linkedContactIds.includes(contact.id)
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          role="combobox"
          variant="outline"
          aria-expanded={open}
          className={cn(
            'justify-between border border-dashed border-muted-foreground rounded-md py-1 pl-2 text-muted-foreground text-left',
            buttonWidth ? buttonWidth : 'w-fit'
          )}
        >
          + Link contact
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[280px] p-0">
        <Command>
          <CommandInput placeholder="Search contacts..." className="h-9" />
          <CommandList>
            <CommandEmpty>No contacts found.</CommandEmpty>
            <CommandGroup>
              {unlinkedContacts.map((contact) => (
                <CommandItem
                  key={contact.id}
                  value={`${contact.firstName} ${contact.lastName}`}
                  onSelect={() => {
                    setOpen(false);
                    onContactSelect(contact);
                  }}
                  className="cursor-pointer"
                >
                  <div className="flex items-center gap-3 w-full">
                    <Image
                      width={32}
                      height={32}
                      alt={`${contact.firstName} ${contact.lastName}`}
                      src={contact.photoUrl || '/images/Yuriy.jpg'}
                      className="rounded-full"
                    />
                    <div className="flex flex-col">
                      <span className="font-medium">
                        {contact.firstName} {contact.lastName}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {contact.jobTitle || 'No job title'}
                      </span>
                    </div>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default LinkContactComboBox;
