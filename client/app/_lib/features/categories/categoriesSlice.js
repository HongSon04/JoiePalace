const { createSlice } = require("@reduxjs/toolkit");

const initialState = {
  categories: [],
  isLoading: false,
  error: null,
  isError: false,
};

const categoriesSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    fetchingCategories(state) {
      state.isLoading = true;
    },
    fetchingCategoriesSuccess(state, action) {
      state.isLoading = false;
      state.categories = action.payload;
    },
    fetchingCategoriesFailure(state, action) {
      state.isLoading = false;
      state.error = action.payload;
      state.isError = true;
    },
    addingCategory(state) {
      state.isLoading = true;
    },
    addingCategorySuccess(state) {
      state.isLoading = false;
    },
    addingCategoryFailure(state) {
      state.isLoading = false;
      state.error = action.payload;
      state.isError = true;
    },
  },
});

export const {
  fetchingCategories,
  fetchingCategoriesSuccess,
  fetchingCategoriesFailure,
  addingCategory,
  addingCategorySuccess,
  addingCategoryFailure,
} = categoriesSlice.actions;

export default categoriesSlice;
