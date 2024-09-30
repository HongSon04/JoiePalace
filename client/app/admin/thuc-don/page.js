"use client";

import AdminHeader from "@/app/_components/AdminHeader";
import {
  fetchMenuItems,
  setSelectedMenuId,
  toggleCheckbox,
  toggleSelectAll,
} from "@/app/_lib/features/menu/menuSlice";
import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from "@chakra-ui/react";
import { ChevronDownIcon, PlusIcon } from "@heroicons/react/24/outline";
import {
  Button,
  ButtonGroup,
  Checkbox,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";
import { FormProvider } from "antd/es/form/context";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import MenuList from "./MenuList";
import { useToast } from "@chakra-ui/react";

function Page() {
  const dispatch = useDispatch();
  const { menuList, status } = useSelector((store) => store.menu);

  useEffect(() => {
    dispatch(fetchMenuItems());
  }, [dispatch]);

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
      {status === "loading" && <div>Loading...</div>}
      {status === "failed" && <div>Error: {error}</div>}
      {status === "succeeded" && <MenuList menuList={menuList} />}
    </div>
  );
}

export default Page;
