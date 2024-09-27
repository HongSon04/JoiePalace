"use client";

import AdminHeader from "@/app/_components/AdminHeader";
import { ChevronDownIcon, PlusIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import MenuList from "./MenuList";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@chakra-ui/react";
import {
  Button,
  ButtonGroup,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Checkbox,
} from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import SearchForm from "@/app/_components/SearchForm";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchMenuItems,
  toggleCheckbox,
  toggleSelectAll,
} from "@/app/_lib/features/menu/menuSlice";
import { FormProvider } from "antd/es/form/context";
import { useForm } from "react-hook-form";

function Page() {
  const dispatch = useDispatch();
  const { selectAll, menuItems, status } = useSelector((store) => store.menu);

  const methods = useForm();

  useEffect(() => {
    dispatch(fetchMenuItems());
  }, [dispatch]);

  const handleSelectAll = (event) => {
    dispatch(toggleSelectAll(event.target.checked));
  };

  const handleCheckboxChange = (id) => {
    dispatch(toggleCheckbox(id));
  };

  const [selectedOption, setSelectedOption] = useState(new Set(["edit"]));

  // const descriptionsMap = {
  //   edit: "All commits from the source branch are added to the destination branch via a merge commit.",
  //   delete:
  //     "All commits from the source branch are added to the destination branch as a single commit.",
  //   active:
  //     "All commits from the source branch are added to the destination branch individually.",
  //   unactive:
  //     "All commits from the source branch are added to the destination branch individually.",
  // };

  const labelsMap = {
    edit: "Chỉnh sửa thực đơn",
    delete: "Xóa thực đơn",
    active: "Active thực đơn",
    unactive: "Unactive thực đơn",
  };

  // Convert the Set to an Array and get the first value.
  const selectedOptionValue = Array.from(selectedOption)[0];

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
          className="px-3 py-2 h-full bg-white flex flex-center gap-3 rounded-full text-gray-600 shrink-0 hover:brightness-95"
        >
          <PlusIcon className="h-6 w-6 cursor-pointer text-gray-600" />
          Tạo thực đơn
        </Link>
      </div>
      {/* BREADCRUMBS */}
      <Breadcrumb marginTop={20} className="text-gray-400">
        <BreadcrumbItem>
          <BreadcrumbLink
            className="text-gray-400 hover:text-gray-200"
            href="/admin/yeu-cau"
          >
            Thực đơn /
          </BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>

      <FormProvider {...methods}>
        <form action="#" noValidate onSubmit={(e) => e.preventDefault()}>
          {/* MENU TOOLBAR */}
          <div className="flex items-center gap-5 mt-8 w-full">
            {/* SORT BY */}
            <div className="flex items-center gap-3">
              <p className="text-gray-600">Sắp xếp:</p>
              <select>
                <option value="asc">Giá tăng dần</option>
                <option value="desc">Giá giảm dần</option>
              </select>
            </div>

            {/* ACTIONS */}
            <div className="flex gap-5 flex-1 justify-end items-center">
              <Checkbox
                className="bg-white rounded-lg h-full py-2 text-sm font-normal"
                defaultChecked={false}
                onChange={handleSelectAll}
              >
                Chọn tất cả
              </Checkbox>
              <ButtonGroup variant="flat">
                <Button className="bg-white text-gray-600">
                  {labelsMap[selectedOptionValue]}
                </Button>
                <Dropdown placement="bottom-end">
                  <DropdownTrigger>
                    <Button isIconOnly className="bg-white">
                      <ChevronDownIcon className="w-6 h-6 text-gray-600" />
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu
                    disallowEmptySelection
                    aria-label="Chỉnh sửa thực đơn"
                    selectedKeys={selectedOption}
                    selectionMode="single"
                    onSelectionChange={setSelectedOption}
                    className="max-w-[300px]"
                  >
                    {Object.keys(labelsMap).map((label) => (
                      <DropdownItem
                        key={label}
                        // description={descriptionsMap[label]}
                      >
                        {labelsMap[label]}
                      </DropdownItem>
                    ))}
                  </DropdownMenu>
                </Dropdown>
              </ButtonGroup>
            </div>
          </div>

          {/* MENU LIST */}
          {status === "loading" && <div>Loading...</div>}
          {status === "failed" && <div>Error: {error}</div>}
          {status === "succeeded" && (
            <MenuList
              menuList={menuItems}
              onCheckboxChange={handleCheckboxChange}
            />
          )}
        </form>
      </FormProvider>
    </div>
  );
}

export default Page;
