import AdminHeader from "@/app/_components/AdminHeader";
import AddDishCategory from "./AddDishCategory";
import DishesMain from "./DishesMain";
import PageBreadcrumbs from "./PageBreadcrumbs";

export const metadata = {
  title: "Quản lý món ăn",
};

function Page() {
  return (
    <div>
      {/* Header */}
      <div className="flex items-center">
        <AdminHeader
          title={"Quản lý thực phẩm"}
          showNotificationButton={false}
          showHomeButton={false}
          showSearchForm={false}
          className="w-full"
        />
        <AddDishCategory />
      </div>
      {/* <PageBreadcrumbs />  */}
      <DishesMain />
    </div>
  );
}

export default Page;
