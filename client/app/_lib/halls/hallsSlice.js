import { API_CONFIG, makeAuthorizedRequest } from "@/app/_utils/api.config";

const { createSlice, createAsyncThunk } = require("@reduxjs/toolkit");

const initialState = {
  halls: [],
  pagination: {},
  error: null,
  isFetchingHalls: false,
  isFetchingHallsError: false,
  isCreatingHall: false,
  isCreatingHallError: false,
  isUpdatingHall: false,
  isUpdatingHallError: false,
  isDeletingHall: false,
  isDeletingHallError: false,
};

const hallsSlice = createSlice({
  name: "halls",
  initialState,
  reducers: {
    fetchingHalls(state) {
      state.isFetchingHalls = true;
      state.isFetchingHallsError = false;
    },
    fetchingHallsSuccess(state, action) {
      state.isFetchingHalls = false;
      state.halls = action.payload.data;
      state.pagination = action.payload.pagination;
    },
    fetchingHallsFailure(state) {
      state.isFetchingHalls = false;
      state.isFetchingHallsError = true;
    },

    creatingHall(state) {
      state.isCreatingHall = true;
      state.isCreatingHallError = false;
    },
    creatingHallSuccess(state, action) {
      state.isCreatingHall = false;
      state.halls.push(action.payload);
    },
    creatingHallFailure(state) {
      state.isCreatingHall = false;
      state.isCreatingHallError = true;
    },

    updatingHall(state) {
      state.isUpdatingHall = true;
      state.isUpdatingHallError = false;
    },
    updatingHallSuccess(state, action) {
      state.isUpdatingHall = false;
      state.halls = state.halls.map((hall) =>
        hall.id === action.payload.id ? action.payload : hall
      );
    },
    updatingHallFailure(state) {
      state.isUpdatingHall = false;
      state.isUpdatingHallError = true;
    },

    deletingHall(state) {
      state.isDeletingHall = true;
      state.isDeletingHallError = false;
    },
    deletingHallSuccess(state, action) {
      state.isDeletingHall = false;
      state.halls = state.halls.filter((hall) => hall.id !== action.payload);
    },
    deletingHallFailure(state) {
      state.isDeletingHall = false;
      state.isDeletingHallError = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchHalls.pending, (state) => {
        state.isFetchingHalls = true;
        state.isFetchingHallsError = false;
        state.error = null;
      })
      .addCase(fetchHalls.fulfilled, (state, action) => {
        state.isFetchingHalls = false;
        state.halls = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchHalls.rejected, (state, action) => {
        state.isFetchingHalls = false;
        state.isFetchingHallsError = true;
        state.error = action.payload;
      });

    builder
      .addCase(createHall.pending, (state) => {
        state.isCreatingHall = true;
        state.isCreatingHallError = false;
      })
      .addCase(createHall.fulfilled, (state, action) => {
        state.isCreatingHall = false;
        state.halls.push(action.payload);
      })
      .addCase(createHall.rejected, (state) => {
        state.isCreatingHall = false;
        state.isCreatingHallError = true;
      });

    builder
      .addCase(updateHall.pending, (state) => {
        state.isUpdatingHall = true;
        state.isUpdatingHallError = false;
        state.error = null;
      })
      .addCase(updateHall.fulfilled, (state, action) => {
        state.isUpdatingHall = false;
        state.halls = state.halls.map((hall) =>
          hall.id === action.payload.id ? action.payload : hall
        );
      })
      .addCase(updateHall.rejected, (state, action) => {
        state.isUpdatingHall = false;
        state.isUpdatingHallError = true;
        state.error = action.payload;
      });

    builder
      .addCase(deleteHall.pending, (state) => {
        state.isDeletingHall = true;
        state.isDeletingHallError = false;
      })
      .addCase(deleteHall.fulfilled, (state, action) => {
        state.isDeletingHall = false;
        state.halls = state.halls.filter((hall) => hall.id !== action.payload);
      })
      .addCase(deleteHall.rejected, (state, action) => {
        state.isDeletingHall = false;
        state.isDeletingHallError = true;
        state.error = action.payload;
      });
  },
});

export const fetchHalls = createAsyncThunk(
  "halls/fetchHall",
  async (payload, { dispatch, rejectWithValue }) => {
    try {
      const response = await makeAuthorizedRequest(
        API_CONFIG.STAGES.GET_ALL(payload.id),
        "GET"
      );

      if (response.success) {
        return response;
      } else {
        return rejectWithValue({ error: response.error });
      }
    } catch (error) {
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  }
);

export const createHall = createAsyncThunk(
  "halls/createHall",
  async (data, { dispatch, rejectWithValue }) => {
    dispatch(creatingHall());

    try {
      const response = await makeAuthorizedRequest(
        API_CONFIG.HALLS.CREATE,
        "POST",
        data
      );

      if (response.success) {
        return response;
      } else {
        return rejectWithValue(response.error);
      }
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const updateHall = createAsyncThunk(
  "halls/updateHall",
  async (data, { dispatch, rejectWithValue }) => {
    dispatch(updatingHall());

    try {
      const response = await makeAuthorizedRequest(
        API_CONFIG.HALLS.UPDATE(data.id),
        "PATCH",
        data
      );

      if (response.success) {
        return response;
      } else {
        return rejectWithValue(response.error);
      }
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const deleteHall = createAsyncThunk(
  "halls/deleteHall",
  async (id, { dispatch, rejectWithValue }) => {
    dispatch(deletingHall());

    try {
      const response = await makeAuthorizedRequest(
        API_CONFIG.HALLS.DELETE(id),
        "DELETE"
      );

      if (response.success) {
        return response;
      } else {
        return rejectWithValue(response.error);
      }
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const {
  fetchingHalls,
  fetchingHallsSuccess,
  fetchingHallsFailure,

  creatingHall,
  creatingHallSuccess,
  creatingHallFailure,

  updatingHall,
  updatingHallSuccess,
  updatingHallFailure,

  deletingHall,
  deletingHallSuccess,
  deletingHallFailure,
} = hallsSlice.actions;

export default hallsSlice;
