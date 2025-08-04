import client from '@/api/client';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const getCompanyThatStartsWith = createAsyncThunk(
  'companies/getCompanyThatStartsWith',
  async (companyName: string, thunkAPI) => {
    try {
      const res = await client.post('/companies/starts-with', {
        name: companyName,
      });
      return res.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data || 'Error fetching companies'
      );
    }
  }
);

export const createCompany = createAsyncThunk(
  'companies/createNewCompany',
  async (name: string, thunkAPI) => {
    const body = {
      name: name,
    };

    try {
      const res = await client.post('/companies', body);
      return res.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data || 'Error creating company'
      );
    }
  }
);

export const getCompany = createAsyncThunk(
  'companies/getCompany',
  async (companyId: string, thunkAPI) => {
    try {
      const res = await client.get(`/companies/${companyId}`);
      return res.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data || 'Error fetching company'
      );
    }
  }
);

export const updateCompany = createAsyncThunk(
  'companies/updateCompany',
  async (values: { companyId: string; [key: string]: any }, thunkAPI) => {
    const { companyId, ...rest } = values;
    try {
      const res = await client.put(`/companies/${companyId}`, rest);
      return res.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data || 'Error updating company'
      );
    }
  }
);
