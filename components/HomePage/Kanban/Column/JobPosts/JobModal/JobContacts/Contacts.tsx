import { toast } from 'react-toastify';
import { SlPeople } from 'react-icons/sl';
import { useCallback, useEffect, useState } from 'react';
import { useParams, usePathname } from 'next/navigation';

import ContactCard from './ContactCard';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { getAllJobPostsPerColumn } from '@/redux/jobs/jobsThunk';
import CreateContactModal from '@/components/Misc/CreateContactModal';
import LinkContactComboBox from '@/components/Forms/AddContact/LinkContactComboBox';
import {
  getAllContactsPerBoard,
  assignContactToJobPost,
} from '@/redux/contacts/contactsThunk';
import {
  Card,
  CardTitle,
  CardFooter,
  CardHeader,
  CardContent,
  CardDescription,
} from '@/components/ui/card';

const Contacts = () => {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const { job_id, board_id } = useParams();
  const jobs = useAppSelector((state) => state.jobs);
  const isContactsPage = pathname?.includes('/home/contacts');
  const [availableContacts, setAvailableContacts] = useState<Contact[]>([]);
  const numberOfContactsPerJob =
    jobs.jobPosts.find((job) => job.id === job_id)?.contacts.length || 0;
  const jobPostContacts = jobs.jobPosts.find(
    (job) => job.id === job_id
  )?.contacts;

  // Helper function to filter out contacts already linked to the current job
  const filterUnlinkedContacts = useCallback(
    (allContacts: Contact[], jobId: string | string[] | undefined) => {
      const currentLinkedIds =
        jobs.jobPosts
          .find((job) => job.id === jobId)
          ?.contacts.map((contact: Contact) => contact.id) || [];

      return allContacts.filter(
        (contact: Contact) => !currentLinkedIds.includes(contact.id)
      );
    },
    [jobs.jobPosts]
  );
  // Fetch all board contacts when component mounts
  useEffect(() => {
    const fetchBoardContacts = async () => {
      if (board_id) {
        try {
          const boardId = Array.isArray(board_id) ? board_id[0] : board_id;
          const response = await dispatch(getAllContactsPerBoard(boardId)).unwrap();

          const unlinkedContacts = filterUnlinkedContacts(response, job_id);
          setAvailableContacts(unlinkedContacts);
        } catch (error) {
          console.error('Error fetching board contacts:', error);
          setAvailableContacts([]);
        }
      }
    };
    fetchBoardContacts();
  }, [dispatch, board_id, job_id, filterUnlinkedContacts]);

  const handleContactUpdated = (updatedContact: Contact) => {
    // Refresh data from the backend to update Redux state
    refreshContacts();
  };
  const refreshContacts = useCallback(async () => {
    try {
      const columnId = localStorage.getItem('columnId');
      if (columnId) {
        // Refresh job posts to get updated contact assignments
        const jobPostsResponse = await dispatch(getAllJobPostsPerColumn(columnId)).unwrap();

        // Also refresh the available contacts list
        if (board_id) {
          const boardId = Array.isArray(board_id) ? board_id[0] : board_id;
          const boardContactsResponse = await dispatch(
            getAllContactsPerBoard(boardId)
          ).unwrap();

          // Use the fresh job posts data from the API response to filter contacts
          const currentJob = jobPostsResponse.find(
            (job: any) => job.id === job_id
          );
          const currentLinkedIds =
            currentJob?.contacts?.map((contact: Contact) => contact.id) || [];

          const unlinkedContacts = boardContactsResponse.filter(
            (contact: Contact) => !currentLinkedIds.includes(contact.id)
          );

          setAvailableContacts(unlinkedContacts);
        }
      }
    } catch (error) {
      console.error('Error refreshing contacts:', error);
    }
  }, [dispatch, board_id, job_id]);

  // Remove the additional useEffect that might cause issues
  const handleContactDeleted = () => {
    // Refresh data from the backend
    refreshContacts();
  }; // Handle linking existing contact to job
  const handleLinkContact = async (contact: Contact) => {
    if (!job_id) return;
    try {
      await dispatch(
        assignContactToJobPost({
          contactId: contact.id,
          jobApplicationId: job_id,
        })
      ).unwrap();

      // Refresh the job posts to show the newly linked contact
      await refreshContacts();
    } catch (error) {
      console.error('Error linking contact to job:', error);

      // Show error toast notification
      toast.error(
        `Failed to link ${contact.firstName} ${contact.lastName} to this job. Please try again.`,
        {
          autoClose: 5000,
          draggable: true,
          closeOnClick: true,
          pauseOnHover: true,
          position: 'top-right',
          hideProgressBar: false,
        }
      );
    }
  };
  return (
    <>
      {numberOfContactsPerJob === 0 ? (
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
            {' '}
            <CreateContactModal
              showButton={true}
              buttonLabel="+ Create Contact"
              userContactsPage={isContactsPage}
              onContactCreated={refreshContacts}
              onContactUpdated={refreshContacts}
            />{' '}
            <LinkContactComboBox
              onLinkContact={handleLinkContact}
              availableContacts={availableContacts}
            />
          </CardContent>
          <CardFooter></CardFooter>
        </Card>
      ) : (
        <div className="flex flex-col gap-4 w-full">
          <div className="flex justify-end items-center gap-2 mb-4">
            {' '}
            <CreateContactModal
              showButton={true}
              buttonLabel="+ Create Contact"
              userContactsPage={isContactsPage}
              onContactCreated={refreshContacts}
              onContactUpdated={refreshContacts}
            />{' '}
            <LinkContactComboBox
              onLinkContact={handleLinkContact}
              availableContacts={availableContacts}
            />
          </div>
          <div className="flex flex-wrap gap-4 overflow-y-auto h-[506px]">
            {jobPostContacts?.map((contact) => (
              <div key={contact.id}>
                <ContactCard
                  contact={contact}
                  onDelete={handleContactDeleted}
                  onUpdate={handleContactUpdated}
                />
              </div>
            ))}{' '}
          </div>
        </div>
      )}
    </>
  );
};

export default Contacts;
