import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AlertSliceState {
  alertMessage: string;
  alertVis: boolean;
}

const initialState: AlertSliceState = {
  alertMessage: '',
  alertVis: false,
};

const AlertSlice = createSlice({
  name: 'logic',
  initialState,
  reducers: {
    setAlertVisible: (state, action: PayloadAction<string>) => {
      state.alertVis = true;
      state.alertMessage = action.payload;
    },
    setAlertDisable: (state) => {
      state.alertVis = false;
      state.alertMessage = '';
    },
  },
});

export const { setAlertVisible, setAlertDisable } = AlertSlice.actions;
export default AlertSlice.reducer;
