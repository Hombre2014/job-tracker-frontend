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
  const [inputValue, setInputValue] = useState(value!);

  const handleBlur = () => {
    if (sendData) {
      // if (inputValue.length === 0) {
      //   setInputValue('');
      //   sendData(id, 'delete');
      //   return;
      // }
      sendData(id, inputValue);
    }
  };

  return (
    <div className={cn(stylings)}>
      <Label htmlFor={id}>{labelName}</Label>
      <Input
        id={id}
        value={inputValue}
        defaultValue={defaultValue}
        placeholder={placeholderName}
        onBlur={handleBlur}
        onChange={(e) => setInputValue(e.target.value)}
      />
    </div>
  );
};

export default InputElement;
