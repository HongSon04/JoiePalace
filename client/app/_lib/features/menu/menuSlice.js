import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import menuBg from "@/public/Alacarte-Menu-Thumbnail.png";

const initialState = {
  selectAll: false,
  menuList: [],
  status: "idle",
  error: null,
  selectedMenuId: [],
};

const checkboxSlice = createSlice({
  name: "menu",
  initialState,
  reducers: {
    toggleSelectAll: (state, action) => {
      state.selectAll = action.payload;
      state.menuList = state.menuList.map((item) => ({
        ...item,
        checked: action.payload,
      }));
    },
    toggleCheckbox: (state, action) => {
      const item = state.menuList.find((item) => item.id === action.payload);
      if (item) {
        item.checked = !item.checked;
      }
      state.selectAll = state.menuList.every((item) => item.checked);
    },
    setSelectedMenuId: (state, action) => {
      if (state.selectedMenuId.includes(action.payload)) {
        state.selectedMenuId = state.selectedMenuId.filter(
          (id) => id !== action.payload
        );
      } else {
        if (Array.isArray(state.selectedMenuId))
          if (Array.isArray(action.payload)) {
            state.selectedMenuId = [...state.selectedMenuId, ...action.payload];
          } else {
            state.selectedMenuId = action.payload;
          }
        else {
          if (Array.isArray(action.payload)) {
            state.selectedMenuId = [state.selectedMenuId, ...action.payload];
          } else {
            state.selectedMenuId = [state.selectedMenuId, action.payload];
          }
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMenuItems.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchMenuItems.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.menuList = action.payload.map((item) => ({
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
        label: "Thực đơn 1",
        active: false,
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
        label: "Thực đơn 2",
        active: true,
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
        label: "Thực đơn 3",
        active: true,
      },
    ];

    return menuList;
  }
);

export const { toggleSelectAll, toggleCheckbox, setSelectedMenuId } =
  checkboxSlice.actions;
export default checkboxSlice;
