import { useEffect, useState, useCallback } from 'react';
import { useParams, usePathname } from 'next/navigation';

import { useAppDispatch } from '@/redux/hooks';
import CreateContactModal from './CreateContactModal';
import { getBoardsOnly } from '@/redux/boards/boardsThunk';
import { getAllContactsPerBoard } from '@/redux/contacts/contactsThunk';
import ContactCard from '@/components/HomePage/Kanban/Column/JobPosts/JobModal/JobContacts/ContactCard';

const ContactsList = ({
  refetchContacts,
  contacts: initialContacts,
}: ContactsListProps) => {
  const params = useParams();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const accessToken = localStorage.getItem('accessToken');
  const [error, setError] = useState<string | null>(null);
  const isContactsPage = pathname?.includes('/home/contacts');
  const [contactsWithBoardIds, setContactsWithBoardIds] = useState<Contact[]>(
    initialContacts || [],
  );
  const board_id = params.board_id
    ? Array.isArray(params.board_id)
      ? params.board_id[0]
      : params.board_id
    : undefined;

  // Fetch contacts for a specific board
  const fetchContactsForBoard = useCallback(
    async (boardId: string) => {
      try {
        const boardContacts = await dispatch(
          getAllContactsPerBoard({
            accessToken,
            boardId,
          }),
        ).unwrap();

        return boardContacts.map((contact: Contact) => ({
          ...contact,
          boardId, // Ensure boardId is set
        }));
      } catch (error) {
        console.error(`Error fetching contacts for board ${boardId}:`, error);
        return [];
      }
    },
    [dispatch, accessToken],
  );

  // Fetch contacts from all boards
  const fetchAllContacts = useCallback(async () => {
    try {
      const boards = await dispatch(
        getBoardsOnly(accessToken as string),
      ).unwrap();

      // Fetch contacts for all boards in parallel
      const contactPromises = boards.map((board: Board) =>
        fetchContactsForBoard(board.id),
      );

      // Wait for all promises to resolve
      const contactsArrays = await Promise.all(contactPromises);

      // Flatten the array of arrays
      return contactsArrays.flat();
    } catch (error) {
      console.error('Error fetching boards:', error);
      setError('Failed to fetch contacts from all boards');
      return [];
    }
  }, [dispatch, accessToken, fetchContactsForBoard]);

  useEffect(() => {
    const loadContacts = async () => {
      if (!accessToken) return;

      setIsLoading(true);
      setError(null);

      try {
        // If we have a board_id, fetch contacts for that board
        if (board_id) {
          const boardContacts = await fetchContactsForBoard(board_id);
          setContactsWithBoardIds(boardContacts);
        }
        // If we're on the contacts page (no board_id), fetch all contacts
        else if (isContactsPage) {
          const allContacts = await fetchAllContacts();
          setContactsWithBoardIds(allContacts);
        }
      } catch (error) {
        console.error('Error loading contacts:', error);
        setError('Failed to load contacts');
      } finally {
        setIsLoading(false);
      }
    };

    loadContacts();
  }, [
    board_id,
    accessToken,
    isContactsPage,
    fetchAllContacts,
    fetchContactsForBoard,
  ]);

  // Handle data refresh separately to avoid creating loops
  useEffect(() => {
    if (refetchContacts) {
      refetchContacts();
    }
  }, [refetchContacts]);

  const handleContactDeleted = (deletedContactId: string) => {
    setContactsWithBoardIds((prevContacts) =>
      prevContacts.filter((contact) => contact.id !== deletedContactId),
    );
  };

  const handleContactUpdated = (updatedContact: Contact) => {
    setContactsWithBoardIds((prevContacts) =>
      prevContacts.map((contact) =>
        contact.id === updatedContact.id ? updatedContact : contact,
      ),
    );
  };

  return (
    <div className="w-2/3 flex flex-col mx-auto mt-8">
      <div className="w-full flex items-center py-2 border-b mb-8">
        <div className="w-full flex justify-between items-center">
          <h1 className="font-semibold text-center">Contacts</h1>
          <CreateContactModal
            showButton={true}
            userContactsPage={isContactsPage}
            onContactCreated={refetchContacts}
            onContactUpdated={(updatedContact) => {
              setContactsWithBoardIds((prevContacts) =>
                prevContacts.map((contact) =>
                  contact.id === updatedContact.id ? updatedContact : contact,
                ),
              );
            }}
          />
        </div>
      </div>

      {isLoading && (
        <div className="text-center p-4">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent mx-auto mb-2"></div>
          <p>Loading contacts...</p>
        </div>
      )}

      {error && (
        <div className="text-center p-4 text-red-500">
          <p>{error}</p>
        </div>
      )}

      {!isLoading && !error && contactsWithBoardIds.length === 0 && (
        <div className="text-center p-8 border border-dashed rounded-md">
          <p className="text-lg text-gray-500">No contacts found</p>
          <p className="text-sm text-gray-400 mt-2">
            Create a new contact to get started
          </p>
        </div>
      )}

      {!isLoading && !error && contactsWithBoardIds.length > 0 && (
        <div className="w-full flex flex-wrap items-center justify-start gap-4 max-h-[80vh] overflow-y-auto">
          {contactsWithBoardIds.map((contact) => (
            <div key={contact.id}>
              <ContactCard
                contact={contact}
                onDelete={handleContactDeleted}
                onUpdate={handleContactUpdated}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ContactsList;
