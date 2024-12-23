'use client';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogTitle,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

const AlertDialogModal = ({
  children,
  stylings,
  dialogText,
  dialogTitle,
  buttonLabel,
  buttonCancel,
  buttonVariant,
  buttonConfirm,
  isFormValid = true,
  actionFunction,
}: AlertDialogProps) => {
  const clearLocalStorage = () => {
    localStorage.setItem('boardValueChanged', 'false');
    localStorage.removeItem('jobTitle');
    localStorage.removeItem('company');
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant={buttonVariant} className={cn(stylings)}>
          {buttonLabel}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-center border-b pb-4 mb-2">
            {dialogTitle}
          </AlertDialogTitle>
          <div className="text-center pb-4 border-b">
            {children}
            {dialogText}
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={actionFunction} disabled={!isFormValid}>
            {buttonConfirm}
          </AlertDialogAction>
          <AlertDialogCancel onClick={clearLocalStorage}>
            {buttonCancel}
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AlertDialogModal;
