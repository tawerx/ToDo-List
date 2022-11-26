import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FilesInfo } from '../../components/CreateNewNote';

export type Notes = {
  _id: string;
  title: string;
  description: string;
  date: string;
  dateCreate: string;
  files: FilesInfo[];
  complete: boolean;
  delay: boolean;
};

interface logicSlice {
  notes: Notes[];
}

const initialState: logicSlice = {
  notes: [],
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
      const findIndex = state.notes.findIndex((obj) => obj._id == action.payload);
      state.notes.splice(findIndex, 1);
    },
    setClear: (state) => {
      state.notes = [];
    },
    setUpdateNote: (state, action) => {
      const { _id, editTitle, editDesc, editDate, editFiles } = action.payload;
      const findNote = state.notes.findIndex((obj) => obj._id === _id);
      state.notes[findNote].title = editTitle;
      state.notes[findNote].description = editDesc;
      state.notes[findNote].date = editDate;
      state.notes[findNote].files = editFiles;
    },
    setDeleteFile: (state, action) => {
      const { noteId, files } = action.payload;

      const findNote = state.notes.findIndex((obj) => obj._id === noteId);
      state.notes[findNote].files = files;
    },
    setUpdateComplete: (state, action) => {
      const noteId = action.payload;
      const findNote = state.notes.findIndex((obj) => obj._id === noteId);
      state.notes[findNote].complete = true;
    },
    setUpdateDelay: (state, action) => {
      const noteId = action.payload;
      const findNote = state.notes.findIndex((obj) => obj._id === noteId);
      state.notes[findNote].delay = true;
    },
  },
});

export const {
  setNotes,
  addNewNote,
  deleteNote,
  setClear,
  setUpdateNote,
  setDeleteFile,
  setUpdateComplete,
  setUpdateDelay,
} = logicSlice.actions;
export default logicSlice.reducer;
