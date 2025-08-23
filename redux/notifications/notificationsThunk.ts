import { isAxiosError } from 'axios';

import client from '@/api/client';
import { createAsyncThunk } from '@reduxjs/toolkit';

// Helper types and utilities
type ApiError = { message: string; status?: number; data?: unknown };

const toApiError = (err: unknown): ApiError => {
  if (isAxiosError(err)) {
    return {
      message: (err.response?.data as any)?.message ?? err.message,
      status: err.response?.status,
      data: err.response?.data,
    };
  }
  return { message: 'Unexpected error' };
};

// Types
export type DayOfWeek =
  | 'MONDAY'
  | 'TUESDAY'
  | 'WEDNESDAY'
  | 'THURSDAY'
  | 'FRIDAY'
  | 'SATURDAY'
  | 'SUNDAY';

export interface NotificationSettings {
  id?: string;
  time: `${number}:${number}`; // "HH:MM" format
  updatedAt?: string;
  createdAt?: string;
  timezoneOffset: number; // -840 to 720
  scheduledTime?: string;
  type: 'DAILY' | 'WEEKLY';
  deletedAt?: string | null;
  dayOfWeek?: DayOfWeek;
}

export interface NotificationsResponse {
  daily: NotificationSettings | null;
  weekly: NotificationSettings | null;
}

export interface WeeklyNotificationPayload {
  time: `${number}:${number}`;
  timezoneOffset: number;
  dayOfWeek: DayOfWeek;
}

export interface DailyNotificationPayload {
  time: `${number}:${number}`;
  timezoneOffset: number;
}

export interface CreateUpdateNotificationRequest {
  weekly: WeeklyNotificationPayload | null;
  daily: DailyNotificationPayload | null;
}

export const getBothNotifications = createAsyncThunk<
  NotificationsResponse,
  string,
  { rejectValue: ApiError }
>(
  'notifications/getBothNotifications',
  async (accessToken, { rejectWithValue, signal }) => {
    if (!accessToken) {
      return rejectWithValue({ message: 'Missing access token' });
    }
    try {
      const res = await client.get<NotificationsResponse>('/notifications/report', {
        headers: { Authorization: `Bearer ${accessToken}` },
        signal,
      });
      // Graceful fallback if backend returns empty/204
      return res?.data ?? { daily: null, weekly: null };
    } catch (err: unknown) {
      if (isAxiosError(err) && err.response?.status === 404) {
        // Treat not-found as "no notifications configured"
        return { daily: null, weekly: null };
      }
      return rejectWithValue(toApiError(err));
    }
  }
);

export const createUpdateDeleteNotifications = createAsyncThunk<
  NotificationsResponse,
  { accessToken: string; notifications: CreateUpdateNotificationRequest },
  { rejectValue: ApiError }
>(
  'notifications/createUpdateDeleteNotifications',
  async ({ accessToken, notifications }, { rejectWithValue, signal }) => {
    if (!accessToken) {
      return rejectWithValue({ message: 'Missing access token' });
    }
    try {
      const res = await client.post<NotificationsResponse>(
        '/notifications/report',
        notifications,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
          signal,
        }
      );
      return res?.data ?? { daily: null, weekly: null };
    } catch (err: unknown) {
      return rejectWithValue(toApiError(err));
    }
  }
);
