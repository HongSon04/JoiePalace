import { configureStore } from "@reduxjs/toolkit";
// import slices
import accountSlice from "./features/authentication/accountSlice";
import branchSlice from "./features/branch/branchSlice";
import dishesSlice from "./features/dishes/dishesSlice";
import menuSlice from "./features/menu/menuSlice";
import requestsSlice from "./features/requests/requestsSlice";
import sidebarSlice from "./features/sidebar/sidebarSlice";
import themeSlice from "./features/theme/themeSlice";

// import services

const store = configureStore({
  reducer: {
    account: accountSlice.reducer,
    theme: themeSlice.reducer,
    requests: requestsSlice.reducer,
    dishes: dishesSlice.reducer,
    sidebar: sidebarSlice.reducer,
    menu: menuSlice.reducer,
    branch: branchSlice.reducer,
  },
});

export default store;
