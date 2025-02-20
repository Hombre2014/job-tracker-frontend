import CreateContactModal from './CreateContactModal';
import ContactCard from '@/components/HomePage/Kanban/Column/JobPosts/JobModal/JobContacts/ContactCard';

interface ContactsListProps {
  contacts: Contact[];
}

const ContactsList = ({ contacts }: ContactsListProps) => {
  return (
    <div className="w-2/3 flex flex-col mx-auto mt-8">
      <div className="w-full flex items-center py-2 border-b mb-8">
        <div className="w-full flex justify-between items-center">
          <h1 className="font-semibold text-center">Contacts</h1>
          <CreateContactModal showButton={true} />
        </div>
      </div>
      <div className="w-full flex flex-wrap items-center justify-start gap-4 max-h-[80vh] overflow-y-auto">
        {contacts.map((contact) => (
          <div key={contact.id} className="">
            <ContactCard contact={contact} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContactsList;
