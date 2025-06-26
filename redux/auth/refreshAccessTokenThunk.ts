import { createAsyncThunk } from '@reduxjs/toolkit';

import client from '@/api/client';

export const refreshAccessToken = createAsyncThunk(
  'auth/refreshAccessToken',
  async (refreshToken: string, thunkAPI) => {
    try {
      const response = await client.get('/auth/refresh', {
        headers: {
          Authorization: `Bearer ${refreshToken}`,
        },
      });
      const data = response.data;

      if (response.status === 200) {
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        return { data };
      } else {
        return thunkAPI.rejectWithValue(data);
      }
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data || 'Refresh access token failed'
      );
    }
  }
);
