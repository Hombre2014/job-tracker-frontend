import { createSlice } from '@reduxjs/toolkit';
import { login, logout } from './userThunk';
import { RootState } from '../store';

interface UserState {
  email: string;
  accessToken?: string;
  refreshToken?: string;
  userId: string | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: UserState = {
  accessToken: '',
  refreshToken: '',
  email: '',
  userId: null,
  status: 'idle',
  error: null,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.accessToken = action.payload?.data.accessToken;
        state.refreshToken = action.payload?.data.refreshToken;
        state.userId = action.payload?.decoded.sub as string;
        if (
          typeof action.payload?.decoded === 'object' &&
          action.payload?.decoded !== null
        ) {
          state.email = action.payload?.decoded.email;
        }
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Something went wrong';
      })
      .addCase(logout.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(logout.fulfilled, (state) => {
        state.status = 'idle';
        state.accessToken = '';
        state.refreshToken = '';
        state.email = '';
        state.userId = null;
        state.error = null;
      })
      .addCase(logout.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Something went wrong';
      });
  },
});

export const selectUser = (state: RootState) => state.user;
export default userSlice.reducer;
