import { createAsyncThunk } from '@reduxjs/toolkit';

import client from '@/api/client';

export const getBoards = createAsyncThunk(
  'boards/getBoards',
  async (accessToken: string, thunkAPI) => {
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
      console.log('Error fetching boards: ', err.response.data);
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
);

export const createBoard = createAsyncThunk(
  'boards/createBoard',
  async (values: any, thunkAPI) => {
    const { accessToken } = values;
    const { name } = values;
    const postData = { name: name };
    try {
      const res = await client.post('/boards', postData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const data = await res.data;
      console.log('Data from CreateBoard Thunk: ', data);
      return data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
);
