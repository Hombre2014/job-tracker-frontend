import { createSlice } from '@reduxjs/toolkit';

import { RootState } from '../store';
import {
  login,
  logout,
  getUser,
  isLoggedIn,
  updateUser,
  uploadUserPhoto,
} from './userThunk';

interface UserState {
  email: string;
  lastName: string;
  firstName: string;
  accessToken?: string;
  error: string | null;
  refreshToken?: string;
  userId: string | null;
  profilePicUrl?: string;
  role?: 'admin' | 'user' | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
}

const initialState: UserState = {
  email: '',
  error: null,
  lastName: '',
  role: 'user',
  userId: null,
  firstName: '',
  status: 'idle',
  accessToken: '',
  refreshToken: '',
  profilePicUrl: '',
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
        state.userId = action.payload?.decoded.sub as string;
        state.refreshToken = action.payload?.data.refreshToken;
        if (
          typeof action.payload?.decoded === 'object' &&
          action.payload?.decoded !== null
        ) {
          state.role = 'user';
          state.email = action.payload?.decoded.email;
          state.lastName = action.payload?.decoded.lastName;
          state.firstName = action.payload?.decoded.firstName;
          state.profilePicUrl = action.payload?.decoded.profilePicUrl;
        }
        console.log('Login successful:', action.payload);
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
        state.email = '';
        state.error = null;
        state.userId = null;
        state.status = 'idle';
        state.accessToken = '';
        state.refreshToken = '';
      })
      .addCase(logout.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Something went wrong';
      })
      .addCase(isLoggedIn.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(isLoggedIn.fulfilled, (state, action) => {
        state.error = null;
        state.role = 'user';
        state.status = 'succeeded';
        state.email = action.payload?.email;
        state.userId = action.payload?.userId;
        state.accessToken = action.payload?.accessToken;
        state.refreshToken = action.payload?.refreshToken;
      })
      .addCase(isLoggedIn.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'User not logged in';
      })
      .addCase(getUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.error = null;
        state.status = 'succeeded';
        state.email = action.payload?.email;
        state.userId = action.payload?.userId;
        state.lastName = action.payload?.lastName;
        state.firstName = action.payload?.firstName;
        state.profilePicUrl = action.payload?.profilePicUrl;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'User not found';
      })
      .addCase(updateUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        console.log('Updated user data in Redux:', action.payload);
        state.error = null;
        state.status = 'succeeded';
        state.email = action.payload?.email;
        state.lastName = action.payload?.lastName;
        state.firstName = action.payload?.firstName;
        state.role = action.payload?.role || 'user';
        state.profilePicUrl = action.payload?.profilePicUrl;
      })
      .addCase(updateUser.rejected, (state, action) => {
        console.error('updateUser rejected:', action.error.message); // Debug log
        state.status = 'failed';
        state.error = action.error.message || 'Error updating user';
      })
      .addCase(uploadUserPhoto.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(uploadUserPhoto.fulfilled, (state, action) => {
        state.error = null;
        state.status = 'succeeded';
        const { imageUrl } = action.payload;
        state.profilePicUrl = imageUrl; // Update the profilePicUrl field
      })
      .addCase(uploadUserPhoto.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Error uploading photo';
      });
  },
});

export const selectUser = (state: RootState) => state.user;
export const { setStatusToIdle } = userSlice.actions;
export default userSlice.reducer;
