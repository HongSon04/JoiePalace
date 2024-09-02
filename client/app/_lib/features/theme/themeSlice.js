import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentTheme: "dark",
};

export const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    toggle(state) {
      state.currentTheme = state.currentTheme === "dark" ? "light" : "dark";
    },
  },
});

export const { toggle } = themeSlice.actions;

export default themeSlice.reducer;
