"use client";

import { getCurrentBranch } from "@/app/_lib/features/branch/branchSlice";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@chakra-ui/react";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

function PageBreadcrumbs() {
  const { currentBranch } = useSelector((store) => store.branch);
  const dispatch = useDispatch();

  React.useEffect(() => {
    const storedBranch = localStorage.getItem("currentBranch");
    if (storedBranch) {
      dispatch(getCurrentBranch(JSON.parse(storedBranch)));
    }
  }, []);

  return (
    <>
      {currentBranch && (
        <Breadcrumb className="text-gray-400 mt-5">
          <BreadcrumbItem>
            <BreadcrumbLink
              className="text-gray-400 hover:text-gray-200"
              href="/admin/mon-an"
            >
              Món ăn /
            </BreadcrumbLink>
            <BreadcrumbLink
              className="text-gray-400 hover:text-gray-200"
              href="/admin/mon-an"
            >
              {currentBranch.name}
            </BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
      )}
    </>
  );
}

export default PageBreadcrumbs;
