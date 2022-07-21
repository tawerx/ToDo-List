import { configureStore } from '@reduxjs/toolkit';
import logic from './slices/logic';

export const store = configureStore({
  reducer: {
    logic,
  },
});

export type RootState = ReturnType<typeof store.getState>;
