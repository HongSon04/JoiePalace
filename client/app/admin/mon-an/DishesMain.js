"use client";

import Error from "@/app/_components/Error";
import useApiServices from "@/app/_hooks/useApiServices";
import useRoleGuard from "@/app/_hooks/useRoleGuard";
import {
  fetchingCategories,
  fetchingCategoriesFailure,
  fetchingCategoriesSuccess,
} from "@/app/_lib/features/categories/categoriesSlice";
import {
  fetchingCategoryDishes,
  fetchingCategoryDishesSuccess,
} from "@/app/_lib/features/dishes/dishesSlice";
import { API_CONFIG } from "@/app/_utils/api.config";
import {
  Tab,
  TabIndicator,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import Loading from "../loading";
import DishesSection from "./DishesSection";
import DishesTable from "./DishesTable";

function DishesMain() {
  const { isLoading } = useRoleGuard();
  const { makeAuthorizedRequest } = useApiServices();

  const {
    categories,
    isLoading: isFetchingCategories,
    isError: isErrorFetchingCategories,
    error: errorFetchingCategories,
  } = useSelector((store) => store.categories);

  const dispatch = useDispatch();

  const [activeTabIndex, setActiveTabIndex] = React.useState(0); // State to track the active tab

  const getCategories = async () => {
    dispatch(fetchingCategories());

    const data = await makeAuthorizedRequest(
      API_CONFIG.CATEGORIES.GET_BY_SLUG(API_CONFIG.FOOD_CATEGORY_SLUG),
      "GET"
    );

    if (data.success) {
      dispatch(fetchingCategoriesSuccess(data.data.at(0).children));
      return;
    }

    dispatch(fetchingCategoriesFailure(data.message));
  };

  const getDishesByCategoryId = async (categoryId) => {
    dispatch(fetchingCategoryDishes());

    const data = await makeAuthorizedRequest(
      API_CONFIG.PRODUCTS.GET_BY_CATEGORY(categoryId),
      "GET"
    );

    if (data.success) {
      dispatch(fetchingCategoryDishesSuccess(data.data));
      return;
    }

    dispatch(fetchingCategoriesFailure(data.message));
  };

  React.useEffect(() => {
    getCategories();
  }, []);

  // Fetch dishes when the active tab changes
  React.useEffect(() => {
    if (categories.length > 0) {
      const activeCategoryId = categories[activeTabIndex].id; // Assuming each category has an 'id' property
      getDishesByCategoryId(activeCategoryId);
    }
  }, [activeTabIndex, categories]);

  if (isFetchingCategories) {
    return <Loading />;
  }

  if (isErrorFetchingCategories) {
    return <Error error={errorFetchingCategories} />;
  }
  return (
    <div className="w-full mt-8">
      <Tabs
        className="mt-8"
        variant={"unstyled"}
        isLazy
        onChange={(index) => setActiveTabIndex(index)}
        defaultIndex={activeTabIndex}
      >
        <TabList width={"fit-content"} className="!w-full flex">
          {categories.map((c, index) => (
            <Tab
              key={index}
              color={"white"}
              className="aria-[selected=true]:opacity-100 opacity-45 aria-[selected=true]:font-semibold transition text-lg flex items-center gap-2"
            >
              {c.name}
            </Tab>
          ))}
        </TabList>
        <TabIndicator mt="1.5px" height="2px" bg="white" borderRadius="2px" />
        <TabPanels>
          {categories.map((category, index) => (
            <TabPanel className="mt-3 rounded-md" key={index}>
              <DishesSection
                dishCategory={category}
                key={index}
                categories={categories}
              />{" "}
              {/* Pass categoryId to DishesSection */}
              {/* <DishesTable
                key={index}
                dishCategory={category}
                categories={categories}
              /> */}
            </TabPanel>
          ))}
        </TabPanels>
        {/* <CustomPagination total={status.length} /> */}
      </Tabs>
    </div>
  );
}

export default DishesMain;
