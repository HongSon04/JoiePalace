import AdminHeader from "@/app/_components/AdminHeader";
import DishesMain from "./DishesMain";
import PageBreadcrumbs from "./PageBreadcrumbs";
import DishesTable from "./ProductTable";

export const metadata = {
  title: "Quản lý món ăn",
};

function Page() {
  return (
    <div>
      {/* Header */}
      <div className="flex items-center">
        <AdminHeader
          title={"Quản lý sản phẩm"}
        />
      </div>
      <DishesMain />
    </div>
  );
}

export default Page;
