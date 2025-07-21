import { createSlice } from '@reduxjs/toolkit';

import { RootState } from '../store';
import {
  getCompany,
  createCompany,
  updateCompany,
  getCompanyThatStartsWith,
} from './companiesThunk';

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
      })
      .addCase(createCompany.pending, (state) => {
        state.companiesStatus = 'loading';
      })
      .addCase(createCompany.fulfilled, (state, action) => {
        state.companiesStatus = 'succeeded';
        state.companies = action.payload;
        state.error = null;
      })
      .addCase(createCompany.rejected, (state, action) => {
        state.companiesStatus = 'failed';
        state.error = action.error.message || 'Failed to create company';
      })
      .addCase(getCompany.pending, (state) => {
        state.companiesStatus = 'loading';
      })
      .addCase(getCompany.fulfilled, (state, action) => {
        state.companiesStatus = 'succeeded';
        state.companies = action.payload;
        state.error = null;
      })
      .addCase(getCompany.rejected, (state, action) => {
        state.companiesStatus = 'failed';
        state.error = action.error.message || 'Failed to fetch company';
      })
      .addCase(updateCompany.pending, (state) => {
        state.companiesStatus = 'loading';
      })
      .addCase(updateCompany.fulfilled, (state, action) => {
        state.companiesStatus = 'succeeded';
        state.companies = state.companies.map((company) =>
          company.id === action.payload.id ? action.payload : company
        );
        state.error = null;
      })
      .addCase(updateCompany.rejected, (state, action) => {
        state.companiesStatus = 'failed';
        state.error = action.error.message || 'Failed to update company';
      });
  },
});

export default companiesSlice.reducer;
export const selectCompanies = (state: RootState) => state.companies.companies;
