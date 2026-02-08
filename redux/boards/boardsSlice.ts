import { createSlice } from '@reduxjs/toolkit';

import { RootState } from '../store';
import { deleteJobPost, createJobPost, updateJobPost } from '../jobs/jobsThunk';
import {
  getBoards,
  createBoard,
  renameBoard,
  archiveBoard,
  getBoardsOnly,
  unarchiveBoard,
  updateColumnName,
  rearrangeColumns,
  getArchivedBoards,
  getBoardWithColumns,
} from './boardsThunk';
import { updateCompany } from '../companies/companiesThunk';

interface BoardsState {
  boards: Board[];
  error: string | null;
  archivedBoards: Board[];
  boardsStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
}

const initialState: BoardsState = {
  boards: [],
  error: null,
  archivedBoards: [],
  boardsStatus: 'idle',
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
          board.id === action.payload.id ? action.payload : board,
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
          board.id === action.payload.id ? action.payload : board,
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
        state.archivedBoards = action.payload;
        state.error = null;
      })
      .addCase(getArchivedBoards.rejected, (state, action) => {
        state.boardsStatus = 'failed';
        state.error = action.error.message || 'Failed to fetch archived boards';
      })
      .addCase(unarchiveBoard.pending, (state) => {
        state.boardsStatus = 'loading';
      })
      .addCase(unarchiveBoard.fulfilled, (state, action) => {
        state.boardsStatus = 'succeeded';
        state.archivedBoards = state.archivedBoards.filter(
          (board) => board.id !== action.payload.id,
        );
        state.error = null;
      })
      .addCase(unarchiveBoard.rejected, (state, action) => {
        state.boardsStatus = 'failed';
        state.error = action.error.message || 'Failed to unarchive board';
      })
      .addCase(getBoardWithColumns.pending, (state) => {
        state.boardsStatus = 'loading';
      })
      .addCase(getBoardWithColumns.fulfilled, (state, action) => {
        state.boardsStatus = 'succeeded';
        const fetchedBoard = action.payload;
        const existingBoardIndex = state.boards.findIndex(
          (board) => board.id === fetchedBoard.id,
        );

        if (existingBoardIndex !== -1) {
          // Replace with server data as source of truth
          // Job creation is synchronous, so no pending jobs exist
          state.boards[existingBoardIndex] = fetchedBoard;
        } else {
          // Board doesn't exist in state yet, add it
          state.boards.push(fetchedBoard);
        }

        state.error = null;
      })
      .addCase(getBoardWithColumns.rejected, (state, action) => {
        state.boardsStatus = 'failed';
        state.error =
          action.error.message || 'Failed to fetch board with columns';
      })
      .addCase(updateColumnName.pending, (state) => {
        state.boardsStatus = 'loading';
      })
      .addCase(updateColumnName.fulfilled, (state, action) => {
        state.boardsStatus = 'succeeded';
        state.boards = state.boards.map((board) =>
          board.id === action.payload.id ? action.payload : board,
        );
        state.error = null;
      })
      .addCase(updateColumnName.rejected, (state, action) => {
        state.boardsStatus = 'failed';
        state.error = action.error.message || 'Failed to update column name';
      })
      .addCase(rearrangeColumns.pending, (state) => {
        state.boardsStatus = 'loading';
      })
      .addCase(rearrangeColumns.fulfilled, (state, action) => {
        state.boardsStatus = 'succeeded';
        state.boards = state.boards.map((board) =>
          board.id === action.payload.id ? action.payload : board,
        );
        state.error = null;
      })
      .addCase(rearrangeColumns.rejected, (state, action) => {
        state.boardsStatus = 'failed';
        state.error = action.error.message || 'Failed to rearrange columns';
      })
      .addCase(getBoardsOnly.pending, (state) => {
        state.boardsStatus = 'loading';
      })
      .addCase(getBoardsOnly.fulfilled, (state, action) => {
        state.boardsStatus = 'succeeded';
        state.boards = action.payload;
        state.error = null;
      })
      .addCase(getBoardsOnly.rejected, (state, action) => {
        state.boardsStatus = 'failed';
        state.error = action.error.message || 'Failed to fetch boards';
      })
      // Handle job deletion to update board state
      .addCase(deleteJobPost.fulfilled, (state, action) => {
        const deletedJobId = action.payload;
        // Remove the job from all boards' columns
        state.boards.forEach((board) => {
          board.columns?.forEach((column) => {
            if (column.jobApplications) {
              column.jobApplications = column.jobApplications.filter(
                (job) => job.id !== deletedJobId,
              );
            }
          });
        });
        // Also remove from archived boards for consistency
        state.archivedBoards.forEach((board) => {
          board.columns?.forEach((column) => {
            if (column.jobApplications) {
              column.jobApplications = column.jobApplications.filter(
                (job) => job.id !== deletedJobId,
              );
            }
          });
        });
      })
      // Handle job creation to update board state
      .addCase(createJobPost.fulfilled, (state, action) => {
        const newJob = action.payload;
        const newJobColumnId = newJob?.columnId ?? newJob?.column_id;
        if (!newJobColumnId) return;

        // Find the board that contains this column and update it
        for (const board of state.boards) {
          if (!board.columns) continue;

          const targetColumn = board.columns.find(
            (col) => col.id === newJobColumnId,
          );

          if (targetColumn) {
            // Initialize jobApplications array if it doesn't exist
            if (!targetColumn.jobApplications) {
              targetColumn.jobApplications = [];
            }

            // Only add if not already present (avoid duplicates)
            const exists = targetColumn.jobApplications.some(
              (job) => job.id === newJob.id,
            );

            if (!exists) {
              targetColumn.jobApplications.push(newJob);
            }

            // Found and updated, exit loop
            break;
          }
        }
      })
      // Handle job updates (including drag and drop) to update board state
      .addCase(updateJobPost.fulfilled, (state, action) => {
        const updatedJob = action.payload;
        if (!updatedJob?.id) return;
        const updatedColumnId = updatedJob.columnId ?? updatedJob.column_id;

        // Find and remove the job from its current column
        let sourceBoard: Board | null = null;
        let sourceColumn: Column | null = null;

        for (const board of state.boards) {
          if (!board.columns) continue;

          for (const column of board.columns) {
            if (!column.jobApplications) continue;

            const jobIndex = column.jobApplications.findIndex(
              (job) => job.id === updatedJob.id,
            );

            if (jobIndex !== -1) {
              sourceBoard = board;
              sourceColumn = column;
              // Remove the job from the source column
              column.jobApplications.splice(jobIndex, 1);
              break;
            }
          }

          if (sourceColumn) break;
        }

        // If columnId is specified in the updated job, add it to the target column
        if (updatedColumnId) {
          for (const board of state.boards) {
            if (!board.columns) continue;

            const targetColumn = board.columns.find(
              (col) => col.id === updatedColumnId,
            );

            if (targetColumn) {
              // Initialize jobApplications array if it doesn't exist
              if (!targetColumn.jobApplications) {
                targetColumn.jobApplications = [];
              }

              // Only add if not already present (avoid duplicates)
              const exists = targetColumn.jobApplications.some(
                (job) => job.id === updatedJob.id,
              );

              if (!exists) {
                targetColumn.jobApplications.push(updatedJob);
              }
              break;
            }
          }
        } else if (sourceColumn) {
          // If no columnId specified, put it back in the source column with updated data
          if (!sourceColumn.jobApplications) {
            sourceColumn.jobApplications = [];
          }
          sourceColumn.jobApplications.push(updatedJob);
        }
      })
      .addCase(updateCompany.fulfilled, (state, action) => {
        const updatedCompany = action.payload;
        if (!updatedCompany?.id) return;

        const updateCompanyInBoard = (board: Board) => {
          board.columns?.forEach((column) => {
            if (column.jobApplications) {
              column.jobApplications = column.jobApplications.map((job) => {
                if (job.company?.id === updatedCompany.id) {
                  return {
                    ...job,
                    company: {
                      ...job.company,
                      ...updatedCompany,
                    },
                  };
                }
                return job;
              });
            }
          });
        };

        state.boards.forEach(updateCompanyInBoard);
        state.archivedBoards.forEach(updateCompanyInBoard);
      });
  },
});

export const selectBoards = (state: RootState) => state.boards;
export default boardsSlice.reducer;
