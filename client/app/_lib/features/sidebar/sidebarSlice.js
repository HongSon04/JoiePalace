import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isSidebarOpen: false,
  size: "small",
};

const sidebarSlice = createSlice({
  name: "sidebar",
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.isSidebarOpen = !state.isSidebarOpen;
      state.size = state.isSidebarOpen ? "big" : "small";
    },
    openSidebar: (state) => {
      state.isSidebarOpen = true;
      state.size = "big";
    },
    closeSidebar: (state) => {
      state.isSidebarOpen = false;
      state.size = "small";
    },
  },
});

export const { toggleSidebar, openSidebar, closeSidebar } =
  sidebarSlice.actions;

export default sidebarSlice;
