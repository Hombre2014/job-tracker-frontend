import { createSlice } from '@reduxjs/toolkit';

import { RootState } from '../store';
import { login, logout, isLoggedIn, getUser, updateUser } from './userThunk';

interface UserState {
  email: string;
  firstName: string;
  lastName: string;
  accessToken?: string;
  refreshToken?: string;
  userId: string | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: UserState = {
  accessToken: '',
  refreshToken: '',
  firstName: '',
  lastName: '',
  email: '',
  userId: null,
  status: 'idle',
  error: null,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setStatusToIdle: (state) => {
      state.status = 'idle';
    },
  },
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
        state.error = action.error.message || 'Invalid email or password';
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
      })
      .addCase(isLoggedIn.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(isLoggedIn.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.accessToken = action.payload?.accessToken;
        state.refreshToken = action.payload?.refreshToken;
        state.userId = action.payload?.userId;
        state.email = action.payload?.email;
        state.error = null;
      })
      .addCase(isLoggedIn.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'User not logged in';
      })
      .addCase(getUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.email = action.payload?.email;
        state.firstName = action.payload?.firstName;
        state.lastName = action.payload?.lastName;
        state.userId = action.payload?.userId;
        state.error = null;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'User not found';
      })
      .addCase(updateUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.firstName = action.payload?.firstName;
        state.lastName = action.payload?.lastName;
        state.error = null;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Error updating user';
      });
  },
});

export const selectUser = (state: RootState) => state.user;
export const { setStatusToIdle } = userSlice.actions;
export default userSlice.reducer;
