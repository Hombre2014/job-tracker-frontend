import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { isAxiosError } from 'axios';
import PerformanceMonitor from '@/utils/PerformanceMonitor';
import SecurityValidator from '@/utils/SecurityValidator';
import { 
  createDeleteVerificationCode, 
  deleteUserAccount 
} from './userThunk';
import client from '@/api/client';

// Get user thunk - moved here to avoid circular dependency
export const getUser = createAsyncThunk('user/getUser', async (_, thunkAPI) => {
  try {
    const res = await client.get(`${process.env.NEXT_PUBLIC_API_URL}/users`);

    if (res.status === 200) {
      return res.data;
    } else {
      return thunkAPI.rejectWithValue('User not found');
    }
  } catch (err: unknown) {
    if (isAxiosError(err)) {
      return thunkAPI.rejectWithValue(err.response?.data || 'User not found');
    }
    return thunkAPI.rejectWithValue('User not found');
  }
});

// Simple login thunk to avoid circular dependency
export const login = createAsyncThunk(
  'user/login',
  async (values: { email: string; password: string }) => {
    const startTime = Date.now();
    // TODO: Extract real client IP from request headers in production
    const clientIP = 'client'; // Placeholder - needs proper implementation

    // Check login attempt limits
    const loginCheck = SecurityValidator.trackLoginAttempt(clientIP, false);
    if (!loginCheck.allowed) {
      const error = new Error(
        'Too many login attempts. Please try again later.'
      );
      PerformanceMonitor.trackAuthEvent(
        'login',
        false,
        Date.now() - startTime,
        undefined,
        {
          reason: 'rate_limited',
          email: values.email,
        }
      );
      throw error;
    }

    try {
      const response = await client.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
        values
      );

      if (response.status === 200) {
        const responseData = response.data

        const userInfo = {
          userId: responseData.id,
          email: responseData.email,
          firstName: responseData.firstName,
          lastName: responseData.lastName,
          profilePicUrl: responseData.profilePicUrl,
          role: responseData.role || 'user',
        };
        localStorage.setItem('user', JSON.stringify(userInfo));

        // Track successful login
        SecurityValidator.trackLoginAttempt(clientIP, true);
        PerformanceMonitor.trackAuthEvent(
          'login',
          true,
          Date.now() - startTime,
          responseData.id,
          {
            email: values.email,
          }
        );

        return {
          data: { passwordStrength: responseData.passwordStrength },
          userInfo
        };
      } else {
        // Track failed login
        SecurityValidator.trackLoginAttempt(clientIP, false);
        PerformanceMonitor.trackAuthEvent(
          'login',
          false,
          Date.now() - startTime,
          undefined,
          {
            email: values.email,
            reason: 'invalid_credentials',
          }
        );
        throw new Error('Login failed');
      }
    } catch (error) {
      // Track login error
      SecurityValidator.trackLoginAttempt(clientIP, false);
      PerformanceMonitor.trackAuthEvent(
        'login',
        false,
        Date.now() - startTime,
        undefined,
        {
          email: values.email,
          error: error instanceof Error ? error.message : 'Unknown error',
        }
      );
      throw error;
    }
  }
);

// Simple logout thunk
export const logout = createAsyncThunk('user/logout', async () => {
  // Clear localStorage
  localStorage.removeItem('user');

  return true;
});

