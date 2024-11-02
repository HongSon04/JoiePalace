import imagePlaceholder from "@/public/alacarte-menu-thumbnail.png";
import { createSlice } from "@reduxjs/toolkit";

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
  name: "requests",
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
    },
    fetchingCategoryDishesSuccess: (state, action) => {
      state.isLoading = false;
      state.categoryDishes = action.payload.data;
      state.pagination = action.payload.pagination;
    },
    fetchingCategoryDishesFailure: (state, action) => {
      state.isLoading = false;
      state.isError = true;
    },
    addingDish: (state, action) => {
      state.isAddingDish = true;
    },
    addingDishSuccess: (state, action) => {
      state.isAddingDish = false;
      state.dishes = [
        ...state.dishes.filter((dish) => dish.id !== action.payload.id),
        action.payload,
      ];
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
      state.dishes = [
        ...state.dishes.filter((dish) => dish.id !== action.payload.id),
        action.payload,
      ];
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
    },
    deleteDishFailure: (state, action) => {
      state.isDeletingDish = false;
      state.isDeletingDishError = true;
      state.error = action.payload;
    },
  },
  // extraReducers: (builder) => {
  //   builder
  //     .addCase(getDishes.pending, (state) => {
  //       state.status = "loading";
  //     })
  //     .addCase(getDishes.fulfilled, (state, action) => {
  //       state.status = "succeeded";
  //       state.dishes = action.payload;
  //     })
  //     .addCase(getDishes.rejected, (state, action) => {
  //       state.status = "failed";
  //       state.error = action.error.message;
  //     })
  //     .addCase(getDishesByCategory.pending, (state) => {
  //       state.status = "loading";
  //     })
  //     .addCase(getDishesByCategory.fulfilled, (state, action) => {
  //       state.status = "succeeded";
  //       state.categoryDishes = action.payload;
  //     })
  //     .addCase(getDishesByCategory.rejected, (state, action) => {
  //       state.status = "failed";
  //       state.error = action.error.message;
  //     });
  // },
});

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

const dishes = [
  {
    id: 4,
    name: "Bún chả",
    price: 30000,
    image: imagePlaceholder,
    category: "appetizer",
  },
  {
    id: 5,
    name: "Spring Rolls",
    price: 25000,
    image: imagePlaceholder,
    category: "appetizer",
  },
  {
    id: 6,
    name: "Stuffed Mushrooms",
    price: 27000,
    image: imagePlaceholder,
    category: "appetizer",
  },
  {
    id: 7,
    name: "Bruschetta",
    price: 22000,
    image: imagePlaceholder,
    category: "appetizer",
  },
  {
    id: 8,
    name: "Garlic Bread",
    price: 20000,
    image: imagePlaceholder,
    category: "appetizer",
  },
  {
    id: 9,
    name: "Caesar Salad",
    price: 28000,
    image: imagePlaceholder,
    category: "appetizer",
  },
  {
    id: 10,
    name: "Grilled Chicken",
    price: 50000,
    image: imagePlaceholder,
    category: "mainCourse",
  },
  {
    id: 11,
    name: "Beef Steak",
    price: 70000,
    image: imagePlaceholder,
    category: "mainCourse",
  },
  {
    id: 12,
    name: "Spaghetti Carbonara",
    price: 45000,
    image: imagePlaceholder,
    category: "mainCourse",
  },
  {
    id: 13,
    name: "Chicken Alfredo",
    price: 48000,
    image: imagePlaceholder,
    category: "mainCourse",
  },
  {
    id: 14,
    name: "Grilled Salmon",
    price: 65000,
    image: imagePlaceholder,
    category: "mainCourse",
  },
  {
    id: 15,
    name: "Vegetable Stir Fry",
    price: 40000,
    image: imagePlaceholder,
    category: "mainCourse",
  },
  {
    id: 16,
    name: "Chocolate Cake",
    price: 35000,
    image: imagePlaceholder,
    category: "dessert",
  },
  {
    id: 17,
    name: "Cheesecake",
    price: 37000,
    image: imagePlaceholder,
    category: "dessert",
  },
  {
    id: 18,
    name: "Ice Cream Sundae",
    price: 30000,
    image: imagePlaceholder,
    category: "dessert",
  },
  {
    id: 19,
    name: "Fruit Salad",
    price: 25000,
    image: imagePlaceholder,
    category: "dessert",
  },
  {
    id: 20,
    name: "Brownie",
    price: 32000,
    image: imagePlaceholder,
    category: "dessert",
  },
  {
    id: 21,
    name: "Panna Cotta",
    price: 34000,
    image: imagePlaceholder,
    category: "dessert",
  },
  {
    id: 22,
    name: "Tiramisu",
    price: 36000,
    image: imagePlaceholder,
    category: "dessert",
  },
  {
    id: 23,
    name: "Apple Pie",
    price: 33000,
    image: imagePlaceholder,
    category: "dessert",
  },
  {
    id: 24,
    name: "Mango Sticky Rice",
    price: 31000,
    image: imagePlaceholder,
    category: "dessert",
  },
  {
    id: 25,
    name: "Lemon Tart",
    price: 35000,
    image: imagePlaceholder,
    category: "dessert",
  },
];
