import { isAxiosError } from 'axios';

import { createAsyncThunk } from '@reduxjs/toolkit';
import client from '@/api/client';

export const getBoards = createAsyncThunk(
  'boards/getBoards',
  async (_, thunkAPI) => {
    try {
      const res = await client.get('/boards-all');
      const data = res.data;

      if (data.length === 0) {
        return [];
      }

      if (data.length > 0) {
        const filteredData = data.filter((board: any) => !board.isArchived);
        return filteredData;
      }
    } catch (err: unknown) {
      if (isAxiosError(err)) {
        return thunkAPI.rejectWithValue(
          err.response?.data || 'Error fetching boards'
        );
      }
      return thunkAPI.rejectWithValue('Error fetching boards');
    }
  }
);

export const getBoardsOnly = createAsyncThunk(
  'boards/getBoardsOnly',
  async (_, thunkAPI) => {
    try {
      const res = await client.get('/boards');
      const data = res.data;

      if (data.length === 0) {
        return [];
      }

      if (data.length > 0) {
        const filteredData = data.filter((board: any) => !board.isArchived);
        return filteredData;
      }
    } catch (err: unknown) {
      if (isAxiosError(err)) {
        return thunkAPI.rejectWithValue(
          err.response?.data || 'Error fetching boards'
        );
      }
      return thunkAPI.rejectWithValue('Error fetching boards');
    }
  }
);

export const createBoard = createAsyncThunk(
  'boards/createBoard',
  async (values: any, thunkAPI) => {
    const { name } = values;
    const postData = { name };
    try {
      const res = await client.post('/boards', postData);

      const data = res.data;
      return data;
    } catch (err: unknown) {
      if (isAxiosError(err)) {
        return thunkAPI.rejectWithValue(
          err.response?.data || 'Error creating board'
        );
      }
      return thunkAPI.rejectWithValue('Error creating board');
    }
  }
);

export const renameBoard = createAsyncThunk(
  'boards/renameBoard',
  async (values: any, thunkAPI) => {
    const { name, id } = values;
    const patchData = { name };
    try {
      const res = await client.patch(`/boards/${id}`, patchData);

      const data = res.data;
      return data;
    } catch (err: unknown) {
      if (isAxiosError(err)) {
        return thunkAPI.rejectWithValue(
          err.response?.data || 'Error renaming board'
        );
      }
      return thunkAPI.rejectWithValue('Error renaming board');
    }
  }
);

export const archiveBoard = createAsyncThunk(
  'boards/archiveBoard',
  async (values: any, thunkAPI) => {
    const { id } = values;
    try {
      const res = await client.patch(
        `/boards/${id}`,
        {
          isArchived: true,
        }
      );

      const data = res.data;
      return data;
    } catch (err: unknown) {
      if (isAxiosError(err)) {
        return thunkAPI.rejectWithValue(
          err.response?.data || 'Error archiving board'
        );
      }
      return thunkAPI.rejectWithValue('Error archiving board');
    }
  }
);

export const getArchivedBoards = createAsyncThunk(
  'boards/getArchivedBoards',
  async (_, thunkAPI) => {
    try {
      const res = await client.get('/boards');
      const data = res.data;

      if (data.length === 0) {
        return [];
      }

      if (data.length > 0) {
        const filteredData = data.filter((board: any) => board.isArchived);
        return filteredData;
      }
    } catch (err: unknown) {
      if (isAxiosError(err)) {
        return thunkAPI.rejectWithValue(
          err.response?.data || 'Error fetching boards'
        );
      }
      return thunkAPI.rejectWithValue('Error fetching boards');
    }
  }
);

export const unarchiveBoard = createAsyncThunk(
  'boards/unarchiveBoard',
  async (values: any, thunkAPI) => {
    const { id } = values;
    try {
      const res = await client.patch(
        `/boards/${id}`,
        {
          isArchived: false,
        }
      );

      const data = res.data;
      return data;
    } catch (err: unknown) {
      if (isAxiosError(err)) {
        return thunkAPI.rejectWithValue(
          err.response?.data || 'Failed to unarchive board'
        );
      }
      return thunkAPI.rejectWithValue('Failed to unarchive board');
    }
  }
);

export const getBoardWithColumns = createAsyncThunk(
  'boards/getBoardWithColumns',
  async (values: any, thunkAPI) => {
    const { boardId } = values;
    try {
      const res = await client.get(`/boards/${boardId}`);

      const data = res.data;
      return data;
    } catch (err: unknown) {
      if (isAxiosError(err)) {
        return thunkAPI.rejectWithValue(
          err.response?.data || 'Error fetching columns'
        );
      }
      return thunkAPI.rejectWithValue('Error fetching columns');
    }
  }
);

export const updateColumnName = createAsyncThunk(
  'boards/updateColumnName',
  async (values: any, thunkAPI) => {
    const { name, id } = values;
    const patchData = { name };
    try {
      const res = await client.patch(`/board-columns/${id}`, patchData);

      const data = res.data;
      return data;
    } catch (err: unknown) {
      if (isAxiosError(err)) {
        return thunkAPI.rejectWithValue(
          err.response?.data || 'Error updating column name'
        );
      }
      return thunkAPI.rejectWithValue('Error updating column name');
    }
  }
);

export const rearrangeColumns = createAsyncThunk(
  'boards/rearrangeColumns',
  async (values: any, thunkAPI) => {
    const { boardId, columns_id } = values;
    try {
      const res = await client.put(
        `/board-columns/${boardId}/rearrange`,
        columns_id
      );

      const data = res.data;
      return data;
    } catch (err: unknown) {
      if (isAxiosError(err)) {
        return thunkAPI.rejectWithValue(
          err.response?.data || 'Error rearranging columns'
        );
      }
      return thunkAPI.rejectWithValue('Error rearranging columns');
    }
  }
);
