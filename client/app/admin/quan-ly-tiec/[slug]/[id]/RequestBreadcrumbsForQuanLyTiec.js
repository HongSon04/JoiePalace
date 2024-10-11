"use client";

import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@chakra-ui/react";

function RequestBreadcrumbsForQuanLyTiec({ requestId, nameLink }) {
  const branch = {
    id: 1,
    name: "Hoàng Văn Thụ",
    slug: "hoang-van-thu",
  };

  return (
    <Breadcrumb className="text-gray-400 mt-5">
      <BreadcrumbItem>
        <BreadcrumbLink
          className="text-gray-400 hover:text-gray-200 "
          href={`/admin/${nameLink}`}
        >
         Quản lý tiệc
        </BreadcrumbLink>
      </BreadcrumbItem>

      <BreadcrumbItem>
        <BreadcrumbLink
          className="text-gray-400 hover:text-gray-200"
          href={`/admin/${nameLink}/${branch.slug}`}
        >
          {branch.name}
        </BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbItem>
        <BreadcrumbLink
          className="text-gray-400 hover:text-gray-200"
          href={`/admin/${nameLink}/${branch.slug}/${requestId}`}
        >
          Chi tiết tiệc
        </BreadcrumbLink>
      </BreadcrumbItem>
      </Breadcrumb>
  );
}

export default RequestBreadcrumbsForQuanLyTiec;
