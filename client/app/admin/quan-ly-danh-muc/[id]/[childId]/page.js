"use client";

import AdminHeader from "@/app/_components/AdminHeader";
import CategoryDetailSection from "./CategoryDetailSection";

function Page() {
  return (
    <div>
      <AdminHeader
        title="Quản lý danh mục - Chi tiết danh mục con"
        showSearchForm={false}
      />
      <CategoryDetailSection />
    </div>
  );
}

export default Page;
