import client from '@/api/client';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const getCompanyThatStartsWith = createAsyncThunk(
  'companies/getCompanyThatStartsWith',
  async (values: any, thunkAPI) => {
    const { accessToken, companyName } = values;

    try {
      const res = await client.post(
        '/companies/starts-with',
        { name: companyName },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );
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
  async (values: any, thunkAPI) => {
    const { accessToken, name } = values;
    const body = {
      name: name,
    };

    try {
      const res = await client.post('/companies', body, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });
      return res.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data || 'Error creating company'
      );
    }
  }
);
