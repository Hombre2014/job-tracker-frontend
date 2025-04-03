import jwt from 'jsonwebtoken';
import { createAsyncThunk } from '@reduxjs/toolkit';

import client from '@/api/client';
import { RootState } from '@/redux/store';
import { cleanupAfterLogout } from '@/utils/helpers';

export const login = createAsyncThunk(
  'user/login',
  async (values: any, thunkAPI) => {
    try {
      const res = await client.post('/auth/login', values);
      const data = res.data;

      if (res.status === 200) {
        const { accessToken, refreshToken } = res.data;
        const decoded = jwt.decode(accessToken);
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);

        if (decoded) {
          localStorage.setItem('user', JSON.stringify(decoded));
          return { data, decoded };
        } else {
          return thunkAPI.rejectWithValue('Token decoding failed');
        }
      } else {
        return thunkAPI.rejectWithValue(data);
      }
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data || 'Login failed');
    }
  }
);

export const logout = createAsyncThunk('user/logout', async () => {
  cleanupAfterLogout();

  return {
    email: '',
    error: null,
    userId: null,
    status: 'idle',
    accessToken: '',
    refreshToken: '',
  };
});

export const isLoggedIn = createAsyncThunk(
  'user/isLoggedIn',
  async (_, thunkAPI) => {
    const state = thunkAPI.getState() as RootState;
    const { accessToken, refreshToken, email, userId } = state.user;

    if (accessToken && refreshToken && email && userId) {
      return {
        email,
        userId,
        error: null,
        accessToken,
        refreshToken,
        status: 'succeeded',
      };
    } else {
      return thunkAPI.rejectWithValue('User is not logged in');
    }
  }
);

export const getUser = createAsyncThunk(
  'user/getUser',
  async (accessToken: string, thunkAPI) => {
    try {
      const res = await client.get('/users', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
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
  }
);

// export const updateUser = createAsyncThunk(
//   'user/updateUser',
//   async (values: any, thunkAPI) => {
//     const { accessToken, firstName, lastName, email, profilePic, role } =
//       values;
//     const postData = { firstName, lastName, email, profilePic, role };
//     try {
//       console.log('updateUser API request payload:', {
//         role,
//         firstName,
//         email,
//         lastName,
//         profilePic,
//       }); // Debug log
//       const res = await client.patch('/users', postData, {
//         headers: {
//           Authorization: `Bearer ${accessToken}`,
//         },
//       });

//       console.log('updateUser API response:', res.data); // Debug log
//       if (res.status === 200) {
//         return res.data;
//       } else {
//         return thunkAPI.rejectWithValue('Error updating user');
//       }
//     } catch (err: any) {
//       console.error('Error in updateUser thunk:', err); // Debug log
//       return thunkAPI.rejectWithValue(
//         err.response?.data || 'Error updating user'
//       );
//     }
//   }
// );

export const updateUser = createAsyncThunk(
  'user/updateUser',
  async (values: any, thunkAPI) => {
    const { accessToken, firstName, lastName, email, profilePic, role } =
      values;

    // Create FormData object
    const formData = new FormData();
    formData.append('firstName', firstName);
    formData.append('lastName', lastName);
    formData.append('email', email);
    formData.append('role', role);

    // Check if profilePic is a valid File object
    if (profilePic && profilePic instanceof File && profilePic.size > 0) {
      console.log(
        'Appending file to form data:',
        profilePic.name,
        profilePic.size
      );
      formData.append('profilePic', profilePic);
    } else {
      console.log('No valid file to append:', profilePic);
    }

    try {
      // Log the form data entries to verify content
      for (let [key, value] of formData.entries()) {
        console.log(`Form data entry - ${key}:`, value);
      }

      const res = await client.patch('/users', formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('updateUser API response:', res.data);
      if (res.status === 200) {
        return res.data;
      } else {
        return thunkAPI.rejectWithValue('Error updating user');
      }
    } catch (err: any) {
      console.error('Error in updateUser thunk:', err);
      return thunkAPI.rejectWithValue(
        err.response?.data || 'Error updating user'
      );
    }
  }
);

export const uploadUserPhoto = createAsyncThunk(
  'user/uploadUserPhoto',
  async (
    {
      file,
      email,
      accessToken,
    }: { file: File; email: string; accessToken: string },
    thunkAPI
  ) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await client.post('/appwrite-uploads', formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      const data = res.data;
      return { email, imageUrl: data.url }; // Return email and uploaded photo URL
    } catch (err: any) {
      console.error('Error in uploadUserPhoto thunk:', err);
      return thunkAPI.rejectWithValue(
        err.response?.data || 'Error uploading user photo'
      );
    }
  }
);
