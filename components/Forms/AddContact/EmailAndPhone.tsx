import { useRef, useState } from 'react';
import { RiCloseLine } from 'react-icons/ri';
import { HiOutlinePhone } from 'react-icons/hi';
import { Button } from '@/components/ui/button';
import { RxEnvelopeClosed, RxChevronDown } from 'react-icons/rx';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Command,
  CommandItem,
  CommandList,
  CommandGroup,
} from '@/components/ui/command';

const types = [
  { value: 'WORK', label: 'WORK' },
  { value: 'PERSONAL', label: 'PERSONAL' },
];

interface EmailAndPhoneProps {
  id: string;
  value: string;
  initialType: string;
  contact: 'email' | 'phone';
  returnData: (contact: 'email' | 'phone', id: string) => void;
  handleChange: (id: string, value: string, type: string, options?: { blur?: boolean }) => void;
}

const EmailAndPhone = ({
  id,
  value,
  contact,
  returnData,
  initialType,
  handleChange,
}: EmailAndPhoneProps) => {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState(initialType);
  const [inputValue, setInputValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleTypeChange = (newType: string) => {
    setType(newType);
    handleChange(id, inputValue, newType);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    handleChange(id, e.target.value, type);
  };

  const removeContact = () => {
    returnData(contact, id);
  };

  return (
    <div className="w-full px-2">
      <div className="w-full flex items-center justify-between">
        <div className="flex items-center gap-2">
          {contact === 'email' ? (
            <RxEnvelopeClosed size={20} className="text-gray-500" />
          ) : (
            <HiOutlinePhone size={20} className="text-gray-500" />
          )}
          <input
            ref={inputRef}
            name="contact"
            title="contact"
            value={inputValue}
            onChange={handleInputChange}
            className="outline-none bg-transparent border-none pl-2 text-sm"
            placeholder={contact.charAt(0).toUpperCase() + contact.slice(1)}
          />
        </div>
        <div className="flex items-center gap-4">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                value={type}
                role="combobox"
                variant="outline"
                aria-expanded={open}
                className="w-fit justify-between !h-7 !px-2"
              >
                <span className="text-xs">{type}</span>
                <RxChevronDown className="opacity-50 ml-2" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[98px] p-0">
              <Command>
                <CommandList>
                  <CommandGroup>
                    {types.map((typeOption) => (
                      <CommandItem
                        key={typeOption.value}
                        value={typeOption.value}
                        onSelect={(currentValue) => {
                          handleTypeChange(currentValue);
                          setOpen(false);
                        }}
                      >
                        <span className="text-xs">{typeOption.label}</span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          <RiCloseLine
            onClick={removeContact}
            className="text-gray-500 hover:cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};

export default EmailAndPhone;
