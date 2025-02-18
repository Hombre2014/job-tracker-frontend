import { createSlice } from '@reduxjs/toolkit';

import { RootState } from '../store';
import {
  getJobPost,
  createJobPost,
  updateJobPost,
  deleteJobPost,
  getAllJobPostsPerColumn,
} from './jobsThunk';

interface JobPostState {
  jobPosts: JobApplication[];
  jobPostsStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: JobPostState = {
  jobPosts: [],
  jobPostsStatus: 'idle',
  error: null,
};

export const jobsSlice = createSlice({
  name: 'jobs',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createJobPost.pending, (state) => {
        state.jobPostsStatus = 'loading';
      })
      .addCase(createJobPost.fulfilled, (state, action) => {
        state.jobPostsStatus = 'succeeded';
        state.jobPosts.push(action.payload);
        state.error = null;
      })
      .addCase(createJobPost.rejected, (state, action) => {
        state.jobPostsStatus = 'failed';
        state.error = action.error.message || 'Failed to create job post';
      })
      .addCase(getAllJobPostsPerColumn.pending, (state) => {
        state.jobPostsStatus = 'loading';
      })
      .addCase(getAllJobPostsPerColumn.fulfilled, (state, action) => {
        state.jobPostsStatus = 'succeeded';
        state.jobPosts = action.payload;
        state.error = null;
      })
      .addCase(getAllJobPostsPerColumn.rejected, (state, action) => {
        state.jobPostsStatus = 'failed';
        state.error = action.error.message || 'Failed to fetch job posts';
      })
      .addCase(updateJobPost.pending, (state) => {
        state.jobPostsStatus = 'loading';
      })
      .addCase(updateJobPost.fulfilled, (state, action) => {
        state.jobPostsStatus = 'succeeded';
        state.jobPosts = state.jobPosts.map((jobPost) =>
          jobPost.id === action.payload.id ? action.payload : jobPost
        );
        state.error = null;
      })
      .addCase(updateJobPost.rejected, (state, action) => {
        state.jobPostsStatus = 'failed';
        state.error = action.error.message || 'Failed to update job post';
      })
      .addCase(deleteJobPost.pending, (state) => {
        state.jobPostsStatus = 'loading';
      })
      .addCase(deleteJobPost.fulfilled, (state, action) => {
        state.jobPostsStatus = 'succeeded';
        state.jobPosts = state.jobPosts.filter(
          (jobPost) => jobPost.id !== action.payload.id
        );
        state.error = null;
      })
      .addCase(deleteJobPost.rejected, (state, action) => {
        state.jobPostsStatus = 'failed';
        state.error = action.error.message || 'Failed to delete job post';
      })
      .addCase(getJobPost.pending, (state) => {
        state.jobPostsStatus = 'loading';
      })
      .addCase(getJobPost.fulfilled, (state, action) => {
        state.jobPostsStatus = 'succeeded';
        state.jobPosts = action.payload;
        state.error = null;
      })
      .addCase(getJobPost.rejected, (state, action) => {
        state.jobPostsStatus = 'failed';
        state.error = action.error.message || 'Failed to fetch job post';
      });
  },
});

export const selectJobPosts = (state: RootState) => state.jobs.jobPosts;
export const selectJobPostsStatus = (state: RootState) =>
  state.jobs.jobPostsStatus;
export const selectJobPostsError = (state: RootState) => state.jobs.error;
export default jobsSlice.reducer;
