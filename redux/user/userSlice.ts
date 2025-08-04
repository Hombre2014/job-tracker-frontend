import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Get user thunk using HTTP-only cookies
export const getUser = createAsyncThunk('user/getUser', async (_, thunkAPI) => {
  try {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
      withCredentials: true, // Use HTTP-only cookies for authentication
    });

    if (res.status === 200) {
      return res.data;
    } else {
      return thunkAPI.rejectWithValue('User not found');
    }
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err.response?.data || 'User not found');
  }
});

// Simple login thunk to avoid circular dependency
export const login = createAsyncThunk(
  'user/login',
  async (values: { email: string; password: string }) => {
    const startTime = Date.now();
    // TODO: Extract real client IP from request headers in production
    const clientIP = 'client'; // Placeholder - needs proper implementation

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
        values,
        {
          withCredentials: true, // Include cookies in requests
        }
      );

      if (response.status === 200) {
        // With HTTP-only cookies, tokens are automatically set by the server
        // We only need to handle user data

        // Try to fetch user profile from API since we have authenticated session
        try {
          const userResponse = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/users`,
            {
              withCredentials: true, // Use cookie authentication
            }
          );

          if (userResponse.status === 200) {
            const apiUserData = userResponse.data;
            console.log('Login: Fetched user data from API:', apiUserData);

            // Store minimal user info for persistence (without tokens)
            const userInfo = {
              userId: apiUserData.id || apiUserData.userId || '',
              email: apiUserData.email || '',
              firstName: apiUserData.firstName || '',
              lastName: apiUserData.lastName || '',
              profilePicUrl: apiUserData.profilePicUrl || '',
              role: apiUserData.role || 'user',
            };

            console.log('Login: Storing user info (no tokens):', userInfo);
            localStorage.setItem('user', JSON.stringify(userInfo));

            return {
              userProfile: apiUserData,
            };
          }
        } catch (apiError) {
          console.error(
            'Login: Failed to fetch user profile from API:',
            apiError
          );
          // Even if user fetch fails, login was successful
          return {
            userProfile: null,
          };
        }

        return {
          userProfile: null,
        };
      } else {
        throw new Error('Login failed');
      }
    } catch (error: any) {
      if (error.response?.status === 401) {
        throw new Error('Invalid email or password');
      }
      throw error;
    }
  }
);

// Simple logout thunk using HTTP-only cookies
export const logout = createAsyncThunk('user/logout', async () => {
  try {
    // Call logout endpoint to clear HTTP-only cookies
    await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, null, {
      withCredentials: true, // Include cookies
      timeout: 5000, // 5 second timeout
    });
    console.log('Logout: Server logout successful');
  } catch (error: any) {
    // Even if logout fails on server, clear client state
    if (error.response?.status === 404) {
      console.warn('Logout endpoint not found - clearing client state only');
    } else {
      console.error('Logout endpoint failed:', error.message);
    }
    // Don't throw - we want to clear client state regardless
  }

  // Clear localStorage (user data, not tokens since they're HTTP-only)
  localStorage.removeItem('user');
  console.log('Logout: Client state cleared');

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
    const { firstName, lastName, email, profilePic, role } = userData;

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
      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/users`,
        formData,
        {
          withCredentials: true, // Use HTTP-only cookies
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
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
    clearUserState: (state) => {
      // Clear user state without making API calls (for login page cleanup)
      state.email = '';
      state.error = null;
      state.userId = null;
      state.lastName = '';
      state.firstName = '';
      state.status = 'idle';
      state.profilePicUrl = '';
      state.role = 'user';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'succeeded';

        // Use API user profile data if available
        const userProfile = action.payload?.userProfile;

        if (userProfile) {
          // Use data from API
          state.userId = userProfile.id || userProfile.userId || '';
          state.email = userProfile.email || '';
          state.firstName = userProfile.firstName || '';
          state.lastName = userProfile.lastName || '';
          state.profilePicUrl = userProfile.profilePicUrl || '';
          state.role = userProfile.role || 'user';
        }

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
      });
  },
});

export const { setStatusToIdle, updateUserData, clearUserState } = userSlice.actions;
export const selectUser = (state: any) => state.user;
export default userSlice.reducer;
