'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import AlertDialogModal from '@/components/HomePage/Boards/AlertDialogModal';
import CreateContactForm from '@/components/Forms/AddContact/CreateContactForm';

interface CreateContactModalProps {
  showButton: boolean;
  buttonLabel?: string;
}

const CreateContactModal = ({
  showButton,
  buttonLabel,
}: CreateContactModalProps) => {
  const [, setIsMenuOpen] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);

  const createContact = () => {
    if (!isFormValid) return;

    setShowContactModal(false);

    // TODO: Implement contact creation
  };

  return (
    <>
      {showButton && (
        <Button
          variant="normal"
          onClick={() => {
            setShowContactModal(true);
            setIsFormValid(false);
          }}
        >
          {buttonLabel || '+ Create Contact'}
        </Button>
      )}
      {showContactModal && (
        <AlertDialogModal
          buttonVariant="none"
          buttonCancel="Discard"
          buttonConfirm="Create"
          open={showContactModal}
          isFormValid={isFormValid}
          contentWidth="!max-w-[900px]"
          dialogTitle="Save New Contact"
          actionFunction={createContact}
          onOpenChange={(open) => {
            setShowContactModal(open);
            if (!open) setIsMenuOpen(false);
          }}
        >
          <CreateContactForm onValidationChange={setIsFormValid} />
        </AlertDialogModal>
      )}
    </>
  );
};

export default CreateContactModal;
