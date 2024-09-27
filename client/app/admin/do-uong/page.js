"use client";

import AdminHeader from "@/app/_components/AdminHeader";
import AddDishCategory from "./AddDishCategory";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@chakra-ui/react";
import DishesMain from "./DishesMain";

function page() {
  return (
    <div>
      {/* Header */}
      <div className="flex items-center">
        <AdminHeader
          title={"Đồ uống"}
          showNotificationButton={false}
          showHomeButton={false}
          showSearchForm={false}
          className="w-full"
        />
        <AddDishCategory />
      </div>
      <Breadcrumb marginTop={20} className="text-gray-400">
        <BreadcrumbItem>
          <BreadcrumbLink
            className="text-gray-400 hover:text-gray-200"
            href="/admin/mon-an"
          >
            Đồ uống /
          </BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>

      {/* Main content */}
      <DishesMain />
    </div>
  );
}

export default page;
