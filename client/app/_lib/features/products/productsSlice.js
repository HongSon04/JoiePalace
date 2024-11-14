import { API_CONFIG, makeAuthorizedRequest } from "@/app/_utils/api.config";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  products: [],
  pagination: {
    page: 1,
    total: 0,
    itemsPerPage: 10,
    lastPage: 1,
    nextPage: null,
    prevPage: null,
  },

  error: null,

  isFetchingProducts: false,
  isFetchingProductsError: false,

  isUpdatingProduct: false,
  isUpdatingProductError: false,

  isCreatingProduct: false,
  isCreatingProductError: false,

  isDeletingProduct: false,
  isDeletingProductError: false,
};

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    fetchingProducts: (state) => {
      state.isFetchingProducts = true;
      state.isFetchingProductsError = false;
      state.error = null;
    },
    fetchingProductsSuccess: (state, action) => {
      // console.log("success action -> ", action);

      state.isFetchingProducts = false;
      state.products = action.payload.data;
      state.pagination = action.payload.pagination;
      state.isFetchingProductsError = false;
      state.error = null;
    },
    fetchingProductsFailure: (state, action) => {
      // console.log("failure action -> ", action);
      state.isFetchingProducts = false;
      state.isFetchingProductsError = true;
    },

    updatingProduct: (state) => {
      state.isUpdatingProduct = true;
      state.isUpdatingProductError = false;
    },
    updatingProductSuccess: (state) => {
      state.isUpdatingProduct = false;
    },
    updatingProductFailure: (state) => {
      state.isUpdatingProduct = false;
      state.isUpdatingProductError = true;
    },

    creatingProduct: (state) => {
      state.isCreatingProduct = true;
      state.isCreatingProductError = false;
    },
    creatingProductSuccess: (state) => {
      state.isCreatingProduct = false;
    },
    creatingProductFailure: (state) => {
      state.isCreatingProduct = false;
      state.isCreatingProductError = true;
    },

    deletingProduct: (state) => {
      state.isDeletingProduct = true;
      state.isDeletingProductError = false;
    },
    deletingProductSuccess: (state) => {
      state.isDeletingProduct = false;
    },
    deletingProductFailure: (state) => {
      state.isDeletingProduct = false;
      state.isDeletingProductError = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.isFetchingProducts = true;
        state.isFetchingProductsError = false;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.isFetchingProducts = false;
        state.products = action.payload.data;
        state.pagination = action.payload.pagination;
        state.isFetchingProductsError = false;
        state.error = null;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.isFetchingProducts = false;
        state.isFetchingProductsError = true;
        state.error = action.payload;
      });

    builder
      .addCase(updateProduct.pending, (state) => {
        state.isUpdatingProduct = true;
        state.isUpdatingProductError = false;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state) => {
        state.isUpdatingProduct = false;
        state.isUpdatingProductError = false;
        state.error = null;
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.isUpdatingProduct = false;
        state.isUpdatingProductError = true;
        state.error = action.payload;
      });

    builder
      .addCase(createProduct.pending, (state) => {
        state.isCreatingProduct = true;
        state.isCreatingProductError = false;
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state) => {
        state.isCreatingProduct = false;
        state.isCreatingProductError = false;
        state.error = null;
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.isCreatingProduct = false;
        state.isCreatingProductError = true;
        state.error = action.payload;
      });

    builder
      .addCase(deleteProduct.pending, (state) => {
        state.isDeletingProduct = true;
        state.isDeletingProductError = false;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state) => {
        state.isDeletingProduct = false;
        state.isDeletingProductError = false;
        state.error = null;
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.isDeletingProduct = false;
        state.isDeletingProductError = true;
        state.error = action.payload;
      });

    builder
      .addCase(fetchProductByCategorySlug.pending, (state) => {
        state.isFetchingProducts = true;
        state.isFetchingProductsError = false;
        state.error = null;
      })
      .addCase(fetchProductByCategorySlug.fulfilled, (state, action) => {
        state.isFetchingProducts = false;
        console.log("fetchProductByCategorySlug payload -> ", action.payload);
        state.products = action.payload.data;
        state.pagination = action.payload.pagination;
        state.isFetchingProductsError = false;
        state.error = null;
      })
      .addCase(fetchProductByCategorySlug.rejected, (state, action) => {
        state.isFetchingProducts = false;
        state.isFetchingProductsError = true;
        state.error = action.payload;
      });
  },
});

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async ({ params = {}, signal }, { dispatch, rejectWithValue }) => {
    // console.log("fetching products");

    dispatch(fetchingProducts());

    const response = await makeAuthorizedRequest(
      API_CONFIG.PRODUCTS.GET_ALL(params),
      "GET",
      null,
      { signal }
    );

    // console.log("response form thunk -> ", response);

    if (response.success) {
      dispatch(fetchingProductsSuccess(response));
      return response;
    } else {
      dispatch(fetchingProductsFailure());
      return rejectWithValue(response);
    }
  }
);

