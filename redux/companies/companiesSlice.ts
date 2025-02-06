import { createSlice } from '@reduxjs/toolkit';

import { RootState } from '../store';
import { getCompanyThatStartsWith } from './companiesThunk';

interface CompanyState {
  companies: Company[];
  error: string | null;
  companiesStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
}

const initialState: CompanyState = {
  companies: [],
  error: null,
  companiesStatus: 'idle',
};

export const companiesSlice = createSlice({
  name: 'companies',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getCompanyThatStartsWith.pending, (state) => {
        state.companiesStatus = 'loading';
      })
      .addCase(getCompanyThatStartsWith.fulfilled, (state, action) => {
        state.companiesStatus = 'succeeded';
        state.companies = action.payload;
        state.error = null;
      })
      .addCase(getCompanyThatStartsWith.rejected, (state, action) => {
        state.companiesStatus = 'failed';
        state.error = action.error.message || 'Failed to fetch companies';
      });
  },
});

export default companiesSlice.reducer;
export const selectCompanies = (state: RootState) => state.companies.companies;
