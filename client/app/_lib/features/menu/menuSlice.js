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
  isUpdatingMenu: false,
  isUpdatingMenuError: false,
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

    builder
      .addCase(getMenuListByUserId.pending, (state) => {
        state.isFetchingMenuList = true;
        state.isFetchingMenuError = false;
      })
      .addCase(getMenuListByUserId.fulfilled, (state, action) => {
        state.isFetchingMenuList = false;
        state.menuList = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(getMenuListByUserId.rejected, (state) => {
        state.isFetchingMenuList = false;
        state.isFetchingMenu;
      });

    builder
      .addCase(updateMenu.pending, (state) => {
        state.isUpdatingMenu = true;
        state.isUpdatingMenuError = false;
      })
      .addCase(updateMenu.fulfilled, (state, action) => {
        state.isUpdatingMenu = false;
        state.menuList = state.menuList.map((item) =>
          item.id === action.payload.id ? action.payload : item
        );
      })
      .addCase(updateMenu.rejected, (state) => {
        state.isUpdatingMenu = false;
        state.isUpdatingMenuError = true;
      });
  },
});

export const createMenu = createAsyncThunk(
  "menu/createMenu",
  async (data, { dispatch, rejectWithValue }) => {
    dispatch(createMenuRequest());

    try {
      const response = await makeAuthorizedRequest(
        API_CONFIG.MENU.CREATE,
        "POST",
        data
      );

      if (response.success) {
        dispatch(createMenuSuccess(response.data));
      } else {
        const { error } = response;
        dispatch(createMenuError(error.message));
      }
      return response;
    } catch (error) {
      dispatch(createMenuError(error));
      return rejectWithValue(error);
    }
  }
);

export const getMenuList = createAsyncThunk(
  "menu/fetchMenuList",
  async ({ params, signal }, { dispatch, rejectWithValue }) => {
    try {
      const response = await makeAuthorizedRequest(
        API_CONFIG.MENU.GET_ALL(params),
        "GET",
        null,
        { signal }
      );

      if (response.success) {
        return response;
      } else {
        return rejectWithValue(response.message);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getMenuListByUserId = createAsyncThunk(
  "menu/fetchMenuListByUserId",
  async ({ params, signal }, { dispatch, rejectWithValue }) => {
    try {
      const response = await makeAuthorizedRequest(
        API_CONFIG.MENU.GET_ALL(params),
        "GET",
        null,
        { signal }
      );

      if (response.success) {
        return response;
      } else {
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

export const updateMenu = createAsyncThunk(
  "menu/updateMenu",
  async ({ data, id }, { dispatch, rejectWithValue }) => {
    try {
      const response = await makeAuthorizedRequest(
        API_CONFIG.MENU.UPDATE(id),
        "PATCH",
        data
      );

      if (response.success) {
        return response;
      } else {
        return response;
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

  createMenuRequest,
  createMenuSuccess,
  createMenuError,
} = checkboxSlice.actions;
export default checkboxSlice;
