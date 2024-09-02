import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  account: {},
  accessToken: "",
  refreshToken: "",
};

const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    login(state, action) {
      state.account = action.payload.account;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
    },
    register(state, action) {
      state.account = action.payload.account;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
    },
    logout(state) {
      state.account = {};
      state.accessToken = "";
      state.refreshToken = "";
    },
  },
});

export const { login, register, logout } = accountSlice.actions;

export default accountSlice.reducer;
