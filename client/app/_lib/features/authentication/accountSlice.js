import { API_CONFIG } from "@/app/_utils/api.config";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  username: "",
  password: "",
  email: "",
  role: "",
  accessToken: "",
  refreshToken: "",
};

const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
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
} = accountSlice.actions;

export default accountSlice;
