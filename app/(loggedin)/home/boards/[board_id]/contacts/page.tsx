'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useAppDispatch } from '@/redux/hooks';

import ContactsList from '@/components/Misc/ContactsList';
import { getAllContactsPerBoard } from '@/redux/contacts/contactsThunk';

const BoardContacts = () => {
  const { board_id } = useParams();
  const dispatch = useAppDispatch();
  const accessToken = localStorage.getItem('accessToken');
  const [allContacts, setAllContacts] = useState<Contact[]>([]);

  useEffect(() => {
    dispatch(getAllContactsPerBoard({ accessToken, boardId: board_id }))
      .unwrap()
      .then((contacts) => setAllContacts(contacts));
  }, [dispatch, accessToken, board_id]);

  return <ContactsList contacts={allContacts} />;
};

export default BoardContacts;
