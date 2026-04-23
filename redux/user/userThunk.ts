import { isAxiosError } from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';

import client from '@/api/client';
import { cleanupAfterLogout } from '@/utils/helpers';

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
