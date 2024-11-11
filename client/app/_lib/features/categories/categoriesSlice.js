import { API_CONFIG, makeAuthorizedRequest } from "@/app/_utils/api.config";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  categories: [],
  pagination: {
    page: 1,
    itemsPerPage: 10,
    total: 0,
    lastPage: 1,
    nextPage: null,
    prevPage: null,
  },
  selectedCategory: {},
  isLoading: false,
  isError: false,
  error: null,

  isAddingCategory: false,
  isAddingCategoryError: false,

  isUpdatingCategory: false,
  isUpdatingCategoryError: false,

  isDeletingCategory: false,
  isDeletingCategoryError: false,
};

const categoriesSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    setSelectedCategory(state, action) {
      state.selectedCategory = action.payload;
    },
    fetchingCategories(state) {
      state.isLoading = true;
      state.isError = false;
      state.error = null;
    },
    fetchingCategoriesSuccess(state, action) {
      state.isLoading = false;
      state.isError = false;
      state.categories = action.payload;
      state.error = null;
      // console.log("State after fetchCategoriesBySlug.fulfilled:", state);
    },
    fetchingCategoriesFailure(state, action) {
      state.isLoading = false;
      state.isError = true;
      state.error = action.payload;
    },

    addingCategory(state) {
      state.isAddingCategory = true;
      state.isAddingCategoryError = false;
    },
    addingCategorySuccess(state, action) {
      state.isAddingCategory = false;
      state.isAddingCategoryError = false;
      state.categories = Array.isArray(state.categories)
        ? [...state.categories, action.payload]
        : state.categories.push(action.payload);
    },
    addingCategoryFailure(state, action) {
      state.isAddingCategory = false;
      state.error = action.payload;
      state.isAddingCategoryError = true;
    },

    fetchingParentCategory(state) {
      state.isLoading = true;
      state.isError = false;
    },
    fetchingParentCategorySuccess(state, action) {
      state.isLoading = false;
      state.categories = action.payload;
      // LATER: add pagination for categories
      state.isError = false;
    },
    fetchingParentCategoryFailure(state, action) {
      state.isLoading = false;
      state.error = action.payload;
      state.isError = true;
    },

    deletingCategory(state) {
      state.isDeletingCategory = true;
      state.isDeletingCategoryError = false;
    },
    deletingCategorySuccess(state, action) {
      state.isDeletingCategory = false;
      state.isDeletingCategoryError = false;
      state.categories = state.categories.filter(
        (category) => category.id !== action.payload
      );
    },
    deletingCategoryFailure(state, action) {
      state.isDeletingCategory = false;
      state.isDeletingCategoryError = true;
      state.error = action.payload;
    },

    fetchingSelectedCategory(state) {
      state.isLoading = true;
      state.isError = false;
    },
    fetchingSelectedCategorySuccess(state, action) {
      state.isLoading = false;
      state.selectedCategory = action.payload;
      state.isError = false;
    },
    fetchingSelectedCategoryFailure(state, action) {
      state.isLoading = false;
      state.error = action.payload;
      state.isError = true;
    },

    updatingCategory(state) {
      state.isUpdatingCategory = true;
      state.isUpdatingCategoryError = false;
    },
    updatingCategorySuccess(state, action) {
      state.isUpdatingCategory = false;
      state.isUpdatingCategoryError = false;
      state.categories = state.categories.map((category) =>
        category.id === action.payload.id ? action.payload : category
      );
    },
    updatingCategoryFailure(state, action) {
      state.isUpdatingCategory = false;
      state.isUpdatingCategoryError = true;
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetching category categories
      .addCase(fetchCategoriesBySlug.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.error = null;
      })
      .addCase(fetchCategoriesBySlug.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.categories = action.payload;
        state.error = null;
      })
      .addCase(fetchCategoriesBySlug.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload;
      });
    // Adding a category
    builder
      .addCase(addCategory.pending, (state) => {
        state.isAddingCategory = true;
        state.isAddingCategoryError = false;
      })
      .addCase(addCategory.fulfilled, (state, action) => {
        state.isAddingCategory = false;
        state.isAddingCategoryError = false;
      })
      .addCase(addCategory.rejected, (state, action) => {
        state.isAddingCategory = false;
        state.isAddingCategoryError = true;
        state.error = action.payload; // Use the error message from the rejected action
      });
    // // Updating a category
    builder
      .addCase(updateCategory.pending, (state) => {
        state.isUpdatingCategory = true;
        state.isUpdatingCategoryError = false;
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.isUpdatingCategory = false;
        state.categories = state.categories.map((category) =>
          category.id === action.payload.id ? action.payload : category
        ); // Update the category in the state
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.isUpdatingCategory = false;
        state.isUpdatingCategoryError = true;
        state.error = action.payload; // Use the error message from the rejected action
      });
    // Deleting a category
    builder
      .addCase(deleteCategory.pending, (state) => {
        state.isDeletingCategory = true;
        state.isDeletingCategoryError = false;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.isDeletingCategory = false;
        state.categories = state.categories.filter(
          (category) => category.id !== action.payload
        ); // Remove the deleted category from the state
        state.isDeletingCategoryError = false;
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.isDeletingCategory = false;
        state.isDeletingCategoryError = true;
        state.error = action.payload;
      });

    // Fetching category by ID
    builder
      .addCase(fetchCategoryById.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.error = null;
      })
      .addCase(fetchCategoryById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.selectedCategory = action.payload;
        state.error = null;
      })
      .addCase(fetchCategoryById.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload;
      });
  },
});

