import { configureStore } from "@reduxjs/toolkit";
// import slices
import accountSlice from "./features/authentication/accountSlice";
import branchSlice from "./features/branch/branchSlice";
import dishesSlice from "./features/dishes/dishesSlice";
import menuSlice from "./features/menu/menuSlice";
import requestsSlice from "./features/requests/requestsSlice";
import sidebarSlice from "./features/sidebar/sidebarSlice";
import themeSlice from "./features/theme/themeSlice";
import categoriesSlice from "./features/categories/categoriesSlice";
import feedbacksSlice from "./features/feedbacks/feedbacksSlice";
import partyTypesSlice from "./features/partyTypes/partyTypesSlice";

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
    categories: categoriesSlice.reducer,
    feedbacks: feedbacksSlice.reducer,
    partyTypes: partyTypesSlice.reducer,
  },
});

export default store;
