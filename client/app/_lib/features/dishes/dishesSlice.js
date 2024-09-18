import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedDish: {},
};

const dishesSlice = createSlice({
  name: "requests",
  initialState,
  reducers: {
    setSelectedDish: (state, action) => {
      state.selectedDish = action.payload;
    },
  },
});

export const { setSelectedDish } = dishesSlice.actions;

export default dishesSlice;
