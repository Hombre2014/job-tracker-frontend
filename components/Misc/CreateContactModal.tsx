'use client';

import { useState, useEffect } from 'react';
import { useParams, usePathname } from 'next/navigation';

import { useAppDispatch } from '@/redux/hooks';
import { Button } from '@/components/ui/button';
import { cleanupAfterContact } from '@/utils/helpers';
import AlertDialogModal from '@/components/HomePage/Boards/AlertDialogModal';
import CreateContactForm from '@/components/Forms/AddContact/CreateContactForm';
import { createContact, updateContact } from '@/redux/contacts/contactsThunk';

interface CreateContactModalProps {
  showButton: boolean;
  isVisible?: boolean;
  buttonLabel?: string;
  dialogTitle?: string;
  onClose?: () => void;
  isEditMode?: boolean;
  buttonConfirm?: string;
  userContactsPage?: boolean;
  onContactCreated?: () => void;
  contactToEdit?: Contact | null;
}

const CreateContactModal = ({
  onClose,
  isVisible,
  showButton,
  buttonLabel,
  isEditMode,
  dialogTitle,
  buttonConfirm,
  contactToEdit,
  userContactsPage,
  onContactCreated,
}: CreateContactModalProps) => {
  const pathname = usePathname();
  const { board_id } = useParams();
  const dispatch = useAppDispatch();
  const [, setIsMenuOpen] = useState(false);
  const accessToken = localStorage.getItem('accessToken');
  const [isFormValid, setIsFormValid] = useState(isEditMode);
  const isDefaultJobPost = pathname?.includes('job-details');
  const [showContactModal, setShowContactModal] = useState(false);

  console.log('isEditMode in CreateContactModal:', isEditMode);
  console.log('contactToEdit in CreateContactModal:', contactToEdit);

  useEffect(() => {
    if (isVisible !== undefined) {
      setShowContactModal(isVisible);
    }
  }, [isVisible]);

  useEffect(() => {
    // Always set form as valid in edit mode
    if (isEditMode) {
      setIsFormValid(true);
    }
  }, [isEditMode]);

  console.log('isEditMode:', isEditMode);
  console.log('contactToEdit:', contactToEdit);
  console.log('isFormValid:', isFormValid);

  const createOrUpdateContact = async () => {
    console.log('createOrUpdateContact called');
    console.log('isFormValid:', isFormValid);
    console.log('isEditMode:', isEditMode);
    console.log('contactToEdit:', contactToEdit);

    if (!isFormValid && !isEditMode) {
      console.log('Form is not valid and not in edit mode, returning');
      return;
    }

    setShowContactModal(false);
    if (onClose) onClose();

    const values = {
      accessToken,
      boardId: board_id,
      comment: localStorage.getItem('comment') || contactToEdit?.comment || '',
      jobTitle:
        localStorage.getItem('jobTitle') || contactToEdit?.jobTitle || '',
      lastName:
        localStorage.getItem('lastName') || contactToEdit?.lastName || '',
      location:
        localStorage.getItem('location') || contactToEdit?.location || '',
      photoUrl:
        localStorage.getItem('photoUrl') || contactToEdit?.photoUrl || '',
      firstName:
        localStorage.getItem('firstName') || contactToEdit?.firstName || '',
      githubUrl:
        localStorage.getItem('githubUrl') || contactToEdit?.githubUrl || '',
      twitterUrl:
        localStorage.getItem('twitterUrl') || contactToEdit?.twitterUrl || '',
      linkedinUrl:
        localStorage.getItem('linkedinUrl') || contactToEdit?.linkedinUrl || '',
      facebookUrl:
        localStorage.getItem('facebookUrl') || contactToEdit?.facebookUrl || '',
      emails: JSON.parse(localStorage.getItem('emails') || '[]'),
      phones: JSON.parse(localStorage.getItem('phones') || '[]'),
      companyIds: JSON.parse(localStorage.getItem('companyIds') || '[]'),
    };

    try {
      console.log('Entering try block');
      if (isEditMode && contactToEdit) {
        console.log('Inside edit mode condition');
        const updateValues = {
          ...values,
          id: contactToEdit.id,
        };

        console.log('About to dispatch updateContact with:', updateValues);
        const result = await dispatch(updateContact(updateValues)).unwrap();
        console.log('Contact updated successfully:', result);

        if (onContactCreated) {
          onContactCreated();
        }
      } else {
        console.log('Creating new contact');

        // Dispatch the createContact thunk
        const result = await dispatch(createContact(values)).unwrap();
        console.log('Contact created successfully:', result);

        if (onContactCreated) {
          onContactCreated();
        }
      }

      // Clear localStorage after saving or updating
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
          contentWidth="!max-w-[910px]"
          actionFunction={createOrUpdateContact}
          buttonConfirm={buttonConfirm || 'Create'}
          isFormValid={isEditMode || isFormValid}
          dialogTitle={dialogTitle || 'Save New Contact'}
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
            contactToEdit={contactToEdit}
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
