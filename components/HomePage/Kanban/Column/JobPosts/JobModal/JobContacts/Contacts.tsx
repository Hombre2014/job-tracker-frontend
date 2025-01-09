import { SlPeople } from 'react-icons/sl';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardTitle,
  CardFooter,
  CardHeader,
  CardContent,
  CardDescription,
} from '@/components/ui/card';
import AlertDialogModal from '@/components/HomePage/Boards/AlertDialogModal';
import { useState } from 'react';
import CreateContactForm from '@/components/Forms/CreateContactForm';

const Contacts = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);

  const createContact = () => {
    if (!isFormValid) return;

    setShowContactModal(false);

    // TODO: Implement contact creation
  };

  return (
    <Card className="min-h-[560px] flex flex-col gap-4">
      <CardHeader className="flex flex-col gap-2 items-center">
        <CardTitle className="mt-28">
          <SlPeople className="h-14 w-14" />
        </CardTitle>
        <CardDescription className="pt-10 text-xl pb-6">
          You have not linked any contacts to this job yet.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 items-center">
        <AlertDialogModal
          buttonVariant="none"
          buttonCancel="Discard"
          buttonConfirm="Create"
          open={showContactModal}
          isFormValid={isFormValid}
          contentWidth="!max-w-[908px]"
          buttonLabel="+ Create Contact"
          dialogTitle="Save New Contact"
          actionFunction={createContact}
          stylings="!w-fit !bg-blue-500 text-white !rounded-md hover:cursor-pointer hover:!bg-blue-600"
          onOpenChange={(open) => {
            setShowContactModal(open);
            if (!open) setIsMenuOpen(false);
          }}
        >
          <CreateContactForm onValidationChange={setIsFormValid} />
        </AlertDialogModal>
        <Button className="w-fit mt-4" variant="outline">
          Link contact
        </Button>
      </CardContent>
      <CardFooter></CardFooter>
    </Card>
  );
};

export default Contacts;
