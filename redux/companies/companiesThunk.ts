import client from '@/api/client';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const getCompanyThatStartsWith = createAsyncThunk(
  'companies/getCompanyThatStartsWith',
  async (values: any, thunkAPI) => {
    const { accessToken, companyName } = values;
    const body = {
      name: companyName,
    };
    try {
      const res = await client.get(`/companies/starts-with`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        data: body,
      });
      const data = res.data;
      return data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data || 'Error fetching companies'
      );
    }
  }
);
