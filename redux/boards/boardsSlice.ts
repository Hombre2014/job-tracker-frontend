import { createSlice } from '@reduxjs/toolkit';

import { RootState } from '../store';
import { getBoards } from './boardsThunk';

interface Column {
  id: string;
  name: string;
  order: number;
  boardId: string;
}

interface Board {
  id: string;
  name: string;
  columns: Column[] | null;
}

interface BoardsState {
  boards: Board[];
  boardsStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: BoardsState = {
  boards: [],
  boardsStatus: 'idle',
  error: null,
};

export const boardsSlice = createSlice({
  name: 'boards',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getBoards.pending, (state) => {
        state.boardsStatus = 'loading';
      })
      .addCase(getBoards.fulfilled, (state, action) => {
        state.boardsStatus = 'succeeded';
        state.boards = action.payload;
        state.error = null;
      })
      .addCase(getBoards.rejected, (state, action) => {
        state.boardsStatus = 'failed';
        state.error = action.error.message || 'Failed to fetch boards';
      });
  },
});

export const selectBoards = (state: RootState) => state.boards;
export default boardsSlice.reducer;
