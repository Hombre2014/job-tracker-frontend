import { createSlice } from '@reduxjs/toolkit';

import { RootState } from '../store';
import { refreshAccessToken } from './refreshAccessTokenThunk';

interface RefreshAccessTokenState {
  error: string | null;
  accessToken: string | null;
  refreshToken: string | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
}

const initialState: RefreshAccessTokenState = {
  error: null,
  status: 'idle',
  accessToken: null,
  refreshToken: null,
};

export const refreshAccessTokenSlice = createSlice({
  name: 'refreshAccessToken',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(refreshAccessToken.fulfilled, (state, action) => {
      state.status = 'succeeded';
      state.accessToken = action.payload?.data.accessToken;
      state.refreshToken = action.payload?.data.refreshToken;
      state.error = null;
    });
    builder.addCase(refreshAccessToken.pending, (state) => {
      state.status = 'loading';
      state.error = null;
    });
    builder.addCase(refreshAccessToken.rejected, (state, action) => {
      state.status = 'failed';
      state.error = action.error.message || 'Failed to refresh access token';
    });
  },
});

export const selectAccessToken = (state: RootState) =>
  state.refreshAccessToken.accessToken;

export const selectRefreshToken = (state: RootState) =>
  state.refreshAccessToken.refreshToken;

export default refreshAccessTokenSlice.reducer;
