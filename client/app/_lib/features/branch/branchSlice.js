import { API_CONFIG } from "@/app/_utils/api.config";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  branches: [],
  currentBranch: null,
  loading: false,
  error: null,
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
      state.loading = true;
    },
    error: (state, action) => {
      state.error = action.payload;
    },
    setBranches: (state, action) => {
      state.branches = action.payload;
    },
    setCurrentBranch: (state, action) => {
      state.currentBranch = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getBranches.fulfilled, (state, action) => {
      state.branches = action.payload;
      state.loading = false;
    });
    builder.addCase(getBranches.rejected, (state, action) => {
      state.error = action.error.message;
      state.loading = false;
    });
  },
});

export const getBranches = createAsyncThunk("branch/getBranches", async () => {
  try {
    const res = await axios.get(API_CONFIG.BRANCHES.GET_ALL);
    return res.data;
  } catch (error) {
    return error.message;
  }
});

export const { setBranches, setCurrentBranch } = branchSlice.actions;
export default branchSlice;
