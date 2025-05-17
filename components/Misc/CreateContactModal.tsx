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
  contactToEdit?: Contact | null;
  onContactUpdated?: (updatedContact: Contact) => void;
}

const CreateContactModal = ({
  onClose,
  isVisible,
  showButton,
  buttonLabel,
  dialogTitle,
  buttonConfirm,
  contactToEdit,
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

  const handleContact = async () => {
    if (!isFormValid) return;

    // Get raw emails/phones from localStorage
    const rawEmails = JSON.parse(localStorage.getItem('emails') || '[]');
    const rawPhones = JSON.parse(localStorage.getItem('phones') || '[]');

    // Transform to backend format for create
    const emails = rawEmails
      .filter((e: any) => e.value || e.email)
      .map((e: any) => ({
        id: e.id,
        email: e.email ?? e.value,
        type: e.type,
      }));
    const phones = rawPhones
      .filter((p: any) => p.value || p.phone)
      .map((p: any) => ({
        id: p.id,
        phone: p.phone ?? p.value,
        type: p.type,
      }));

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
      emails,
      phones,
      companyIds: JSON.parse(localStorage.getItem('companyIds') || '[]'),
    };

    // If a new image is being uploaded, do not send photoUrl in the initial create request
    let createValues: any = { ...values };
    if (pendingImage) {
      delete createValues.photoUrl;
    }

    try {
      if (contactToEdit) {
        // For update, also transform contactToEdit.phones/emails if used
        const updateValues = { ...values } as Partial<typeof values>;

        // Only include photoUrl if it exists
        if (!updateValues.photoUrl) {
          delete updateValues.photoUrl;
        }

        // Use the transformed emails/phones, not the raw ones
        updateValues.phones = phones;
        updateValues.emails = emails;

        const updatedContact = await dispatch(
          updateContact({
            ...updateValues,
            accessToken,
            id: contactToEdit.id,
          })
        ).unwrap();

        if (pendingImage) {
          const uploadResult = await dispatch(
            uploadContactImage({
              file: pendingImage,
              contactId: contactToEdit.id,
              accessToken: accessToken as string,
            })
          ).unwrap();

          const finalUpdatedContact = await dispatch(
            updateContact({
              ...updatedContact,
              photoUrl: uploadResult.imageUrl,
              accessToken: accessToken as string,
            })
          ).unwrap();

          if (onContactUpdated) {
            onContactUpdated(finalUpdatedContact);
          }
        } else if (onContactUpdated) {
          onContactUpdated(updatedContact);
        }

        cleanupAfterContact(); // Clean up after successful update
      } else {
        // Create new contact (without photoUrl if uploading)
        const result = await dispatch(createContact(createValues)).unwrap();
        const newContactId = result.id;

        // If user uploaded a photo, upload it and update the contact
        if (pendingImage) {
          const uploadResult = await dispatch(
            uploadContactImage({
              file: pendingImage,
              contactId: newContactId,
              accessToken: accessToken as string,
            })
          ).unwrap();

          await dispatch(
            updateContact({
              id: newContactId,
              boardId: board_id,
              photoUrl: uploadResult.imageUrl,
              accessToken: accessToken as string,
            })
          ).unwrap();
        }

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

        if (onContactCreated) {
          onContactCreated();
        }

        cleanupAfterContact(); // Clean up after successful creation
      }

      setShowContactModal(false);
      if (onClose) onClose();
    } catch (error) {
      console.error('Error handling contact:', error);
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
          actionFunction={handleContact}
          buttonConfirm={buttonConfirm || (contactToEdit ? 'Update' : 'Create')}
          dialogTitle={
            dialogTitle || (contactToEdit ? 'Edit Contact' : 'Save New Contact')
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
            contactToEdit={contactToEdit}
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
