import { configureStore } from "@reduxjs/toolkit";
import { accountReducer } from "./features/authentication/accountSlice";
import { themeReducer } from "./features/theme/themeSlice";

const store = configureStore({
  reducer: {
    account: accountReducer,
    theme: themeReducer,
  },
});

export default store;
