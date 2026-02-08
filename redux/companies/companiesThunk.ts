import { isAxiosError } from 'axios';

import client from '@/api/client';
import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  findCompanyByNameOrDomain,
  validateDomain as validateDomainService,
} from '@/services/brandfetchValidationService';

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
        },
      );
      return res.data;
    } catch (err: unknown) {
      if (isAxiosError(err)) {
        return thunkAPI.rejectWithValue(
          err.response?.data || 'Error fetching companies',
        );
      }
      return thunkAPI.rejectWithValue('Error fetching companies');
    }
  },
);

export const createCompany = createAsyncThunk(
  'companies/createNewCompany',
  async (values: any, thunkAPI) => {
    const { accessToken, name, url, logo } = values;
    const body: { name: string; url?: string; logo?: string | null } = {
      name: name,
    };

    // Include URL if provided
    if (url) {
      body.url = url;
    }

    // Include logo if provided (can be null for generic icon)
    if (logo !== undefined) {
      body.logo = logo;
    }

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
          err.response?.data || 'Error creating company',
        );
      }
      return thunkAPI.rejectWithValue('Error creating company');
    }
  },
);

export const findCompany = createAsyncThunk(
  'companies/findCompany',
  async (values: any, thunkAPI) => {
    const { accessToken, name, domain } = values;
    try {
      const company = await findCompanyByNameOrDomain({ name, domain }, accessToken);
      return company;
    } catch (err: unknown) {
      if (isAxiosError(err)) {
        return thunkAPI.rejectWithValue(
          err.response?.data || 'Error finding company',
        );
      }
      return thunkAPI.rejectWithValue('Error finding company');
    }
  },
);

export const validateDomain = createAsyncThunk(
  'companies/validateDomain',
  async (values: any, thunkAPI) => {
    const { accessToken, domain } = values;
    try {
      const result = await validateDomainService(domain, accessToken);
      return result;
    } catch (err: unknown) {
      if (isAxiosError(err)) {
        return thunkAPI.rejectWithValue(
          err.response?.data || 'Error validating domain',
        );
      }
      return thunkAPI.rejectWithValue('Error validating domain');
    }
  },
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
          err.response?.data || 'Error fetching company',
        );
      }
      return thunkAPI.rejectWithValue('Error fetching company');
    }
  },
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
          err.response?.data || 'Error updating company',
        );
      }
      return thunkAPI.rejectWithValue('Error updating company');
    }
  },
);
