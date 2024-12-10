import { API_CONFIG, makeAuthorizedRequest } from "@/app/_utils/api.config";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  decors: [],
  pagination: {
    page: 1,
    total: 0,
    itemsPerPage: 10,
    lastPage: 1,
    nextPage: null,
    prevPage: null,
  },

  error: null,

  isFetchingDecors: false,
  isFetchingDecorsError: false,

  isUpdateDecors: false,
  isUpdateDecorsError: false,

  isCreatingDecors: false,
  isCreatingDecorsError: false,

  isDeletingDecors: false,
  isDeletingDecorsError: false,
};

const productsSlice = createSlice({
  name: "decors",
  initialState,
  reducers: {
    fetchingDecors: (state) => {
      state.isFetchingDecors = true;
      state.isFetchingDecorsError = false;
      state.error = null;
    },
    fetchingDecorsSuccess: (state, action) => {
      // console.log("success action -> ", action);

      state.isFetchingDecors = false;
      state.decors = action.payload.data;
      state.pagination = action.payload.pagination;
      state.isFetchingDecorsError = false;
      state.error = null;
    },
    fetchingProductsFailure: (state, action) => {
      // console.log("failure action -> ", action);
      state.isFetchingDecors = false;
      state.isFetchingDecorsError = true;
    },

    updatingDecors: (state) => {
      state.isUpdateDecors = true;
      state.isUpdateDecorsError = false;
    },
    updatingDecorsSuccess: (state) => {
      state.isUpdateDecors = false;
    },
    updatingDecorsFailure: (state) => {
      state.isUpdateDecors = false;
      state.isUpdateDecorsError = true;
    },

    creatingDecors: (state) => {
      state.isCreatingDecors = true;
      state.isCreatingDecorsError = false;
    },
    creatingDecorsSuccess: (state) => {
      state.isCreatingDecors = false;
    },
    creatingDecorsFailure: (state) => {
      state.isCreatingDecors = false;
      state.isCreatingDecorsError = true;
    },

    deletingDecors: (state) => {
      state.isDeletingDecors = true;
      state.isDeletingDecorsError = false;
    },
    deletingDecorsSuccess: (state) => {
      state.isDeletingDecors = false;
    },
    deletingDecorsFailure: (state) => {
      state.isDeletingDecors = false;
      state.isDeletingDecorsError = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDecors.pending, (state) => {
        state.isFetchingDecors = true;
        state.isFetchingDecorsError = false;
        state.error = null;
      })
      .addCase(fetchDecors.fulfilled, (state, action) => {
        state.isFetchingDecors = false;
        state.decors = action.payload.data;
        state.pagination = action.payload.pagination;
        state.isFetchingDecorsError = false;
        state.error = null;
      })
      .addCase(fetchDecors.rejected, (state, action) => {
        state.isFetchingDecors = false;
        state.isFetchingDecorsError = true;
        state.error = action.payload;
      });

    builder
      .addCase(updateProduct.pending, (state) => {
        state.isUpdateDecors = true;
        state.isUpdateDecorsError = false;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state) => {
        state.isUpdateDecors = false;
        state.isUpdateDecorsError = false;
        state.error = null;
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.isUpdateDecors = false;
        state.isUpdateDecorsError = true;
        state.error = action.payload;
      });

    builder
      .addCase(createProduct.pending, (state) => {
        state.isCreatingDecors = true;
        state.isCreatingDecorsError = false;
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state) => {
        state.isCreatingDecors = false;
        state.isCreatingDecorsError = false;
        state.error = null;
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.isCreatingDecors = false;
        state.isCreatingDecorsError = true;
        state.error = action.payload;
      });

    builder
      .addCase(deleteProduct.pending, (state) => {
        state.isDeletingDecors = true;
        state.isDeletingDecorsError = false;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state) => {
        state.isDeletingDecors = false;
        state.isDeletingDecorsError = false;
        state.error = null;
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.isDeletingDecors = false;
        state.isDeletingDecorsError = true;
        state.error = action.payload;
      });

    builder
      .addCase(fetchProductByCategorySlug.pending, (state) => {
        state.isFetchingDecors = true;
        state.isFetchingDecorsError = false;
        state.error = null;
      })
      .addCase(fetchProductByCategorySlug.fulfilled, (state, action) => {
        state.isFetchingDecors = false;
        // console.log("fetchProductByCategorySlug payload -> ", action.payload);
        state.decors = action.payload.data;
        state.pagination = action.payload.pagination;
        state.isFetchingDecorsError = false;
        state.error = null;
      })
      .addCase(fetchProductByCategorySlug.rejected, (state, action) => {
        state.isFetchingDecors = false;
        state.isFetchingDecorsError = true;
        state.error = action.payload;
      });
  },
});

