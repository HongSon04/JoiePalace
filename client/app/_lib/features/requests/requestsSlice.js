import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  requests: [],
  selectedRequest: null,
  filter: 1,
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

    setSelectedRequest(state, action) {
      state.selectedRequest = action.payload;
    },

    updateRequest(state, action) {
      // LATER with thunk middleware and API
    },
  },
});

export const { setRequests, setFilter, setSelectedRequest } =
  requestsSlice.actions;

export default requestsSlice;
