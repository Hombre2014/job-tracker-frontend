'use client';

import { useState, useEffect } from 'react';

import { Button } from '@/components/ui/button';
import AlertDialogModal from '@/components/HomePage/Boards/AlertDialogModal';
import CreateContactForm from '@/components/Forms/AddContact/CreateContactForm';

interface CreateContactModalProps {
  showButton: boolean;
  isVisible?: boolean;
  buttonLabel?: string;
  onClose?: () => void;
}

const CreateContactModal = ({
  onClose,
  isVisible,
  showButton,
  buttonLabel,
}: CreateContactModalProps) => {
  const [, setIsMenuOpen] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);

  useEffect(() => {
    if (isVisible !== undefined) {
      setShowContactModal(isVisible);
    }
  }, [isVisible]);

  const createContact = () => {
    if (!isFormValid) return;

    setShowContactModal(false);
    if (onClose) onClose();

    // TODO: Implement contact creation
  };

  return (
    <div className="">
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
          contentWidth="!max-w-[910px]"
          dialogTitle="Save New Contact"
          actionFunction={createContact}
          onOpenChange={(open) => {
            setShowContactModal(open);
            if (!open) {
              setIsMenuOpen(false);
              if (onClose) onClose();
            }
          }}
        >
          <CreateContactForm onValidationChange={setIsFormValid} />
        </AlertDialogModal>
      )}
    </div>
  );
};

export default CreateContactModal;
