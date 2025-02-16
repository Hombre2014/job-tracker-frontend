import { SlPeople } from 'react-icons/sl';
import { useParams } from 'next/navigation';

import ContactCard from './ContactCard';
import { Button } from '@/components/ui/button';
import { useAppSelector } from '@/redux/hooks';
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
  const jobs = useAppSelector((state) => state.jobs);

  console.log('jobs in Contacts: ', jobs);

  const numberOfContactsPerJob =
    jobs.jobPosts.find((job) => job.id === job_id)?.contacts.length || 0;

  console.log('number of contacts', numberOfContactsPerJob);

  const jobPostContacts = jobs.jobPosts.find(
    (job) => job.id === job_id
  )?.contacts;

  console.log('contacts: ', jobPostContacts);

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
        <CreateContactModal showButton={true} buttonLabel="+ Create Contact" />
        <Button className="w-fit mt-4" variant="outline">
          + Link contact
        </Button>
      </CardContent>
      <CardFooter></CardFooter>
    </Card>
  ) : (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex justify-end items-center gap-2 mb-4">
        <CreateContactModal showButton={true} buttonLabel="+ Create Contact" />
        <Button variant="outline">+ Link contact</Button>
      </div>
      <div className="flex flex-wrap gap-4">
        {jobPostContacts?.map((contact) => (
          <div key={contact.id} className="">
            <ContactCard contact={contact} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Contacts;
