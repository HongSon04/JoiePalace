import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  feedbacks: [],
  isLoading: false,
  isApproving: false,
  isHiding: false,
  isError: false,
  error: null,
  categories: [
    { id: "requested", name: "Đã nhận", isApproved: false, isShow: true },
    { id: "approved", name: "Đã duyệt", isApproved: true, isShow: true },
  ],
  pagination: {},
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
      state.feedbacks = action.payload.data;
      state.pagination = action.payload.pagination;
    },
    fetchFeedbacksFailure: (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.error = action.payload;
    },
    approvingFeedbackRequest: (state) => {
      state.isApproving = true;
    },
    approvingFeedbackSuccess: (state, action) => {
      state.isApproving = false;
    },
    approvingFeedbackFailure: (state, action) => {
      state.isApproving = false;
      state.isError = true;
      state.error = action.payload;
    },
    hidingFeedbackRequest: (state) => {
      state.isHiding = true;
    },
    hidingFeedbackSuccess: (state, action) => {
      state.isHiding = false;
    },
    hidingFeedbackFailure: (state, action) => {
      state.isHiding = false;
      state.isError = true;
      state.error = action.payload;
    },
  },
});

export const {
  fetchFeedbacksRequest,
  fetchFeedbacksSuccess,
  fetchFeedbacksFailure,

  updatingFeedbackRequest,
  updatingFeedbackSuccess,
  updatingFeedbackFailure,

  approvingFeedbackRequest,
  approvingFeedbackSuccess,
  approvingFeedbackFailure,

  hidingFeedbackRequest,
  hidingFeedbackSuccess,
  hidingFeedbackFailure,
} = feedbacksSlice.actions;

export default feedbacksSlice;
