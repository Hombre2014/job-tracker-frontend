import client from '@/api/client';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const getDocument = createAsyncThunk(
  'documents/getDocument',
  async (values: GetDocumentParams, thunkAPI) => {
    const { accessToken, documentId } = values;
    try {
      const res = await client.get(`/documents/${documentId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = res.data;
      return data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data || 'Error getting document'
      );
    }
  }
);

export const uploadDocument = createAsyncThunk(
  'documents/uploadDocument',
  async (values: UploadDocumentParams, thunkAPI) => {
    const { file, title, boardId, category, description, accessToken } = values;
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', title);
      formData.append('boardId', boardId);
      formData.append('category', category);
      formData.append('description', description);
      formData.append('fileSize', file.size.toString()); // Include file size

      const res = await client.post(`/documents`, formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      const data = res.data;
      return data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data || 'Error uploading document'
      );
    }
  }
);

export const attachDocumentToJobApplication = createAsyncThunk(
  'documents/attachDocumentToJobApplication',
  async (values: AttachDocumentParams, thunkAPI) => {
    const { jobId, documentId, accessToken } = values;
    try {
      const res = await client.post(
        `/documents/${documentId}/job-application/${jobId}/attach`,
        {},
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
        err.response?.data || 'Error attaching document to job application'
      );
    }
  }
);

export const detachDocumentFromJobApplication = createAsyncThunk(
  'documents/detachDocumentFromJobApplication',
  async (values: DetachDocumentParams, thunkAPI) => {
    const { jobId, documentId, accessToken } = values;
    try {
      const res = await client.post(
        `/documents/${documentId}/job-application/${jobId}/detach`,
        {},
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
        err.response?.data || 'Error detaching document from job application'
      );
    }
  }
);

export const deleteDocument = createAsyncThunk(
  'documents/deleteDocument',
  async (values: DeleteDocumentParams, thunkAPI) => {
    const { documentId, accessToken } = values;
    try {
      const res = await client.delete(`/documents/${documentId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      // Return the documentId for filtering in the slice
      return documentId;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data || 'Error deleting document'
      );
    }
  }
);

export const getDocumentsPerUser = createAsyncThunk(
  'documents/getDocumentsPerUser',
  async (accessToken: string, thunkAPI) => {
    try {
      const res = await client.get('/documents/user', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = res.data;
      return data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data || 'Error getting user documents'
      );
    }
  }
);

export const getDocumentsPerBoard = createAsyncThunk(
  'documents/getDocumentsPerBoard',
  async (values: { boardId: string; accessToken: string }, thunkAPI) => {
    const { boardId, accessToken } = values;
    try {
      const res = await client.get(`/documents/board/${boardId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = res.data;
      return data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data || 'Error getting board documents'
      );
    }
  }
);

export const updateDocument = createAsyncThunk(
  'documents/updateDocument',
  async (
    values: {
      title: string;
      category: string;
      documentId: string;
      accessToken: string;
      description?: string;
    },
    thunkAPI
  ) => {
    const { documentId, title, category, description, accessToken } = values;
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('category', category);
      if (description) {
        formData.append('description', description);
      }

      const res = await client.patch(`/documents/${documentId}`, formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      const data = res.data;
      return data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data || 'Error updating document'
      );
    }
  }
);
