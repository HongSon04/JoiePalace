import { configureStore } from "@reduxjs/toolkit";
import accountSlice from "./features/authentication/accountSlice";
import themeSlice from "./features/theme/themeSlice";
import requestsSlice from "./features/requests/requestsSlice";

const store = configureStore({
  reducer: {
    account: accountSlice.reducer,
    theme: themeSlice.reducer,
    requests: requestsSlice.reducer,
  },
});

export default store;
