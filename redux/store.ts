import { configureStore } from '@reduxjs/toolkit';

import userSlice from './user/userSlice';
import boardsSlice from './boards/boardsSlice';

export const makeStore = () => {
  return configureStore({
    reducer: {
      user: userSlice,
      boards: boardsSlice,
    },
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
