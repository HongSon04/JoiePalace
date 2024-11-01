"use client";

import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@chakra-ui/react";

function RequestBreadcrumbs({ requestId, nameLink, pathLink, namepath }) {


  return (
    <Breadcrumb className="text-gray-400 mt-5">
      <BreadcrumbItem>
        <BreadcrumbLink
          className="text-gray-400 hover:text-gray-200"
          href={`/admin/${nameLink}`}
        >
          Quản lý tiệc
        </BreadcrumbLink>
      </BreadcrumbItem>

    { pathLink && (     <BreadcrumbItem>
        <BreadcrumbLink
          className="text-gray-400 hover:text-gray-200"
          href={`/admin/${nameLink}/${pathLink}`}
        >
          {namepath}
        </BreadcrumbLink>
      </BreadcrumbItem>)}
      {/* <BreadcrumbItem>
        <BreadcrumbLink
          className="text-gray-400 hover:text-gray-200"
          href={`/admin/${nameLink}/${requestId}`}
        >
          {requestId}
        </BreadcrumbLink>
      </BreadcrumbItem> */}
    </Breadcrumb>
  );
}

export default RequestBreadcrumbs;
