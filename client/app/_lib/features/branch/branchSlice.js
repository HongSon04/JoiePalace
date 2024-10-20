import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  branches: [],
  currentBranch: JSON.parse(localStorage.getItem("currentBranch")) || null,
  isLoading: false,
  isError: false,
  errorMessage: null,
};

const branchSlice = createSlice({
  name: "branch",
  initialState,
  reducers: {
    loading: (state) => {
      state.isLoading = true;
    },
    error: (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.errorMessage = action.payload;
    },
    fetchBranchSuccess: (state, action) => {
      state.currentBranch = action.payload;
      state.isLoading = false;
      state.isError = false;
      state.errorMessage = null;
    },
    fetchBranchesSuccess: (state, action) => {
      state.branches = action.payload;
      state.isLoading = false;
      state.isError = false;
      state.errorMessage = null;
    },
  },
});

export const { fetchBranchesSuccess, fetchBranchSuccess, loading, error } =
  branchSlice.actions;
export default branchSlice;
