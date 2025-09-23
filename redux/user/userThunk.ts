import jwt from 'jsonwebtoken';
import { isAxiosError } from 'axios';
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
    } catch (err: unknown) {
      if (isAxiosError(err)) {
        return thunkAPI.rejectWithValue(err.response?.data || 'Login failed');
      }
      return thunkAPI.rejectWithValue('Login failed');
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

export const createDeleteVerificationCode = createAsyncThunk<
  { message: string; email: string },
  { email: string },
  { rejectValue: string }
>('user/createDeleteVerificationCode', async (values, thunkAPI) => {
  const { email } = values;

  try {
    const res = await client.post(
      '/users/delete/create-verification-code',
      { email },
      { signal: thunkAPI.signal }
    );

    if (res.status === 201 || res.status === 200) {
      return {
        message: 'Verification code sent successfully',
        email,
      };
    } else {
      return thunkAPI.rejectWithValue('Failed to send verification code');
    }
  } catch (err: unknown) {
    if (isAxiosError(err)) {
      const raw = err.response?.data;
      const message =
        (typeof raw === 'string' && raw) ||
        raw?.userFriendlyMessage ||
        raw?.message ||
        'Failed to send verification code';
      return thunkAPI.rejectWithValue(message);
    }
    return thunkAPI.rejectWithValue('Failed to send verification code');
  }
});

export const deleteUserAccount = createAsyncThunk<
  { message: string; deleted: true },
  { code: string },
  { rejectValue: string }
>('user/deleteUserAccount', async (values, thunkAPI) => {
  const { code } = values;

  try {
    const res = await client.delete('/users', {
      data: { code },
      signal: thunkAPI.signal,
    });

    if (res.status === 200) {
      // Clear all user data after successful deletion
      cleanupAfterLogout();

      return {
        message: 'Account deleted successfully',
        deleted: true,
      };
    } else {
      return thunkAPI.rejectWithValue('Failed to delete account');
    }
  } catch (err: unknown) {
    if (isAxiosError(err)) {
      const raw = err.response?.data;
      const message =
        (typeof raw === 'string' && raw) ||
        raw?.userFriendlyMessage ||
        raw?.message ||
        'Failed to delete account';
      return thunkAPI.rejectWithValue(message);
    }
    return thunkAPI.rejectWithValue('Failed to delete account');
  }
});
