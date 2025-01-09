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

const Contacts = () => {
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
        <Button className="w-fit" variant="normal">
          + Create Contact
        </Button>
        <Button className="w-fit mt-4" variant="outline">
          Link contact
        </Button>
      </CardContent>
      <CardFooter></CardFooter>
    </Card>
  );
};

export default Contacts;
