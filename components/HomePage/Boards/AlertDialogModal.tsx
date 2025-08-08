'use client';

import { useState } from 'react';
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
import { cleanupAfterJobPost, cleanupAfterContact } from '@/utils/helpers';

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
  cleanupType = 'job', // 'job' | 'contact' | 'none'
}: AlertDialogProps) => {
  const [internalFormValid, setInternalFormValid] = useState(false);
  
  // Use internal validation if isFormValid is not provided or is undefined
  const finalFormValid = isFormValid !== undefined ? isFormValid : internalFormValid;
  
  const handleSubmit = () => {
    // For job forms, check if company and job title exist in localStorage
    if (cleanupType === 'job') {
      const company = localStorage.getItem('company');
      const jobTitle = localStorage.getItem('jobTitle');
      
      if (!company || !jobTitle || company.trim() === '' || jobTitle.trim() === '') {
        console.log('❌ Form validation failed - missing company or job title');
        return;
      }
    }
    
    // If validation passes, call the action function
    if (actionFunction) {
      actionFunction();
    }
  };

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
            onClick={handleSubmit}
            className={cn(
              destructiveVariant && 'bg-destructive hover:bg-destructive/90'
            )}
          >
            {buttonConfirm}
          </AlertDialogAction>
          <AlertDialogCancel
            onClick={() => {
              console.log(
                '❌ AlertDialogModal Cancel clicked - cleanupType:',
                cleanupType
              );

              // Call appropriate cleanup function based on cleanupType
              if (cleanupType === 'job') {
                console.log('🧹 Calling cleanupAfterJobPost');
                cleanupAfterJobPost();
              } else if (cleanupType === 'contact') {
                cleanupAfterContact();
              }
              // 'none' type doesn't call any cleanup

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
