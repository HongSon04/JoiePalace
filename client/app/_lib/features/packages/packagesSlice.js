import { API_CONFIG, makeAuthorizedRequest } from "@/app/_utils/api.config";

const { createSlice, createAsyncThunk } = require("@reduxjs/toolkit");

const initialState = {
  packages: [],
  isLoading: false,
  isError: null,
  error: null,
  isCreatingPakage: false,
  isCreatingPakageError: null,
};

const packagesSlice = createSlice({
  name: "packages",
  initialState,
  reducers: {
    fetchPackagesRequest: (state) => {
      state.isLoading = true;
    },
    fetchPackagesSuccess: (state, action) => {
      state.isLoading = false;
      state.packages = action.payload;
    },
    fetchPackagesFailure: (state, action) => {
      state.isLoading = false;
      state.isError = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createPackage.pending, (state) => {
        state.isCreatingPakage = true;
        state.isCreatingPakageError = false;
        state.error = null;
      })
      .addCase(createPackage.fulfilled, (state, action) => {
        state.isCreatingPakage = false;
        state.packages.push(action.payload);
      })
      .addCase(createPackage.rejected, (state, action) => {
        state.isCreatingPakage = false;
        state.isCreatingPakageError = true;
        state.error = action.payload;
      });
  },
});

export const createPackage = createAsyncThunk(
  "packages/createPackage",
  async (data, { rejectWithValue }) => {
    try {
      const response = await makeAuthorizedRequest(
        API_CONFIG.PACKAGES.CREATE,
        "POST",
        data
      );

      if (response.success) {
        return response;
      } else {
        return response;
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const {
  fetchPackagesRequest,
  fetchPackagesSuccess,
  fetchPackagesFailure,
} = packagesSlice.actions;

export default packagesSlice;
