import { isAxiosError } from 'axios';

import client from '@/api/client';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const createJobApplicationNote = createAsyncThunk(
  'notes/createJobApplicationNote',
  async (values: any, thunkAPI) => {
    const { jobApplicationId, noteContent } = values;
    const body = {
      content: noteContent,
      jobApplicationId: jobApplicationId,
    };
    try {
      const res = await client.post(`/job-application-notes`, body);
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
  async (jobApplicationId: string, thunkAPI) => {
    try {
      const res = await client.get(
        `/job-application-notes/${jobApplicationId}`
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
    const { noteContent, noteId } = values;
    const body = {
      content: noteContent,
    };
    try {
      const res = await client.put(`/job-application-notes/${noteId}`, body);
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
  async (noteId: string, thunkAPI) => {
    try {
      await client.delete(`/job-application-notes/${noteId}`);
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
