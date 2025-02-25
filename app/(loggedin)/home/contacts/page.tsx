'use client';

import { useCallback, useEffect, useState } from 'react';

import { useAppDispatch } from '@/redux/hooks';
import ContactsList from '@/components/Misc/ContactsList';
import { getBoardsOnly } from '@/redux/boards/boardsThunk';
import { getAllContactsPerBoard } from '@/redux/contacts/contactsThunk';

const UserContacts = () => {
  const dispatch = useAppDispatch();
  const accessToken = localStorage.getItem('accessToken');
  const [allUserContacts, setAllUserContacts] = useState<Contact[]>([]);

  const fetchAllContacts = useCallback(async () => {
    if (!accessToken) return;

    try {
      const boardsResponse = await dispatch(
        getBoardsOnly(accessToken)
      ).unwrap();
      const contactsPromises = boardsResponse.map((board: Board) =>
        dispatch(
          getAllContactsPerBoard({
            accessToken,
            boardId: board.id,
          })
        ).unwrap()
      );

      const contactsArrays = await Promise.all(contactsPromises);
      const uniqueContacts = Array.from(
        new Map(
          contactsArrays.flat().map((contact) => [contact.id, contact])
        ).values()
      );

      setAllUserContacts(uniqueContacts);
    } catch (error) {
      console.error('Error fetching contacts:', error);
    }
  }, [dispatch, accessToken]);

  useEffect(() => {
    fetchAllContacts();
  }, [fetchAllContacts]);

  return (
    <ContactsList
      contacts={allUserContacts}
      refetchContacts={fetchAllContacts}
    />
  );
};

export default UserContacts;
