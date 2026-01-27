import companiesReducer from './companiesSlice';
import { createCompany, updateCompany } from './companiesThunk';

describe('companiesSlice', () => {
  const initialState = {
    companies: [],
    error: null,
    companiesStatus: 'idle' as const,
  };

  const mockCompany: Company = {
    id: '1',
    name: 'Test Company',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  describe('createCompany', () => {
    it('should handle createCompany.fulfilled with valid payload', () => {
      const action = { type: createCompany.fulfilled.type, payload: mockCompany };
      const state = companiesReducer(initialState, action);

      expect(state.companiesStatus).toBe('succeeded');
      expect(state.companies).toHaveLength(1);
      expect(state.companies[0]).toEqual(mockCompany);
      expect(state.error).toBeNull();
    });

    it('should handle createCompany.fulfilled with null payload', () => {
      const action = { type: createCompany.fulfilled.type, payload: null };
      const state = companiesReducer(initialState, action);

      expect(state.companiesStatus).toBe('failed');
      expect(state.companies).toHaveLength(0);
      expect(state.error).toBe('Create failed: no payload received');
    });

    it('should handle createCompany.fulfilled with undefined payload', () => {
      const action = { type: createCompany.fulfilled.type, payload: undefined };
      const state = companiesReducer(initialState, action);

      expect(state.companiesStatus).toBe('failed');
      expect(state.companies).toHaveLength(0);
      expect(state.error).toBe('Create failed: no payload received');
    });
  });

  describe('updateCompany', () => {
    const stateWithCompany = {
      companies: [mockCompany],
      error: null,
      companiesStatus: 'idle' as const,
    };

    it('should handle updateCompany.fulfilled with valid payload', () => {
      const updatedCompany = { ...mockCompany, name: 'Updated Company' };
      const action = { type: updateCompany.fulfilled.type, payload: updatedCompany };
      const state = companiesReducer(stateWithCompany, action);

      expect(state.companiesStatus).toBe('succeeded');
      expect(state.companies[0].name).toBe('Updated Company');
      expect(state.error).toBeNull();
    });

    it('should handle updateCompany.fulfilled with null payload', () => {
      const action = { type: updateCompany.fulfilled.type, payload: null };
      const state = companiesReducer(stateWithCompany, action);

      expect(state.companiesStatus).toBe('failed');
      expect(state.companies).toHaveLength(1);
      expect(state.error).toBe('Update failed: no payload received');
    });

    it('should handle updateCompany.fulfilled with undefined payload', () => {
      const action = { type: updateCompany.fulfilled.type, payload: undefined };
      const state = companiesReducer(stateWithCompany, action);

      expect(state.companiesStatus).toBe('failed');
      expect(state.companies).toHaveLength(1);
      expect(state.error).toBe('Update failed: no payload received');
    });
  });
});
