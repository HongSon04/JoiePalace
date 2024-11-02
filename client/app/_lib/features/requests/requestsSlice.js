import { createSlice } from "@reduxjs/toolkit";

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
    fetchingRequestFailure(state) {
      state.isFetchingRequests = false;
      state.isFetchingRequestsError = true;
    },

    updatingRequest(state) {
      state.isUpdatingRequest = true;
    },
    updatingRequestSuccess(state) {
      state.isUpdatingRequest = false;
      state.isUpdatingRequestError = false;
    },
    updatingRequestFailure(state) {
      state.isUpdatingRequest = false;
      state.isUpdatingRequestError = true;
    },
  },
});

export const {
  setRequests,
  setFilter,
  setSelectedRequest,

  fetchingRequests,
  fetchingRequestsSuccess,
  fetchingRequestFailure,

  updatingRequest,
  updatingRequestSuccess,
  updatingRequestFailure,

  fetchingSelectedRequest,
  fetchingSelectedRequestSuccess,
  fetchingSelectedRequestFailure,
} = requestsSlice.actions;

export default requestsSlice;
