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
      const res = await client.post(`/job-applications-notes`, body, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = res.data;
      return data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data || 'Error creating job application note'
      );
    }
  }
);

export const getAllJobApplicationNotes = createAsyncThunk(
  'notes/getAllJobApplicationNotes',
  async (values: any, thunkAPI) => {
    const { accessToken, jobApplicationId } = values;
    try {
      const res = await client.get(
        `/job-applications-notes/${jobApplicationId}`,
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
        err.response?.data || 'Error fetching job application notes'
      );
    }
  }
);
