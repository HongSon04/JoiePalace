import { API_CONFIG } from "@/app/_utils/api.config";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: {},
  accessToken: "",
  refreshToken: "",
  isLoading: false,
  isError: false,
};

const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    getUserFromLocalStorage(state, action) {
      state.user = action.payload;
    },
    loading(state) {
      state.isLoading = true;
      state.isError = false;
    },
    error(state) {
      state.isLoading = false;
      state.isError = true;
    },
    logingIn(state) {
      state.isLoading = true;
      state.isError = false;
    },
    login(state, action) {
      state.user = action.payload;
      state.isLoading = false;
      state.isError = false;
    },
    loginSuccess(state) {
      state.isLoading = false;
      state.isError = false;
    },
    loginFailed(state) {
      state.isLoading = false;
      state.isError = true;
    },
    register(state, action) {},
    logout(state) {
      state.user.email = "";
      state.user.role = "";
      state.accessToken = "";
      state.refreshToken = "";
    },
    setUser(state, action) {
      state.user = action.payload;
    },
    fetchUserProfileSuccess(state, action) {
      state.user = action.payload;
    },
  },
});


export const fetchUserByID = createAsyncThunk(
  "account/fetchUserByID",
  async (id, { dispatch, rejectWithValue }) => {
    try {
      const response = await makeAuthorizedRequest(
        API_CONFIG.USER.GET_BY_ID(id),
        "GET",
        null
      );
      console.log(response)
      if (response.success) {
        return response;
      } else {
        return rejectWithValue(response.error);
      }
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);

export const {
  login,
  register,
  logout,
  setUser,
  loading,
  logingIn,
  loginSuccess,
  loginFailed,
  error,
  fetchUserProfileSuccess,
  getUserFromLocalStorage,
} = accountSlice.actions;

export default accountSlice;
