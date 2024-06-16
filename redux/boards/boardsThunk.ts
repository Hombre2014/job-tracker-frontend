import { createAsyncThunk } from '@reduxjs/toolkit';
import client from '@/api/client';

export const getBoards = createAsyncThunk(
  'boards/getBoards',
  async (accessToken: string | null, thunkAPI) => {
    try {
      const res = await client.get('/boards', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await res.data;

      if (data.length === 0) {
        console.log('No boards found. Something is wrong!');
        return thunkAPI.rejectWithValue('No boards found');
      }

      return data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
);
