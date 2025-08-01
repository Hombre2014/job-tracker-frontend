import client from '@/api/client';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { defaultJobPostColor } from '@/data/constants';
import { DocumentService } from '@/services/documentService';

export const createJobPost = createAsyncThunk(
  'jobs/createJobPost',
  async (values: any, thunkAPI) => {
    const { accessToken, title, companyId, columnId, status } = values;
    const body = {
      title: title,
      status: status,
      columnId: columnId,
      companyId: companyId,
      color: defaultJobPostColor,
      createdAt: new Date().toISOString(),
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
      title,
      color,
      salary,
      status,
      postUrl,
      location,
      deadline,
      columnId,
      jobPostId,
      accessToken,
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
    const { accessToken, jobPostId, jobPostData } = values;
    try {
      // Step 1: Handle documents attached to this job post using DocumentService
      if (jobPostData?.documents && jobPostData.documents.length > 0) {
        const documentResults =
          await DocumentService.handleDocumentsForJobDeletion(
            jobPostData.documents,
            jobPostId,
            accessToken
          );

        // Log the results for debugging
        console.log('Document processing results:', documentResults);
      }

      // Step 2: Delete the job post itself
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

export const getJobPost = createAsyncThunk(
  'jobs/getJobPost',
  async (values: any, thunkAPI) => {
    const { accessToken, jobPostId } = values;
    try {
      const res = await client.get(`/job-applications/${jobPostId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const data = res.data;
      return data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data || 'Error fetching job post'
      );
    }
  }
);
