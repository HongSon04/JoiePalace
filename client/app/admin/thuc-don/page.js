"use client";

import AdminHeader from "@/app/_components/AdminHeader";
import useApiServices from "@/app/_hooks/useApiServices";
import useCustomToast from "@/app/_hooks/useCustomToast";
import {
  fetchMenuListError,
  fetchMenuListRequest,
  fetchMenuListSuccess,
} from "@/app/_lib/features/menu/menuSlice";
import { API_CONFIG } from "@/app/_utils/api.config";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@chakra-ui/react";
import { PlusIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import MenuList from "./MenuList";

function Page() {
  const [page, setPage] = React.useState(1);
  const dispatch = useDispatch();
  const { menuList, status } = useSelector((store) => store.menu);
  const toast = useCustomToast();
  const { makeAuthorizedRequest } = useApiServices();

  const fetchMenuList = async () => {
    dispatch(fetchMenuListRequest());

    const data = await makeAuthorizedRequest(API_CONFIG.MENU.GET_ALL(), "GET");

    if (data.success) {
      dispatch(fetchMenuListSuccess(data));
    } else {
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách thực đơn",
        type: "error",
      });
      dispatch(fetchMenuListError());
    }
  };

  React.useEffect(() => {
    async function fetchData() {
      await fetchMenuList();
    }

    fetchData();

    return () => {};
  }, []);

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
