import { createSlice } from "@reduxjs/toolkit";

const getUserFromLocalStorage = () => {
  if (typeof window !== "undefined" && window.localStorage) {
    return JSON.parse(localStorage.getItem("user")) || {};
  }
  return {};
};

const initialState = {
  user: getUserFromLocalStorage(),
  accessToken: "",
  refreshToken: "",
  isLoading: false,
  isError: false,
};

const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
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
} = accountSlice.actions;

export default accountSlice;
