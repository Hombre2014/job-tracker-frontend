import { Button } from '@/components/ui/button';

const UserContacts = () => {
  return (
    <div className="w-full flex items-center py-2 border-b">
      <div className="w-11/12">
        <h1 className="font-semibold text-center">Contacts</h1>
      </div>
      <Button variant="normal">+ Contact</Button>
    </div>
  );
};

export default UserContacts;
