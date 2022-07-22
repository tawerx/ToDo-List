import { configureStore } from '@reduxjs/toolkit';
import logic from './slices/logic';
import colors from './slices/colorsSlice';

export const store = configureStore({
  reducer: {
    logic,
    colors,
  },
});

export type RootState = ReturnType<typeof store.getState>;
