import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface InputElementProps {
  id: string;
  classes?: string;
  stylings?: string;
  labelName: string;
  defaultValue?: string;
  placeholderName?: string;
}

const InputElement = ({
  id,
  stylings,
  labelName,
  defaultValue,
  placeholderName,
}: InputElementProps) => {
  return (
    <div className={cn(stylings)}>
      <Label htmlFor={id}>{labelName}</Label>
      <Input
        id={id}
        defaultValue={defaultValue}
        placeholder={placeholderName}
      />
    </div>
  );
};

export default InputElement;
