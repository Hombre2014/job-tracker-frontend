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
import { cleanupAfterJobPost } from '@/utils/helpers';

const AlertDialogModal = ({
  open,
  children,
  stylings,
  dialogText,
  dialogTitle,
  buttonLabel,
  onOpenChange,
  buttonCancel,
  contentWidth,
  buttonVariant,
  buttonConfirm,
  actionFunction,
  destructiveVariant,
  isFormValid = true,
}: AlertDialogProps) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogTrigger asChild>
        <Button variant={buttonVariant} className={cn(stylings)}>
          {buttonLabel}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className={cn(contentWidth)}>
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
          <AlertDialogAction
            onClick={actionFunction}
            disabled={!isFormValid}
            className={cn(
              destructiveVariant && 'bg-destructive hover:bg-destructive/90'
            )}
          >
            {buttonConfirm}
          </AlertDialogAction>
          <AlertDialogCancel
            onClick={() => {
              cleanupAfterJobPost();
              onOpenChange && onOpenChange(false); // Close the alert dialog and dropdown menu
            }}
          >
            {buttonCancel}
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AlertDialogModal;
