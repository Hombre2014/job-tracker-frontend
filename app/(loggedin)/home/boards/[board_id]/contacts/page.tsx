import CreateContactModal from '@/components/Misc/CreateContactModal';

const BoardContacts = () => {
  return (
    <div className="w-1/2 flex items-center pt-2 pb-4 border-b mx-auto mt-24">
      <div className="flex justify-between w-full">
        <h1 className="font-semibold text-center">Contacts</h1>
      </div>
      <CreateContactModal showButton={true} />
    </div>
  );
};

export default BoardContacts;
