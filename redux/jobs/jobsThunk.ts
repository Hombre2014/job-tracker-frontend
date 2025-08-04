import client from '@/api/client';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { defaultJobPostColor } from '@/data/constants';
import { DocumentService } from '@/services/documentService';

export const createJobPost = createAsyncThunk(
  'jobs/createJobPost',
  async (
    values: {
      title: string;
      companyId: string;
      columnId: string;
      status: string;
    },
    thunkAPI
  ) => {
    const { title, companyId, columnId, status } = values;
    const body = {
      title: title,
      status: status,
      columnId: columnId,
      companyId: companyId,
      color: defaultJobPostColor,
      createdAt: new Date().toISOString(),
    };
    try {
      const res = await client.post('/job-applications', body);

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
  async (columnId: string, thunkAPI) => {
    try {
      const res = await client.get(`/job-applications/column/${columnId}`);

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
  async (
    values: {
      title: string;
      color: string;
      salary: string;
      status: string;
      postUrl: string;
      location: string;
      deadline: string;
      columnId: string;
      jobPostId: string;
      description: string;
      statusChangedAt: string;
      company: { name: string };
    },
    thunkAPI
  ) => {
    const {
      title,
      color,
      salary,
      status,
      postUrl,
      location,
      deadline,
      columnId,
      jobPostId,
      description,
      statusChangedAt,
      company: { name: companyName },
    } = values;
    const body = {
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
      company: {
        name: companyName,
      },
    };
    try {
      const res = await client.put(`/job-applications/${jobPostId}`, body);

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
  async (values: { jobPostId: string; jobPostData: any }, thunkAPI) => {
    const { jobPostId, jobPostData } = values;
    try {
      // Step 1: Handle documents attached to this job post using DocumentService
      if (jobPostData?.documents && jobPostData.documents.length > 0) {
        const documentResults =
          await DocumentService.handleDocumentsForJobDeletion(
            jobPostData.documents,
            jobPostId
          );

        // Log the results for debugging
        console.log('Document processing results:', documentResults);
      }

      // Step 2: Delete the job post itself
      await client.delete(`/job-applications/${jobPostId}`);

      return jobPostId;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data || 'Error deleting job post'
      );
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
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data || 'Error fetching job post'
      );
    }
  }
);
