'use client';

import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useAppDispatch } from '@/redux/hooks';

import ContactsList from '@/components/Misc/ContactsList';
import { getAllContactsPerBoard } from '@/redux/contacts/contactsThunk';

const BoardContacts = () => {
  const { board_id } = useParams();
  const dispatch = useAppDispatch();
  const accessToken = localStorage.getItem('accessToken');
  const [allBoardContacts, setAllBoardContacts] = useState<Contact[]>([]);

  const fetchBoardContacts = useCallback(async () => {
    try {
      const contacts = await dispatch(
        getAllContactsPerBoard({ accessToken, boardId: board_id })
      ).unwrap();
      setAllBoardContacts(contacts);
    } catch (error) {
      console.error('Error fetching board contacts:', error);
    }
  }, [dispatch, accessToken, board_id]);

  useEffect(() => {
    fetchBoardContacts();
  }, [fetchBoardContacts]);

  return (
    <ContactsList
      contacts={allBoardContacts}
      refetchContacts={fetchBoardContacts}
    />
  );
};

export default BoardContacts;
