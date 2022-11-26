import { configureStore } from '@reduxjs/toolkit';
import logic from './slices/logicSlice';
import colors from './slices/colorsSlice';
import alert from './slices/alertSlice';

export const store = configureStore({
  reducer: {
    logic,
    colors,
    alert,
  },
});

export type RootState = ReturnType<typeof store.getState>;
