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
      jobTitle,
      location,
      photoUrl,
      firstName,
      githubUrl,
      companyIds,
      twitterUrl,
      linkedinUrl,
      accessToken,
      facebookUrl,
    } = values;
    const body = {
      emails: emails,
      phones: phones,
      boardId: boardId,
      comment: comment,
      lastName: lastName,
      jobTitle: jobTitle,
      location: location,
      photoUrl: photoUrl,
      firstName: firstName,
      githubUrl: githubUrl,
      companyIds: companyIds,
      twitterUrl: twitterUrl,
      linkedinUrl: linkedinUrl,
      facebookUrl: facebookUrl,
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
      jobTitle,
      location,
      photoUrl,
      firstName,
      githubUrl,
      companyIds,
      twitterUrl,
      linkedinUrl,
      accessToken,
      facebookUrl,
    } = values;
    const body = {
      id: id,
      emails: emails,
      phones: phones,
      boardId: boardId,
      comment: comment,
      lastName: lastName,
      jobTitle: jobTitle,
      location: location,
      photoUrl: photoUrl,
      firstName: firstName,
      githubUrl: githubUrl,
      companyIds: companyIds,
      twitterUrl: twitterUrl,
      linkedinUrl: linkedinUrl,
      facebookUrl: facebookUrl,
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

export const assignContactToJobPost = createAsyncThunk(
  'contacts/assignContactToJobPost',
  async (values: any, thunkAPI) => {
    const { accessToken, contactId, jobApplicationId } = values;
    const body = {
      contactId: contactId,
      jobApplicationId: jobApplicationId,
    };
    try {
      const res = await client.post(`/contacts/jobApplication/assign`, body, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = res.data;
      return data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data || 'Error assigning contact to job application'
      );
    }
  }
);

export const unassignContactFromJobPost = createAsyncThunk(
  'contacts/unassignContactFromJobPost',
  async (values: any, thunkAPI) => {
    const { accessToken, contactId, jobApplicationId } = values;
    const body = {
      contactId: contactId,
      jobApplicationId: jobApplicationId,
    };
    try {
      const res = await client.post(`/contacts/jobApplication/unassign`, body, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = res.data;
      return data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data || 'Error removing contact from job application'
      );
    }
  }
);
