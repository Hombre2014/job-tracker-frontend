import { isAxiosError } from 'axios';

import client from '@/api/client';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { defaultJobPostColor } from '@/data/constants';
import { DocumentService } from '@/services/documentService';

export const createJobPost = createAsyncThunk(
  'jobs/createJobPost',
  async (values: any, thunkAPI) => {
    const {
      title,
      companyId,
      columnId,
      status,
      postUrl,
      description,
      location,
      salary,
      deadline,
    } = values;
    const body = {
      title: title,
      status: status,
      columnId: columnId,
      companyId: companyId,
      postUrl: postUrl,
      location: location,
      salary: salary,
      description: description,
      deadline: deadline,
      color: defaultJobPostColor,
      createdAt: new Date().toISOString(),
    };
    try {
      const res = await client.post('/job-applications', body);

      const data = res.data;
      return data;
    } catch (err: unknown) {
      if (isAxiosError(err)) {
        return thunkAPI.rejectWithValue(
          err.response?.data || 'Error creating job post'
        );
      }
      return thunkAPI.rejectWithValue('Error creating job post');
    }
  }
);

export const getAllJobPostsPerColumn = createAsyncThunk(
  'jobs/getAllJobPostsPerColumn',
  async (columnId: string, thunkAPI) => {
    try {
      const res = await client.get(`/job-applications/column/${columnId}`);

      const data = res.data;
      return data;
    } catch (err: unknown) {
      if (isAxiosError(err)) {
        return thunkAPI.rejectWithValue(
          err.response?.data || 'Error fetching job posts'
        );
      }
      return thunkAPI.rejectWithValue('Error fetching job posts');
    }
  }
);

export const updateJobPost = createAsyncThunk(
  'jobs/updateJobPost',
  async (values: any, thunkAPI) => {
    const {
      title,
      color,
      salary,
      status,
      postUrl,
      company,
      location,
      deadline,
      columnId,
      jobPostId,
      description,
      statusChangedAt,
    } = values;
    const companyName: string | undefined = company?.name;

    const body: any = {
      title: title,
      color: color,
      salary: salary,
      status: status,
      postUrl: postUrl,
      location: location,
      deadline: deadline,
      columnId: columnId,
      description: description,
      statusChangedAt: statusChangedAt,
    };

    if (companyName) {
      body.company = { name: companyName };
    }
    try {
      const res = await client.put(`/job-applications/${jobPostId}`, body);

      const data = res.data;
      return data;
    } catch (err: unknown) {
      if (isAxiosError(err)) {
        return thunkAPI.rejectWithValue(
          err.response?.data || 'Error updating job post'
        );
      }
      return thunkAPI.rejectWithValue('Error updating job post');
    }
  }
);

export const deleteJobPost = createAsyncThunk(
  'jobs/deleteJobPost',
  async (values: any, thunkAPI) => {
    const { jobPostId, jobPostData } = values;
    try {
      // Step 1: Handle documents attached to this job post using DocumentService
      if (jobPostData?.documents && jobPostData.documents.length > 0) {
        const documentResults =
          await DocumentService.handleDocumentsForJobDeletion(
            jobPostData.documents,
            jobPostId,
          );

        // Log the results for debugging in development only
        if (process.env.NODE_ENV === 'development') {
          console.log('Document processing results:', documentResults);
        }
      }

      // Step 2: Delete the job post itself
      await client.delete(`/job-applications/${jobPostId}`);

      return jobPostId;
    } catch (err: unknown) {
      if (isAxiosError(err)) {
        return thunkAPI.rejectWithValue(
          err.response?.data || 'Error deleting job post'
        );
      }
      return thunkAPI.rejectWithValue('Error deleting job post');
    }
  }
);

export const getJobPost = createAsyncThunk(
  'jobs/getJobPost',
  async (jobPostId: string, thunkAPI) => {
    try {
      const res = await client.get(`/job-applications/${jobPostId}`);

      const data = res.data;
      return data;
    } catch (err: unknown) {
      if (isAxiosError(err)) {
        return thunkAPI.rejectWithValue(
          err.response?.data || 'Error fetching job post'
        );
      }
      return thunkAPI.rejectWithValue('Error fetching job post');
    }
  }
);
