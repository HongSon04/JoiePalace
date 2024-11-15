import { API_CONFIG, makeAuthorizedRequest } from "@/app/_utils/api.config";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedDish: {
    images: [""],
  },
  dishes: [],
  pagination: {
    total: 0,
    currentPage: 1,
    lastPage: 1,
    prePage: null,
    nextPage: null,
    itemsPerPage: 10,
  },
  categoryDishes: [],
  error: "",
  isLoading: false,
  isError: false,
  isAddingDishCategory: false,
  isAddingDishCategoryError: false,
  isAddingDish: false,
  isAddingDishError: false,
  isUpdatingDish: false,
  isUpdatingDishError: false,
  isDeletingDish: false,
  isDeletingDishError: false,
};

const dishesSlice = createSlice({
  name: "dishes",
  initialState,
  reducers: {
    setSelectedDish: (state, action) => {
      state.selectedDish = action.payload;
    },

    addingDishCategory: (state, action) => {
      state.isAddingDishCategory = true;
    },
    addingDishCategorySuccess: (state, action) => {
      state.isAddingDishCategory = false;
    },
    addingDishCategoryFailure: (state, action) => {
      state.isAddingDishCategory = false;
      state.isAddingDishCategoryError = true;
    },

    fetchingSelectedDish: (state, action) => {
      state.isLoading = true;
    },
    fetchingSelectedDishSuccess: (state, action) => {
      state.isLoading = false;
    },
    fetchingSelectedDishFailure: (state, action) => {
      state.isLoading = false;
      state.isError = true;
    },

    fetchingCategoryDishes: (state, action) => {
      state.isLoading = true;
      state.isError = false;
    },
    fetchingCategoryDishesSuccess: (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.categoryDishes = action.payload.data;
      state.pagination = action.payload.pagination;
    },
    fetchingCategoryDishesFailure: (state, action) => {
      state.isLoading = false;
      state.isError = true;
    },

    addingDish: (state, action) => {
      state.isAddingDish = true;
      state.isAddingDishError = false;
    },
    addingDishSuccess: (state, action) => {
      state.isAddingDish = false;
      state.categoryDishes = [
        ...state.categoryDishes.filter((dish) => dish.id !== action.payload.id),
        action.payload,
      ];
      state.isAddingDishError = false;
    },
    addingDishFailure: (state, action) => {
      state.isAddingDish = false;
      state.isAddingDishError = true;
    },

    updateDishRequest: (state, action) => {
      state.isUpdatingDish = true;
    },
    updateDishSuccess: (state, action) => {
      state.isUpdatingDish = false;
      state.categoryDishes = [
        ...state.categoryDishes.filter((dish) => dish.id !== action.payload.id),
        action.payload,
      ];
      state.isUpdatingDishError = false;
    },
    updateDishFailure: (state, action) => {
      state.isUpdatingDish = false;
      state.isUpdatingDishError = true;
    },

    deleteDishRequest: (state, action) => {
      state.isDeletingDish = true;
    },
    deleteDishSuccess: (state, action) => {
      state.isDeletingDish = false;
      state.categoryDishes = state.categoryDishes.filter(
        (dish) => dish.id !== action.payload
      );
      state.isDeletingDishError = false;
    },
    deleteDishFailure: (state, action) => {
      state.isDeletingDish = false;
      state.isDeletingDishError = true;
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetching category dishes
      .addCase(fetchCategoryDishes.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(fetchCategoryDishes.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.categoryDishes = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchCategoryDishes.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload; // Use the error message from the rejected action
      })
      // Adding a dish
      .addCase(addDish.pending, (state) => {
        state.isAddingDish = true;
        state.isAddingDishError = false;
      })
      .addCase(addDish.fulfilled, (state, action) => {
        state.isAddingDish = false;
        state.dishes.push(action.payload); // Add the new dish to the state
      })
      .addCase(addDish.rejected, (state, action) => {
        state.isAddingDish = false;
        state.isAddingDishError = true;
        state.error = action.payload; // Use the error message from the rejected action
      })
      // Updating a dish
      .addCase(updateDish.pending, (state) => {
        state.isUpdatingDish = true;
        state.isUpdatingDishError = false;
      })
      .addCase(updateDish.fulfilled, (state, action) => {
        state.isUpdatingDish = false;
        state.dishes = state.dishes.map((dish) =>
          dish.id === action.payload.id ? action.payload : dish
        ); // Update the dish in the state
      })
      .addCase(updateDish.rejected, (state, action) => {
        state.isUpdatingDish = false;
        state.isUpdatingDishError = true;
        state.error = action.payload; // Use the error message from the rejected action
      })
      // Deleting a dish
      .addCase(deleteDish.pending, (state) => {
        state.isDeletingDish = true;
        state.isDeletingDishError = false;
      })
      .addCase(deleteDish.fulfilled, (state, action) => {
        state.isDeletingDish = false;
        state.categoryDishes = state.categoryDishes.filter(
          (dish) => dish.id !== action.payload
        ); // Remove the deleted dish from the state
      })
      .addCase(deleteDish.rejected, (state, action) => {
        state.isDeletingDish = false;
        state.isDeletingDishError = true;
        state.error = action.payload; // Use the error message from the rejected action
      });
  },
});

// Fetch category dishes
export const fetchCategoryDishes = createAsyncThunk(
  "dishes/fetchCategoryDishes",
  async ({ categoryId, params, signal }, { dispatch, rejectWithValue }) => {
    const response = await makeAuthorizedRequest(
      API_CONFIG.PRODUCTS.GET_BY_CATEGORY(categoryId, params),
      "GET",
      null,
      { signal }
    );

    // console.log("params -> ", params);
    // console.log("response from fetchCategoryDishes thunk -> ", response);
    if (response.success) {
      return response;
    } else {
      return rejectWithValue(response.message);
    }
  }
);

// Add a dish
export const addDish = createAsyncThunk(
  "dishes/addDish",
  async (dishData, { dispatch, rejectWithValue }) => {
    dispatch(addingDish());
    const response = await makeAuthorizedRequest(
      API_CONFIG.PRODUCTS.CREATE,
      "POST",
      dishData
    );

    // console.log("response from addDish thunk -> ", response);

    if (response.success) {
      dispatch(addingDishSuccess(response.data.at(0)));
      return response.data;
    } else {
      dispatch(addingDishFailure(response.error.message));
      return rejectWithValue(response.error.message);
    }
  }
);

// Update a dish
export const updateDish = createAsyncThunk(
  "dishes/updateDish",
  async ({ dishId, dishData }, { dispatch, rejectWithValue }) => {
    dispatch(updateDishRequest());

    try {
      const response = await makeAuthorizedRequest(
        API_CONFIG.PRODUCTS.UPDATE(dishId),
        "PATCH",
        dishData
      );

      if (response.success) {
        dispatch(updateDishSuccess(response.data));
      } else {
        dispatch(updateDishFailure(response.message));
      }

      return response;
    } catch (error) {
      dispatch(updateDishFailure(error));
      return rejectWithValue(error.message);
    }
  }
);

// Delete a dish
export const deleteDish = createAsyncThunk(
  "dishes/deleteDish",
  async (dishId, { dispatch, rejectWithValue }) => {
    dispatch(deleteDishRequest());
    try {
      const response = await makeAuthorizedRequest(
        API_CONFIG.PRODUCTS.DELETE(dishId),
        "DELETE"
      );
      if (response.success) {
        dispatch(deleteDishSuccess(dishId));
      } else {
        dispatch(deleteDishFailure(response.message));
        return rejectWithValue(response.message);
      }

      return response;
    } catch (error) {
      dispatch(deleteDishFailure(error));
      return rejectWithValue(error.message);
    }
  }
);

export const {
  setSelectedDish,

  addingDishCategory,
  addingDishCategorySuccess,
  addingDishCategoryFailure,

  fetchingSelectedDish,
  fetchingSelectedDishSuccess,
  fetchingSelectedDishFailure,
  fetchingCategoryDishes,
  fetchingCategoryDishesSuccess,
  fetchingCategoryDishesFailure,

  addingDish,
  addingDishSuccess,
  addingDishFailure,

  updateDishRequest,
  updateDishSuccess,
  updateDishFailure,

  deleteDishRequest,
  deleteDishSuccess,
  deleteDishFailure,
} = dishesSlice.actions;

export default dishesSlice;
