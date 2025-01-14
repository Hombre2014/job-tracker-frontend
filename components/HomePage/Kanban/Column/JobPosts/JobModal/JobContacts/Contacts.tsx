import { SlPeople } from 'react-icons/sl';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { BsThreeDots } from 'react-icons/bs';
import { IoLocationOutline } from 'react-icons/io5';

import { Button } from '@/components/ui/button';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { getAllJobPostsPerColumn } from '@/redux/jobs/jobsThunk';
import AlertDialogModal from '@/components/HomePage/Boards/AlertDialogModal';
import CreateContactForm from '@/components/Forms/AddContact/CreateContactForm';
import {
  Card,
  CardTitle,
  CardFooter,
  CardHeader,
  CardContent,
  CardDescription,
} from '@/components/ui/card';
import Image from 'next/image';

const Contacts = () => {
  const { job_id } = useParams();
  const dispatch = useAppDispatch();
  const jobs = useAppSelector((state) => state.jobs);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const accessToken = localStorage.getItem('accessToken');
  const [showContactModal, setShowContactModal] = useState(false);
  const { firstName, lastName } = useAppSelector((state) => state.user);

  const currentJobPost = jobs.jobPosts.find((job) => job.id === job_id);

  useEffect(() => {
    const jobPostsData = {
      accessToken: accessToken as string,
      columnId: localStorage.getItem('columnId'),
    };

    dispatch(getAllJobPostsPerColumn(jobPostsData));
  }, [dispatch, accessToken]);

  const createContact = () => {
    console.log('isValid: ', isFormValid);
    if (!isFormValid) return;

    setShowContactModal(false);

    // TODO: Implement contact creation
  };

  const numberOfContactsPerJob =
    jobs.jobPosts.find((job) => job.id === job_id)?.contacts.length || 0;

  return numberOfContactsPerJob === 0 ? (
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
          + Link contact
        </Button>
      </CardContent>
      <CardFooter></CardFooter>
    </Card>
  ) : (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex justify-end items-center gap-2 mb-4">
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
        <Button variant="outline">+ Link contact</Button>
      </div>
      <div className="flex flex-col gap-4 w-full">
        <div className="flex flex-col gap-4 w-1/3 border border-gray-200 rounded-md p-2">
          <div className="flex justify-between">
            <div className="flex justify-start gap-4 items-center">
              <Image
                width={40}
                height={40}
                alt="Contact photo"
                // TODO: Add contact photo
                src="/images/Yuriy.jpg"
              />
              <div className="flex flex-col items-start justify-center text-sm">
                <p className="font-bold">
                  {firstName} {lastName}
                </p>
                <p className="font-semibold text-muted-foreground">
                  {currentJobPost?.title}
                </p>
                <p className="text-muted-foreground">
                  {currentJobPost?.company.name}
                </p>
              </div>
            </div>
            <BsThreeDots className="h-6 w-6 border rounded-md hover:cursor-pointer hover:border-gray-300" />
          </div>
          <hr />
          <div className="flex justify-start gap-2 items-center">
            <IoLocationOutline className="h-6 w-6" />
            <p className="text-sm text-muted-foreground">
              {currentJobPost?.contacts[0].companyLocation}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contacts;
