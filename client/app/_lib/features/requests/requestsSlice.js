import { API_CONFIG, makeAuthorizedRequest } from "@/app/_utils/api.config";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  requests: [],
  pagination: {
    page: 1,
    itemsPerPage: 10,
    total: 0,
    lastPage: 1,
    nextPage: null,
    prevPage: null,
  },
  error: null,
  selectedRequest: null,

  isFetchingRequests: false,
  isFetchingRequestsError: false,

  isUpdatingRequest: false,
  isUpdatingRequestError: false,

  isFetchingSelectedRequest: false,
  isFetchingSelectedRequestError: false,
};

const requestsSlice = createSlice({
  name: "requests",
  initialState,
  reducers: {
    setRequests(state, action) {
      state.requests = action.payload;
    },

    setFilter(state, action) {
      state.filter = action.payload;
    },

    fetchingSelectedRequest(state) {
      state.isLoading = true;
    },
    fetchingSelectedRequestSuccess(state, action) {
      state.selectedRequest = action.payload;
    },
    fetchingSelectedRequestFailure(state, action) {
      state.selectedRequest = action.payload;
    },

    fetchingRequests(state) {
      state.isFetchingRequests = true;
    },
    fetchingRequestsSuccess(state, action) {
      state.isFetchingRequests = false;
      state.isFetchingRequestsError = false;
      state.requests = action.payload.data;
      state.pagination = action.payload.pagination;
    },
    fetchingRequestsFailure(state, action) {
      state.isFetchingRequests = false;
      state.isFetchingRequestsError = true;
      state.error = action.payload;
    },

    updatingRequest(state) {
      state.isUpdatingRequest = true;
    },
    updatingRequestSuccess(state, action) {
      state.isUpdatingRequest = false;
      state.isUpdatingRequestError = false;
    },
    updatingRequestFailure(state) {
      state.isUpdatingRequest = false;
      state.isUpdatingRequestError = true;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetching category requests
      .addCase(fetchRequests.pending, (state) => {
        state.isFetchingRequests = true;
        state.isFetchingRequestsError = false;
        state.error = null;
      })
      .addCase(fetchRequests.fulfilled, (state, action) => {
        state.isFetchingRequests = false;
        state.isFetchingRequestsError = false;
        state.requests = action.payload.data;
        state.pagination = action.payload.pagination;
        state.error = null;
      })
      .addCase(fetchRequests.rejected, (state, action) => {
        state.isFetchingRequests = false;
        state.isFetchingRequestsError = true;
        state.error = action.payload;
      })
      // Updating a request
      .addCase(updateRequestStatus.pending, (state) => {
        state.isUpdatingRequest = true;
        state.isUpdatingRequestError = false;
      })
      .addCase(updateRequestStatus.fulfilled, (state, action) => {
        state.isUpdatingRequest = false;
        state.requests = state.requests.map((request) =>
          request.id === action.payload.id ? action.payload : request
        ); // Update the request in the state
        state.isUpdatingRequestError = false;
      })
      .addCase(updateRequestStatus.rejected, (state, action) => {
        state.isUpdatingRequest = false;
        state.isUpdatingRequestError = true;
        state.error = action.payload;
      })
      .addCase(fetchRequestsByBranch.pending, (state) => {
        state.isFetchingRequests = true;
        state.isFetchingRequestsError = false;
      })
      .addCase(fetchRequestsByBranch.fulfilled, (state, action) => {
        state.isFetchingRequests = false;
        state.isFetchingRequestsError = false;
        state.requests = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchRequestsByBranch.rejected, (state, action) => {
        state.isFetchingRequests = false;
        state.isFetchingRequestsError = true;
        state.error = action.payload;
      });
  },
});

// Fetch category requests
export const fetchRequests = createAsyncThunk(
  "requests/fetchRequests",
  async ({ params, signal }, { dispatch, rejectWithValue }) => {
    dispatch(fetchingRequests());

    const response = await makeAuthorizedRequest(
      API_CONFIG.BOOKINGS.GET_ALL(params),
      "GET",
      null,
      { signal }
    );
    
    // console.log("response from fetchRequests thunk -> ", response);
    if (response.success) {
      dispatch(fetchingRequestsSuccess(response));// Return the response for further use
      return response;
    } else {
      dispatch(fetchingRequestsFailure(response.error.message));
      return rejectWithValue(response.error.message);
    }
  }
);

// Update a request
export const updateRequestStatus = createAsyncThunk(
  "requests/updateRequestStatus",
  async ({ requestId, requestData }, { dispatch, rejectWithValue }) => {
    dispatch(updatingRequest());

    try {
      const response = await makeAuthorizedRequest(
        API_CONFIG.BOOKINGS.UPDATE_STATUS(requestId),
        "PATCH",
        requestData
      );

      console.log(response);

      if (response.success) {
        dispatch(updatingRequestSuccess(response));
      } else {
        dispatch(updatingRequestFailure(response));
      }

      return response;
    } catch (error) {
      dispatch(updatingRequestFailure(error));
      return rejectWithValue(error.message);
    }
  }
);

export const fetchRequestsByBranch = createAsyncThunk(
  "requests/fetchRequestsByBranch", 
  async ({ params, branchId, signal }, { dispatch, rejectWithValue }) => {
    dispatch(fetchingRequests());

    try {
      const response = await makeAuthorizedRequest(
        API_CONFIG.BOOKINGS.GET_ALL(params),
        "GET",
        null,
        { signal }
      );

      if (response.success) {
        const filteredBookings = branchId
          ? response.data.filter((booking) => booking.branch_id === branchId)
          : response.data;

        dispatch(
          fetchingRequestsSuccess({ ...response, data: filteredBookings })
        );
        return filteredBookings;
      } else {
        dispatch(fetchingRequestsFailure(response));
        return rejectWithValue(response.message);
      }
    } catch (error) {
      console.error("Error fetching requests:", error); // Log any errors
      dispatch(fetchingRequestsFailure(error));
      return rejectWithValue(error.message);
    }
  }
);
export const fetchRequestsBookingStage = createAsyncThunk(
  "requests/fetchRequestsByBranch", 
  async ({ params, branchId, signal }, { dispatch, rejectWithValue }) => {
    dispatch(fetchingRequests());

    try {
      const response = await makeAuthorizedRequest(
        API_CONFIG.BOOKINGS.GET_BOOKING_LIST(params),
        "GET",
        null,
        { signal }
      );

      if (response.success) {
        const filteredBookings = branchId
          ? response.data.filter((booking) => booking.branch_id === branchId)
          : response.data;

        dispatch(
          fetchingRequestsSuccess({ ...response, data: filteredBookings })
        );
        return filteredBookings;
      } else {
        dispatch(fetchingRequestsFailure(response));
        return rejectWithValue(response.message);
      }
    } catch (error) {
      console.error("Error fetching requests:", error); // Log any errors
      dispatch(fetchingRequestsFailure(error));
      return rejectWithValue(error.message);
    }
  }
);

export const {
  setRequests,
  setFilter,
  setSelectedRequest,

  fetchingRequests,
  fetchingRequestsSuccess,
  fetchingRequestsFailure,

  updatingRequest,
  updatingRequestSuccess,
  updatingRequestFailure,

  fetchingSelectedRequest,
  fetchingSelectedRequestSuccess,
  fetchingSelectedRequestFailure,
} = requestsSlice.actions;

export default requestsSlice;
