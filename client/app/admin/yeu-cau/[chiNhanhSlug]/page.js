"use client";

import AdminHeader from "@/app/_components/AdminHeader";
import RequestTableWrapper from "@/app/_components/RequestTableWrapper";
import TableSkeleton from "@/app/_components/skeletons/TableSkeleton";
import { getCurrentBranch } from "@/app/_lib/features/branch/branchSlice";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@chakra-ui/react";
import React, { Suspense } from "react";
import { useDispatch, useSelector } from "react-redux";
import PageBreadcrumbs from "./PageBreadcrumbs";

function Page({ params }) {
  const { chiNhanhSlug } = params;
  return (
    <div>
      <AdminHeader title={"Yêu cầu"} showSearchForm={false} />
      {/* <PageBreadcrumbs branchSlug={chiNhanhSlug} /> */}
      <Suspense fallback={<TableSkeleton />}>
        <RequestTableWrapper />
      </Suspense>
    </div>
  );
}

export default Page;
