'use client';

import {
  AlertDialog,
  AlertDialogTitle,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogDescription,
} from '@/components/ui/alert-dialog';
import { CompanyLogo } from '@/components/CompanyLogo';

// Define the data structure for validation results
export interface DomainValidationData {
  formData: any;
  logo?: string;
  domain: string;
  registeredName: string;
  attemptedName?: string;
  type: 'name-mismatch' | 'domain-change';
}

interface DomainValidationDialogProps extends Omit<DomainValidationData, 'formData'> {
  open: boolean;
  onAccept: () => void;
  onCancel: () => void;
  onOpenChange: (open: boolean) => void;
}

export function DomainValidationDialog({
  open,
  onOpenChange,
  onAccept,
  onCancel,
  domain,
  registeredName,
  logo,
  type,
  attemptedName,
}: DomainValidationDialogProps) {
  const handleCancel = () => {
    onCancel();
    onOpenChange(false);
  };

  const handleAccept = () => {
    onAccept();
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {type === 'name-mismatch' ? '⚠️ Domain Mismatch' : 'ℹ️ Domain Registered'}
          </AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-4">
              {type === 'name-mismatch' ? (
                <>
                  <p>
                    This domain <code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded">{domain}</code> is registered to{' '}
                    <strong>{registeredName}</strong>.
                  </p>
                  {logo && (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                      <CompanyLogo domain={domain} companyName={registeredName} size="md" />
                      <span className="font-medium">{registeredName}</span>
                    </div>
                  )}
                  <p>
                    To change the name to <strong>{attemptedName}</strong>, please use a different domain or keep the existing information.
                  </p>
                </>
              ) : (
                <>
                  <p>
                    This domain <code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded">{domain}</code> is registered to{' '}
                    <strong>{registeredName}</strong>.
                  </p>
                  {logo && (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                      <CompanyLogo domain={domain} companyName={registeredName} size="md" />
                      <span className="font-medium">{registeredName}</span>
                    </div>
                  )}
                  <p>
                    Click <strong>Update</strong> to accept these changes or <strong>Cancel</strong> to keep the existing information.
                  </p>
                </>
              )}
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancel}>Cancel</AlertDialogCancel>
          {type === 'domain-change' && (
            <AlertDialogAction onClick={handleAccept}>Update</AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
