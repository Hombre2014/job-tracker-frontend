import jwt from 'jsonwebtoken';
import { createAsyncThunk } from '@reduxjs/toolkit';

import client from '@/api/client';
import { RootState } from '../store';

export const login = createAsyncThunk(
  'user/login',
  async (values: any, thunkAPI) => {
    try {
      const res = await client.post('/auth/login', values);
      const data = res.data;

      if (res.status === 200) {
        const { accessToken, refreshToken } = res.data;
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
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');

  return {
    accessToken: '',
    refreshToken: '',
    email: '',
    userId: null,
    status: 'idle',
    error: null,
  };
});

export const isLoggedIn = createAsyncThunk(
  'user/isLoggedIn',
  async (_, thunkAPI) => {
    const state = thunkAPI.getState() as RootState;
    const { accessToken, refreshToken, email, userId } = state.user;

    if (accessToken && refreshToken && email && userId) {
      return {
        accessToken,
        refreshToken,
        userId,
        email,
        status: 'succeeded',
        error: null,
      };
    } else {
      return thunkAPI.rejectWithValue('User is not logged in');
    }
  }
);

export const forgotPasswordSendCode = createAsyncThunk(
  'user/forgotPasswordSendCode',
  async (values: any, thunkAPI) => {
    const { email } = values;
    try {
      const res = await client.post(
        '/users/reset-password/create-verification-code',
        { email }
      );
      const data = res.data;

      if (res.status === 200) {
        console.log('Data: ', data);
        return data;
      } else {
        return thunkAPI.rejectWithValue(data);
      }
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data || 'Request failed');
    }
  }
);

export const forgotPasswordResetPassword = createAsyncThunk(
  'user/forgotPasswordResetPassword',
  async (values: any, thunkAPI) => {
    const { email, code, newPassword } = values;
    try {
      const res = await client.post('/users/reset-password', {
        email,
        code,
        newPassword,
      });
      const data = res.data;

      if (res.status === 200) {
        console.log('Data: ', data);
        return data;
      } else {
        return thunkAPI.rejectWithValue(data);
      }
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data || 'Request failed');
    }
  }
);
