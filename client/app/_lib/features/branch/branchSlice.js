import { API_CONFIG, makeAuthorizedRequest } from "@/app/_utils/api.config";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// const getCurrentBranchFromLocalStorage = () => {
//   if (typeof window !== "undefined" && window.localStorage) {
//     return JSON.parse(localStorage.getItem("currentBranch")) || {};
//   }
//   return {};
// };

const initialState = {
  branches: [],
  // currentBranch: getCurrentBranchFromLocalStorage(),
  currentBranch: {},
  isLoading: false,
  isError: false,
  errorMessage: null,
  isFetchingBranches: false,
  isFetchingBranchesError: false,
  error: null,
};

const branchSlice = createSlice({
  name: "branch",
  initialState,
  reducers: {
    getCurrentBranch: (state, action) => {
      state.currentBranch = action.payload;
    },
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
  extraReducers: (builder) => {
    builder
      .addCase(getBranches.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getBranches.fulfilled, (state, action) => {
        state.branches = action.payload.data;
        state.isFetchingBranches = false;
        state.isFetchingBranchesError = false;
        state.errorMessage = null;
      })
      .addCase(getBranches.rejected, (state, action) => {
        state.isFetchingBranches = false;
        state.isFetchingBranchesError = true;
        state.errorMessage = action.payload;
      });
  },
});

export const getBranches = createAsyncThunk(
  "branch/getBranches",
  async ({ params, signal }, { dispatch, rejectWithValue }) => {
    try {
      const response = await makeAuthorizedRequest(
        API_CONFIG.BRANCHES.GET_ALL(params),
        "GET",
        null,
        { signal }
      );

      if (response.success) {
        return response;
      } else {
        return response;
      }
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const {
  fetchBranchesSuccess,
  fetchBranchSuccess,
  loading,
  error,
  getCurrentBranch,
} = branchSlice.actions;

export default branchSlice;
