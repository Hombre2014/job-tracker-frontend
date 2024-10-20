import client from '@/api/client';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const createJobPost = createAsyncThunk(
  'jobs/createJobPost',
  async (values: any, thunkAPI) => {
    const { accessToken, title, companyName, columnId } = values;
    const body = {
      title: title,
      columnId: columnId,
      company: {
        name: companyName,
      },
    };
    try {
      const res = await client.post('/job-applications', body, {
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

export const getAllJobPostsPerColumn = createAsyncThunk(
  'jobs/getAllJobPostsPerColumn',
  async (values: any, thunkAPI) => {
    const { accessToken, columnId } = values;
    try {
      const res = await client.get(`/job-applications/column/${columnId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const data = res.data;
      return data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data || 'Error fetching job posts'
      );
    }
  }
);
