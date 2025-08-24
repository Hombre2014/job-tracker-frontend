import { createSlice, PayloadAction, isAnyOf } from '@reduxjs/toolkit';
import {
  getBothNotifications,
  NotificationsResponse,
  createUpdateDeleteNotifications,
} from './notificationsThunk';

interface NotificationsState {
  loading: boolean;
  error: string | null;
  daily: NotificationsResponse['daily'] | null;
  weekly: NotificationsResponse['weekly'] | null;
}

const initialState: NotificationsState = {
  daily: null,
  error: null,
  weekly: null,
  loading: false,
};

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // pending matcher
      .addMatcher(
        isAnyOf(
          getBothNotifications.pending,
          createUpdateDeleteNotifications.pending
        ),
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      // fulfilled matcher
      .addMatcher(
        isAnyOf(
          getBothNotifications.fulfilled,
          createUpdateDeleteNotifications.fulfilled
        ),
        (state, action: PayloadAction<NotificationsResponse>) => {
          state.loading = false;
          state.daily = action.payload.daily;
          state.weekly = action.payload.weekly;
        }
      )
      // rejected matcher
      .addMatcher(
        isAnyOf(
          getBothNotifications.rejected,
          createUpdateDeleteNotifications.rejected
        ),
        (state, action) => {
          state.loading = false;
          const fallback = (action as any)?.error?.message ?? 'Unknown error';
          state.error = (action.payload as string | undefined) ?? fallback;
        }
      );
  },
});

export const { clearError } = notificationsSlice.actions;
export default notificationsSlice.reducer;
