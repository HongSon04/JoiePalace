import { API_CONFIG, makeAuthorizedRequest } from "@/app/_utils/api.config";

const { createSlice, createAsyncThunk } = require("@reduxjs/toolkit");

const initialState = {
  beaverages: [],
  isFetchingBeaverages: false,
  isFetchingBeaveragesError: false,
  error: null,
};

const beaveragesSlice = createSlice({
  name: "beaverages",
  initialState,
  reducers: {
    getBeaverages: (state, action) => {
      state.beaverages = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getBeaverageById.pending, (state) => {
        state.isFetchingBeaverages = true;
        state.isFetchingBeaveragesError = false;
      })
      .addCase(getBeaverageById.fulfilled, (state, action) => {
        state.isFetchingBeaverages = false;
        state.isFetchingBeaveragesError = false;
        state.beaverages = action.payload;
      })
      .addCase(getBeaverageById.rejected, (state, action) => {
        state.isFetchingBeaverages = false;
        state.isFetchingBeaveragesError = action.error.message;
      });
  },
});

export const getBeaverageById = createAsyncThunk(
  "beaverages/getBeaverages",
  async (id) => {
    const response = await makeAuthorizedRequest(
      API_CONFIG.PRODUCTS.GET_BY_ID(id),
      "GET"
    );

    if (response?.success) return response?.data;
    else throw new Error(response?.message);
  }
);

export const { getBeaverages } = beaveragesSlice.actions;

export default beaveragesSlice;
