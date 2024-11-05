import { API_CONFIG, makeAuthorizedRequest } from "@/app/_utils/api.config";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  categories: [],
  isLoading: false,
  isError: false,
  error: null,
};

const categoriesSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
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
      console.log("State after fetchCategories.fulfilled:", state);
    },
    fetchingCategoriesFailure(state, action) {
      state.isLoading = false;
      state.isError = true;
      state.error = action.payload;
    },

    addingCategory(state) {
      state.isLoading = true;
    },
    addingCategorySuccess(state) {
      state.isLoading = false;
    },
    addingCategoryFailure(state, action) {
      state.isLoading = false;
      state.error = action.payload;
      state.isError = true;
    },

    fetchingParentCategory(state) {
      state.isLoading = true;
    },
    fetchingParentCategorySuccess(state) {
      state.isLoading = false;
    },
    fetchingParentCategoryFailure(state, action) {
      state.isLoading = false;
      state.error = action.payload;
      state.isError = true;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetching category dishes
      .addCase(fetchCategories.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.categories = action.payload;
        state.error = null;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload;
      });
    // Adding a dish
    // .addCase(addCategory.pending, (state) => {
    //   state.isAddingCategory = true;
    //   state.isAddingCategoryError = false;
    // })
    // .addCase(addCategory.fulfilled, (state, action) => {
    //   state.isAddingCategory = false;
    //   state.dishes.push(action.payload); // Add the new dish to the state
    // })
    // .addCase(addCategory.rejected, (state, action) => {
    //   state.isAddingCategory = false;
    //   state.isAddingCategoryError = true;
    //   state.error = action.payload; // Use the error message from the rejected action
    // })
    // // Updating a dish
    // .addCase(updateCategory.pending, (state) => {
    //   state.isUpdatingCategory = true;
    //   state.isUpdatingCategoryError = false;
    // })
    // .addCase(updateCategory.fulfilled, (state, action) => {
    //   state.isUpdatingCategory = false;
    //   state.dishes = state.dishes.map((dish) =>
    //     dish.id === action.payload.id ? action.payload : dish
    //   ); // Update the dish in the state
    // })
    // .addCase(updateCategory.rejected, (state, action) => {
    //   state.isUpdatingCategory = false;
    //   state.isUpdatingCategoryError = true;
    //   state.error = action.payload; // Use the error message from the rejected action
    // })
    // // Deleting a dish
    // .addCase(deleteCategory.pending, (state) => {
    //   state.isDeletingCategory = true;
    //   state.isDeletingCategoryError = false;
    // })
    // .addCase(deleteCategory.fulfilled, (state, action) => {
    //   state.isDeletingCategory = false;
    //   state.categoryCategoryes = state.categoryCategoryes.filter(
    //     (dish) => dish.id !== action.payload
    //   ); // Remove the deleted dish from the state
    // })
    // .addCase(deleteCategory.rejected, (state, action) => {
    //   state.isDeletingCategory = false;
    //   state.isDeletingCategoryError = true;
    //   state.error = action.payload; // Use the error message from the rejected action
    // });
  },
});

export const fetchCategories = createAsyncThunk(
  "categories/fetchCategories",
  async ({ slug }, { dispatch, rejectWithValue }) => {
    dispatch(fetchingCategories());

    const response = await makeAuthorizedRequest(
      API_CONFIG.CATEGORIES.GET_BY_SLUG(slug),
      "GET"
    );

    console.log("response from thunk -> ", response);
    console.log(
      "categories that should be stoređ -> ",
      response.data.at(0).children
    );

    if (response.success) {
      dispatch(fetchingCategoriesSuccess(response.data.at(0).children));
      return response.data.at(0).children;
    } else {
      dispatch(fetchingCategoriesFailure(response.message));
      return rejectWithValue(response.message);
    }
  }
);

export const {
  fetchingCategories,
  fetchingCategoriesSuccess,
  fetchingCategoriesFailure,

  addingCategory,
  addingCategorySuccess,
  addingCategoryFailure,

  fetchingParentCategory,
  fetchingParentCategorySuccess,
  fetchingParentCategoryFailure,
} = categoriesSlice.actions;

export default categoriesSlice;