export const fetchDecors = createAsyncThunk(
  "decors/fetchDecors",
  async ({ params = {}, signal }, { dispatch, rejectWithValue }) => {
    // console.log("fetching decors");

    const response = await makeAuthorizedRequest(
      API_CONFIG.DECORS.GET_ALL(params),
      "GET",
      null,
      { signal }
    );

    // console.log("response form thunk -> ", response);

    if (response.success) {
      dispatch(fetchingDecorsSuccess(response));
      return response;
    } else {
      dispatch(fetchingProductsFailure());
      return rejectWithValue(response);
    }
  }
);

export const fetchDecorsDetail = createAsyncThunk(
  "decors/fetchDecorsDetail",
  async ({ id }, { dispatch, rejectWithValue }) => {
    const response = await makeAuthorizedRequest(
      API_CONFIG.DECORS.GET_BY_ID(id),
      "GET"
    );

    if (response.success) {
      return response.data;
    } else {
      return rejectWithValue(response);
    }
  }
);

export const fetchProductByCategory = createAsyncThunk(
  "decors/fetchProductByCategory",
  async ({ category, params = {} }, { dispatch, rejectWithValue }) => {
    const response = await makeAuthorizedRequest(
      API_CONFIG.DECORS.GET_BY_CATEGORY(category, params),
      "GET"
    );

    if (response.success) {
      return response.data;
    } else {
      return rejectWithValue(response);
    }
  }
);

export const fetchProductByCategorySlug = createAsyncThunk(
  "decors/fetchProductByCategoryId",
  async ({ slug, params = {} }, { dispatch, rejectWithValue }) => {
    // console.log("getting category");

    const category = await makeAuthorizedRequest(
      API_CONFIG.CATEGORIES.GET_BY_SLUG(slug),
      "GET"
    );

    if (category.success) {
      // console.log("getting category done...");
      // console.log("getting decors with category...", category.data.at(0).id);

      const response = await makeAuthorizedRequest(
        API_CONFIG.DECORS.GET_BY_CATEGORY(category.data.at(0).id, params),
        "GET"
      );

      if (response.success) {
        // console.log("getting decors with category done...");
        // console.log("getting decors with category successfully...");
        // console.log("response -> ", response);
        return response;
      } else {
        return rejectWithValue(response);
      }
    } else {
      return rejectWithValue(category);
    }
  }
);

export const updateDecors = createAsyncThunk(
  "decors/updateDecors",
  async ({ id, data }, { dispatch, rejectWithValue }) => {
    dispatch(updatingDecors());

    const response = await makeAuthorizedRequest(
      API_CONFIG.DECORS.UPDATE(id),
      "PATCH",
      data
    );

    if (response.success) {
      dispatch(updatingDecorsSuccess());
      return response.data;
    } else {
      dispatch(updatingDecorsFailure());
      return rejectWithValue(response);
    }
  }
);

export const createProduct = createAsyncThunk(
  "decors/createProduct",
  async ({ data }, { dispatch, rejectWithValue }) => {
    dispatch(creatingDecors());

    const response = await makeAuthorizedRequest(
      API_CONFIG.DECORS.CREATE,
      "POST",
      data
    );

    if (response.success) {
      dispatch(creatingDecorsSuccess());
      return response.data;
    } else {
      dispatch(creatingDecorsFailure());
      return rejectWithValue(response);
    }
  }
);

export const deleteProduct = createAsyncThunk(
  "decors/deleteProduct",
  async ({ id }, { dispatch, rejectWithValue }) => {
    dispatch(deletingDecors());

    const response = await makeAuthorizedRequest(
      API_CONFIG.DECORS.DELETE(id),
      "DELETE"
    );

    if (response.success) {
      dispatch(deletingDecorsSuccess());
      return response.data;
    } else {
      dispatch(deletingDecorsFailure());
      return rejectWithValue(response);
    }
  }
);

export const {
  fetchingDecors,
  fetchingDecorsSuccess,
  fetchingProductsFailure,

  updatingDecors,
  updatingDecorsSuccess,
  updatingDecorsFailure,

  creatingDecors,
  creatingDecorsSuccess,
  creatingDecorsFailure,

  deletingDecors,
  deletingDecorsSuccess,
  deletingDecorsFailure,
} = productsSlice.actions;

export default productsSlice;
