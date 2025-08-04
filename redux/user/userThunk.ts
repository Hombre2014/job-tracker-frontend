import { createAsyncThunk } from '@reduxjs/toolkit';

import client from '@/api/client';
import { RootState } from '@/redux/store';
import { cleanupAfterLogout } from '@/utils/helpers';

export const login = createAsyncThunk(
  'user/login',
  async (values: any, thunkAPI) => {
    try {
      const res = await client.post('/auth/login', values);

      if (res.status === 200) {
        // With HTTP-only cookies, tokens are handled automatically
        // Try to fetch user profile
        try {
          const userRes = await client.get('/users');
          if (userRes.status === 200) {
            const userProfile = userRes.data;

            // Store user info (without tokens) for persistence
            const userInfo = {
              userId: userProfile.id || userProfile.userId || '',
              email: userProfile.email || '',
              firstName: userProfile.firstName || '',
              lastName: userProfile.lastName || '',
              profilePicUrl: userProfile.profilePicUrl || '',
              role: userProfile.role || 'user',
            };

            localStorage.setItem('user', JSON.stringify(userInfo));

            return { userProfile };
          }
        } catch (userErr) {
          console.error('Failed to fetch user profile:', userErr);
          // Login was successful even if user fetch failed
          return { userProfile: null };
        }

        return { userProfile: null };
      } else {
        return thunkAPI.rejectWithValue('Login failed');
      }
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data || 'Login failed');
    }
  }
);

export const logout = createAsyncThunk('user/logout', async () => {
  try {
    // Call logout endpoint to clear HTTP-only cookies
    await client.post('/auth/logout');
  } catch (error) {
    console.error('Logout endpoint failed:', error);
  }

  // Clean up client-side state
  cleanupAfterLogout();

  return {
    email: '',
    error: null,
    userId: null,
    status: 'idle',
  };
});

export const isLoggedIn = createAsyncThunk(
  'user/isLoggedIn',
  async (_, thunkAPI) => {
    const state = thunkAPI.getState() as RootState;
    const { email, userId } = state.user;

    // With HTTP-only cookies, we check if user data exists
    // Authentication status is determined by successful API calls
    if (email && userId) {
      return {
        email,
        userId,
        error: null,
        status: 'succeeded',
      };
    } else {
      return thunkAPI.rejectWithValue('User is not logged in');
    }
  }
);

export const updateUser = createAsyncThunk(
  'user/updateUser',
  async (values: any, thunkAPI) => {
    const { firstName, lastName, email, profilePic, role } = values;

    // Create FormData object
    const formData = new FormData();
    formData.append('firstName', firstName);
    formData.append('lastName', lastName);
    formData.append('email', email);
    formData.append('role', role);

    // Check if profilePic is a valid File object
    if (profilePic && profilePic instanceof File && profilePic.size > 0) {
      formData.append('profilePic', profilePic);
    }

    try {
      const res = await client.patch('/users', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (res.status === 200) {
        return res.data;
      } else {
        return thunkAPI.rejectWithValue('Error updating user');
      }
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data || 'Error updating user'
      );
    }
  }
);
