import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type Posts = {
  title: string;
  date: string;
};

interface logicSlice {
  posts: Posts[];
  flag: boolean;
  title: string;
}

const initialState: logicSlice = {
  posts: [],
  flag: false,
  title: '',
};

const logicSlice = createSlice({
  name: 'logic',
  initialState,
  reducers: {
    setPosts: (state, action: PayloadAction<Posts[]>) => {
      state.posts = action.payload;
    },
    setFlag: (state) => {
      state.flag = !state.flag;
    },
    setTitle: (state, action: PayloadAction<string>) => {
      state.title = action.payload;
    },
  },
});

export const { setPosts, setFlag, setTitle } = logicSlice.actions;
export default logicSlice.reducer;
