"use client";

import { fetchCategoriesBySlug } from "@/app/_lib/features/categories/categoriesSlice";
import { API_CONFIG } from "@/app/_utils/api.config";
import Loading from "@/app/loading";
import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import DishList from "./DishList";
import { fetchCategoryDishes } from "@/app/_lib/features/dishes/dishesSlice";
import { getMenuListByUserId } from "@/app/_lib/features/menu/menuSlice";

function DishesTabs() {
  const { menuList } = useSelector((store) => store.menu);
  const [isLogedIn, setIsLogedIn] = React.useState(false);

  React.useEffect(() => {
    const fetchData = async () => {
      if (typeof window !== "undefined") {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (storedUser) {
          setIsLogedIn(true);
          try {
            const result = await dispatch(
              getMenuListByUserId({
                params: { user_id: storedUser.id, is_show: false },
              })
            ).unwrap();

            if (result.success) {
              console.log("success result -> ", result);
            } else {
              console.log("failure result -> ", result);
            }
          } catch (error) {
            console.error(error);
          }
        }
      }
    };

    fetchData();
    dispatch(fetchCategoriesBySlug({ slug: API_CONFIG.FOOD_CATEGORY_SLUG }));

    return () => {};
  }, []);

  const [tabIndex, setTabIndex] = React.useState(0);

  const dispatch = useDispatch();
  const {
    categories,
    isLoading: isFetchingCategories,
    isError: isErrorFetchingCategories,
    error: errorFetchingCategories,
  } = useSelector((store) => store.categories);

  const handleTabChange = (index) => {
    setTabIndex(index);
  };

  if (isFetchingCategories) {
    return <Loading />;
  }

  return (
    <section id="creator" className="px-48 py-16 relative !font-gilroy">
      <Tabs
        variant={"unstyled"}
        position={"relative"}
        align="center"
        index={tabIndex}
        onChange={handleTabChange}
        isLazy
      >
        <TabList className="p-2 rounded-full bg-whiteAlpha-100 w-fit items-center gap-3">
          {categories.map((category, index) => (
            <Tab
              key={index}
              color={"white"}
              className="aria-[selected=true]:text-white aria-[selected=true]:opacity-100 aria-[selected=true]:bg-gold bg-transparent opacity-45 transition flex items-center gap-2 uppercase font-semibold flex-center text-center rounded-full py-2 px-6 leading-8"
            >
              {category.name}
            </Tab>
          ))}
        </TabList>
        <TabPanels className="mt-6">
          {categories.map((category, index) => (
            <TabPanel key={index}>
              <DishList userMenuList={menuList} category={category} />
            </TabPanel>
          ))}
        </TabPanels>
      </Tabs>
    </section>
  );
}

export default DishesTabs;
