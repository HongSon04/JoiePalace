import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "https://joieplace.live/api/location";

const initialState = {
  branches: [],
  currentBranch: null,
  isLoading: false,
  error: null,
};

// Async thunk for posting location data
export const postBrach = createAsyncThunk(
  "location/postBrach",
  async (BrachData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}`, BrachData);
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
    setBranches: (state, action) => {
      state.branches = action.payload;
    },
    setCurrentBranch: (state, action) => {
      state.currentBranch = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(postBrach.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(postBrach.fulfilled, (state, action) => {
        state.isLoading = false;
        state.branches = action.payload;
      })
      .addCase(postBrach.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { setBranches, setCurrentBranch } = branchSlice.actions;
export default branchSlice;
