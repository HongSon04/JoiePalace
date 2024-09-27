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
  const toast = useToast();

  const dispatch = useDispatch();
  const { menuList, status, selectAll, selectedMenuId } = useSelector(
    (store) => store.menu
  );

  const methods = useForm();

  useEffect(() => {
    dispatch(fetchMenuItems());
  }, [dispatch]);

  const handleSelectAll = (event) => {
    dispatch(toggleSelectAll(event.target.checked));
    dispatch(setSelectedMenuId(menuList.map((item) => item.id)));
    toast({
      position: "top-right",
      render: () => (
        <Box color="gray.600" p={3} bg="white" rounded={"8px"}>
          {event.target.checked ? "Chọn tất cả" : "Bỏ chọn tất cả"}
        </Box>
      ),
      isClosable: true,
      duration: 1000,
    });
  };

  const handleCheckboxChange = (id) => {
    dispatch(toggleCheckbox(id));
    dispatch(setSelectedMenuId(id));
  };

  const [selectedOption, setSelectedOption] = useState(new Set(["edit"]));

  const handleEdit = () => {
    console.log("Edit menu");
    console.log(selectedMenuId);
  };

  const handleDelete = () => {
    console.log("Delete menu");
    console.log(selectedMenuId);
  };

  const handleActivate = () => {
    console.log("Activate menu");
    console.log(selectedMenuId);
  };

  const handleDeactivate = () => {
    console.log("Deactivate menu");
    console.log(selectedMenuId);
  };

  const labelsMap = {
    edit: {
      label: "Chỉnh sửa thực đơn",
      action: handleEdit,
    },
    delete: {
      label: "Xóa thực đơn",
      action: handleDelete,
    },
    active: {
      label: "Active thực đơn",
      action: handleActivate,
    },
    unactive: {
      label: "Unactive thực đơn",
      action: handleDeactivate,
    },
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
          className="px-3 py-2 h-full bg-whiteAlpha-100 flex flex-center gap-3 rounded-full text-white shrink-0 hover:whiteAlpha-200"
        >
          <PlusIcon className="h-6 w-6 cursor-pointer text-white" />
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
              <h4 className="text-white">Sắp xếp:</h4>
              <select className="select">
                <option className="option" value="asc">
                  Giá tăng dần
                </option>
                <option className="option" value="desc">
                  Giá giảm dần
                </option>
              </select>
            </div>

            {/* ACTIONS */}
            <div className="flex gap-5 flex-1 justify-end items-center">
              <Checkbox
                className="bg-whiteAlpha-100 rounded-lg h-full py-2 px-3 text-sm font-normal"
                defaultChecked={false}
                onChange={handleSelectAll}
                classNames={{
                  label: "text-white",
                }}
              >
                Chọn tất cả
              </Checkbox>
              <ButtonGroup variant="flat">
                <Button
                  className="bg-whiteAlpha-100 text-white"
                  onClick={labelsMap[selectedOptionValue].action}
                >
                  {labelsMap[selectedOptionValue].label}
                </Button>
                <Dropdown placement="bottom-end">
                  <DropdownTrigger>
                    <Button isIconOnly className="bg-whiteAlpha-100">
                      <ChevronDownIcon className="w-6 h-6 text-white" />
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
              menuList={menuList}
              isSelectAll={selectAll}
              onCheckboxChange={handleCheckboxChange}
            />
          )}
        </form>
      </FormProvider>
    </div>
  );
}

export default Page;
