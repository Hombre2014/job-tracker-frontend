import { useState } from 'react';

import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const InputElement = ({
  id,
  value,
  stylings,
  labelName,
  defaultValue,
  placeholderName,
  sendData,
}: InputElementProps) => {
  const [inputValue, setInputValue] = useState(value);

  const handleBlur = () => {
    if (sendData) {
      sendData(inputValue);
    }
  };

  return (
    <div className={cn(stylings)}>
      <Label htmlFor={id}>{labelName}</Label>
      <Input
        id={id}
        defaultValue={defaultValue}
        placeholder={placeholderName}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onBlur={handleBlur}
      />
    </div>
  );
};

export default InputElement;
