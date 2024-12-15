"use client";

import Error from "@/app/_components/Error";
import useRoleGuard from "@/app/_hooks/useRoleGuard";
import { fetchCategoriesBySlug } from "@/app/_lib/features/categories/categoriesSlice";
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

function DishesMain() {
  const { isLoading } = useRoleGuard();

  const {
    categories,
    isLoading: isFetchingCategories,
    isError: isErrorFetchingCategories,
    error: errorFetchingCategories,
  } = useSelector((store) => store.categories);

  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(fetchCategoriesBySlug({ slug: API_CONFIG.FOOD_CATEGORY_SLUG }));

    return () => {};
  }, []);

  if (isFetchingCategories) {
    return <Loading />;
  }

  if (isErrorFetchingCategories) {
    return <Error error={errorFetchingCategories} />;
  }

  return (
    <div className="w-full mt-8">
      {!categories && isFetchingCategories && (
        <div className="flex flex-col gap-3 justify-center items-center">
          <p className="text-gray-400">Tải danh mục món ăn thất bại</p>
          <button
            className="text-gray-400 underline"
            onClick={() =>
              dispatch(
                fetchCategoriesBySlug({
                  slug: API_CONFIG.FOOD_CATEGORY_SLUG,
                })
              )
            }
          >
            Thử lại
          </button>
        </div>
      )}
      <Tabs className="mt-8" variant={"unstyled"} isLazy>
        <TabList width={"fit-content"} className="!w-full flex">
          {categories &&
            categories.map((c, index) => (
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
          {categories &&
            categories.map((category, index) => (
              <TabPanel className="mt-3 rounded-md" key={index}>
                <DishesSection
                  dishCategory={category}
                  key={index}
                  categories={categories}
                />{" "}
                {/* <DishesTable
                key={index}
                dishCategory={category}
                categories={categories}
              /> */}
              </TabPanel>
            ))}
        </TabPanels>
      </Tabs>
    </div>
  );
}

export default DishesMain;
