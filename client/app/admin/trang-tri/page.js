"use client";

import AdminHeader from "@/app/_components/AdminHeader";
import TableSkeleton from "@/app/_components/skeletons/TableSkeleton";
import { Suspense } from "react";
import RequestTable from "./RequestTableForDecor";

function Page() {
  return (
    <div>
      <AdminHeader title={"Trang Trí"} showSearchForm={false} />
      {/* <PageBreadcrumbs branchSlug={chiNhanhSlug} /> */}
      <Suspense fallback={<TableSkeleton />}>
        <RequestTable />
      </Suspense>
    </div>
  );
}

export default Page;
