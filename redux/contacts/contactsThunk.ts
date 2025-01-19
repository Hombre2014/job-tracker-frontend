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
      photoUrl,
      jobTitle,
      companies,
      firstName,
      gitHubUrl,
      twitterUrl,
      linkedinUrl,
      accessToken,
      facebookUrl,
      companyLocation,
    } = values;
    const body = {
      emails,
      phones,
      boardId,
      comment,
      photoUrl,
      lastName,
      jobTitle,
      firstName,
      gitHubUrl,
      companies,
      twitterUrl,
      linkedinUrl,
      facebookUrl,
      companyLocation,
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
      photoUrl,
      jobTitle,
      companies,
      firstName,
      gitHubUrl,
      twitterUrl,
      linkedinUrl,
      accessToken,
      facebookUrl,
      companyLocation,
    } = values;
    const body = {
      id,
      emails,
      phones,
      boardId,
      comment,
      photoUrl,
      lastName,
      jobTitle,
      firstName,
      gitHubUrl,
      companies,
      twitterUrl,
      linkedinUrl,
      facebookUrl,
      companyLocation,
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
