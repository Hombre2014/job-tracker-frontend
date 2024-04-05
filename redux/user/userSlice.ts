import { createSlice } from '@reduxjs/toolkit';
import { login, logout } from './userThunk';
import { RootState } from '../store';
import jwt from 'jsonwebtoken';

// Define a type for the slice state
interface UserState {
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
        const decoded = jwt.decode(action.payload.accessToken);
        console.log('Decoded in Thunk: ', decoded);
        if (decoded) {
          state.email = decoded.email;
          state.userId = decoded.sub as string;
        }
        // state.email = action.payload.email;
        // state.role = action.payload.role;
        console.log('Action Payload: ', action.payload);
        // state.userId = action.payload.userId;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Something went wrong';
      })
      .addCase(logout.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(logout.fulfilled, (state) => {
        state.status = 'succeeded';
        state.accessToken = '';
        state.refreshToken = '';
        state.email = '';
        state.role = 'user';
        state.userId = null;
      })
      .addCase(logout.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Something went wrong';
      });
  },
});

export const selectUser = (state: RootState) => state.user;
export default userSlice.reducer;
