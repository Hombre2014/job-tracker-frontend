'use client';

import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { cn } from '@/lib/utils';

const AlertDialogModal = ({
  buttonLabel,
  buttonVariant,
  dialogTitle,
  dialogText,
  buttonCancel,
  buttonConfirm,
  actionFunction,
  stylings,
  children,
}: AlertDialogProps) => {
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
            {/* Above parent 'AlertDialogDescription' is a <p> element, can't have a Form inside */}
            {children}
            {dialogText}
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={actionFunction}>
            {buttonConfirm}
          </AlertDialogAction>
          <AlertDialogCancel>{buttonCancel}</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AlertDialogModal;
