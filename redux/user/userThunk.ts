import jwt from 'jsonwebtoken';
import { createAsyncThunk } from '@reduxjs/toolkit';

import client from '@/api/client';
import { RootState } from '@/redux/store';
import { cleanupAfterLogout } from '@/utils/helpers';

export const login = createAsyncThunk(
  'user/login',
  async (values: any, thunkAPI) => {
    try {
      const res = await client.post('/auth/login', values);
      const data = res.data;

      if (res.status === 200) {
        const { accessToken, refreshToken } = res.data;
        // ⚠️ SECURITY WARNING: jwt.decode() does NOT verify signatures!
        // This is for UX purposes only - server must verify for security
        const decoded = jwt.decode(accessToken);
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);

        if (decoded) {
          localStorage.setItem('user', JSON.stringify(decoded));
          return { data, decoded };
        } else {
          return thunkAPI.rejectWithValue('Token decoding failed');
        }
      } else {
        return thunkAPI.rejectWithValue(data);
      }
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data || 'Login failed');
    }
  }
);

export const logout = createAsyncThunk('user/logout', async () => {
  cleanupAfterLogout();

  return {
    email: '',
    error: null,
    userId: null,
    status: 'idle',
    accessToken: '',
    refreshToken: '',
  };
});

export const isLoggedIn = createAsyncThunk(
  'user/isLoggedIn',
  async (_, thunkAPI) => {
    const state = thunkAPI.getState() as RootState;
    const { accessToken, refreshToken, email, userId } = state.user;

    if (accessToken && refreshToken && email && userId) {
      return {
        email,
        userId,
        error: null,
        accessToken,
        refreshToken,
        status: 'succeeded',
      };
    } else {
      return thunkAPI.rejectWithValue('User is not logged in');
    }
  }
);

export const updateUser = createAsyncThunk(
  'user/updateUser',
  async (values: any, thunkAPI) => {
    const { accessToken, firstName, lastName, email, profilePic, role } =
      values;

    // Create FormData object
    const formData = new FormData();
    formData.append('firstName', firstName);
    formData.append('lastName', lastName);
    formData.append('email', email);
    formData.append('role', role);

    // Check if profilePic is a valid File object
    if (profilePic && profilePic instanceof File && profilePic.size > 0) {
      formData.append('profilePic', profilePic);
    }

    try {
      const res = await client.patch('/users', formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      if (res.status === 200) {
        return res.data;
      } else {
        return thunkAPI.rejectWithValue('Error updating user');
      }
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data || 'Error updating user'
      );
    }
  }
);
