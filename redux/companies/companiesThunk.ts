import { isAxiosError } from 'axios';

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
    } catch (err: unknown) {
      if (isAxiosError(err)) {
        return thunkAPI.rejectWithValue(
          err.response?.data || 'Error fetching companies'
        );
      }
      return thunkAPI.rejectWithValue('Error fetching companies');
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
    } catch (err: unknown) {
      if (isAxiosError(err)) {
        return thunkAPI.rejectWithValue(
          err.response?.data || 'Error creating company'
        );
      }
      return thunkAPI.rejectWithValue('Error creating company');
    }
  }
);

export const getCompany = createAsyncThunk(
  'companies/getCompany',
  async (values: any, thunkAPI) => {
    const { companyId, accessToken } = values;
    try {
      const res = await client.get(`/companies/${companyId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });
      return res.data;
    } catch (err: unknown) {
      if (isAxiosError(err)) {
        return thunkAPI.rejectWithValue(
          err.response?.data || 'Error fetching company'
        );
      }
      return thunkAPI.rejectWithValue('Error fetching company');
    }
  }
);

export const updateCompany = createAsyncThunk(
  'companies/updateCompany',
  async (values: any, thunkAPI) => {
    const { companyId, accessToken, ...rest } = values;
    try {
      const res = await client.put(`/companies/${companyId}`, rest, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });
      return res.data;
    } catch (err: unknown) {
      if (isAxiosError(err)) {
        return thunkAPI.rejectWithValue(
          err.response?.data || 'Error updating company'
        );
      }
      return thunkAPI.rejectWithValue('Error updating company');
    }
  }
);
