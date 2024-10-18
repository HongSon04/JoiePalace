import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import imagePlaceholder from "@/public/alacarte-menu-thumbnail.png";

const initialState = {
  selectedDish: {},
  dishes: [],
  categoryDishes: [],
  error: "",
  isLoading: false,
  isError: false,
};

const dishesSlice = createSlice({
  name: "requests",
  initialState,
  reducers: {
    setSelectedDish: (state, action) => {
      state.selectedDish = action.payload;
    },
    addingDishCategory: (state, action) => {
      state.isLoading = true;
    },
    addingDishCategorySuccess: (state, action) => {
      state.isLoading = false;
    },
    addingDishCategoryFailure: (state, action) => {
      state.isLoading = false;
      state.isError = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getDishes.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getDishes.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.dishes = action.payload;
      })
      .addCase(getDishes.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(getDishesByCategory.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getDishesByCategory.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.categoryDishes = action.payload;
      })
      .addCase(getDishesByCategory.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const getDishes = createAsyncThunk("dishes/getDishes", async () => {
  // const response = await fetch("/api/dishes");
  // const data = await response.json();

  return dishes;
});

export const getDishesByCategory = createAsyncThunk(
  "dishes/getDishesByCategory",
  async (category) => {
    // const response = await fetch(`/api/dishes?category=${category}`);
    // const data = await response.json();

    // return data;

    return dishes.filter((dish) => dish.category === category);
  }
);

export const {
  setSelectedDish,
  addingDishCategory,
  addingDishCategorySuccess,
  addingDishCategoryFailure,
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
