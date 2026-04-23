import { createSlice } from '@reduxjs/toolkit';

import { RootState } from '../store';
import {
  createJobApplicationNote,
  updateJobApplicationNote,
  deleteJobApplicationNote,
  getAllJobApplicationNotes,
} from './notesThunk';

interface NoteState {
  notes: Notes[];
  error: string | null;
  notesStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
}

const initialState: NoteState = {
  notes: [],
  error: null,
  notesStatus: 'idle',
};

export const notesSlice = createSlice({
  name: 'notes',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createJobApplicationNote.pending, (state) => {
        state.notesStatus = 'loading';
      })
      .addCase(createJobApplicationNote.fulfilled, (state, action) => {
        state.notesStatus = 'succeeded';
        state.notes.push(action.payload);
        state.error = null;
      })
      .addCase(createJobApplicationNote.rejected, (state, action) => {
        state.notesStatus = 'failed';
        state.error = action.error.message || 'Failed to create a note';
      })
      .addCase(getAllJobApplicationNotes.pending, (state) => {
        state.notesStatus = 'loading';
      })
      .addCase(getAllJobApplicationNotes.fulfilled, (state, action) => {
        state.notesStatus = 'succeeded';
        state.notes = action.payload;
        state.error = null;
      })
      .addCase(getAllJobApplicationNotes.rejected, (state, action) => {
        state.notesStatus = 'failed';
        state.error = action.error.message || 'Failed to fetch the notes';
      })
      .addCase(updateJobApplicationNote.pending, (state) => {
        state.notesStatus = 'loading';
      })
      .addCase(updateJobApplicationNote.fulfilled, (state, action) => {
        state.notesStatus = 'succeeded';
        state.notes = state.notes.map((note) =>
          note.id === action.payload.id ? action.payload : note
        );
        state.error = null;
      })
      .addCase(updateJobApplicationNote.rejected, (state, action) => {
        state.notesStatus = 'failed';
        state.error = action.error.message || 'Failed to update the note';
      })
      .addCase(deleteJobApplicationNote.pending, (state) => {
        state.notesStatus = 'loading';
      })
      .addCase(deleteJobApplicationNote.fulfilled, (state, action) => {
        state.notesStatus = 'succeeded';
        state.notes = state.notes.filter(
          (note) => note.id !== action.payload
        );
        state.error = null;
      })
      .addCase(deleteJobApplicationNote.rejected, (state, action) => {
        state.notesStatus = 'failed';
        state.error = action.error.message || 'Failed to delete the note';
      });
  },
});

export default notesSlice.reducer;
export const selectAllNotes = (state: RootState) => state.notes.notes;
export const selectNotesStatus = (state: RootState) => state.notes.notesStatus;
