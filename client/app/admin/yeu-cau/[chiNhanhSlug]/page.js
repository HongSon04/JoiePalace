"use client";

import AdminHeader from "@/app/_components/AdminHeader";
import RequestTable from "@/app/_components/RequestTable";
import TableSkeleton from "@/app/_components/skeletons/TableSkeleton";
import { Suspense } from "react";

function Page() {
  return (
    <div>
      <AdminHeader title={"Yêu cầu"} showSearchForm={false} />
      {/* <PageBreadcrumbs branchSlug={chiNhanhSlug} /> */}
      <Suspense fallback={<TableSkeleton />}>
        <RequestTable />
      </Suspense>
    </div>
  );
}

export default Page;
