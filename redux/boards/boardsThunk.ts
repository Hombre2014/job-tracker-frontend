import { createAsyncThunk } from '@reduxjs/toolkit';
import client from '@/api/client';

export const getBoards = createAsyncThunk(
  'boards/getBoards',
  async (accessToken: string, thunkAPI) => {
    // console.log('Getting Boards', new Error().stack);
    try {
      const res = await client.get('/boards-all', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = res.data;

      if (data.length === 0) {
        console.log('No boards found. Something is wrong!');
        return thunkAPI.rejectWithValue('No boards found');
      }

      if (data.length > 0) {
        const filteredData = data.filter((board: any) => !board.isArchived);
        return filteredData;
      }
    } catch (err: any) {
      console.log('Error fetching boards: ', err.response?.data);
      return thunkAPI.rejectWithValue(
        err.response?.data || 'Error fetching boards'
      );
    }
  }
);

export const createBoard = createAsyncThunk(
  'boards/createBoard',
  async (values: any, thunkAPI) => {
    const { accessToken, name } = values;
    const postData = { name };
    try {
      const res = await client.post('/boards', postData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const data = res.data;
      return data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data || 'Error creating board'
      );
    }
  }
);

export const renameBoard = createAsyncThunk(
  'boards/renameBoard',
  async (values: any, thunkAPI) => {
    const { accessToken, name, id } = values;
    const patchData = { name };
    try {
      const res = await client.patch(`/boards/${id}`, patchData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const data = res.data;
      return data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data || 'Error renaming board'
      );
    }
  }
);

export const archiveBoard = createAsyncThunk(
  'boards/archiveBoard',
  async (values: any, thunkAPI) => {
    const { accessToken, id } = values;
    try {
      const res = await client.patch(
        `/boards/${id}`,
        {
          isArchived: true,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const data = res.data;
      return data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data || 'Error archiving board'
      );
    }
  }
);

export const getArchivedBoards = createAsyncThunk(
  'boards/getArchivedBoards',
  async (accessToken: string, thunkAPI) => {
    try {
      const res = await client.get('/boards', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = res.data;

      if (data.length === 0) {
        console.log('No boards found. Something is wrong!');
        return thunkAPI.rejectWithValue('No boards found');
      }

      if (data.length > 0) {
        const filteredData = data.filter((board: any) => board.isArchived);
        return filteredData;
      }
    } catch (err: any) {
      console.log('Error fetching boards: ', err.response?.data);
      return thunkAPI.rejectWithValue(
        err.response?.data || 'Error fetching boards'
      );
    }
  }
);

export const unarchiveBoard = createAsyncThunk(
  'boards/unarchiveBoard',
  async (values: any, thunkAPI) => {
    const { accessToken, id } = values;
    try {
      const res = await client.patch(
        `/boards/${id}`,
        {
          isArchived: false,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const data = res.data;
      return data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data || 'Failed to unarchive board'
      );
    }
  }
);

export const getBoardWithColumns = createAsyncThunk(
  'boards/getBoardWithColumns',
  async (values: any, thunkAPI) => {
    const { accessToken, boardId } = values;
    try {
      const res = await client.get(`/boards/${boardId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const data = res.data;
      return data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data || 'Error fetching columns'
      );
    }
  }
);

export const updateColumnName = createAsyncThunk(
  'boards/updateColumnName',
  async (values: any, thunkAPI) => {
    const { accessToken, name, id } = values;
    const patchData = { name };
    try {
      const res = await client.patch(`/board-columns/${id}`, patchData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const data = res.data;
      return data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data || 'Error updating column name'
      );
    }
  }
);

export const rearrangeColumns = createAsyncThunk(
  'boards/rearrangeColumns',
  async (values: any, thunkAPI) => {
    const { accessToken, boardId, columns_id } = values;
    try {
      const res = await client.put(
        `/board-columns/${boardId}/rearrange`,
        columns_id,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const data = res.data;
      return data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data || 'Error rearranging columns'
      );
    }
  }
);
