import client from '@/api/client';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const createContact = createAsyncThunk(
  'contacts/createContact',
  async (values: any, thunkAPI) => {
    const {
      emails,
      phones,
      boardId,
      comment,
      lastName,
      // photoUrl,
      jobTitle,
      // companies,
      firstName,
      gitHubUrl,
      twitterUrl,
      linkedinUrl,
      accessToken,
      facebookUrl,
      companyLocation,
    } = values;
    const body = {
      emails: emails,
      phones: phones,
      boardId: boardId,
      comment: comment,
      // photoUrl: photoUrl,
      lastName: lastName,
      jobTitle: jobTitle,
      firstName: firstName,
      gitHubUrl: gitHubUrl,
      // companies: companies,
      twitterUrl: twitterUrl,
      linkedinUrl: linkedinUrl,
      facebookUrl: facebookUrl,
      companyLocation: companyLocation,
    };
    try {
      const res = await client.post(`/contacts`, body, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = res.data;
      return data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data || 'Error creating contact'
      );
    }
  }
);

export const updateContact = createAsyncThunk(
  'contacts/updateContact',
  async (values: any, thunkAPI) => {
    const {
      id,
      emails,
      phones,
      boardId,
      comment,
      lastName,
      // photoUrl,
      jobTitle,
      // companies,
      firstName,
      gitHubUrl,
      twitterUrl,
      linkedinUrl,
      accessToken,
      facebookUrl,
      companyLocation,
    } = values;
    const body = {
      id: id,
      emails: emails,
      phones: phones,
      boardId: boardId,
      comment: comment,
      // photoUrl: photoUrl,
      lastName: lastName,
      jobTitle: jobTitle,
      firstName: firstName,
      gitHubUrl: gitHubUrl,
      // companies: companies,
      twitterUrl: twitterUrl,
      linkedinUrl: linkedinUrl,
      facebookUrl: facebookUrl,
      companyLocation: companyLocation,
    };
    try {
      const res = await client.put(`/contacts`, body, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = res.data;
      return data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data || 'Error updating contact'
      );
    }
  }
);

export const deleteContact = createAsyncThunk(
  'contacts/deleteContact',
  async (values: any, thunkAPI) => {
    const { id, accessToken } = values;
    try {
      const res = await client.delete(`/contacts/${id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = res.data;
      return data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data || 'Error deleting contact'
      );
    }
  }
);

export const getContact = createAsyncThunk(
  'contacts/getContact',
  async ({ accessToken, boardId, contactId }: any, thunkAPI) => {
    try {
      const res = await client.get(
        `/contacts?boardId=${boardId}&contactId=${contactId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const data = res.data;
      return data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data || 'Error getting contacts'
      );
    }
  }
);

export const getAllContactsPerBoard = createAsyncThunk(
  'contacts/getAllContactsPerBoard',
  async (values: any, thunkAPI) => {
    const { accessToken, boardId } = values;
    try {
      const res = await client.get(`/contacts?boardId=${boardId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = res.data;
      return data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data || 'Error getting contacts'
      );
    }
  }
);
