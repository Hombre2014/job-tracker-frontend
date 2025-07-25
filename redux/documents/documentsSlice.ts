import { createSlice } from '@reduxjs/toolkit';

import { RootState } from '../store';
import {
  getDocument,
  uploadDocument,
  updateDocument,
  deleteDocument,
  getDocumentsPerUser,
  getDocumentsPerBoard,
  attachDocumentToJobApplication,
  detachDocumentFromJobApplication,
} from './documentsThunk';

interface DocumentState {
  error: string | null;
  documents: JobDocument[];
  userDocuments: JobDocument[];
  boardDocuments: JobDocument[];
  documentsStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  userDocumentsStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  boardDocumentsStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
}

const initialState: DocumentState = {
  error: null,
  documents: [],
  userDocuments: [],
  boardDocuments: [],
  documentsStatus: 'idle',
  userDocumentsStatus: 'idle',
  boardDocumentsStatus: 'idle',
};

const documentsSlice = createSlice({
  name: 'documents',
  initialState,
  reducers: {
    updateDocumentInState: (state, action) => {
      const updatedDoc = action.payload;

      // Update in userDocuments
      const userIndex = state.userDocuments.findIndex(
        (doc) => doc.id === updatedDoc.id
      );
      if (userIndex !== -1) {
        state.userDocuments[userIndex] = updatedDoc;
      }

      // Update in boardDocuments
      const boardIndex = state.boardDocuments.findIndex(
        (doc) => doc.id === updatedDoc.id
      );
      if (boardIndex !== -1) {
        state.boardDocuments[boardIndex] = updatedDoc;
      }
    },
  },
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
      })
      .addCase(getDocumentsPerUser.pending, (state) => {
        state.userDocumentsStatus = 'loading';
      })
      .addCase(getDocumentsPerUser.fulfilled, (state, action) => {
        state.userDocumentsStatus = 'succeeded';
        state.userDocuments = action.payload;
        state.error = null;
      })
      .addCase(getDocumentsPerUser.rejected, (state, action) => {
        state.userDocumentsStatus = 'failed';
        state.error = action.error.message || 'Failed to fetch user documents';
      })
      // Board documents cases
      .addCase(getDocumentsPerBoard.pending, (state) => {
        state.boardDocumentsStatus = 'loading';
      })
      .addCase(getDocumentsPerBoard.fulfilled, (state, action) => {
        state.boardDocumentsStatus = 'succeeded';
        state.boardDocuments = action.payload;
        state.error = null;
      })
      .addCase(getDocumentsPerBoard.rejected, (state, action) => {
        state.boardDocumentsStatus = 'failed';
        state.error = action.error.message || 'Failed to fetch board documents';
      })
      .addCase(updateDocument.pending, (state) => {
        state.documentsStatus = 'loading';
      })
      .addCase(updateDocument.fulfilled, (state, action) => {
        state.documentsStatus = 'succeeded';
        const index = state.documents.findIndex(
          (doc) => doc.id === action.payload.id
        );
        if (index >= 0) {
          state.documents[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(updateDocument.rejected, (state, action) => {
        state.documentsStatus = 'failed';
        state.error = action.error.message || 'Failed to update document';
      });
  },
});

export default documentsSlice.reducer;
export const selectDocuments = (state: RootState) => state.documents.documents;
export const selectDocumentsStatus = (state: RootState) =>
  state.documents.documentsStatus;
export const selectUserDocuments = (state: RootState) =>
  state.documents.userDocuments;
export const selectUserDocumentsStatus = (state: RootState) =>
  state.documents.userDocumentsStatus;
export const selectBoardDocuments = (state: RootState) =>
  state.documents.boardDocuments;
export const selectBoardDocumentsStatus = (state: RootState) =>
  state.documents.boardDocumentsStatus;
export const { updateDocumentInState } = documentsSlice.actions;
