import { isAxiosError } from 'axios';

import client from '@/api/client';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const createContact = createAsyncThunk(
  'contacts/createContact',
  async (values: any, thunkAPI) => {
    const {
      emails,
      phones,
      boardId,
      comment,
      lastName,
      jobTitle,
      location,
      photoUrl,
      firstName,
      githubUrl,
      companyIds,
      twitterUrl,
      linkedinUrl,
      accessToken,
      facebookUrl,
    } = values;

    const body = {
      emails: emails,
      phones: phones,
      boardId: boardId,
      comment: comment,
      lastName: lastName,
      jobTitle: jobTitle,
      location: location,
      photoUrl: photoUrl,
      firstName: firstName,
      githubUrl: githubUrl,
      companyIds: companyIds,
      twitterUrl: twitterUrl,
      linkedinUrl: linkedinUrl,
      facebookUrl: facebookUrl,
    };

    try {
      const res = await client.post(`/contacts`, body, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = res.data;
      return { id: data.id, ...data }; // Return the contact ID along with other data
    } catch (err: unknown) {
      console.error('Error creating contact:', err);
      if (isAxiosError(err)) {
        return thunkAPI.rejectWithValue(
          err.response?.data || 'Error creating contact'
        );
      }
      return thunkAPI.rejectWithValue('Error creating contact');
    }
  }
);

export const updateContact = createAsyncThunk(
  'contacts/updateContact',
  async (values: any, thunkAPI) => {
    const {
      id,
      boardId,
      comment,
      lastName,
      jobTitle,
      location,
      photoUrl,
      firstName,
      githubUrl,
      companyIds,
      twitterUrl,
      linkedinUrl,
      accessToken,
      facebookUrl,
    } = values;
    const body = {
      id: id,
      boardId: boardId,
      comment: comment,
      lastName: lastName,
      jobTitle: jobTitle,
      location: location,
      photoUrl: photoUrl,
      firstName: firstName,
      githubUrl: githubUrl,
      companyIds: companyIds,
      twitterUrl: twitterUrl,
      linkedinUrl: linkedinUrl,
      facebookUrl: facebookUrl,
    };
    try {
      const res = await client.put(`/contacts`, body, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = res.data;
      return data;
    } catch (err: unknown) {
      if (isAxiosError(err)) {
        return thunkAPI.rejectWithValue(
          err.response?.data || 'Error updating contact'
        );
      }
      return thunkAPI.rejectWithValue('Error updating contact');
    }
  }
);

export const deleteContact = createAsyncThunk(
  'contacts/deleteContact',
  async (values: any, thunkAPI) => {
    const { id, accessToken } = values;
    try {
      const res = await client.delete(`/contacts/${id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = res.data;
      return data;
    } catch (err: unknown) {
      if (isAxiosError(err)) {
        return thunkAPI.rejectWithValue(
          err.response?.data || 'Error deleting contact'
        );
      }
      return thunkAPI.rejectWithValue('Error deleting contact');
    }
  }
);

export const getContact = createAsyncThunk(
  'contacts/getContact',
  async ({ accessToken, boardId, contactId }: any, thunkAPI) => {
    try {
      const res = await client.get(
        `/contacts?boardId=${boardId}&contactId=${contactId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const data = res.data;
      return data;
    } catch (err: unknown) {
      if (isAxiosError(err)) {
        return thunkAPI.rejectWithValue(
          err.response?.data || 'Error getting contacts'
        );
      }
      return thunkAPI.rejectWithValue('Error getting contacts');
    }
  }
);

export const getAllContactsPerBoard = createAsyncThunk(
  'contacts/getAllContactsPerBoard',
  async (values: any, thunkAPI) => {
    const { accessToken, boardId } = values;
    try {
      const res = await client.get(`/contacts?boardId=${boardId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = res.data;
      return data;
    } catch (err: unknown) {
      if (isAxiosError(err)) {
        return thunkAPI.rejectWithValue(
          err.response?.data || 'Error getting contacts'
        );
      }
      return thunkAPI.rejectWithValue('Error getting contacts');
    }
  }
);

export const assignContactToJobPost = createAsyncThunk(
  'contacts/assignContactToJobPost',
  async (values: any, thunkAPI) => {
    const { accessToken, contactId, jobApplicationId } = values;
    const body = {
      contactId: contactId,
      jobApplicationId: jobApplicationId,
    };
    try {
      const res = await client.post(`/contacts/jobApplication/assign`, body, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = res.data;
      return data;
    } catch (err: unknown) {
      if (isAxiosError(err)) {
        return thunkAPI.rejectWithValue(
          err.response?.data || 'Error assigning contact to job application'
        );
      }
      return thunkAPI.rejectWithValue(
        'Error assigning contact to job application'
      );
    }
  }
);

export const unassignContactFromJobPost = createAsyncThunk(
  'contacts/unassignContactFromJobPost',
  async (values: any, thunkAPI) => {
    const { accessToken, contactId, jobApplicationId } = values;
    const body = {
      contactId: contactId,
      jobApplicationId: jobApplicationId,
    };
    try {
      const res = await client.delete(`/contacts/jobApplication/unassign`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        data: body,
      });
      const data = res.data;
      return data;
    } catch (err: unknown) {
      if (isAxiosError(err)) {
        return thunkAPI.rejectWithValue(
          err.response?.data || 'Error removing contact from job application'
        );
      }
      return thunkAPI.rejectWithValue(
        'Error removing contact from job application'
      );
    }
  }
);

export const uploadContactImage = createAsyncThunk(
  'contacts/uploadContactImage',
  async (
    {
      file,
      contactId,
      accessToken,
    }: { file: File; contactId: string; accessToken: string },
    thunkAPI
  ) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await client.post('/appwrite-uploads', formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      const data = res.data;
      return { contactId, imageUrl: data.url };
    } catch (err: unknown) {
      console.error('Error in uploadContactImage thunk:', err);
      if (isAxiosError(err)) {
        return thunkAPI.rejectWithValue(
          err.response?.data || 'Error uploading contact image'
        );
      }
      return thunkAPI.rejectWithValue('Error uploading contact image');
    }
  }
);

export const createContactEmail = createAsyncThunk(
  'contacts/createContactEmail',
  async (values: any, thunkAPI) => {
    const { accessToken, contactId, email, type } = values;
    const body = {
      type: type,
      email: email,
      contactId: contactId,
    };
    try {
      const res = await client.post(`/contacts/contact-method/email`, body, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = res.data;
      return data;
    } catch (err: unknown) {
      if (isAxiosError(err)) {
        return thunkAPI.rejectWithValue(
          err.response?.data || 'Error creating contact email'
        );
      }
      return thunkAPI.rejectWithValue('Error creating contact email');
    }
  }
);

export const createContactPhone = createAsyncThunk(
  'contacts/createContactPhone',
  async (values: any, thunkAPI) => {
    const { accessToken, contactId, phone, type } = values;
    const body = {
      type: type,
      phone: phone,
      contactId: contactId,
    };
    try {
      const res = await client.post(`/contacts/contact-method/phone`, body, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = res.data;
      return data;
    } catch (err: unknown) {
      if (isAxiosError(err)) {
        return thunkAPI.rejectWithValue(
          err.response?.data || 'Error creating contact phone'
        );
      }
      return thunkAPI.rejectWithValue('Error creating contact phone');
    }
  }
);

export const updateContactEmail = createAsyncThunk(
  'contacts/updateContactEmail',
  async (values: any, thunkAPI) => {
    const { accessToken, email, type, id } = values;
    const body = {
      id: id,
      type: type,
      email: email,
    };
    try {
      const res = await client.put(`/contacts/contact-method/email`, body, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = res.data;
      return data;
    } catch (err: unknown) {
      if (isAxiosError(err)) {
        return thunkAPI.rejectWithValue(
          err.response?.data || 'Error updating contact email'
        );
      }
      return thunkAPI.rejectWithValue('Error updating contact email');
    }
  }
);

export const updateContactPhone = createAsyncThunk(
  'contacts/updateContactPhone',
  async (values: any, thunkAPI) => {
    const { accessToken, phone, type, id } = values;
    const body = {
      id: id,
      type: type,
      phone: phone,
    };
    try {
      const res = await client.put(`/contacts/contact-method/phone`, body, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = res.data;
      return data;
    } catch (err: unknown) {
      if (isAxiosError(err)) {
        return thunkAPI.rejectWithValue(
          err.response?.data || 'Error updating contact phone'
        );
      }
      return thunkAPI.rejectWithValue('Error updating contact phone');
    }
  }
);

export const deleteContactEmail = createAsyncThunk(
  'contacts/deleteContactEmail',
  async (values: any, thunkAPI) => {
    const { accessToken, id } = values;
    try {
      const res = await client.delete(`/contacts/contact-method/email/${id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = res.data;
      return data;
    } catch (err: unknown) {
      if (isAxiosError(err)) {
        return thunkAPI.rejectWithValue(
          err.response?.data || 'Error deleting contact email'
        );
      }
      return thunkAPI.rejectWithValue('Error deleting contact email');
    }
  }
);

export const deleteContactPhone = createAsyncThunk(
  'contacts/deleteContactPhone',
  async (values: any, thunkAPI) => {
    const { accessToken, id } = values;
    try {
      const res = await client.delete(`/contacts/contact-method/phone/${id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = res.data;
      return data;
    } catch (err: unknown) {
      if (isAxiosError(err)) {
        return thunkAPI.rejectWithValue(
          err.response?.data || 'Error deleting contact phone'
        );
      }
      return thunkAPI.rejectWithValue('Error deleting contact phone');
    }
  }
);

export const getContactEmails = createAsyncThunk(
  'contacts/getContactEmails',
  async (values: any, thunkAPI) => {
    const { accessToken, contactId } = values;
    try {
      const res = await client.get(
        `/contacts/contact-method/email?contactId=${contactId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const data = res.data;
      return data;
    } catch (err: unknown) {
      if (isAxiosError(err)) {
        return thunkAPI.rejectWithValue(
          err.response?.data || 'Error getting contact emails'
        );
      }
      return thunkAPI.rejectWithValue('Error getting contact emails');
    }
  }
);

export const getContactPhones = createAsyncThunk(
  'contacts/getContactPhones',
  async (values: any, thunkAPI) => {
    const { accessToken, contactId } = values;
    try {
      const res = await client.get(
        `/contacts/contact-method/phone?contactId=${contactId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const data = res.data;
      return data;
    } catch (err: unknown) {
      if (isAxiosError(err)) {
        return thunkAPI.rejectWithValue(
          err.response?.data || 'Error getting contact phones'
        );
      }
      return thunkAPI.rejectWithValue('Error getting contact phones');
    }
  }
);
