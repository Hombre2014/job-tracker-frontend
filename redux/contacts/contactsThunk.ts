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
      const res = await client.post(`/contacts`, body);
      const data = res.data;
      return { id: data.id, ...data }; // Return the contact ID along with other data
    } catch (err: any) {
      console.error('Error creating contact:', err);
      return thunkAPI.rejectWithValue(
        err.response?.data || 'Error creating contact'
      );
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
      const res = await client.put(`/contacts`, body);
      const data = res.data;
      return data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data || 'Error updating contact'
      );
    }
  }
);

export const deleteContact = createAsyncThunk(
  'contacts/deleteContact',
  async (id: string, thunkAPI) => {
    try {
      const res = await client.delete(`/contacts/${id}`);
      const data = res.data;
      return data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data || 'Error deleting contact'
      );
    }
  }
);

export const getContact = createAsyncThunk(
  'contacts/getContact',
  async ({ boardId, contactId }: any, thunkAPI) => {
    try {
      const res = await client.get(
        `/contacts?boardId=${boardId}&contactId=${contactId}`
      );
      const data = res.data;
      return data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data || 'Error getting contacts'
      );
    }
  }
);

export const getAllContactsPerBoard = createAsyncThunk(
  'contacts/getAllContactsPerBoard',
  async (boardId: string, thunkAPI) => {
    try {
      const res = await client.get(`/contacts?boardId=${boardId}`);
      const data = res.data;
      return data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data || 'Error getting contacts'
      );
    }
  }
);

export const assignContactToJobPost = createAsyncThunk(
  'contacts/assignContactToJobPost',
  async (values: { contactId: string; jobApplicationId: string }, thunkAPI) => {
    const { contactId, jobApplicationId } = values;
    const body = {
      contactId: contactId,
      jobApplicationId: jobApplicationId,
    };
    try {
      const res = await client.post(`/contacts/jobApplication/assign`, body);
      const data = res.data;
      return data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data || 'Error assigning contact to job application'
      );
    }
  }
);

export const unassignContactFromJobPost = createAsyncThunk(
  'contacts/unassignContactFromJobPost',
  async (values: { contactId: string; jobApplicationId: string }, thunkAPI) => {
    const { contactId, jobApplicationId } = values;
    const body = {
      contactId: contactId,
      jobApplicationId: jobApplicationId,
    };
    try {
      const res = await client.delete(`/contacts/jobApplication/unassign`, {
        headers: {
          'Content-Type': 'application/json',
        },
        data: body,
      });
      const data = res.data;
      return data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data || 'Error removing contact from job application'
      );
    }
  }
);

export const uploadContactImage = createAsyncThunk(
  'contacts/uploadContactImage',
  async ({ file, contactId }: { file: File; contactId: string }, thunkAPI) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await client.post('/appwrite-uploads', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      const data = res.data;
      return { contactId, imageUrl: data.url };
    } catch (err: any) {
      console.error('Error in uploadContactImage thunk:', err);
      return thunkAPI.rejectWithValue(
        err.response?.data || 'Error uploading contact image'
      );
    }
  }
);

export const createContactEmail = createAsyncThunk(
  'contacts/createContactEmail',
  async (
    values: { contactId: string; email: string; type: string },
    thunkAPI
  ) => {
    const { contactId, email, type } = values;
    const body = {
      type: type,
      email: email,
      contactId: contactId,
    };
    try {
      const res = await client.post(`/contacts/contact-method/email`, body);
      const data = res.data;
      return data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data || 'Error creating contact email'
      );
    }
  }
);

export const createContactPhone = createAsyncThunk(
  'contacts/createContactPhone',
  async (
    values: { contactId: string; phone: string; type: string },
    thunkAPI
  ) => {
    const { contactId, phone, type } = values;
    const body = {
      type: type,
      phone: phone,
      contactId: contactId,
    };
    try {
      const res = await client.post(`/contacts/contact-method/phone`, body);
      const data = res.data;
      return data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data || 'Error creating contact phone'
      );
    }
  }
);

export const updateContactEmail = createAsyncThunk(
  'contacts/updateContactEmail',
  async (values: { email: string; type: string; id: string }, thunkAPI) => {
    const { email, type, id } = values;
    const body = {
      id: id,
      type: type,
      email: email,
    };
    try {
      const res = await client.put(`/contacts/contact-method/email`, body);
      const data = res.data;
      return data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data || 'Error updating contact email'
      );
    }
  }
);

export const updateContactPhone = createAsyncThunk(
  'contacts/updateContactPhone',
  async (values: { phone: string; type: string; id: string }, thunkAPI) => {
    const { phone, type, id } = values;
    const body = {
      id: id,
      type: type,
      phone: phone,
    };
    try {
      const res = await client.put(`/contacts/contact-method/phone`, body);
      const data = res.data;
      return data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data || 'Error updating contact phone'
      );
    }
  }
);

export const deleteContactEmail = createAsyncThunk(
  'contacts/deleteContactEmail',
  async (id: string, thunkAPI) => {
    try {
      const res = await client.delete(`/contacts/contact-method/email/${id}`);
      const data = res.data;
      return data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data || 'Error deleting contact email'
      );
    }
  }
);

export const deleteContactPhone = createAsyncThunk(
  'contacts/deleteContactPhone',
  async (id: string, thunkAPI) => {
    try {
      const res = await client.delete(`/contacts/contact-method/phone/${id}`);
      const data = res.data;
      return data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data || 'Error deleting contact phone'
      );
    }
  }
);

export const getContactEmails = createAsyncThunk(
  'contacts/getContactEmails',
  async (contactId: string, thunkAPI) => {
    try {
      const res = await client.get(
        `/contacts/contact-method/email?contactId=${contactId}`
      );
      const data = res.data;
      return data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data || 'Error getting contact emails'
      );
    }
  }
);

export const getContactPhones = createAsyncThunk(
  'contacts/getContactPhones',
  async (contactId: string, thunkAPI) => {
    try {
      const res = await client.get(
        `/contacts/contact-method/phone?contactId=${contactId}`
      );
      const data = res.data;
      return data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data || 'Error getting contact phones'
      );
    }
  }
);
