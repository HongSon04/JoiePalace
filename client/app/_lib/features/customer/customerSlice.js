import { API_CONFIG, makeAuthorizedRequest } from "@/app/_utils/api.config";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Initial state for customers and top users
const initialState = {
    customers: [],
    topUsers: [],
    pagination: {
        page: 1,
        itemsPerPage: 10,
        total: 0,
        lastPage: 1,
        nextPage: null,
        prevPage: null,
    },
    isFetchingCustomer: false,
    isFetchingTopUsers: false,
    isFetchingError: false,
};

const customersSlice = createSlice({
    name: 'customers',
    initialState,
    reducers: {
        fetchCustomersRequest(state) {
            state.isFetchingCustomer = true;
            state.isFetchingError = false;
        },
        fetchCustomersSuccess(state, action) {
            state.isFetchingCustomer = false;
            state.customers = action.payload.data;
            state.pagination = action.payload.pagination;
        },
        fetchCustomersError(state) {
            state.isFetchingCustomer = false;
            state.isFetchingError = true;
        },
        fetchTopUsersRequest(state) {
            state.isFetchingTopUsers = true;
            state.isFetchingError = false;
        },
        fetchTopUsersSuccess(state, action) {
            state.isFetchingTopUsers = false;
            state.topUsers = action.payload.data;
        },
        fetchTopUsersError(state) {
            state.isFetchingTopUsers = false;
            state.isFetchingError = true;
        },
    },
    extraReducers: builder => {
        builder
            // Handling customers fetching
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
            })
            
            // Handling top users fetching
            .addCase(fetchTopUsers.pending, (state) => {
                state.isFetchingTopUsers = true;
            })
            .addCase(fetchTopUsers.fulfilled, (state, action) => {
                state.isFetchingTopUsers = false;
                state.topUsers = action.payload.data;
            })
            .addCase(fetchTopUsers.rejected, (state) => {
                state.isFetchingTopUsers = false;
                state.isFetchingError = true;
            });
    }
});

// Async Thunk for fetching all customers (pagination, etc.)
export const fetchAllCustomers = createAsyncThunk(
    "customers/fetchAllCustomers",
    async ({ params, signal }, { rejectWithValue }) => {
        try {
            const result = await makeAuthorizedRequest(
                API_CONFIG.USER.GET_ALL(params), // Call API to get all customers with pagination
                "GET",
                null,
                { signal }
            );
            
            if (result.success) {
                return result; // Return all customer data
            } else {
                return rejectWithValue(result); // Handle failure
            }
        } catch (error) {
            return rejectWithValue(error.message); // Handle errors
        }
    }
);

// Async Thunk for fetching top customers (no pagination, just top users)
export const fetchTopUsers = createAsyncThunk(
    "topUsers/fetchTopUsers",
    async ({ signal }, { rejectWithValue }) => {
        try {
            const result = await makeAuthorizedRequest(
                API_CONFIG.USER.GET_ALL({ itemsPerPage: 100000 }), 
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

const {
    fetchCustomersRequest,
    fetchCustomersSuccess,
    fetchCustomersError,
} = customersSlice.actions;

export default customersSlice;
