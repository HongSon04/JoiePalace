"use client";

import AdminHeader from "@/app/_components/AdminHeader";
import RequestTableWrapper from "@/app/_components/RequestTableWrapper";
import TableSkeleton from "@/app/_components/skeletons/TableSkeleton";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@chakra-ui/react";
import { Suspense } from "react";
import { useSelector } from "react-redux";

function Page({ params }) {
  const { chiNhanhSlug } = params;
  const { currentBranch } = useSelector((store) => store.branch);

  return (
    <div>
      <AdminHeader title={"Yêu cầu"} showSearchForm={false} />
      <Breadcrumb className="text-gray-400 mt-5">
        <BreadcrumbItem>
          <BreadcrumbLink
            className="text-gray-400 hover:text-gray-200"
            href="#"
          >
            Yêu cầu
          </BreadcrumbLink>
        </BreadcrumbItem>

        <BreadcrumbItem>
          <BreadcrumbLink
            className="text-gray-400 hover:text-gray-200"
            href={`/admin/yeu-cau/${chiNhanhSlug}`}
          >
            {currentBranch.name}
          </BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>

      <Suspense fallback={<TableSkeleton />}>
        <RequestTableWrapper />
      </Suspense>
    </div>
  );
}

export default Page;
