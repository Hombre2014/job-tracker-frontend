import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import PerformanceMonitor from '@/utils/PerformanceMonitor';
import SecurityValidator from '@/utils/SecurityValidator';

// Get user thunk - moved here to avoid circular dependency
export const getUser = createAsyncThunk('user/getUser', async (_, thunkAPI) => {
  try {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
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
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
        values
      );

      if (response.status === 200) {
        const { accessToken, refreshToken } = response.data;
        // ⚠️ SECURITY WARNING: jwt.decode() does NOT verify signatures!
        // This is for UX purposes only (storing user info for display)
        // Server must verify token signatures for all security decisions
        const decoded = jwt.decode(accessToken); // TODO: Add signature verification

        if (process.env.NODE_ENV === 'development') {
          console.log('Login: JWT decoded payload:', decoded);
        }

        // Store tokens in localStorage
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);

        // Also store user info for persistence
        if (decoded && typeof decoded === 'object') {
          // Check different possible field names in the JWT
          const decodedAny = decoded as any;
          const userInfo = {
            userId: decodedAny.sub || decodedAny.id || decodedAny.userId || '',
            email: decodedAny.email || '',
            firstName:
              decodedAny.firstName ||
              decodedAny.first_name ||
              decodedAny.given_name ||
              '',
            lastName:
              decodedAny.lastName ||
              decodedAny.last_name ||
              decodedAny.family_name ||
              '',
            profilePicUrl:
              decodedAny.profilePicUrl ||
              decodedAny.profile_pic_url ||
              decodedAny.picture ||
              '',
            role: decodedAny.role || 'user',
            accessToken,
            refreshToken,
          };

          console.log('Login: Storing user info:', userInfo);
          localStorage.setItem('user', JSON.stringify(userInfo));

          // If user data is missing from JWT, try to fetch it from API
          if (!userInfo.firstName || !userInfo.lastName) {
            console.log(
              'Login: User data missing from JWT, fetching from API...'
            );
            try {
              const userResponse = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}/users`,
                {
                  headers: {
                    Authorization: `Bearer ${accessToken}`,
                  },
                }
              );

              if (userResponse.status === 200) {
                const apiUserData = userResponse.data;
                console.log('Login: Fetched user data from API:', apiUserData);

                // Update user info with API data
                const completeUserInfo = {
                  ...userInfo,
                  firstName: apiUserData.firstName || userInfo.firstName,
                  lastName: apiUserData.lastName || userInfo.lastName,
                  profilePicUrl:
                    apiUserData.profilePicUrl || userInfo.profilePicUrl,
                  email: apiUserData.email || userInfo.email,
                };

                console.log('Login: Complete user info:', completeUserInfo);
                localStorage.setItem('user', JSON.stringify(completeUserInfo));

                return {
                  data: { accessToken, refreshToken },
                  decoded,
                  userProfile: apiUserData,
                };
              }
            } catch (apiError) {
              console.error(
                'Login: Failed to fetch user profile from API:',
                apiError
              );
            }
          }
        }

        // Track successful login
        SecurityValidator.trackLoginAttempt(clientIP, true);
        PerformanceMonitor.trackAuthEvent(
          'login',
          true,
          Date.now() - startTime,
          (decoded as any)?.sub || undefined,
          {
            email: values.email,
          }
        );

        return {
          data: { accessToken, refreshToken },
          decoded,
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
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
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
    accessToken: string;
  }) => {
    const { accessToken, firstName, lastName, email, profilePic, role } =
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
      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/users`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
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
  accessToken?: string;
  error: string | null;
  refreshToken?: string;
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
  accessToken: '',
  refreshToken: '',
  profilePicUrl: '',
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setStatusToIdle: (state) => {
      state.status = 'idle';
    },
    updateUserTokens: (state, action) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
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
        state.accessToken = action.payload?.data.accessToken;
        state.refreshToken = action.payload?.data.refreshToken;

        // Use API user profile data if available, otherwise fall back to JWT
        const userProfile = action.payload?.userProfile;
        const jwtDecoded = action.payload?.decoded as any;

        if (userProfile) {
          // Use data from API
          state.userId =
            userProfile.id || userProfile.userId || jwtDecoded?.sub || '';
          state.email = userProfile.email || jwtDecoded?.email || '';
          state.firstName = userProfile.firstName || '';
          state.lastName = userProfile.lastName || '';
          state.profilePicUrl = userProfile.profilePicUrl || '';
          state.role = userProfile.role || 'user';
        } else if (jwtDecoded) {
          // Fall back to JWT data
          state.userId =
            jwtDecoded.sub || jwtDecoded.id || jwtDecoded.userId || '';
          state.email = jwtDecoded.email || '';
          state.firstName =
            jwtDecoded.firstName ||
            jwtDecoded.first_name ||
            jwtDecoded.given_name ||
            '';
          state.lastName =
            jwtDecoded.lastName ||
            jwtDecoded.last_name ||
            jwtDecoded.family_name ||
            '';
          state.role = jwtDecoded.role || 'user';
          state.profilePicUrl =
            jwtDecoded.profilePicUrl ||
            jwtDecoded.profile_pic_url ||
            jwtDecoded.picture ||
            '';
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
        state.accessToken = '';
        state.refreshToken = '';
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

export const { setStatusToIdle, updateUserTokens, updateUserData } =
  userSlice.actions;
export const selectUser = (state: any) => state.user;
export default userSlice.reducer;
