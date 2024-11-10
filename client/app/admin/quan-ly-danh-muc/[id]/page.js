"use client";

import AdminHeader from "@/app/_components/AdminHeader";
import CategoriesTable from "./CategoriesTable";

function Page() {
  return (
    <div>
      <AdminHeader
        title="Quản lý danh mục - Chi tiết danh mục"
        showSearchForm={false}
      />
      <CategoriesTable />
    </div>
  );
}

export default Page;
