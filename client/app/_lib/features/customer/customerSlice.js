import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { makeAuthorizedRequest, API_CONFIG } from "@/app/_utils/api.config";

const initialState = {
  customers: [],
  pagination: {
    page: 1,
    itemsPerPage: 10,
    total: 0,
    lastPage: 1,
    nextPage: null,
    prevPage: null,
  },
  isFetchingCustomer: false,
  isFetchingError: false,
};

const customersSlice = createSlice({
  name: "customers",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllCustomers.pending, (state) => {
        state.isFetchingCustomer = true;
      })
      .addCase(fetchAllCustomers.fulfilled, (state, action) => {
        state.isFetchingCustomer = false;
        state.customers = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchAllCustomers.rejected, (state) => {
        state.isFetchingCustomer = false;
        state.isFetchingError = true;
      });
  },
});

export const fetchAllCustomers = createAsyncThunk(
  "customers/fetchAllCustomers",
  async ({ params, signal }, { rejectWithValue }) => {
    try {
      const result = await makeAuthorizedRequest(
        API_CONFIG.USER.GET_ALL(params),  
        "GET",
        null,
        { signal }
      );

      if (result.success) {
        return result; 
      } else {
        return rejectWithValue(result); 
      }
    } catch (error) {
      return rejectWithValue(error.message); 
    }
  }
);

export default customersSlice;
