import { WebStorage } from 'redux-persist/lib/types';
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import createWebStorage from 'redux-persist/lib/storage/createWebStorage';
import {
  FLUSH,
  PAUSE,
  PURGE,
  PERSIST,
  REGISTER,
  REHYDRATE,
  persistStore,
  persistReducer,
} from 'redux-persist';

import userSlice from './user/userSlice';
import jobsSlice from './jobs/jobsSlice';
import notesSlice from './notes/notesSlice';
import boardsSlice from './boards/boardsSlice';
import contactsSlice from './contacts/contactsSlice';
import companiesSlice from './companies/companiesSlice';
import documentsSlice from './documents/documentsSlice';
import refreshAccessTokenReducer from './auth/refreshAccessTokenSlice';

export function createPersistStorage(): WebStorage {
  const isServer = typeof window === 'undefined';

  // Returns noop (dummy) storage.
  if (isServer) {
    return {
      getItem() {
        return Promise.resolve(null);
      },
      setItem() {
        return Promise.resolve();
      },
      removeItem() {
        return Promise.resolve();
      },
    };
  }

  return createWebStorage('local');
}

const persistConfig = {
  version: 1,
  key: 'root',
  storage: createPersistStorage(),
  whitelist: [
    'user',
    'boards',
    'jobs',
    'notes',
    'contacts',
    'companies',
    'documents',
    'refreshAccessToken',
  ],
};

const rootReducer = combineReducers({
  user: userSlice,
  jobs: jobsSlice,
  notes: notesSlice,
  boards: boardsSlice,
  contacts: contactsSlice,
  companies: companiesSlice,
  documents: documentsSlice,
  refreshAccessToken: refreshAccessTokenReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const makeStore = () => {
  return configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }),
  });
};

export const store = makeStore();
export const persistor = persistStore(store);

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
