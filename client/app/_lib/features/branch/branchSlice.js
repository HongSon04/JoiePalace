import { API_CONFIG } from "@/app/_utils/api.config";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  branches: [],
  currentBranch: null,
  loading: false,
  error: null,
};

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

    builder
      .addCase(postBranch.pending, (state) => {
        state.loading = true; 
        state.error = null; 
      })
      .addCase(postBranch.fulfilled, (state, action) => {
        state.branches = action.payload;
        state.loading = false; 
      })
      .addCase(postBranch.rejected, (state, action) => {
        state.error = action.error.message; 
        state.loading = false;
      });
  },
});

// Async thunk for Branch data
export const postBranch = createAsyncThunk(
  "location/postBranch",
  async (BranchData, { rejectWithValue }) => {
    try {
      const response = await axios.post(API_CONFIG.BRANCHES.CREATE, BranchData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

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
