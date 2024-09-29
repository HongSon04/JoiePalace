import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  branches: [],
  currentBranch: null,
};

const branchSlice = createSlice({
  name: "branch",
  initialState,
  reducers: {
    setBranches: (state, action) => {
      state.branches = action.payload;
    },
    setCurrentBranch: (state, action) => {
      state.currentBranch = action.payload;
    },
  },
});

export const { setBranches, setCurrentBranch } = branchSlice.actions;
export default branchSlice;
