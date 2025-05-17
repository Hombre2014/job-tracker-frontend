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
  createContactEmail,
  createContactPhone,
  updateContactEmail,
  updateContactPhone,
  getContact,
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
      githubUrl: localStorage.getItem('githubUrl') || null,
      twitterUrl: localStorage.getItem('twitterUrl') || null,
      linkedinUrl: localStorage.getItem('linkedinUrl') || null,
      facebookUrl: localStorage.getItem('facebookUrl') || null,
      emails,
      phones,
      companyIds: JSON.parse(localStorage.getItem('companyIds') || '[]'),
    };

    // Before sending updateContact, ensure empty strings are converted to null
    ['githubUrl', 'twitterUrl', 'linkedinUrl', 'facebookUrl'].forEach(
      (field) => {
        if (values[field as keyof typeof values] === '')
          values[field as keyof typeof values] = null;
      }
    );

    // Track what changed
    let hasNewOrUpdatedEmailOrPhone = false;
    let hasBasicInfoChange = false;

    // Find new emails/phones (those not present in contactToEdit)
    const existingEmailIds = new Set<string | number>(
      (contactToEdit?.emails || []).map((e) => e.id)
    );
    const existingPhoneIds = new Set<string | number>(
      (contactToEdit?.phones || []).map((p) => p.id)
    );
    const newEmails = emails.filter((e: any) => !existingEmailIds.has(e.id));
    const newPhones = phones.filter((p: any) => !existingPhoneIds.has(p.id));

    // Find updated emails/phones (existing ones with changed value/type)
    const updatedEmails = emails.filter((e: any) => {
      const orig = (contactToEdit?.emails || []).find(
        (origE) => origE.id === e.id
      );
      return (
        orig &&
        ((orig.email !== e.email && orig.email !== e.value) ||
          orig.type !== e.type)
      );
    });
    const updatedPhones = phones.filter((p: any) => {
      const orig = (contactToEdit?.phones || []).find(
        (origP) => origP.id === p.id
      );
      return (
        orig &&
        ((orig.phone !== p.phone && orig.phone !== p.value) ||
          orig.type !== p.type)
      );
    });

    hasNewOrUpdatedEmailOrPhone =
      newEmails.length > 0 ||
      newPhones.length > 0 ||
      updatedEmails.length > 0 ||
      updatedPhones.length > 0;

    // Check if basic info/social links changed
    if (contactToEdit) {
      const fieldsToCheck: (keyof Contact)[] = [
        'firstName',
        'lastName',
        'jobTitle',
        'location',
        'comment',
        'photoUrl',
        'githubUrl',
        'twitterUrl',
        'linkedinUrl',
        'facebookUrl',
      ];
      for (const field of fieldsToCheck) {
        if (
          values[field as keyof typeof values] !== undefined &&
          values[field as keyof typeof values] !== contactToEdit[field]
        ) {
          hasBasicInfoChange = true;
          break;
        }
      }
    }

    let updatedContactData = contactToEdit;

    try {
      if (contactToEdit) {
        // 1. Handle emails/phones
        for (const email of newEmails) {
          await dispatch(
            createContactEmail({
              type: email.type,
              email: email.email ?? email.value,
              contactId: contactToEdit.id,
              accessToken: accessToken as string,
            })
          ).unwrap();
        }
        for (const phone of newPhones) {
          await dispatch(
            createContactPhone({
              type: phone.type,
              phone: phone.phone ?? phone.value,
              contactId: contactToEdit.id,
              accessToken: accessToken as string,
            })
          ).unwrap();
        }
        for (const email of updatedEmails) {
          await dispatch(
            updateContactEmail({
              id: email.id,
              type: email.type,
              email: email.email ?? email.value,
              accessToken: accessToken as string,
            })
          ).unwrap();
        }
        for (const phone of updatedPhones) {
          await dispatch(
            updateContactPhone({
              id: phone.id,
              type: phone.type,
              phone: phone.phone ?? phone.value,
              accessToken: accessToken as string,
            })
          ).unwrap();
        }

        // 2. Only send updateContact if NO email/phone was added/updated, but basic info/social links changed
        if (!hasNewOrUpdatedEmailOrPhone && hasBasicInfoChange) {
          const updateValues = { ...values } as Partial<typeof values>;
          if (!updateValues.photoUrl) {
            delete updateValues.photoUrl;
          }
          await dispatch(
            updateContact({
              ...updateValues,
              accessToken,
              id: contactToEdit.id,
            })
          ).unwrap();
        }

        // If user uploaded a photo, upload it and update the contact
        if (pendingImage) {
          const uploadResult = await dispatch(
            uploadContactImage({
              file: pendingImage,
              contactId: contactToEdit.id,
              accessToken: accessToken as string,
            })
          ).unwrap();

          // Now update only the photoUrl
          await dispatch(
            updateContact({
              id: contactToEdit.id,
              boardId: board_id,
              photoUrl: uploadResult.imageUrl,
              accessToken: accessToken as string,
            })
          ).unwrap();
        }

        // Fetch the updated contact info
        const value = {
          contactId: contactToEdit.id,
          boardId: board_id,
          accessToken: accessToken as string,
        };
        const contactDataArr = await dispatch(getContact(value)).unwrap();
        updatedContactData = contactDataArr[0] || contactToEdit;

        if (onContactUpdated && updatedContactData) {
          onContactUpdated(updatedContactData);
        }

        cleanupAfterContact(); // Clean up after successful update
      } else {
        // Create new contact (without photoUrl if uploading)
        const result = await dispatch(createContact(values)).unwrap();
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
