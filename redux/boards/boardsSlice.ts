import { createSlice } from '@reduxjs/toolkit';

import { RootState } from '../store';
import {
  getBoards,
  createBoard,
  renameBoard,
  archiveBoard,
  getArchivedBoards,
} from './boardsThunk';

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
      })
      .addCase(createBoard.pending, (state) => {
        state.boardsStatus = 'loading';
      })
      .addCase(createBoard.fulfilled, (state, action) => {
        state.boardsStatus = 'succeeded';
        state.boards.push(action.payload);
        state.error = null;
      })
      .addCase(createBoard.rejected, (state, action) => {
        state.boardsStatus = 'failed';
        state.error = action.error.message || 'Failed to create board';
      })
      .addCase(renameBoard.pending, (state) => {
        state.boardsStatus = 'loading';
      })
      .addCase(renameBoard.fulfilled, (state, action) => {
        state.boardsStatus = 'succeeded';
        state.boards = state.boards.map((board) =>
          board.id === action.payload.id ? action.payload : board
        );
        state.error = null;
      })
      .addCase(renameBoard.rejected, (state, action) => {
        state.boardsStatus = 'failed';
        state.error = action.error.message || 'Failed to rename board';
      })
      .addCase(archiveBoard.pending, (state) => {
        state.boardsStatus = 'loading';
      })
      .addCase(archiveBoard.fulfilled, (state, action) => {
        state.boardsStatus = 'succeeded';
        state.boards = state.boards.map((board) =>
          board.id === action.payload.id ? action.payload : board
        );
        state.error = null;
      })
      .addCase(archiveBoard.rejected, (state, action) => {
        state.boardsStatus = 'failed';
        state.error = action.error.message || 'Failed to archive board';
      })
      .addCase(getArchivedBoards.pending, (state) => {
        state.boardsStatus = 'loading';
      })
      .addCase(getArchivedBoards.fulfilled, (state, action) => {
        state.boardsStatus = 'succeeded';
        state.boards = action.payload;
        state.error = null;
      })
      .addCase(getArchivedBoards.rejected, (state, action) => {
        state.boardsStatus = 'failed';
        state.error = action.error.message || 'Failed to fetch archived boards';
      });
  },
});

export const selectBoards = (state: RootState) => state.boards;
export default boardsSlice.reducer;
