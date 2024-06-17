import jwt from 'jsonwebtoken';
import { createAsyncThunk } from '@reduxjs/toolkit';

import client from '@/api/client';

export const login = createAsyncThunk(
  'user/login',
  async (values: any, thunkAPI) => {
    const res = await client.post('/auth/login', values);
    const data = await res.data;

    if (res.status === 200) {
      const accessToken = res.data.accessToken;
      const refreshToken = res.data.refreshToken;
      const decoded = jwt.decode(accessToken);
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);

      if (decoded) {
        localStorage.setItem('user', JSON.stringify(decoded));
        return { data, decoded };
      } else {
        return thunkAPI.rejectWithValue(data);
      }
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
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    const user = localStorage.getItem('user');

    if (accessToken && refreshToken && user) {
      return {
        accessToken,
        refreshToken,
        userId: JSON.parse(user).sub,
        email: JSON.parse(user).email,
        status: 'succeeded',
        error: null,
      };
    } else {
      return thunkAPI.rejectWithValue('User is not logged in');
    }
  }
);
