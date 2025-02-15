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
  localStorage.removeItem('user');
  localStorage.removeItem('emails');
  localStorage.removeItem('phones');
  localStorage.removeItem('comment');
  localStorage.removeItem('jobTitle');
  localStorage.removeItem('columnId');
  localStorage.removeItem('lastName');
  localStorage.removeItem('gitHubUrl');
  localStorage.removeItem('companies');
  localStorage.removeItem('firstName');
  localStorage.removeItem('companyId');
  localStorage.removeItem('companyIds');
  localStorage.removeItem('twitterUrl');
  localStorage.removeItem('linkedinUrl');
  localStorage.removeItem('chosenBoard');
  localStorage.removeItem('accessToken');
  localStorage.removeItem('facebookUrl');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('chosenColumn');
  localStorage.removeItem('companyLocation');
  localStorage.removeItem('boardValueChanged');
  localStorage.removeItem('firstColumnOfTheBoard');
  localStorage.removeItem('jobsConnectedToContact');

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

export const getUser = createAsyncThunk(
  'user/getUser',
  async (accessToken: string, thunkAPI) => {
    try {
      const res = await client.get('/users', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (res.status === 200) {
        return res.data;
      } else {
        return thunkAPI.rejectWithValue('User not found');
      }
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data || 'User not found');
    }
  }
);

export const updateUser = createAsyncThunk(
  'user/updateUser',
  async (values: any, thunkAPI) => {
    const { accessToken, firstName, lastName } = values;
    const postData = { firstName, lastName };
    try {
      const res = await client.patch('/users', postData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
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
