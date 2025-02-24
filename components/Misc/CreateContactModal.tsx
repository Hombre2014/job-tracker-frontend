'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

import { useAppDispatch } from '@/redux/hooks';
import { Button } from '@/components/ui/button';
import { cleanupAfterContact } from '@/utils/helpers';
import { getAllJobPostsPerColumn } from '@/redux/jobs/jobsThunk';
import AlertDialogModal from '@/components/HomePage/Boards/AlertDialogModal';
import CreateContactForm from '@/components/Forms/AddContact/CreateContactForm';
import {
  assignContactToJobPost,
  createContact,
} from '@/redux/contacts/contactsThunk';

interface CreateContactModalProps {
  showButton: boolean;
  isVisible?: boolean;
  buttonLabel?: string;
  dialogTitle?: string;
  onClose?: () => void;
  buttonConfirm?: string;
  onContactCreated?: () => void;
}

const CreateContactModal = ({
  onClose,
  isVisible,
  showButton,
  buttonLabel,
  dialogTitle,
  buttonConfirm,
  onContactCreated,
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

  const createNewContact = async () => {
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

    try {
      const result = await dispatch(createContact(values)).unwrap();
      const newContactId = result.id;
      localStorage.setItem('contactId', newContactId);

      // Get job posts connected to contact from localStorage
      const jobsConnectedToContact = JSON.parse(
        localStorage.getItem('jobsConnectedToContact') || '[]'
      );

      // Assign contact to all connected jobs
      if (jobsConnectedToContact.length > 0) {
        await Promise.all(
          jobsConnectedToContact.map(async (jobPost: JobApplication) => {
            const assignData = {
              accessToken,
              contactId: newContactId,
              jobApplicationId: jobPost.id,
            };
            await dispatch(assignContactToJobPost(assignData)).unwrap();
          })
        );
      }

      // Fetch updated job posts data to show the new contact
      const columnId = localStorage.getItem('columnId');
      if (columnId) {
        await dispatch(
          getAllJobPostsPerColumn({
            accessToken,
            columnId,
          })
        );
      }

      // Call onContactCreated if provided
      if (onContactCreated) {
        onContactCreated();
      }

      // Clear local storage
      cleanupAfterContact();
    } catch (error) {
      console.error('Error creating/assigning contact:', error);
    }
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
