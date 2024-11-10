"use client";

import AdminHeader from "@/app/_components/AdminHeader";
import ProductTable from "./ProductTable";

function Page() {
  return (
    <div>
      <AdminHeader title={"Quản lý sản phẩm"} />
      <ProductTable />
    </div>
  );
}

export default Page;
