'use client';

import { useState } from 'react';

import AlertDialogModal from '@/components/HomePage/Boards/AlertDialogModal';
import CreateContactForm from '@/components/Forms/AddContact/CreateContactForm';
import { Button } from '@/components/ui/button';

const UserContacts = () => {
  const [, setIsMenuOpen] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);

  const createContact = () => {
    if (!isFormValid) return;

    setShowContactModal(false);

    // TODO: Implement contact creation
  };

  return (
    <div className="w-full flex items-center py-2 border-b">
      <div className="w-11/12">
        <h1 className="font-semibold text-center">Contacts</h1>
      </div>
      <Button
        variant="normal"
        onClick={() => {
          setShowContactModal(true);
          setIsFormValid(false);
        }}
      >
        + Contact
      </Button>
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
    </div>
  );
};

export default UserContacts;
