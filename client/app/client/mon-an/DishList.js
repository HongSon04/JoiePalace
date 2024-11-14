"use client";

import ClientDish from "@/app/_components/ClientDish";
import CustomPagination from "@/app/_components/CustomPagination";
import { fetchCategoryDishes } from "@/app/_lib/features/dishes/dishesSlice";
import { Popover, PopoverContent, PopoverTrigger } from "@nextui-org/popover";
import { Button, Skeleton } from "@nextui-org/react";
import { Col, Row } from "antd";
import React, { use } from "react";
import { useDispatch, useSelector } from "react-redux";
import Error from "./Error";
import { getUserFromLocalStorage } from "@/app/_lib/features/authentication/accountSlice";
import { getMenuListByUserId } from "@/app/_lib/features/menu/menuSlice";

function DishList({ category, userMenuList, isLogedIn }) {
  const dispatch = useDispatch();

  const { categoryDishes, pagination, isLoading, isError, error } = useSelector(
    (store) => store.dishes
  );

  const [currentPage, setCurrentPage] = React.useState(1);

  const handleCurrentPageChange = (page) => {
    setCurrentPage(page);
  };

  React.useEffect(() => {
    const fetchData = async () => {
      const result = await dispatch(
        fetchCategoryDishes({
          categoryId: category.id,
          params: { page: currentPage },
        })
      ).unwrap();

      console.log("result -> ", result);
    };

    fetchData();

    return () => {};
  }, [category.id, currentPage, dispatch]);

  return (
    <div className="min-h-[400px] relative rounded-xl">
      {isLoading && <DishListSkeleton />}
      {isError && <Error error={error} />}
      <Row gutter={[30, 30]} className="mt-8">
        {categoryDishes &&
          categoryDishes.map((dish, index) => (
            <Col span={12} key={index}>
              <ClientDish
                as="button"
                dish={dish}
                addable={true}
                addAction={() => {}}
                removable={false}
                usePopover={true}
                userMenuList={userMenuList}
                isLogedIn={isLogedIn}
              />
            </Col>
          ))}
        {pagination && pagination?.lastPage > 1 && (
          <div className="flex-center w-full mt-8">
            <CustomPagination
              total={pagination.lastPage}
              page={currentPage}
              onChange={handleCurrentPageChange}
            />
          </div>
        )}
      </Row>
    </div>
  );
}

export default DishList;

function DishListSkeleton() {
  return (
    <Row gutter={[30, 30]} className="mt-8">
      {Array(10)
        .fill(0)
        .map((_, index) => (
          <Col span={12} key={index}>
            <ClientDishSkeleton />
          </Col>
        ))}
    </Row>
  );
}

function ClientDishSkeleton() {
  return (
    <div className="flex gap-6 shrink-0 items-center mr-16 ml-5 w-full">
      <Skeleton className="bg-whiteAlpha-100 shrink-0 w-[150px] h-[150px] rounded-full"></Skeleton>
      <div className="flex flex-col gap-6 relative min-w-0 w-full">
        <Skeleton className="bg-whiteAlpha-100 w-1/2 h-5 rounded-lg"></Skeleton>
        <Skeleton className="bg-whiteAlpha-100 w-1/3 h-5 rounded-lg"></Skeleton>
        <Skeleton className="bg-whiteAlpha-100 w-full h-5 rounded-lg"></Skeleton>
        <div className="flex w-full justify-between items-center">
          <Skeleton className="bg-whiteAlpha-100 w-1/2 h-5 rounded-lg"></Skeleton>
          <Skeleton className="bg-whiteAlpha-100 w-11 h-11 rounded-full"></Skeleton>
        </div>
      </div>
    </div>
  );
}
