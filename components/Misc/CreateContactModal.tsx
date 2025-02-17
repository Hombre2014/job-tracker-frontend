'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

import { useAppDispatch } from '@/redux/hooks';
import { Button } from '@/components/ui/button';
import AlertDialogModal from '@/components/HomePage/Boards/AlertDialogModal';
import CreateContactForm from '@/components/Forms/AddContact/CreateContactForm';
import {
  assignContactToJobPost,
  createContact,
} from '@/redux/contacts/contactsThunk';
import { cleanupAfterContact } from '@/utils/helpers';

interface CreateContactModalProps {
  showButton: boolean;
  isVisible?: boolean;
  buttonLabel?: string;
  dialogTitle?: string;
  onClose?: () => void;
  buttonConfirm?: string;
}

const CreateContactModal = ({
  onClose,
  isVisible,
  showButton,
  buttonLabel,
  dialogTitle,
  buttonConfirm,
}: CreateContactModalProps) => {
  const dispatch = useAppDispatch();
  const { board_id, job_id } = useParams();
  const [, setIsMenuOpen] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const accessToken = localStorage.getItem('accessToken');
  const [showContactModal, setShowContactModal] = useState(false);

  useEffect(() => {
    if (isVisible !== undefined) {
      setShowContactModal(isVisible);
    }
  }, [isVisible]);

  const createNewContact = () => {
    if (!isFormValid) return;

    setShowContactModal(false);
    if (onClose) onClose();

    const values = {
      accessToken,
      boardId: board_id,
      comment: localStorage.getItem('comment'),
      jobTitle: localStorage.getItem('jobTitle'),
      lastName: localStorage.getItem('lastName'),
      location: localStorage.getItem('location'),
      photoUrl: localStorage.getItem('photoUrl'),
      firstName: localStorage.getItem('firstName'),
      githubUrl: localStorage.getItem('githubUrl'),
      twitterUrl: localStorage.getItem('twitterUrl'),
      linkedinUrl: localStorage.getItem('linkedinUrl'),
      facebookUrl: localStorage.getItem('facebookUrl'),
      emails: JSON.parse(localStorage.getItem('emails') || '[]'),
      phones: JSON.parse(localStorage.getItem('phones') || '[]'),
      companyIds: JSON.parse(localStorage.getItem('companyIds') || '[]'),
    };

    dispatch(createContact(values))
      .unwrap()
      .then((result) => {
        const newContactId = result.id;
        const jobPostId = job_id;
        localStorage.setItem('contactId', newContactId);

        const assignData = {
          accessToken,
          contactId: newContactId,
          jobApplicationId: jobPostId,
        };

        dispatch(assignContactToJobPost(assignData));
      });

    // Clear local storage
    cleanupAfterContact();
  };

  return (
    <div>
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
          open={showContactModal}
          isFormValid={isFormValid}
          contentWidth="!max-w-[910px]"
          actionFunction={createNewContact}
          buttonConfirm={buttonConfirm || 'Create'}
          dialogTitle={dialogTitle || 'Save New Contact'}
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
