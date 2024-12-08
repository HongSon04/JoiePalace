"use client";

import AdminHeader from "@/app/_components/AdminHeader";
import useRoleGuard from "@/app/_hooks/useRoleGuard";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@chakra-ui/react";
import { PlusIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import MenuTable from "./MenuTable";

function Page() {
  const { isLoading } = useRoleGuard();

  return (
    <div>
      {/* HEADER */}
      <div className="flex items-center gap-5">
        <AdminHeader
          title="Thực đơn"
          path="Thực đơn"
          showNotificationButton={false}
          showHomeButton={false}
          showSearchForm={false}
          className="flex-1"
        />
        <Link
          href="/admin/thuc-don/tao-thuc-don"
          className="px-3 py-2 h-full bg-whiteAlpha-100 flex flex-center gap-3 rounded-full text-white shrink-0 hover:whiteAlpha-200"
        >
          <PlusIcon className="h-6 w-6 cursor-pointer text-white" />
          Tạo thực đơn
        </Link>
      </div>
      {/* BREADCRUMBS */}
      <Breadcrumb className="text-gray-400 mt-5">
        <BreadcrumbItem>
          <BreadcrumbLink
            className="text-gray-400 hover:text-gray-200"
            href="/admin/yeu-cau"
          >
            Thực đơn /
          </BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>

      {/* MENU LIST */}
      <MenuTable />
    </div>
  );
}

export default Page;
