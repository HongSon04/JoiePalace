import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import menuBg from "@/public/Alacarte-Menu-Thumbnail.png";
import { API_CONFIG, makeAuthorizedRequest } from "@/app/_utils/api.config";

const initialState = {
  selectAll: false,
  menuList: [],
  status: "idle",
  error: null,
  menu: {},
  isFetchingMenu: false,
  isFetchingMenuError: false,
  isFetchingMenuList: false,
  isFetchingMenuListError: false,
  isCreatingMenu: false,
  isCreatingMenuError: false,
  pagination: {},
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

    fetchMenuListRequest: (state) => {
      state.isFetchingMenuList = true;
      state.isFetchingMenuError = false;
    },
    fetchMenuListSuccess: (state, action) => {
      state.isFetchingMenuList = false;
      state.menuList = action.payload.data;
      state.pagination = action.payload.pagination;
      state.isFetchingMenuError = false;
    },
    fetchMenuListError: (state) => {
      state.isFetchingMenuList = false;
      state.isFetchingMenuError = true;
    },

    fetchMenuRequest: (state) => {
      state.isFetchingMenu = true;
      state.isFetchingMenuError = false;
    },
    fetchMenuSuccess: (state, action) => {
      state.isFetchingMenu = false;
      state.menu = action.payload;
      state.isFetchingMenuError = false;
    },
    fetchMenuError: (state) => {
      state.isFetchingMenu = false;
      state.isFetchingMenuError = true;
    },

    createMenuRequest: (state) => {
      state.isCreatingMenu = true;
      state.isCreatingMenuError = false;
    },
    createMenuSuccess: (state, action) => {
      state.isCreatingMenu = false;
      state.menuList = [...state.menuList, action.payload];
      state.isCreatingMenuError = false;
    },
    createMenuError: (state) => {
      state.isCreatingMenu = false;
      state.isCreatingMenuError = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getMenuList.pending, (state) => {
        state.isFetchingMenuList = true;
        state.isFetchingMenuError = false;
      })
      .addCase(getMenuList.fulfilled, (state, action) => {
        state.isFetchingMenuList = false;
        state.menuList = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(getMenuList.rejected, (state) => {
        state.isFetchingMenuList = false;
        state.isFetchingMenuError = true;
      });

    builder
      .addCase(getMenu.pending, (state) => {
        state.isFetchingMenu = true;
        state.isFetchingMenuError = false;
      })
      .addCase(getMenu.fulfilled, (state, action) => {
        state.isFetchingMenu = false;
        state.menu = action.payload;
      })
      .addCase(getMenu.rejected, (state) => {
        state.isFetchingMenu = false;
        state.isFetchingMenuError = true;
      });

    builder
      .addCase(createMenu.pending, (state) => {
        state.isCreatingMenu = true;
        state.isCreatingMenuError = false;
      })
      .addCase(createMenu.fulfilled, (state, action) => {
        state.isCreatingMenu = false;
        state.menuList = [...state.menuList, action.payload];
      })
      .addCase(createMenu.rejected, (state) => {
        state.isCreatingMenu = false;
        state.isCreatingMenuError = true;
      });
  },
});

export const createMenu = createAsyncThunk(
  "menu/createMenu",
  async (data, { dispatch, rejectWithValue }) => {
    dispatch(createMenuRequest());

    try {
      const response = await makeAuthorizedRequest(
        API_CONFIG.MENU.CREATE(),
        "POST",
        data
      );

      console.log(response);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getMenuList = createAsyncThunk(
  "menu/fetchMenuList",
  async ({ params, signal }, { dispatch, rejectWithValue }) => {
    try {
      const response = await makeAuthorizedRequest(
        API_CONFIG.MENU.GET_ALL({ params }),
        "GET",
        null,
        { signal }
      );

      console.log(response);

      if (response.success) {
        dispatch(fetchMenuListSuccess(response.data));
        return response.data;
      } else {
        dispatch(fetchMenuListError());
        return rejectWithValue(response.message);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getMenu = createAsyncThunk(
  "menu/fetchMenu",
  async (id, { dispatch, rejectWithValue }) => {
    try {
      const response = await makeAuthorizedRequest(
        API_CONFIG.MENU.GET_BY_ID(id),
        "GET"
      );

      console.log(response);

      if (response.success) {
        dispatch(fetchMenuListSuccess(response.data));
        return response.data;
      } else {
        dispatch(fetchMenuListError());
        return rejectWithValue(response.message);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const {
  toggleSelectAll,
  toggleCheckbox,
  setSelectedMenuId,
  fetchMenuListRequest,
  fetchMenuListSuccess,
  fetchMenuListError,
} = checkboxSlice.actions;
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
