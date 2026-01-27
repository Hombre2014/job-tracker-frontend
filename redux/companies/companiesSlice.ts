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
        // Ensure payload is always treated as an array
        state.companies = Array.isArray(action.payload)
          ? action.payload
          : [action.payload];
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
        // Ensure companies is always an array before pushing
        if (!Array.isArray(state.companies)) {
          state.companies = [];
        }
        state.companies.push(action.payload);
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
        // Ensure state.companies is always an array
        if (!Array.isArray(state.companies)) {
          state.companies = [];
        }
        // Handle both array and single object responses
        if (Array.isArray(action.payload)) {
          state.companies = action.payload;
        } else {
          // If single company, check if it exists, update it, or add it
          const existingIndex = state.companies.findIndex(
            (c) => c.id === action.payload.id,
          );
          if (existingIndex >= 0) {
            state.companies[existingIndex] = action.payload;
          } else {
            state.companies.push(action.payload);
          }
        }
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
        // Ensure companies is always an array before updating
        if (!Array.isArray(state.companies)) {
          state.companies = [];
        }
        // Guard: payload must not be null/undefined
        if (action.payload == null) {
          state.error = 'Update failed: no payload received';
          return;
        }
        // Find and update the company, or add if not found
        const existingIndex = state.companies.findIndex(
          (company) => company.id === action.payload.id,
        );
        if (existingIndex >= 0) {
          state.companies[existingIndex] = action.payload;
        } else {
          state.companies.push(action.payload);
        }
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
