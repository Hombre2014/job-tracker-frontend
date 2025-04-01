'use client';

import { useState, useEffect } from 'react';
import { useParams, usePathname } from 'next/navigation';

import { useAppDispatch } from '@/redux/hooks';
import { Button } from '@/components/ui/button';
import { cleanupAfterContact } from '@/utils/helpers';
import AlertDialogModal from '@/components/HomePage/Boards/AlertDialogModal';
import CreateContactForm from '@/components/Forms/AddContact/CreateContactForm';
import {
  createContact,
  updateContact,
  uploadContactImage,
  assignContactToJobPost,
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
  onContactUpdated?: (updatedContact: Contact) => void;
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
  onContactUpdated,
}: CreateContactModalProps) => {
  const pathname = usePathname();
  const { board_id } = useParams();
  const dispatch = useAppDispatch();
  const [, setIsMenuOpen] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const accessToken = localStorage.getItem('accessToken');
  const isDefaultJobPost = pathname?.includes('job-details');
  const [showContactModal, setShowContactModal] = useState(false);
  const [pendingImage, setPendingImage] = useState<File | null>(null);

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
      // Step 1: Create the contact
      const result = await dispatch(createContact(values)).unwrap();
      const newContactId = result.id;

      // Step 2: Upload the pending image if it exists
      if (pendingImage) {
        const uploadResult = await dispatch(
          uploadContactImage({
            file: pendingImage,
            contactId: newContactId,
            accessToken: accessToken as string,
          })
        ).unwrap();

        // Dispatch updateContact to update the photoUrl
        const updatedContact = await dispatch(
          updateContact({
            id: newContactId,
            boardId: board_id,
            photoUrl: uploadResult.imageUrl, // Update the photoUrl
            accessToken: accessToken as string,
          })
        ).unwrap();

        // Notify parent component about the updated contact
        if (onContactUpdated) {
          onContactUpdated(updatedContact);
        }
      }

      // Step 3: Assign contact to connected jobs (if any)
      const jobsConnectedToContact = JSON.parse(
        localStorage.getItem('jobsConnectedToContact') || '[]'
      );
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

      // Step 4: Call onContactCreated to refresh the contacts list
      if (onContactCreated) {
        console.log('Calling onContactCreated...'); // Debug log
        onContactCreated();
      }

      // Step 5: Clear local storage
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
          <CreateContactForm
            defaultJobPost={isDefaultJobPost}
            setPendingImage={setPendingImage}
            onValidationChange={setIsFormValid}
            isUserContactsPage={userContactsPage}
          />
        </AlertDialogModal>
      )}
    </div>
  );
};

export default CreateContactModal;
