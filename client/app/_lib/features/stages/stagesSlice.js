import { API_CONFIG, makeAuthorizedRequest } from "@/app/_utils/api.config";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  stages: [],
  pagination: {
    page: 1,
    total: 0,
    itemsPerPage: 10,
    lastPage: 1,
    nextPage: null,
    prevPage: null,
  },

  error: null,

  isFetchingStages: false,
  isFetchingStagesError: false,

  isUpdatingStage: false,
  isUpdatingStageError: false,

  isCreatingStage: false,
  isCreatingStageError: false,

  isDeletingStage: false,
  isDeletingStageError: false,
};

const stagesSlice = createSlice({
  name: "stages",
  initialState,
  reducers: {
    fetchingStages: (state) => {
      state.isFetchingStages = true;
      state.isFetchingStagesError = false;
      state.error = null;
    },
    fetchingStagesSuccess: (state, action) => {
      // console.log("success action -> ", action);

      state.isFetchingStages = false;
      state.stages = action.payload.data;
      state.pagination = action.payload.pagination;
      state.isFetchingStagesError = false;
      state.error = null;
    },
    fetchingStagesFailure: (state, action) => {
      // console.log("failure action -> ", action);
      state.isFetchingStages = false;
      state.isFetchingStagesError = true;
    },

    updatingStage: (state) => {
      state.isUpdatingStage = true;
      state.isUpdatingStageError = false;
    },
    updatingStageSuccess: (state) => {
      state.isUpdatingStage = false;
    },
    updatingStageFailure: (state) => {
      state.isUpdatingStage = false;
      state.isUpdatingStageError = true;
    },

    creatingStage: (state) => {
      state.isCreatingStage = true;
      state.isCreatingStageError = false;
    },
    creatingStageSuccess: (state) => {
      state.isCreatingStage = false;
    },
    creatingStageFailure: (state) => {
      state.isCreatingStage = false;
      state.isCreatingStageError = true;
    },

    deletingStage: (state) => {
      state.isDeletingStage = true;
      state.isDeletingStageError = false;
    },
    deletingStageSuccess: (state) => {
      state.isDeletingStage = false;
    },
    deletingStageFailure: (state) => {
      state.isDeletingStage = false;
      state.isDeletingStageError = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStages.pending, (state) => {
        state.isFetchingStages = true;
        state.isFetchingStagesError = false;
        state.error = null;
      })
      .addCase(fetchStages.fulfilled, (state, action) => {
        state.isFetchingStages = false;
        console.log(action.payload);
        state.stages = action.payload;
        // state.pagination = action.payload.pagination;
        state.isFetchingStagesError = false;
        state.error = null;
      })
      .addCase(fetchStages.rejected, (state, action) => {
        state.isFetchingStages = false;
        state.isFetchingStagesError = true;
        state.error = action.payload;
      });

    builder
      .addCase(updateStage.pending, (state) => {
        state.isUpdatingStage = true;
        state.isUpdatingStageError = false;
        state.error = null;
      })
      .addCase(updateStage.fulfilled, (state) => {
        state.isUpdatingStage = false;
        state.isUpdatingStageError = false;
        state.error = null;
      })
      .addCase(updateStage.rejected, (state, action) => {
        state.isUpdatingStage = false;
        state.isUpdatingStageError = true;
        state.error = action.payload;
      });

    builder
      .addCase(createStage.pending, (state) => {
        state.isCreatingStage = true;
        state.isCreatingStageError = false;
        state.error = null;
      })
      .addCase(createStage.fulfilled, (state) => {
        state.isCreatingStage = false;
        state.isCreatingStageError = false;
        state.error = null;
      })
      .addCase(createStage.rejected, (state, action) => {
        state.isCreatingStage = false;
        state.isCreatingStageError = true;
        state.error = action.payload;
      });

    builder
      .addCase(deleteStage.pending, (state) => {
        state.isDeletingStage = true;
        state.isDeletingStageError = false;
        state.error = null;
      })
      .addCase(deleteStage.fulfilled, (state) => {
        state.isDeletingStage = false;
        state.isDeletingStageError = false;
        state.error = null;
      })
      .addCase(deleteStage.rejected, (state, action) => {
        state.isDeletingStage = false;
        state.isDeletingStageError = true;
        state.error = action.payload;
      });
  },
});

export const fetchStages = createAsyncThunk(
  "stages/fetchStages",
  async ({ params = {}, signal }, { dispatch, rejectWithValue }) => {
    const category = await makeAuthorizedRequest(
      API_CONFIG.CATEGORIES.GET_BY_SLUG(API_CONFIG.STAGE_CATEGORY_SLUG),
      "GET",
      null,
      { signal }
    );

    console.log(category);

    if (category.success) {
      return category.data.at(0).products;
    } else {
      return rejectWithValue(category);
    }
  }
);

export const updateStage = createAsyncThunk(
  "stages/updateStage",
  async ({ id, data }, { dispatch, rejectWithValue }) => {
    dispatch(updatingStage());

    const response = await makeAuthorizedRequest(
      API_CONFIG.PRODUCTS.UPDATE(id),
      "PATCH",
      data
    );

    if (response.success) {
      dispatch(updatingStageSuccess());
      return response.data;
    } else {
      dispatch(updatingStageFailure());
      return rejectWithValue(response);
    }
  }
);

export const createStage = createAsyncThunk(
  "stages/createStage",
  async ({ data }, { dispatch, rejectWithValue }) => {
    dispatch(creatingStage());

    const response = await makeAuthorizedRequest(
      API_CONFIG.PRODUCTS.CREATE,
      "POST",
      data
    );

    if (response.success) {
      dispatch(creatingStageSuccess());
      return response.data;
    } else {
      dispatch(creatingStageFailure());
      return rejectWithValue(response);
    }
  }
);

export const deleteStage = createAsyncThunk(
  "stages/deleteStage",
  async ({ id }, { dispatch, rejectWithValue }) => {
    dispatch(deletingStage());

    const response = await makeAuthorizedRequest(
      API_CONFIG.PRODUCTS.DELETE(id),
      "DELETE"
    );

    if (response.success) {
      dispatch(deletingStageSuccess());
      return response.data;
    } else {
      dispatch(deletingStageFailure());
      return rejectWithValue(response);
    }
  }
);

export const {
  fetchingStages,
  fetchingStagesSuccess,
  fetchingStagesFailure,

  updatingStage,
  updatingStageSuccess,
  updatingStageFailure,

  creatingStage,
  creatingStageSuccess,
  creatingStageFailure,

  deletingStage,
  deletingStageSuccess,
  deletingStageFailure,
} = stagesSlice.actions;

export default stagesSlice;
