'use client';

import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useAppDispatch } from '@/redux/hooks';

import ContactsList from '@/components/Misc/ContactsList';
import { getAllContactsPerBoard } from '@/redux/contacts/contactsThunk';

const BoardContacts = () => {
  const { board_id } = useParams();
  const dispatch = useAppDispatch();
  // Access token handled by HTTP-only cookies
  const [allBoardContacts, setAllBoardContacts] = useState<Contact[]>([]);

  const fetchBoardContacts = useCallback(async () => {
    try {
      const boardIdString = Array.isArray(board_id) ? board_id[0] : board_id;
      const contacts = await dispatch(
        getAllContactsPerBoard(boardIdString)
      ).unwrap();
      setAllBoardContacts(contacts);
    } catch (error) {
      console.error('Error fetching board contacts:', error);
    }
  }, [dispatch, board_id]);
  useEffect(() => {
    fetchBoardContacts();
  }, [fetchBoardContacts]);

  // Function to handle updates to contacts list
  const handleContactUpdate = useCallback(() => {
    fetchBoardContacts();
  }, [fetchBoardContacts]);

  return (
    <ContactsList
      contacts={allBoardContacts}
      refetchContacts={handleContactUpdate}
    />
  );
};

export default BoardContacts;
