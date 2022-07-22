import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type Color = {
  id: number;
  title: string;
  bodyColor: string;
  wrapperColor: string;
};

interface ColorsSliceState {
  colors: Color[];
  flag: boolean;
  chosenColor: string;
}

const initialState: ColorsSliceState = {
  colors: [
    { id: 1, title: 'blue', bodyColor: '#adf', wrapperColor: '#cdebff' },
    { id: 2, title: 'yellow', bodyColor: '#f8ff89cc', wrapperColor: '#fcffcd' },
    { id: 3, title: 'purple', bodyColor: '#aad', wrapperColor: '#e1e1ff' },
    { id: 4, title: 'white', bodyColor: 'white', wrapperColor: 'white' },
    { id: 5, title: 'dark', bodyColor: '#000000d1', wrapperColor: '#d2d2d2' },
    { id: 6, title: 'orange', bodyColor: '#ff8900d1', wrapperColor: '#ffd29d' },
  ],
  flag: false,
  chosenColor: '',
};

const ColorsSlice = createSlice({
  name: 'logic',
  initialState,
  reducers: {
    setColorFlag: (state) => {
      state.flag = !state.flag;
    },
    setChosenColor: (state, action: PayloadAction<string>) => {
      state.chosenColor = action.payload;
    },
  },
});

export const { setColorFlag, setChosenColor } = ColorsSlice.actions;
export default ColorsSlice.reducer;