export const fetchProduct = createAsyncThunk(
  "products/fetchProduct",
  async ({ id }, { dispatch, rejectWithValue }) => {
    const response = await makeAuthorizedRequest(
      API_CONFIG.PRODUCTS.GET_BY_ID(id),
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
  "products/fetchProductByCategory",
  async ({ category, params = {} }, { dispatch, rejectWithValue }) => {
    const response = await makeAuthorizedRequest(
      API_CONFIG.PRODUCTS.GET_BY_CATEGORY(category, params),
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
  "products/fetchProductByCategoryId",
  async ({ slug, params = {} }, { dispatch, rejectWithValue }) => {
    // console.log("getting category");

    const category = await makeAuthorizedRequest(
      API_CONFIG.CATEGORIES.GET_BY_SLUG(slug),
      "GET"
    );

    if (category.success) {
      // console.log("getting category done...");
      // console.log("getting products with category...", category.data.at(0).id);

      const response = await makeAuthorizedRequest(
        API_CONFIG.PRODUCTS.GET_BY_CATEGORY(category.data.at(0).id, params),
        "GET"
      );

      if (response.success) {
        // console.log("getting products with category done...");
        // console.log("getting products with category successfully...");
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

export const updateProduct = createAsyncThunk(
  "products/updateProduct",
  async ({ id, data }, { dispatch, rejectWithValue }) => {
    dispatch(updatingProduct());

    const response = await makeAuthorizedRequest(
      API_CONFIG.PRODUCTS.UPDATE(id),
      "PATCH",
      data
    );

    if (response.success) {
      dispatch(updatingProductSuccess());
      return response.data;
    } else {
      dispatch(updatingProductFailure());
      return rejectWithValue(response);
    }
  }
);

export const createProduct = createAsyncThunk(
  "products/createProduct",
  async ({ data }, { dispatch, rejectWithValue }) => {
    dispatch(creatingProduct());

    const response = await makeAuthorizedRequest(
      API_CONFIG.PRODUCTS.CREATE,
      "POST",
      data
    );

    if (response.success) {
      dispatch(creatingProductSuccess());
      return response.data;
    } else {
      dispatch(creatingProductFailure());
      return rejectWithValue(response);
    }
  }
);

export const deleteProduct = createAsyncThunk(
  "products/deleteProduct",
  async ({ id }, { dispatch, rejectWithValue }) => {
    dispatch(deletingProduct());

    const response = await makeAuthorizedRequest(
      API_CONFIG.PRODUCTS.DELETE(id),
      "DELETE"
    );

    if (response.success) {
      dispatch(deletingProductSuccess());
      return response.data;
    } else {
      dispatch(deletingProductFailure());
      return rejectWithValue(response);
    }
  }
);

export const {
  fetchingProducts,
  fetchingProductsSuccess,
  fetchingProductsFailure,

  updatingProduct,
  updatingProductSuccess,
  updatingProductFailure,

  creatingProduct,
  creatingProductSuccess,
  creatingProductFailure,

  deletingProduct,
  deletingProductSuccess,
  deletingProductFailure,
} = productsSlice.actions;

export default productsSlice;
