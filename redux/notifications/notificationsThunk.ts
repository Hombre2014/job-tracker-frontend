import client from '@/api/client';
import { createAsyncThunk } from '@reduxjs/toolkit';

// Types
export interface NotificationSettings {
  id?: string;
  time: string; // "HH:MM" format
  updatedAt?: string;
  createdAt?: string;
  timezoneOffset: number; // -840 to 720
  scheduledTime?: string;
  type: 'DAILY' | 'WEEKLY';
  deletedAt?: string | null;
  dayOfWeek?:
    | 'MONDAY'
    | 'TUESDAY'
    | 'WEDNESDAY'
    | 'THURSDAY'
    | 'FRIDAY'
    | 'SATURDAY'
    | 'SUNDAY';
}

export interface NotificationsResponse {
  daily: NotificationSettings | null;
  weekly: NotificationSettings | null;
}

export interface CreateUpdateNotificationRequest {
  weekly: Omit<
    NotificationSettings,
    'id' | 'type' | 'scheduledTime' | 'createdAt' | 'updatedAt' | 'deletedAt'
  > | null;
  daily: Omit<
    NotificationSettings,
    | 'id'
    | 'type'
    | 'createdAt'
    | 'updatedAt'
    | 'deletedAt'
    | 'dayOfWeek'
    | 'scheduledTime'
  > | null;
}

export const getBothNotifications = createAsyncThunk(
  'notifications/getBothNotifications',
  async (accessToken: string, thunkAPI) => {
    try {
      const res = await client.get('/notifications/report', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return res.data as NotificationsResponse;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data || 'Error fetching notifications'
      );
    }
  }
);

export const createUpdateDeleteNotifications = createAsyncThunk(
  'notifications/createUpdateDeleteNotifications',
  async (
    values: {
      accessToken: string;
      notifications: CreateUpdateNotificationRequest;
    },
    thunkAPI
  ) => {
    const { accessToken, notifications } = values;
    try {
      const res = await client.post('/notifications/report', notifications, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return res.data as NotificationsResponse;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data || 'Error updating notifications'
      );
    }
  }
);
