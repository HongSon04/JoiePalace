import AdminHeader from "@/app/_components/AdminHeader";
import AddDishCategory from "./AddDishCategory";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@chakra-ui/react";
import DishesMain from "./DishesMain";

export const metadata = {
  title: "Quản lý món ăn",
};

function page() {
  return (
    <div>
      {/* Header */}
      <div className="flex items-center">
        <AdminHeader
          title={"Món ăn"}
          showNotificationButton={false}
          showHomeButton={false}
          showSearchForm={false}
          className="w-full"
        />
        <AddDishCategory />
      </div>
      <Breadcrumb className="text-gray-400 mt-5">
        <BreadcrumbItem>
          <BreadcrumbLink
            className="text-gray-400 hover:text-gray-200"
            href="/admin/mon-an"
          >
            Món ăn /
          </BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>

      {/* Main content */}
      <DishesMain />
    </div>
  );
}

export default page;
