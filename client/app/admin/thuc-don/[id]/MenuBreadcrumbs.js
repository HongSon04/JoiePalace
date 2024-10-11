"use client";

import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@chakra-ui/react";

function RequestBreadcrumbs({ menuId }) {
  return (
    <Breadcrumb className="text-gray-400 mt-5">
      <BreadcrumbItem>
        <BreadcrumbLink
          className="text-gray-400 hover:text-gray-200"
          href="/admin/thuc-don"
        >
          Thực đơn
        </BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbItem>
        <BreadcrumbLink
          className="text-gray-400 hover:text-gray-200"
          href={`/admin/thuc-don/${menuId}`}
        >
          {menuId}
        </BreadcrumbLink>
      </BreadcrumbItem>
    </Breadcrumb>
  );
}

export default RequestBreadcrumbs;
