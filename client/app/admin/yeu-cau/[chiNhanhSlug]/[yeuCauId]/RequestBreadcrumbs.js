"use client";

import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@chakra-ui/react";

function RequestBreadcrumbs({ requestId }) {
  const branch = {
    id: 1,
    name: "Hoàng Văn Thụ",
    slug: "hoang-van-thu",
  };

  return (
    <Breadcrumb className="text-gray-400 mt-5">
      <BreadcrumbItem>
        <BreadcrumbLink
          className="text-gray-400 hover:text-gray-200"
          href="/admin/yeu-cau"
        >
          Yêu cầu
        </BreadcrumbLink>
      </BreadcrumbItem>

      <BreadcrumbItem>
        <BreadcrumbLink
          className="text-gray-400 hover:text-gray-200"
          href={`/admin/yeu-cau/${branch.slug}`}
        >
          {branch.name}
        </BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbItem>
        <BreadcrumbLink
          className="text-gray-400 hover:text-gray-200"
          href={`yeu-cau/${branch.slug}/${requestId}`}
        >
          {requestId}
        </BreadcrumbLink>
      </BreadcrumbItem>
    </Breadcrumb>
  );
}

export default RequestBreadcrumbs;
