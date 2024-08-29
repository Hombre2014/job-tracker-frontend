import { createAsyncThunk } from '@reduxjs/toolkit';
import client from '@/api/client';

export const createJobPost = createAsyncThunk(
  'jobs/createJobPost',
  async (values: any, thunkAPI) => {
    const { accessToken, title, companyName, description, columnId } = values;
    const postData = { title, companyName, description, columnId };
    try {
      const res = await client.post('/job-applications', postData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const data = res.data;
      return data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data || 'Error creating job post'
      );
    }
  }
);
