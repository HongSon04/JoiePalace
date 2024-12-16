"use client";

import Error from "@/app/_components/Error";
import useRoleGuard from "@/app/_hooks/useRoleGuard";
import { API_CONFIG, makeAuthorizedRequest } from "@/app/_utils/api.config";
import {
  Tab,
  TabIndicator,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Loading from "../loading";
import DishesSection from "./DishesSection";

function DishesMain() {
  const { isLoading } = useRoleGuard();
  const queryClient = useQueryClient();

  const {
    data: categories,
    isLoading: isFetchingCategories,
    isError: isErrorFetchingCategories,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await makeAuthorizedRequest(
        API_CONFIG.CATEGORIES.GET_BY_SLUG(API_CONFIG.FOOD_CATEGORY_SLUG),
        "GET"
      );

      if (response.success) {
        return response.data.at(0).childrens;
      } else {
        return rejectWithValue(response.message);
      }
    },
  });

  if (isFetchingCategories) {
    return <Loading />;
  }

  if (isErrorFetchingCategories) {
    return <Error error={"Lỗi khi lấy dữ liệu danh mục"} />;
  }

  return (
    <div className="w-full mt-8">
      {!categories && isFetchingCategories && (
        <div className="flex flex-col gap-3 justify-center items-center">
          <p className="text-gray-400">Tải danh mục món ăn thất bại</p>
          <button
            className="text-gray-400 underline"
            onClick={() => queryClient.invalidateQueries(["categories"])}
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
              </TabPanel>
            ))}
        </TabPanels>
      </Tabs>
    </div>
  );
}

export default DishesMain;
