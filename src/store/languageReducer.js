import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  lang: "en",
};

const lang_reducer = createSlice({
  initialState,
  name: "language",
  reducers: {
    updateLanguage: (state, action) => {
      state.lang = action.payload;
    },
  },
});

export const { updateLanguage } = lang_reducer.actions;
export default lang_reducer.reducer;
