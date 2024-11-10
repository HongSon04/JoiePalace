"use client";

import AdminHeader from "@/app/_components/AdminHeader";
import CategoriesTable from "@/app/_components/CategoriesTable";

function Page() {
  return (
    <div>
      <AdminHeader title="Quản lý danh mục" showSearchForm={false} />
      <CategoriesTable />
    </div>
  );
}

export default Page;
