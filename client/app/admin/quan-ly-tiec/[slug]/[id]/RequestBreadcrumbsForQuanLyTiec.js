"use client";

import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@chakra-ui/react";
import { useEffect, useState } from "react";

function RequestBreadcrumbsForQuanLyTiec({ requestId, slugLink, nameLink }) {
  const [currentNameLink, setCurrentNameLink] = useState(nameLink);

  // Update state when nameLink changes
  useEffect(() => {
    setCurrentNameLink(nameLink);
  }, [nameLink]);

  return (
    <Breadcrumb className="text-gray-400 mt-5">
      <BreadcrumbItem>
        <BreadcrumbLink
          className="text-gray-400 hover:text-gray-200"
          href={`/admin/quan-ly-tiec`}
        >
          Quản lý tiệc
        </BreadcrumbLink>
      </BreadcrumbItem>

      <BreadcrumbItem>
        <BreadcrumbLink
          className="text-gray-400 hover:text-gray-200"
          href={`/admin/quan-ly-tiec/${slugLink}`}
        >
          {currentNameLink}
        </BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbItem>
        <BreadcrumbLink
          className="text-gray-400 hover:text-gray-200"
          href={`/admin/quan-ly-tiec/${slugLink}/${requestId}`}
        >
          Chi tiết tiệc
        </BreadcrumbLink>
      </BreadcrumbItem>
    </Breadcrumb>
  );
}

export default RequestBreadcrumbsForQuanLyTiec;
