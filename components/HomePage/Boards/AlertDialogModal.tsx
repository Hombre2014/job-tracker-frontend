'use client';

import React, { useState } from 'react';
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

  // For job forms, use internal validation state; for others use the prop
  const finalFormValid =
    cleanupType === 'job' ? internalFormValid : isFormValid;

  const handleSubmit = async () => {
    try {
      // For job forms, check if company and job title exist in localStorage
      if (cleanupType === 'job') {
        let company: string | null = null;
        let jobTitle: string | null = null;

        try {
          if (typeof window !== 'undefined' && 'localStorage' in window) {
            company = window.localStorage.getItem('company');
            jobTitle = window.localStorage.getItem('jobTitle');
          } else {
            console.warn('Form validation skipped: localStorage not available.');
          }
        } catch (e) {
          console.warn('Form validation skipped: localStorage access blocked.', e);
        }

        if (!company || !jobTitle || company.trim() === '' || jobTitle.trim() === '') {
          console.warn('Form validation failed - missing company or job title');
          return;
        }
      }

      // If validation passes, call the action function
      await actionFunction?.();
      
      // For controlled modals, manually close after successful action
      // Note: For uncontrolled modals, AlertDialogAction should close automatically
      if (open !== undefined) {
        onOpenChange?.(false);
      }
    } catch (err) {
      console.error('AlertDialogModal handleSubmit failed', err);
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
            {/* Pass validation callback to child form if it's a job form */}
            {cleanupType === 'job' &&
            children &&
            typeof children === 'object' &&
            'props' in children
              ? // Clone the child element and add the validation callback
                React.cloneElement(children as React.ReactElement, {
                  onValidationChange: setInternalFormValid,
                })
              : children}
            {dialogText}
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction
            onClick={handleSubmit}
            disabled={!finalFormValid}
            className={cn(
              destructiveVariant && 'bg-destructive hover:bg-destructive/90'
            )}
          >
            {buttonConfirm}
          </AlertDialogAction>
          <AlertDialogCancel
            onClick={() => {
              // Call appropriate cleanup function based on cleanupType
              if (cleanupType === 'job') {
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
