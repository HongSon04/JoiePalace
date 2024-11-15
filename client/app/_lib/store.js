import { configureStore } from "@reduxjs/toolkit";
// import slices
import accountSlice from "./features/authentication/accountSlice";
import branchSlice from "./features/branch/branchSlice";
import categoriesSlice from "./features/categories/categoriesSlice";
import dishesSlice from "./features/dishes/dishesSlice";
import feedbacksSlice from "./features/feedbacks/feedbacksSlice";
import menuSlice from "./features/menu/menuSlice";
import partyTypesSlice from "./features/partyTypes/partyTypesSlice";
import requestsSlice from "./features/requests/requestsSlice";
import sidebarSlice from "./features/sidebar/sidebarSlice";
import themeSlice from "./features/theme/themeSlice";
<<<<<<< HEAD
import productsSlice from "./products/productsSlice";
import customersSlice from "./features/customer/customerSlice";
=======
import productsSlice from "./features/products/productsSlice";
import packagesSlice from "./features/packages/packagesSlice";
import stagesSlice from "./features/stages/stagesSlice";
import decorsSlice from "./decors/decorsSlice";
import hallsSlice from "./halls/hallsSlice";
>>>>>>> 8dd3d6c62275180f6fa990dbc0ebb3c4b7cb7fb6

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
    products: productsSlice.reducer,
<<<<<<< HEAD
    customers: customersSlice.reducer,
=======
    packages: packagesSlice.reducer,
    stages: stagesSlice.reducer,
    decors: decorsSlice.reducer,
    halls: hallsSlice.reducer,
>>>>>>> 8dd3d6c62275180f6fa990dbc0ebb3c4b7cb7fb6
  },
});

export default store;
