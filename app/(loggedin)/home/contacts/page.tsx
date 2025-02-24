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

  // useEffect(() => {
  //   const fetchAllContacts = async () => {
  //     if (!accessToken) return;

  //     try {
  //       const boardsResponse = await dispatch(
  //         getBoardsOnly(accessToken)
  //       ).unwrap();

  //       const contactsPromises = boardsResponse.map((board: Board) =>
  //         dispatch(
  //           getAllContactsPerBoard({
  //             accessToken,
  //             boardId: board.id,
  //           })
  //         ).unwrap()
  //       );

  //       // contactsArrays.flat() combines all contact arrays into one
  //       // map(contact => [contact.id, contact]) creates key-value pairs
  //       // new Map() removes duplicates based on contact IDs
  //       // Array.from().values() converts back to an array

  //       const contactsArrays = await Promise.all(contactsPromises);
  //       const uniqueContacts = Array.from(
  //         new Map(
  //           contactsArrays.flat().map((contact) => [contact.id, contact])
  //         ).values()
  //       );

  //       setAllUserContacts(uniqueContacts);
  //     } catch (error) {
  //       console.error('Error fetching contacts:', error);
  //     }
  //   };

  //   fetchAllContacts();
  // }, [dispatch, accessToken]);

  // return <ContactsList contacts={allUserContacts} />;

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
