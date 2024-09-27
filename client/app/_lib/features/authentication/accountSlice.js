import { createSlice } from "@reduxjs/toolkit";

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
      // LATER: Handle login
    },
    register(state, action) {
      // LATER: Handle register
    },
    logout(state) {
      // LATER: Handle logout
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
