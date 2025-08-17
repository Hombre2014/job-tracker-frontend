import { createSlice } from '@reduxjs/toolkit';
import {
  getBothNotifications,
  createUpdateDeleteNotifications,
  NotificationsResponse,
} from './notificationsThunk';

interface NotificationsState {
  loading: boolean;
  error: string | null;
  daily: NotificationsResponse['daily'] | null;
  weekly: NotificationsResponse['weekly'] | null;
}

const initialState: NotificationsState = {
  daily: null,
  weekly: null,
  loading: false,
  error: null,
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
    // getBothNotifications
    builder
      .addCase(getBothNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getBothNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.daily = action.payload.daily;
        state.weekly = action.payload.weekly;
      })
      .addCase(getBothNotifications.rejected, (state, action) => {
        state.loading = false;
        const fallback = (action as any)?.error?.message ?? 'Unknown error';
        state.error = (action.payload as string | undefined) ?? fallback;
      })
      // createUpdateDeleteNotifications
      .addCase(createUpdateDeleteNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createUpdateDeleteNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.daily = action.payload.daily;
        state.weekly = action.payload.weekly;
      })
      .addCase(createUpdateDeleteNotifications.rejected, (state, action) => {
        state.loading = false;
        const fallback = (action as any)?.error?.message ?? 'Unknown error';
        state.error = (action.payload as string | undefined) ?? fallback;
      });
  },
});

export const { clearError } = notificationsSlice.actions;
export default notificationsSlice.reducer;
