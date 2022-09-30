import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type Notes = {
  id: string;
  value: string;
  date: string;
};

interface logicSlice {
  notes: Notes[];
  flag: boolean;
  title: string;
}

const initialState: logicSlice = {
  notes: [],
  flag: false,
  title: '',
};

const logicSlice = createSlice({
  name: 'logic',
  initialState,
  reducers: {
    setNotes: (state, action: PayloadAction<Notes[]>) => {
      state.notes = action.payload;
    },
    addNewNote: (state, action: PayloadAction<Notes>) => {
      state.notes.push(action.payload);
    },
    deleteNote: (state, action: PayloadAction<string>) => {
      const findIndex = state.notes.findIndex((obj) => obj.id == action.payload);
      state.notes.splice(findIndex, 1);
    },
    setFlag: (state) => {
      state.flag = !state.flag;
    },
    setTitle: (state, action: PayloadAction<string>) => {
      state.title = action.payload;
    },
    setClear: (state) => {
      state.notes = [];
    },
  },
});

export const { setNotes, setFlag, setTitle, addNewNote, deleteNote, setClear } = logicSlice.actions;
export default logicSlice.reducer;
