import { isAxiosError } from 'axios';

import client from '@/api/client';
import { createAsyncThunk } from '@reduxjs/toolkit';

// Helper types and utilities
export type ApiError = { message: string; status?: number; data?: unknown };

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
  updatedAt?: string;
  createdAt?: string;
  timezoneOffset: number; // -840 to 720
  scheduledTime?: string;
  type: 'DAILY' | 'WEEKLY';
  deletedAt?: string | null;
  time: TimeString; // Validated HH:MM format (00:00-23:59)
  dayOfWeek?: DayOfWeek;
}

export interface NotificationsResponse {
  daily: NotificationSettings | null;
  weekly: NotificationSettings | null;
}

export interface WeeklyNotificationPayload {
  time: TimeString; // Validated HH:MM format
  timezoneOffset: number;
  dayOfWeek: DayOfWeek;
}

export interface DailyNotificationPayload {
  time: TimeString; // Validated HH:MM format
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
  async (_, { rejectWithValue, signal }) => {
    try {
      const res = await client.get<NotificationsResponse>(
        '/notifications/report',
        {
          signal,
        }
      );
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
  { notifications: CreateUpdateNotificationRequest },
  { rejectValue: ApiError }
>(
  'notifications/createUpdateDeleteNotifications',
  async ({ notifications }, { rejectWithValue, signal }) => {
    try {
      const res = await client.post<NotificationsResponse>(
        '/notifications/report',
        notifications,
        {
          signal,
        }
      );
      return res?.data ?? { daily: null, weekly: null };
    } catch (err: unknown) {
      return rejectWithValue(toApiError(err));
    }
  }
);
