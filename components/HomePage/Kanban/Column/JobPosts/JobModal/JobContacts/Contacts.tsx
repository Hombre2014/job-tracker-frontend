import { SlPeople } from 'react-icons/sl';
import { useCallback, useState } from 'react';
import { useParams, usePathname } from 'next/navigation';

import ContactCard from './ContactCard';
import { Button } from '@/components/ui/button';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { getAllJobPostsPerColumn } from '@/redux/jobs/jobsThunk';
import CreateContactModal from '@/components/Misc/CreateContactModal';
import {
  Card,
  CardTitle,
  CardFooter,
  CardHeader,
  CardContent,
  CardDescription,
} from '@/components/ui/card';

const Contacts = () => {
  const { job_id } = useParams();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const jobs = useAppSelector((state) => state.jobs);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const accessToken = localStorage.getItem('accessToken');
  const isContactsPage = pathname?.includes('/home/contacts');

  const numberOfContactsPerJob =
    jobs.jobPosts.find((job) => job.id === job_id)?.contacts.length || 0;

  const jobPostContacts = jobs.jobPosts.find(
    (job) => job.id === job_id
  )?.contacts;
  const handleContactUpdated = (updatedContact: Contact) => {
    // First update local state
    setContacts((prevContacts) =>
      prevContacts.map((contact) =>
        contact.id === updatedContact.id ? updatedContact : contact
      )
    );
    
    // Then refresh data from the backend
    refreshContacts();
  };
  const refreshContacts = useCallback(async () => {
    try {
      const columnId = localStorage.getItem('columnId');
      if (columnId) {
        console.log('Refreshing contacts for job application...');
        // Remove the setTimeout to ensure immediate refresh
        const response = await dispatch(
          getAllJobPostsPerColumn({
            accessToken,
            columnId,
          })
        ).unwrap();
        
        console.log('Job posts refreshed:', response);
      }
    } catch (error) {
      console.error('Error refreshing contacts:', error);
    }
  }, [dispatch, accessToken]);
  const handleContactDeleted = () => {
    // Refresh data from the backend
    refreshContacts();
  };

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
        <CreateContactModal
          showButton={true}
          buttonLabel="+ Create Contact"
          userContactsPage={isContactsPage}
          onContactCreated={refreshContacts}
          onContactUpdated={refreshContacts}
        />
        <Button className="w-fit mt-4" variant="outline">
          + Link contact
        </Button>
      </CardContent>
      <CardFooter></CardFooter>
    </Card>
  ) : (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex justify-end items-center gap-2 mb-4">
        <CreateContactModal
          showButton={true}
          buttonLabel="+ Create Contact"
          userContactsPage={isContactsPage}
          onContactCreated={refreshContacts}
          onContactUpdated={refreshContacts}
        />
        <Button variant="outline">+ Link contact</Button>
      </div>
      <div className="flex flex-wrap gap-4 overflow-y-auto h-[506px]">        {jobPostContacts?.map((contact) => (
          <div key={contact.id} className="">
            <ContactCard 
              contact={contact} 
              onDelete={handleContactDeleted}
              onUpdate={handleContactUpdated}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Contacts;
