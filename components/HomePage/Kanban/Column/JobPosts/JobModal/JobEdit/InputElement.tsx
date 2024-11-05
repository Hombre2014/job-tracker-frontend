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
  onChange,
}: InputElementProps) => {
  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(e);
    }
  };

  return (
    <div className={cn(stylings)}>
      <Label htmlFor={id}>{labelName}</Label>
      <Input
        id={id}
        defaultValue={defaultValue}
        placeholder={placeholderName}
        value={value}
        onChange={onChangeHandler}
      />
    </div>
  );
};

export default InputElement;
