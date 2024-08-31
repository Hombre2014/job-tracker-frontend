import { createSlice } from '@reduxjs/toolkit';

import { RootState } from '../store';
import { createJobPost, getAllJobPostsPerColumn } from './jobsThunk';

interface JobPostShortState {
  jobPosts: JobPostShort[];
  jobPostsStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: JobPostShortState = {
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
      });
  },
});

export const selectJobPosts = (state: RootState) => state.jobs.jobPosts;
export const selectJobPostsStatus = (state: RootState) =>
  state.jobs.jobPostsStatus;
export const selectJobPostsError = (state: RootState) => state.jobs.error;
export default jobsSlice.reducer;
