import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  username: "",
  password: "",
  email: "",
  role: "",
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
    login(state, action) {
      state.email = action.payload.email;
      state.role = action.payload.role;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
    },
    register(state, action) {},
    logout(state) {
      state.email = "";
      state.role = "";
      state.accessToken = "";
      state.refreshToken = "";
    },
    setUsername(state, action) {
      state.username = action.payload;
    },
    setPassword(state, action) {
      state.password = action.payload;
    },
    setEmail(state, action) {
      state.email = action.payload;
    },
    setRole(state, action) {
      state.role = action.payload;
    },
  },
});

export const {
  login,
  register,
  logout,
  setUsername,
  setPassword,
  setEmail,
  setRole,
  loading,
  error,
} = accountSlice.actions;

export default accountSlice;
