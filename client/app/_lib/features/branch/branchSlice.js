import { API_CONFIG } from "@/app/_utils/api.config";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  branches: [],
  currentBranch: null,
  isLoading: false,
  isError: false,
  errorMessage: null,
};

// Async thunk for posting location data
export const postBrach = createAsyncThunk(
  "location/postBrach",
  async (BrachData, { rejectWithValue }) => {
    try {
      const response = await axios.post(API_CONFIG.BRANCHES.GET_ALL, BrachData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

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