export const updateUser = createAsyncThunk(
  'user/updateUser',
  async (userData: {
    role: string;
    email: string;
    lastName: string;
    firstName: string;
    profilePic?: File;
  }) => {
    const { firstName, lastName, email, profilePic, role } =
      userData;

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
      const response = await client.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/users`,
        formData
      );

      if (response.status === 200) {
        const updatedUserData = response.data;
        if (process.env.NODE_ENV === 'development') {
          console.log('UpdateUser: API response:', updatedUserData);
        }

        // Update localStorage with new user data
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          try {
            const currentUserData = JSON.parse(storedUser);
            const updatedStoredData = {
              ...currentUserData,
              firstName: updatedUserData.firstName || firstName,
              lastName: updatedUserData.lastName || lastName,
              email: updatedUserData.email || email,
              profilePicUrl:
                updatedUserData.profilePicUrl || currentUserData.profilePicUrl,
            };
            localStorage.setItem('user', JSON.stringify(updatedStoredData));
          } catch (error) {
            console.error('UpdateUser: Error updating localStorage:', error);
          }
        }

        // Return only serializable data (no File objects)
        return {
          id: updatedUserData.id,
          firstName: updatedUserData.firstName || firstName,
          lastName: updatedUserData.lastName || lastName,
          email: updatedUserData.email || email,
          profilePicUrl: updatedUserData.profilePicUrl,
          role: updatedUserData.role || role,
        };
      } else {
        throw new Error('Update failed');
      }
    } catch (error) {
      console.error('UpdateUser: API error:', error);
      throw error;
    }
  }
);

interface UserState {
  email: string;
  lastName: string;
  firstName: string;
  error: string | null;
  userId: string | null;
  profilePicUrl?: string;
  role?: 'admin' | 'user' | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
}

const initialState: UserState = {
  email: '',
  error: null,
  lastName: '',
  role: 'user',
  userId: null,
  firstName: '',
  status: 'idle',
  profilePicUrl: '',
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setStatusToIdle: (state) => {
      state.status = 'idle';
    },
    updateUserData: (state, action) => {
      state.userId = action.payload.userId || state.userId;
      state.email = action.payload.email || state.email;
      state.firstName = action.payload.firstName || state.firstName;
      state.lastName = action.payload.lastName || state.lastName;
      state.profilePicUrl = action.payload.profilePicUrl || state.profilePicUrl;
      state.role = action.payload.role || state.role;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'succeeded';

        const userProfile = action.payload?.userInfo;
        state.userId = userProfile.userId;
        state.email = userProfile.email;
        state.firstName = userProfile.firstName;
        state.lastName = userProfile.lastName;
        state.profilePicUrl = userProfile.profilePicUrl || '';
        state.role = userProfile.role || 'user';

        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Invalid email or password';
      })
      .addCase(logout.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(logout.fulfilled, (state) => {
        state.email = '';
        state.error = null;
        state.userId = null;
        state.lastName = '';
        state.firstName = '';
        state.status = 'idle';
        state.profilePicUrl = '';
      })
      .addCase(logout.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Logout failed';
      })
      .addCase(updateUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        if (action.payload) {
          state.email = action.payload.email || state.email;
          state.firstName = action.payload.firstName || state.firstName;
          state.lastName = action.payload.lastName || state.lastName;
          state.profilePicUrl =
            action.payload.profilePicUrl || state.profilePicUrl;
        }
        state.error = null;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to update user';
      })
      .addCase(getUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        if (action.payload) {
          state.email = action.payload.email || '';
          state.firstName = action.payload.firstName || '';
          state.lastName = action.payload.lastName || '';
          state.userId = action.payload.id || action.payload.userId || '';
          state.profilePicUrl = action.payload.profilePicUrl || '';
          state.role = action.payload.role || 'user';
        }
        state.error = null;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to get user';
      })
      .addCase(createDeleteVerificationCode.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createDeleteVerificationCode.fulfilled, (state) => {
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(createDeleteVerificationCode.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to send verification code';
      })
      .addCase(deleteUserAccount.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteUserAccount.fulfilled, (state) => {
        // Reset all user data after successful account deletion
        state.email = '';
        state.error = null;
        state.userId = null;
        state.lastName = '';
        state.firstName = '';
        state.status = 'idle';
        state.profilePicUrl = '';
        state.role = 'user';
      })
      .addCase(deleteUserAccount.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to delete account';
      });
  },
});

export const { setStatusToIdle, updateUserData } =
  userSlice.actions;
export const selectUser = (state: any) => state.user;
export default userSlice.reducer;