export const fetchParentCategory = createAsyncThunk(
  "categories/fetchParentCategory",
  async ({ params, signal }, { dispatch, rejectWithValue }) => {
    dispatch(fetchingParentCategory());

    const response = await makeAuthorizedRequest(
      // LATER: Change this to the correct API endpoint
      API_CONFIG.CATEGORIES.GET_ALL(),
      "GET",
      params,
      { signal }
    );

    console.log(response);

    if (response.success) {
      dispatch(fetchingParentCategorySuccess(response.data));
      return response.data;
    } else {
      dispatch(fetchingParentCategoryFailure(response.message));
      return rejectWithValue(response.message);
    }
  }
);

export const fetchCategoriesBySlug = createAsyncThunk(
  "categories/fetchCategoriesBySlug",
  async ({ slug }, { dispatch, rejectWithValue }) => {
    dispatch(fetchingCategories());

    const response = await makeAuthorizedRequest(
      API_CONFIG.CATEGORIES.GET_BY_SLUG(slug),
      "GET"
    );

    // console.log("response from thunk -> ", response);
    // console.log(
    //   "categories that should be stoređ -> ",
    //   response.data.at(0).children
    // );

    console.log(response);

    if (response.success) {
      dispatch(fetchingCategoriesSuccess(response.data.at(0).childrens));
      return response.data.at(0).childrens;
    } else {
      dispatch(fetchingCategoriesFailure(response.message));
      return rejectWithValue(response.message);
    }
  }
);

export const fetchCategoryById = createAsyncThunk(
  "categories/fetchCategoryById",
  async ({ id }, { dispatch, rejectWithValue }) => {
    dispatch(fetchingSelectedCategory());

    const response = await makeAuthorizedRequest(
      API_CONFIG.CATEGORIES.GET_BY_ID(id),
      "GET"
    );

    if (response.success) {
      dispatch(fetchingSelectedCategorySuccess(response.data.at(0)));
      return response.data.at(0);
    } else {
      dispatch(fetchingSelectedCategoryFailure(response.error.message));
      return response.error.message;
    }
  }
);

export const addCategory = createAsyncThunk(
  "categories/addCategory",
  async ({ data }, { dispatch, rejectWithValue }) => {
    dispatch(addingCategory());

    const response = await makeAuthorizedRequest(
      API_CONFIG.CATEGORIES.CREATE,
      "POST",
      data
    );

    if (response.success) {
      console.log("response in thunk -> ", response);

      dispatch(addingCategorySuccess(response.data.at(0)));
      return response;
    } else {
      dispatch(addingCategoryFailure(response));
      return response;
    }
  }
);

export const deleteCategory = createAsyncThunk(
  "categories/deleteCategory",
  async ({ id }, { dispatch, rejectWithValue }) => {
    if (typeof window === "undefined") return;

    if (!confirm(`Bạn có chắc chắn muốn xóa danh mục ${id}?`)) return;

    dispatch(deletingCategory());

    const response = await makeAuthorizedRequest(
      API_CONFIG.CATEGORIES.DELETE(id),
      "DELETE"
    );

    if (response.success) {
      dispatch(deletingCategorySuccess(id));
      return response;
    } else {
      dispatch(deletingCategoryFailure(response));
      return response;
    }
  }
);

export const updateCategory = createAsyncThunk(
  "categories/updateCategory",
  async ({ id, data }, { dispatch, rejectWithValue }) => {
    dispatch(updatingCategory());

    const response = await makeAuthorizedRequest(
      API_CONFIG.CATEGORIES.UPDATE(id),
      "PUT",
      data
    );

    if (response.success) {
      dispatch(updatingCategorySuccess(response.data.at(0)));
      return response;
    } else {
      dispatch(updatingCategoryFailure(response));
      return response;
    }
  }
);

export const {
  setSelectedCategory,

  fetchingCategories,
  fetchingCategoriesSuccess,
  fetchingCategoriesFailure,

  addingCategory,
  addingCategorySuccess,
  addingCategoryFailure,

  fetchingParentCategory,
  fetchingParentCategorySuccess,
  fetchingParentCategoryFailure,

  deletingCategory,
  deletingCategorySuccess,
  deletingCategoryFailure,

  fetchingSelectedCategory,
  fetchingSelectedCategorySuccess,
  fetchingSelectedCategoryFailure,

  updatingCategory,
  updatingCategorySuccess,
  updatingCategoryFailure,
} = categoriesSlice.actions;

export default categoriesSlice;
