import { createSlice } from '@reduxjs/toolkit';

import { RootState } from '../store';
import {
  getContact,
  createContact,
  updateContact,
  deleteContact,
  uploadContactImage,
  getAllContactsPerBoard,
  assignContactToJobPost,
  unassignContactFromJobPost,
} from './contactsThunk';

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
        const updatedContact = action.payload;
        state.contacts = state.contacts.map((contact) =>
          contact.id === updatedContact.id
            ? { ...contact, ...updatedContact }
            : contact
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
      })
      .addCase(getContact.pending, (state) => {
        state.contactsStatus = 'loading';
      })
      .addCase(getContact.fulfilled, (state, action) => {
        state.contactsStatus = 'succeeded';
        state.contacts = action.payload;
        state.error = null;
      })
      .addCase(getContact.rejected, (state, action) => {
        state.contactsStatus = 'failed';
        state.error = action.error.message || 'Failed to get contact';
      })
      .addCase(getAllContactsPerBoard.pending, (state) => {
        state.contactsStatus = 'loading';
      })
      .addCase(getAllContactsPerBoard.fulfilled, (state, action) => {
        state.contactsStatus = 'succeeded';
        state.contacts = action.payload;
        state.error = null;
      })
      .addCase(getAllContactsPerBoard.rejected, (state, action) => {
        state.contactsStatus = 'failed';
        state.error = action.error.message || 'Failed to get contacts';
      })
      .addCase(assignContactToJobPost.pending, (state) => {
        state.contactsStatus = 'loading';
      })
      .addCase(assignContactToJobPost.fulfilled, (state, action) => {
        state.contactsStatus = 'succeeded';
        state.contacts = state.contacts.map((contact) =>
          contact.id === action.payload.contactId
            ? { ...contact, jobPostId: action.payload.jobPostId }
            : contact
        );
        state.error = null;
      })
      .addCase(assignContactToJobPost.rejected, (state, action) => {
        state.contactsStatus = 'failed';
        state.error =
          action.error.message || 'Failed to assign contact to job post';
      })
      .addCase(unassignContactFromJobPost.pending, (state) => {
        state.contactsStatus = 'loading';
      })
      .addCase(unassignContactFromJobPost.fulfilled, (state, action) => {
        state.contactsStatus = 'succeeded';
        state.contacts = state.contacts.map((contact) =>
          contact.id === action.payload.contactId
            ? { ...contact, jobPostId: null }
            : contact
        );
        state.error = null;
      })
      .addCase(unassignContactFromJobPost.rejected, (state, action) => {
        state.contactsStatus = 'failed';
        state.error =
          action.error.message || 'Failed to unassign contact from job post';
      })
      .addCase(uploadContactImage.pending, (state) => {
        state.contactsStatus = 'loading';
      })
      .addCase(uploadContactImage.fulfilled, (state, action) => {
        state.contactsStatus = 'succeeded';
        const { contactId, imageUrl } = action.payload;
        state.contacts = state.contacts.map((contact) =>
          contact.id === contactId
            ? { ...contact, photoUrl: imageUrl }
            : contact
        );
        state.error = null;
      })
      .addCase(uploadContactImage.rejected, (state, action) => {
        state.contactsStatus = 'failed';
        state.error = action.error.message || 'Failed to upload contact image';
      });
  },
});

export const selectContacts = (state: RootState) => state.contacts.contacts;
export const selectContactsStatus = (state: RootState) =>
  state.contacts.contactsStatus;
export const selectContactsError = (state: RootState) => state.contacts.error;
export default contactsSlice.reducer;
