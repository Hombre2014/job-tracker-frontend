import client from '@/api/client';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { defaultJobPostColor } from '@/data/constants';

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
      color: defaultJobPostColor,
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

export const updateJobPost = createAsyncThunk(
  'jobs/updateJobPost',
  async (values: any, thunkAPI) => {
    const {
      accessToken,
      title,
      company: { name: companyName },
      columnId,
      jobPostId,
      status,
      postUrl,
      salary,
      location,
      color,
      deadline,
      description,
    } = values;
    const body = {
      title: title,
      columnId: columnId,
      company: {
        name: companyName,
      },
      postUrl: postUrl,
      salary: salary,
      location: location,
      color: color,
      status: status,
      deadline: deadline,
      description: description,
    };
    try {
      const res = await client.put(`/job-applications/${jobPostId}`, body, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const data = res.data;
      return data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data || 'Error updating job post'
      );
    }
  }
);

export const deleteJobPost = createAsyncThunk(
  'jobs/deleteJobPost',
  async (values: any, thunkAPI) => {
    const { accessToken, jobPostId } = values;
    try {
      await client.delete(`/job-applications/${jobPostId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      return jobPostId;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data || 'Error deleting job post'
      );
    }
  }
);
