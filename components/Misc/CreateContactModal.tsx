'use client';

import { useState, useEffect } from 'react';
import { useParams, usePathname } from 'next/navigation';

import { useAppDispatch } from '@/redux/hooks';
import { Button } from '@/components/ui/button';
import { cleanupAfterContact } from '@/utils/helpers';
import AlertDialogModal from '@/components/HomePage/Boards/AlertDialogModal';
import CreateContactForm from '@/components/Forms/AddContact/CreateContactForm';
import {
  assignContactToJobPost,
  createContact,
  updateContact,
} from '@/redux/contacts/contactsThunk';

interface CreateContactModalProps {
  showButton: boolean;
  isVisible?: boolean;
  buttonLabel?: string;
  dialogTitle?: string;
  onClose?: () => void;
  buttonConfirm?: string;
  userContactsPage?: boolean;
  onContactCreated?: () => void;
}

const CreateContactModal = ({
  onClose,
  isVisible,
  showButton,
  buttonLabel,
  dialogTitle,
  buttonConfirm,
  userContactsPage,
  onContactCreated,
}: CreateContactModalProps) => {
  const pathname = usePathname();
  const { board_id } = useParams();
  const dispatch = useAppDispatch();
  const [, setIsMenuOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const accessToken = localStorage.getItem('accessToken');
  const isDefaultJobPost = pathname?.includes('job-details');
  const [showContactModal, setShowContactModal] = useState(false);

  useEffect(() => {
    if (isVisible !== undefined) {
      setShowContactModal(isVisible);
    }
  }, [isVisible]);

  useEffect(() => {
    // Check if we're in edit mode
    const contactId = localStorage.getItem('contactId');
    if (contactId) {
      // In edit mode, initialize isFormValid to true since data is already validated
      setIsFormValid(true);
      console.log('Edit mode detected, setting form as valid');
    } else {
      // Reset form validity for new contacts
      setIsFormValid(false);
    }
  }, [showContactModal]);

  useEffect(() => {
    const contactId = localStorage.getItem('contactId');
    setIsEditMode(!!contactId);
  }, [showContactModal]);

  const createOrEditContact = async () => {
    if (!isFormValid) return;

    setShowContactModal(false);
    if (onClose) onClose();

    // Check if we're in edit mode
    const contactId = localStorage.getItem('contactId');
    const isEditMode = !!contactId;

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
      if (isEditMode) {
        // Update existing contact
        const updateValues = {
          ...values,
          id: contactId,
        };

        await dispatch(updateContact(updateValues)).unwrap();
        console.log('Contact updated successfully');
      } else {
        // Create new contact
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
      }

      // Call onContactCreated to refresh the contacts list in the parent component
      if (onContactCreated) {
        onContactCreated();
      }

      // Clear local storage
      cleanupAfterContact();
    } catch (error) {
      console.error('Error creating/updating contact:', error);
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
          actionFunction={createOrEditContact}
          buttonConfirm={
            isEditMode ? buttonConfirm || 'Update' : buttonConfirm || 'Create'
          }
          dialogTitle={
            isEditMode
              ? dialogTitle || 'Edit Contact'
              : dialogTitle || 'Save New Contact'
          }
          onOpenChange={(open) => {
            setShowContactModal(open);
            if (!open) {
              setIsMenuOpen(false);
              if (onClose) onClose();
            }
          }}
        >
          <CreateContactForm
            isEditMode={isEditMode}
            defaultJobPost={isDefaultJobPost}
            onValidationChange={setIsFormValid}
            isUserContactsPage={userContactsPage}
          />
        </AlertDialogModal>
      )}
    </div>
  );
};

export default CreateContactModal;
