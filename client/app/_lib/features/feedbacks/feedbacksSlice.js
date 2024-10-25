import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  feedbacks: [],
  isLoading: false,
  isError: false,
  categories: [
    { id: "requested", name: "Đã nhận" },
    { id: "approved", name: "Đã duyệt" },
  ],
};

const feedbacksSlice = createSlice({
  name: "feedbacks",
  initialState,
  reducers: {
    fetchFeedbacksRequest: (state) => {
      state.isLoading = true;
    },
    fetchFeedbacksSuccess: (state, action) => {
      state.isLoading = false;
      state.feedbacks = action.payload;
    },
    fetchFeedbacksFailure: (state) => {
      state.isLoading = false;
      state.isError = true;
    },
  },
});

export const {
  fetchFeedbacksRequest,
  fetchFeedbacksSuccess,
  fetchFeedbacksFailure,
} = feedbacksSlice.actions;

export default feedbacksSlice;
