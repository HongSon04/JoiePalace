import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import menuBg from "@/public/Alacarte-Menu-Thumbnail.png";

export const fetchMenuItems = createAsyncThunk(
  "menu/fetchMenuItems",
  async () => {
    // const response = await axios.get("/api/menu");
    // return response.data;
    const menuList = [
      {
        id: 1,
        background: menuBg,
        dishes: [
          {
            id: 1,
            name: "Cơm gà",
            price: 30000,
            image: menuBg,
            category: "Khai vị",
          },
          {
            id: 2,
            name: "Cơm sườn",
            price: 25000,
            image: menuBg,
            category: "Khai vị",
          },
          {
            id: 3,
            name: "Cơm chả cá",
            price: 35000,
            image: menuBg,
            category: "Khai vị",
          },
          {
            id: 4,
            name: "Cơm gà",
            price: 30000,
            image: menuBg,
            category: "Món chính",
          },
          {
            id: 5,
            name: "Cơm sườn",
            price: 25000,
            image: menuBg,
            category: "Món chính",
          },
          {
            id: 6,
            name: "Cơm chả cá",
            price: 35000,
            image: menuBg,
            category: "Món chính",
          },
          {
            id: 7,
            name: "Cơm cà ri",
            price: 30000,
            image: menuBg,
            category: "Tráng miệng",
          },
          {
            id: 8,
            name: "Cơm chiên",
            price: 30000,
            image: menuBg,
            category: "Tráng miệng",
          },
        ],
        name: "Thực đơn 1",
        price: 100000000,
        checked: false,
      },
      {
        id: 2,
        background: menuBg,
        dishes: [
          {
            id: 1,
            name: "Cơm gà",
            price: 30000,
            image: menuBg,
            category: "Khai vị",
          },
          {
            id: 2,
            name: "Cơm sườn",
            price: 25000,
            image: menuBg,
            category: "Khai vị",
          },
          {
            id: 3,
            name: "Cơm chả cá",
            price: 35000,
            image: menuBg,
            category: "Khai vị",
          },
          {
            id: 4,
            name: "Cơm gà",
            price: 30000,
            image: menuBg,
            category: "Món chính",
          },
          {
            id: 5,
            name: "Cơm sườn",
            price: 25000,
            image: menuBg,
            category: "Món chính",
          },
          {
            id: 6,
            name: "Cơm chả cá",
            price: 35000,
            image: menuBg,
            category: "Món chính",
          },
          {
            id: 7,
            name: "Cơm cà ri",
            price: 30000,
            image: menuBg,
            category: "Tráng miệng",
          },
          {
            id: 8,
            name: "Cơm chiên",
            price: 30000,
            image: menuBg,
            category: "Tráng miệng",
          },
        ],
        name: "Thực đơn 2",
        price: 100000000,
        checked: false,
      },
      {
        id: 3,
        background: menuBg,
        dishes: [
          {
            id: 1,
            name: "Cơm gà",
            price: 30000,
            image: menuBg,
            category: "Khai vị",
          },
          {
            id: 2,
            name: "Cơm sườn",
            price: 25000,
            image: menuBg,
            category: "Khai vị",
          },
          {
            id: 3,
            name: "Cơm chả cá",
            price: 35000,
            image: menuBg,
            category: "Khai vị",
          },
          {
            id: 4,
            name: "Cơm gà",
            price: 30000,
            image: menuBg,
            category: "Món chính",
          },
          {
            id: 5,
            name: "Cơm sườn",
            price: 25000,
            image: menuBg,
            category: "Món chính",
          },
          {
            id: 6,
            name: "Cơm chả cá",
            price: 35000,
            image: menuBg,
            category: "Món chính",
          },
          {
            id: 7,
            name: "Cơm cà ri",
            price: 30000,
            image: menuBg,
            category: "Tráng miệng",
          },
          {
            id: 8,
            name: "Cơm chiên",
            price: 30000,
            image: menuBg,
            category: "Tráng miệng",
          },
        ],
        name: "Thực đơn 3",
        price: 100000000,
        checked: false,
      },
    ];

    return menuList;
  }
);

const initialState = {
  selectAll: false,
  menuItems: [],
  status: "idle",
  error: null,
};

const checkboxSlice = createSlice({
  name: "checkbox",
  initialState,
  reducers: {
    toggleSelectAll: (state, action) => {
      state.selectAll = action.payload;
      state.menuItems = state.menuItems.map((item) => ({
        ...item,
        checked: action.payload,
      }));
    },
    toggleCheckbox: (state, action) => {
      const item = state.menuItems.find((item) => item.id === action.payload);
      if (item) {
        item.checked = !item.checked;
      }
      state.selectAll = state.menuItems.every((item) => item.checked);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMenuItems.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchMenuItems.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.menuItems = action.payload.map((item) => ({
          ...item,
          checked: false,
        }));
      })
      .addCase(fetchMenuItems.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { toggleSelectAll, toggleCheckbox } = checkboxSlice.actions;
export default checkboxSlice;
