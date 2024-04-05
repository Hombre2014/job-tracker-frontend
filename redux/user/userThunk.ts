import { createAsyncThunk } from '@reduxjs/toolkit';
import client from '@/api/client';
import jwt from 'jsonwebtoken';

export const login = createAsyncThunk(
  'user/login',
  async (values: any, thunkAPI) => {
    console.log('Values:', values);
    const res = await client.post('/auth/login', values);
    const data = await res.data;
    console.log('Response:', res.data);
    if (res.status === 200) {
      // form.reset();
      const accessToken = res.data.accessToken;
      const refreshToken = res.data.refreshToken;
      const decoded = jwt.decode(accessToken);

      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);

      if (decoded) {
        console.log('Decoded:', decoded);
        localStorage.setItem('user', JSON.stringify(decoded));
        const user = localStorage.getItem('user') || '';
        console.log('User in Thunk: ', user);
        return data;
      } else {
        return thunkAPI.rejectWithValue(data);
      }

      // const user = localStorage.getItem('user') || '';
      // if (user) {
      //   const userData = JSON.parse(user);
      //   if (userData) {
      //     console.log('User:', userData);
      //     console.log('Data from Thunk:', data);
      //     return data;
      //   } else {
      //     return thunkAPI.rejectWithValue(data);
      //   }
      // }
      // setSuccess('Login successful');
      // router.push('/home');
      // return data;
    }
    // setError('Email or password is incorrect');
    // form.reset();
    else {
      console.log('Error:', data);
      return thunkAPI.rejectWithValue(data);
    }
    // return thunkAPI.rejectWithValue(data);
  }
);

export const logout = createAsyncThunk('user/logout', async () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');

  return {
    accessToken: '',
    refreshToken: '',
    email: '',
    role: 'user',
    userId: null,
    status: 'idle',
    error: null,
  };
});

// export const register = createAsyncThunk(
//   'user/register',
//   async (values: any, thunkAPI) => {
//     const res = await client.post('/users', values);
//     if (res.status === 201) {
//       return res.data;
//     } else {
//       return thunkAPI.rejectWithValue(res.data);
//     }
//   }
// );

// export const verifyEmail = createAsyncThunk(
//   'user/verifyEmail',
//   async (values: any, thunkAPI) => {
//     const res = await client.post('/auth/verify-email', values);
//     if (res.status === 200) {
//       return res.data;
//     } else {
//       return thunkAPI.rejectWithValue(res.data);
//     }
//   }
// );

// export const resendEmail = createAsyncThunk(
//   'user/resendEmail',
//   async (values: any, thunkAPI) => {
//     const res = await client.post('/auth/resend-email', values);
//     if (res.status === 200) {
//       return res.data;
//     } else {
//       return thunkAPI.rejectWithValue(res.data);
//     }
//   }
// );

// export const resetPassword = createAsyncThunk(
//   'user/resetPassword',
//   async (values: any, thunkAPI) => {
//     const res = await client.post('/auth/reset-password', values);
//     if (res.status === 200) {
//       return res.data;
//     } else {
//       return thunkAPI.rejectWithValue(res.data);
//     }
//   }
// );
