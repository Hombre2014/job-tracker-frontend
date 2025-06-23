import { createSlice } from '@reduxjs/toolkit';

import { RootState } from '../store';
import {
  getDocument,
  uploadDocument,
  deleteDocument,
  attachDocumentToJobApplication,
  detachDocumentFromJobApplication,
} from './documentsThunk';

interface DocumentState {
  error: string | null;
  documents: WorkDocument[];
  documentsStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
}

const initialState: DocumentState = {
  error: null,
  documents: [],
  documentsStatus: 'idle',
};

const documentsSlice = createSlice({
  name: 'documents',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getDocument.pending, (state) => {
        state.documentsStatus = 'loading';
      })
      .addCase(getDocument.fulfilled, (state, action) => {
        state.documentsStatus = 'succeeded';
        const existingIndex = state.documents.findIndex(
          (doc) => doc.id === action.payload.id
        );
        if (existingIndex >= 0) {
          // Update existing document
          state.documents[existingIndex] = action.payload;
        } else {
          // Add new document
          state.documents.push(action.payload);
        }
        state.error = null;
      })
      .addCase(getDocument.rejected, (state, action) => {
        state.documentsStatus = 'failed';
        state.error = action.error.message || 'Failed to fetch documents';
      })
      .addCase(uploadDocument.pending, (state) => {
        state.documentsStatus = 'loading';
      })
      .addCase(uploadDocument.fulfilled, (state, action) => {
        state.documentsStatus = 'succeeded';
        state.documents.push(action.payload);
        state.error = null;
      })
      .addCase(uploadDocument.rejected, (state, action) => {
        state.documentsStatus = 'failed';
        state.error = action.error.message || 'Failed to upload document';
      })
      .addCase(deleteDocument.pending, (state) => {
        state.documentsStatus = 'loading';
      })
      .addCase(deleteDocument.fulfilled, (state, action) => {
        state.documentsStatus = 'succeeded';
        state.documents = state.documents.filter(
          (document) => document.id !== action.payload
        );
        state.error = null;
      })
      .addCase(deleteDocument.rejected, (state, action) => {
        state.documentsStatus = 'failed';
        state.error = action.error.message || 'Failed to delete document';
      })
      .addCase(attachDocumentToJobApplication.pending, (state) => {
        state.documentsStatus = 'loading';
      })
      .addCase(attachDocumentToJobApplication.fulfilled, (state, action) => {
        state.documentsStatus = 'succeeded';
        state.documents = state.documents.map((document) =>
          document.id === action.payload.id ? action.payload : document
        );
        state.error = null;
      })
      .addCase(attachDocumentToJobApplication.rejected, (state, action) => {
        state.documentsStatus = 'failed';
        state.error =
          action.error.message ||
          'Failed to attach document to job application';
      })
      .addCase(detachDocumentFromJobApplication.pending, (state) => {
        state.documentsStatus = 'loading';
      })
      .addCase(detachDocumentFromJobApplication.fulfilled, (state, action) => {
        state.documentsStatus = 'succeeded';
        state.documents = state.documents.map((document) =>
          document.id === action.payload.id ? action.payload : document
        );
        state.error = null;
      })
      .addCase(detachDocumentFromJobApplication.rejected, (state, action) => {
        state.documentsStatus = 'failed';
        state.error =
          action.error.message ||
          'Failed to detach document from job application';
      });
  },
});

export default documentsSlice.reducer;
export const selectDocuments = (state: RootState) => state.documents.documents;
export const selectDocumentsStatus = (state: RootState) =>
  state.documents.documentsStatus;
