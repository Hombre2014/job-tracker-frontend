import { createSlice } from '@reduxjs/toolkit';

import { RootState } from '../store';
import { createContact, updateContact, deleteContact } from './contactsThunk';

interface ContactState {
  contacts: Contact[];
  error: string | null;
  contactsStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
}

const initialState: ContactState = {
  error: null,
  contacts: [],
  contactsStatus: 'idle',
};

export const contactsSlice = createSlice({
  name: 'contacts',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createContact.pending, (state) => {
        state.contactsStatus = 'loading';
      })
      .addCase(createContact.fulfilled, (state, action) => {
        state.contactsStatus = 'succeeded';
        state.contacts.push(action.payload);
        state.error = null;
      })
      .addCase(createContact.rejected, (state, action) => {
        state.contactsStatus = 'failed';
        state.error = action.error.message || 'Failed to create contact';
      })
      .addCase(updateContact.pending, (state) => {
        state.contactsStatus = 'loading';
      })
      .addCase(updateContact.fulfilled, (state, action) => {
        state.contactsStatus = 'succeeded';
        state.contacts = state.contacts.map((contact) =>
          contact.id === action.payload.id ? action.payload : contact
        );
        state.error = null;
      })
      .addCase(updateContact.rejected, (state, action) => {
        state.contactsStatus = 'failed';
        state.error = action.error.message || 'Failed to update contact';
      })
      .addCase(deleteContact.pending, (state) => {
        state.contactsStatus = 'loading';
      })
      .addCase(deleteContact.fulfilled, (state, action) => {
        state.contactsStatus = 'succeeded';
        state.contacts = state.contacts.filter(
          (contact) => contact.id !== action.payload.id
        );
        state.error = null;
      })
      .addCase(deleteContact.rejected, (state, action) => {
        state.contactsStatus = 'failed';
        state.error = action.error.message || 'Failed to delete contact';
      });
  },
});

export const selectContacts = (state: RootState) => state.contacts.contacts;
export const selectContactsStatus = (state: RootState) =>
  state.contacts.contactsStatus;
export const selectContactsError = (state: RootState) => state.contacts.error;
export default contactsSlice.reducer;
