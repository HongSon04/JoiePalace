import { API_CONFIG, makeAuthorizedRequest } from "@/app/_utils/api.config";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  decors: [],
  pagination: {
    itemsPerPage: 10,
    currentPage: 1,
    total: 0,
    lastPage: 1,
    nextPage: null,
    prevPage: null,
  },

  error: null,

  isFetchingDecors: false,
  isFetchingDecorsError: false,

  isUpdatingDecors: false,
  isUpdatingDecorsError: false,

  isAddingDecors: false,
  isAddingDecorsError: false,

  isDeletingDecors: false,
  isDeletingDecorsError: false,
};

const decorsSlice = createSlice({
  name: "decors",
  initialState,
  reducers: {
    fetchingDecors(state) {
      state.isFetchingDecors = true;
      state.isFetchingDecorsError = false;
    },
    fetchingDecorsSuccess(state, action) {
      state.isFetchingDecors = false;
      state.decors = action.payload.data;
      state.pagination = action.payload.pagination;
    },
    fetchingDecorsFailure(state, action) {
      state.isFetchingDecors = false;
      state.isFetchingDecorsError = true;
      state.error = action.payload;
    },

    updatingDecors(state) {
      state.isUpdatingDecors = true;
      state.isUpdatingDecorsError = false;
    },
    updatingDecorsSuccess(state, action) {
      state.isUpdatingDecors = false;
      state.decors = state.decors.map((decor) =>
        decor.id === action.payload.id ? action.payload : decor
      );
    },
    updatingDecorsFailure(state, action) {
      state.isUpdatingDecors = false;
      state.isUpdatingDecorsError = true;
      state.error = action.payload;
    },

    addingDecors(state) {
      state.isAddingDecors = true;
      state.isAddingDecorsError = false;
    },
    addingDecorsSuccess(state, action) {
      state.isAddingDecors = false;
      state.decors = [action.payload, ...state.decors];
    },
    addingDecorsFailure(state, action) {
      state.isAddingDecors = false;
      state.isAddingDecorsError = true;
      state.error = action.payload;
    },

    deletingDecors(state) {
      state.isDeletingDecors = true;
      state.isDeletingDecorsError = false;
    },
    deletingDecorsSuccess(state, action) {
      state.isDeletingDecors = false;
      state.decors = state.decors.filter(
        (decor) => decor.id !== action.payload
      );
    },
    deletingDecorsFailure(state, action) {
      state.isDeletingDecors = false;
      state.isDeletingDecorsError = true;
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDecors.pending, (state, action) => {
        state.isFetchingDecors = true;
        state.isFetchingDecorsError = false;
        state.error = null;
      })
      .addCase(fetchDecors.fulfilled, (state, action) => {
        state.isFetchingDecors = false;
        state.decors = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchDecors.rejected, (state, action) => {
        state.isFetchingDecors = false;
        state.isFetchingDecorsError = true;
        state.error = action.payload;
      });
  },
});

export const fetchDecors = createAsyncThunk(
  "decors/fetchDecors",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const response = await makeAuthorizedRequest(
        API_CONFIG.DECORS.GET_ALL(),
        "GET",
        null
      );

      console.log(response);

      if (response.success) {
        return response;
      } else {
        return rejectWithValue(response.error);
      }
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);

export const updateDecor = createAsyncThunk(
  "decors/updateDecor",
  async (decor, { dispatch, rejectWithValue }) => {
    try {
      const response = await makeAuthorizedRequest(
        API_CONFIG.DECORS.UPDATE(decor.id),
        "PUT",
        decor
      );

      if (response.success) {
        return response.data;
      } else {
        return rejectWithValue(response.error);
      }
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);

export const addDecor = createAsyncThunk(
  "decors/addDecor",
  async (decor, { dispatch, rejectWithValue }) => {
    try {
      const response = await makeAuthorizedRequest(
        API_CONFIG.DECORS.ADD(),
        "POST",
        decor
      );

      if (response.success) {
        return response.data;
      } else {
        return rejectWithValue(response.error);
      }
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);

export const deleteDecor = createAsyncThunk(
  "decors/deleteDecor",
  async (decorId, { dispatch, rejectWithValue }) => {
    try {
      const response = await makeAuthorizedRequest(
        API_CONFIG.DECORS.DELETE(decorId),
        "DELETE",
        null
      );

      if (response.success) {
        return decorId;
      } else {
        return rejectWithValue(response.error);
      }
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);

export const {
  fetchingDecors,
  fetchingDecorsSuccess,
  fetchingDecorsFailure,

  updatingDecors,
  updatingDecorsSuccess,
  updatingDecorsFailure,

  addingDecors,
  addingDecorsSuccess,
  addingDecorsFailure,

  deletingDecors,
  deletingDecorsSuccess,
  deletingDecorsFailure,
} = decorsSlice.actions;

export default decorsSlice;
