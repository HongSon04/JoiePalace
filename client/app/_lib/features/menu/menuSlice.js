import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import menuBg from "@/public/Alacarte-Menu-Thumbnail.png";

const initialState = {
  selectAll: false,
  menuList: [],
  status: "idle",
  error: null,
  selectedMenuId: [],
  menu: {},
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
      state.selectedMenuId = action.payload
        ? state.menuList.map((item) => item.id)
        : [];
    },
    toggleCheckbox: (state, action) => {
      const item = state.menuList.find((item) => item.id === action.payload);
      if (item) {
        item.checked = !item.checked;
      }
      state.selectAll = state.menuList.every((item) => item.checked);
    },
    setSelectedMenuId: (state, action) => {
      state.selectedMenuId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetch menu list
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
      })
      // fetch menu item
      .addCase(fetchMenu.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchMenu.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.menu = action.payload;
      })
      .addCase(fetchMenu.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const fetchMenuItems = createAsyncThunk(
  "menu/fetchMenuItems",
  async () => {
    // LATER
    // const response = await axios.get("/api/menu");
    // return response.data;
    return menuList;
  }
);

export const fetchMenu = createAsyncThunk("menu/fetchMenu", async (id) => {
  // LATER
  // const response = await axios.get(`/api/menu/${id}`);
  // return response.data;

  return menuList.find((item) => item.id == id);
});

export const { toggleSelectAll, toggleCheckbox, setSelectedMenuId } =
  checkboxSlice.actions;
export default checkboxSlice;

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
        category: "appetizer",
      },
      {
        id: 2,
        name: "Cơm sườn",
        price: 25000,
        image: menuBg,
        category: "appetizer",
      },
      {
        id: 3,
        name: "Cơm chả cá",
        price: 35000,
        image: menuBg,
        category: "appetizer",
      },
      {
        id: 4,
        name: "Cơm gà",
        price: 30000,
        image: menuBg,
        category: "mainCourse",
      },
      {
        id: 5,
        name: "Cơm sườn",
        price: 25000,
        image: menuBg,
        category: "mainCourse",
      },
      {
        id: 6,
        name: "Cơm chả cá",
        price: 35000,
        image: menuBg,
        category: "mainCourse",
      },
      {
        id: 7,
        name: "Cơm cà ri",
        price: 30000,
        image: menuBg,
        category: "dessert",
      },
      {
        id: 8,
        name: "Cơm chiên",
        price: 30000,
        image: menuBg,
        category: "dessert",
      },
    ],
    name: "Thực đơn 1",
    price: 100000000,
    checked: false,
    label: "Thực đơn 1",
    active: false,
    maxDishes: 7,
    appetizer: 4000000,
    mainCourse: 4000000,
    dessert: 4000000,
    total: 4000000,
    maxAppetizer: 2,
    maxMainCourse: 3,
    maxDessert: 2,
    description:
      "Đây là thực đơn thượng hạng mang phong cách Âu - Á với các món ăn đa dạng và hấp dẫn, đầy đủ các hương vị.",
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
        category: "appetizer",
      },
      {
        id: 2,
        name: "Cơm sườn",
        price: 25000,
        image: menuBg,
        category: "appetizer",
      },
      {
        id: 3,
        name: "Cơm chả cá",
        price: 35000,
        image: menuBg,
        category: "appetizer",
      },
      {
        id: 4,
        name: "Cơm gà",
        price: 30000,
        image: menuBg,
        category: "mainCourse",
      },
      {
        id: 5,
        name: "Cơm sườn",
        price: 25000,
        image: menuBg,
        category: "mainCourse",
      },
      {
        id: 6,
        name: "Cơm chả cá",
        price: 35000,
        image: menuBg,
        category: "mainCourse",
      },
      {
        id: 7,
        name: "Cơm cà ri",
        price: 30000,
        image: menuBg,
        category: "dessert",
      },
      {
        id: 8,
        name: "Cơm chiên",
        price: 30000,
        image: menuBg,
        category: "dessert",
      },
    ],
    name: "Thực đơn 2",
    price: 100000000,
    checked: false,
    label: "Thực đơn 2",
    active: true,
    maxDishes: 7,
    appetizer: 4000000,
    mainCourse: 4000000,
    dessert: 4000000,
    total: 4000000,
    maxAppetizer: 2,
    maxMainCourse: 3,
    maxDessert: 2,
    description:
      "Đây là thực đơn thượng hạng mang phong cách Âu - Á với các món ăn đa dạng và hấp dẫn, đầy đủ các hương vị.",
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
        category: "appetizer",
      },
      {
        id: 2,
        name: "Cơm sườn",
        price: 25000,
        image: menuBg,
        category: "appetizer",
      },
      {
        id: 3,
        name: "Cơm chả cá",
        price: 35000,
        image: menuBg,
        category: "appetizer",
      },
      {
        id: 4,
        name: "Cơm gà",
        price: 30000,
        image: menuBg,
        category: "mainCourse",
      },
      {
        id: 5,
        name: "Cơm sườn",
        price: 25000,
        image: menuBg,
        category: "mainCourse",
      },
      {
        id: 6,
        name: "Cơm chả cá",
        price: 35000,
        image: menuBg,
        category: "mainCourse",
      },
      {
        id: 7,
        name: "Cơm cà ri",
        price: 30000,
        image: menuBg,
        category: "dessert",
      },
      {
        id: 8,
        name: "Cơm chiên",
        price: 30000,
        image: menuBg,
        category: "dessert",
      },
    ],
    name: "Thực đơn 3",
    price: 100000000,
    checked: false,
    label: "Thực đơn 3",
    active: true,
    maxDishes: 7,
    appetizer: 4000000,
    mainCourse: 4000000,
    dessert: 4000000,
    total: 4000000,
    maxAppetizer: 2,
    maxMainCourse: 3,
    maxDessert: 2,
    description:
      "Đây là thực đơn thượng hạng mang phong cách Âu - Á với các món ăn đa dạng và hấp dẫn, đầy đủ các hương vị.",
  },
];
