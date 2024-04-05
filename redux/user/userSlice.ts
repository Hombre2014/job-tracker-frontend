import { createSlice } from '@reduxjs/toolkit';
import { login } from './userThunk';
import { RootState } from '../store';

// Define a type for the slice state
interface UserState {
  // user: [];
  email: string;
  role: 'user' | 'admin';
  accessToken?: string;
  refreshToken?: string;
  userId: string | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

// Define the initial state using that type
const initialState: UserState = {
  // user: [],
  accessToken: '',
  refreshToken: '',
  email: '',
  role: 'user',
  userId: null,
  status: 'idle',
  error: null,
};

export const userSlice = createSlice({
  name: 'user',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.email = action.payload.email;
        state.role = action.payload.role;
        state.userId = action.payload.userId;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Something went wrong';
      });
  },
});

export const selectUser = (state: RootState) => state.user;
export default userSlice.reducer;
