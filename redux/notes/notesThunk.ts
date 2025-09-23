import { isAxiosError } from 'axios';

import client from '@/api/client';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const createJobApplicationNote = createAsyncThunk(
  'notes/createJobApplicationNote',
  async (values: any, thunkAPI) => {
    const { accessToken, jobApplicationId, noteContent } = values;
    const body = {
      content: noteContent,
      jobApplicationId: jobApplicationId,
    };
    try {
      const res = await client.post(`/job-application-notes`, body, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = res.data;
      return data;
    } catch (err: unknown) {
      if (isAxiosError(err)) {
        return thunkAPI.rejectWithValue(
          err.response?.data || 'Error creating job application note'
        );
      }
      return thunkAPI.rejectWithValue('Error creating job application note');
    }
  }
);

export const getAllJobApplicationNotes = createAsyncThunk(
  'notes/getAllJobApplicationNotes',
  async (values: any, thunkAPI) => {
    const { accessToken, jobApplicationId } = values;
    try {
      const res = await client.get(
        `/job-application-notes/${jobApplicationId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const data = res.data;
      return data;
    } catch (err: unknown) {
      if (isAxiosError(err)) {
        return thunkAPI.rejectWithValue(
          err.response?.data || 'Error fetching job application notes'
        );
      }
      return thunkAPI.rejectWithValue('Error fetching job application notes');
    }
  }
);

export const updateJobApplicationNote = createAsyncThunk(
  'notes/updateJobApplicationNote',
  async (values: any, thunkAPI) => {
    const { accessToken, noteContent, noteId } = values;
    const body = {
      content: noteContent,
    };
    try {
      const res = await client.put(`/job-application-notes/${noteId}`, body, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = res.data;
      return data;
    } catch (err: unknown) {
      if (isAxiosError(err)) {
        return thunkAPI.rejectWithValue(
          err.response?.data || 'Error updating job application note'
        );
      }
      return thunkAPI.rejectWithValue('Error updating job application note');
    }
  }
);

export const deleteJobApplicationNote = createAsyncThunk(
  'notes/deleteJobApplicationNote',
  async (values: any, thunkAPI) => {
    const { accessToken, noteId } = values;
    try {
      await client.delete(`/job-application-notes/${noteId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return noteId;
    } catch (err: unknown) {
      if (isAxiosError(err)) {
        return thunkAPI.rejectWithValue(
          err.response?.data || 'Error deleting job application note'
        );
      }
      return thunkAPI.rejectWithValue('Error deleting job application note');
    }
  }
);
