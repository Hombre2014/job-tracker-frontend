import client from '@/api/client';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const createContact = createAsyncThunk(
  'contacts',
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
