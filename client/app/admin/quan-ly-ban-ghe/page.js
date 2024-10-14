"use client";

import AdminHeader from "@/app/_components/AdminHeader";
import TableData from "@/app/_components/TableData";
import PageBreadcrumbs from "./PageBreadcrumbs";
import {
  Button,
  Chip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  User,
} from "@nextui-org/react";
import { EllipsisVerticalIcon, PlusIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { SearchIcon } from "@/app/_components/SearchIcon";
import { ChevronDownIcon } from "@/app/_components/ChevronDownIcon";
import React, { useEffect } from "react";
import { capitalize } from "@/app/_utils/helpers";
import { usePathname, useRouter } from "next/navigation";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/modal";
import CustomInput from "@/app/_components/CustomInput";
import { _require } from "@/app/_utils/validations";
import { FormProvider, useForm } from "react-hook-form";

const statusColorMap = {
  active: "success",
  paused: "danger",
  vacation: "warning",
};

const INITIAL_VISIBLE_COLUMNS = [
  "category",
  "name",
  "image",
  "capacity",
  "price",
  "status",
  "actions",
];

function Page() {
  const methods = useForm();

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const data = [
    {
      id: 1,
      category: "table",
      name: "Bàn 1",
      capacity: 10,
      image: "",
      status: "available",
      price: 100000,
    },
    {
      id: 2,
      category: "table",
      name: "Bàn 2",
      capacity: 10,
      image: "",
      status: "available",
      price: 100000,
    },
    {
      id: 3,
      category: "chair",
      name: "Ghế 1",
      capacity: 10,
      image: "",
      status: "available",
      price: 100000,
    },
    {
      id: 4,
      category: "chair",
      name: "Ghế 2",
      capacity: 10,
      image: "",
      status: "available",
      price: 100000,
    },
    {
      id: 5,
      category: "table",
      name: "Bàn 3",
      capacity: 10,
      image: "",
      status: "available",
      price: 100000,
    },
    {
      id: 6,
      category: "table",
      name: "Bàn 4",
      capacity: 10,
      image: "",
      status: "available",
      price: 100000,
    },
    {
      id: 7,
      category: "chair",
      name: "Ghế 3",
      capacity: 10,
      image: "",
      status: "available",
      price: 120000,
    },
    {
      id: 8,
      category: "chair",
      name: "Ghế 4",
      capacity: 10,
      image: "",
      status: "available",
      price: 120000,
    },
  ];

  const statusOptions = [
    { name: "Available", uid: 1 },
    { name: "Unavailable", uid: 2 },
  ];

  const columns = [
    { name: "Loại", uid: "category", sortable: true },
    { name: "Tên", uid: "name", sortable: true },
    { name: "Ảnh", uid: "image" },
    { name: "Sức chứa", uid: "capacity", sortable: true },
    { name: "Giá", uid: "price", sortable: true },
    { name: "Trạng thái", uid: "status", sortable: true },
    { name: "Hành động", uid: "actions" },
  ];

  const [filterValue, setFilterValue] = React.useState("");
  const [selectedKeys, setSelectedKeys] = React.useState(new Set([]));
  const [visibleColumns, setVisibleColumns] = React.useState(
    new Set(INITIAL_VISIBLE_COLUMNS)
  );
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [sortDescriptor, setSortDescriptor] = React.useState({
    column: "age",
    direction: "ascending",
  });
  const [page, setPage] = React.useState(1);

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    );
  }, [visibleColumns]);

  const filteredItems = React.useMemo(() => {
    let filteredData = [...data];

    if (hasSearchFilter) {
      filteredData = filteredData.filter((item) =>
        user.name.toLowerCase().includes(filterValue.toLowerCase())
      );
    }
    if (
      statusFilter !== "all" &&
      Array.from(statusFilter).length !== statusOptions.length
    ) {
      filteredData = filteredData.filter((user) =>
        Array.from(statusFilter).includes(user.status)
      );
    }

    return filteredData;
  }, [data, filterValue, statusFilter]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = React.useMemo(() => {
    return [...items].sort((a, b) => {
      const first = a[sortDescriptor.column];
      const second = b[sortDescriptor.column];
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const renderCell = React.useCallback((item, columnKey) => {
    const cellValue = item[columnKey];

    switch (columnKey) {
      case "category":
        return (
          <Chip
            className="capitalize"
            color={statusColorMap[item.status]}
            size="sm"
            variant="flat"
            color={cellValue === "table" ? "primary" : "warning"}
          >
            {cellValue === "table" ? "Bàn" : "Ghế"}
          </Chip>
        );
      case "status":
        return (
          <Chip
            className="capitalize"
            color={statusColorMap[item.status]}
            size="sm"
            variant="flat"
            color={cellValue === 1 ? "primary" : "warning"}
          >
            {cellValue === 1 ? "Không có sẵn" : "Có sẵn"}
          </Chip>
        );
      case "actions":
        return (
          <div className="relative flex justify-start items-center gap-2">
            <Dropdown>
              <DropdownTrigger>
                <Button isIconOnly size="sm" variant="light">
                  <EllipsisVerticalIcon className="text-default-300" />
                </Button>
              </DropdownTrigger>
              <DropdownMenu>
                <DropdownItem
                  onClick={() => {
                    setFormState(() => ({
                      name: item.name,
                      price: item.price,
                      capacity: item.capacity,
                      category: item.category,
                    }));
                    onOpen();
                  }}
                >
                  Chỉnh sửa
                </DropdownItem>
                <DropdownItem className="text-red-400">Xóa</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        );
      default:
        return cellValue;
    }
  }, []);

  const onNextPage = React.useCallback(() => {
    if (page < pages) {
      setPage(page + 1);
    }
  }, [page, pages]);

  const onPreviousPage = React.useCallback(() => {
    if (page > 1) {
      setPage(page - 1);
    }
  }, [page]);

  const onRowsPerPageChange = React.useCallback((e) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
  }, []);

  const onSearchChange = React.useCallback((value) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const onClear = React.useCallback(() => {
    setFilterValue("");
    setPage(1);
  }, []);

  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-4 mt-8">
        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            classNames={{
              inputWrapper:
                "!bg-whiteAlpha-100 text-white hover:!bg-whiteAlpha-200 focus:!bg-whiteAlpha-200 active:!bg-whiteAlpha-200",
              input: "!text-white",
              placeholder: "!text-white-400",
            }}
            placeholder="Tìm kiếm theo tên..."
            startContent={<SearchIcon />}
            value={filterValue}
            onClear={() => onClear()}
            onValueChange={onSearchChange}
          />
          <div className="flex gap-3">
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  endContent={<ChevronDownIcon className="text-small" />}
                  className="text-gray-200 bg-whiteAlpha-100"
                >
                  Hiển thị
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={visibleColumns}
                selectionMode="multiple"
                onSelectionChange={setVisibleColumns}
              >
                {columns.map((column) => (
                  <DropdownItem key={column.uid} className="capitalize">
                    {capitalize(column.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Button
              startContent={<PlusIcon className="h-6 w-6 text-white" />}
              className="text-white bg-whiteAlpha-100"
              onClick={() => {
                setFormState(() => initialFormState);
                onOpen();
              }}
            >
              Thêm
            </Button>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            Tổng {data.length}
          </span>
          <label className="flex items-center text-default-400 text-small">
            Dòng trên trang:
            <select
              className="bg-transparent outline-none text-default-400 text-small"
              onChange={onRowsPerPageChange}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
            </select>
          </label>
        </div>
      </div>
    );
  }, [
    filterValue,
    statusFilter,
    visibleColumns,
    onRowsPerPageChange,
    data.length,
    onSearchChange,
    hasSearchFilter,
  ]);

  const bottomContent = React.useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center">
        <span className="w-[30%] text-small text-default-400">
          {selectedKeys === "all"
            ? "Đã chọn tất cả"
            : `Đã chọn ${selectedKeys.size} / ${filteredItems.length}`}
        </span>
        <Pagination
          isCompact
          showControls
          showShadow
          page={page}
          total={pages}
          onChange={setPage}
        />
        <div className="hidden sm:flex w-[30%] justify-end gap-2">
          <Button
            isDisabled={pages === 1}
            size="sm"
            variant="flat"
            className="text-white"
            onPress={onPreviousPage}
          >
            Trước
          </Button>
          <Button
            isDisabled={pages === 1}
            size="sm"
            variant="flat"
            className="text-white"
            onPress={onNextPage}
          >
            Sau
          </Button>
        </div>
      </div>
    );
  }, [selectedKeys, items.length, page, pages, hasSearchFilter]);

  const initialFormState = {
    name: "",
    price: "",
    capacity: "",
    category: "table",
  };

  const [formState, setFormState] = React.useState(initialFormState);

  const onSubmit = methods.handleSubmit((data) => {
    console.log({ ...data, category: formState.category });
  });

  return (
    <div>
      {/* HEADER */}
      <AdminHeader title="Quản lý bàn ghế" />
      {/* BREADCRUMBS */}
      <PageBreadcrumbs />

      {/* MAIN */}
      <Table
        aria-label="Example table with custom cells, pagination and sorting"
        isHeaderSticky
        bottomContent={bottomContent}
        bottomContentPlacement="outside"
        classNames={{
          thead:
            "!bg-whiteAlpha-100 has-[role=columnheader]:bg-whiteAlpha-200 [&>tr>th]:bg-whiteAlpha-200 [&>tr]:first:shadow-none",
          wrapper: "!bg-whiteAlpha-100",
          root: "w-full",
          td: "!text-white group-aria-[selected=false]:group-data-[hover=true]:before:bg-whiteAlpha-100 before:bg-whiteAlpha-50 data-[hover=true]:before:bg-whiteAlpha-100",
          row: "hover:!bg-whiteAlpha-50 !bg-whiteAlpha-100 !text-white",
          cell: "!text-white",
          pagination: "bg-default-100",
          paginationControl: "bg-default-100",
          paginationCursor: "!bg-gold",
        }}
        selectedKeys={selectedKeys}
        selectionMode="multiple"
        sortDescriptor={sortDescriptor}
        topContent={topContent}
        topContentPlacement="outside"
        onSelectionChange={setSelectedKeys}
        onSortChange={setSortDescriptor}
      >
        <TableHeader
          columns={headerColumns}
          className="!bg-whiteAlpha-100 has-[role=columnheader]:bg-whiteAlpha-200 here"
        >
          {(column) => (
            <TableColumn
              key={column.uid}
              align={column.uid === "actions" ? "center" : "start"}
              allowsSorting={column.sortable}
              className="group px-3 h-10 align-middle bg-whiteAlpha-200 whitespace-nowrap text-white text-tiny font-semibold first:rounded-l-lg rtl:first:rounded-r-lg rtl:first:rounded-l-[unset] last:rounded-r-lg rtl:last:rounded-l-lg rtl:last:rounded-r-[unset] data-[sortable=true]:cursor-pointer data-[hover=true]:text-foreground-400 outline-none data-[focus-visible=true]:z-10 data-[focus-visible=true]:outline-2 data-[focus-visible=true]:outline-focus data-[focus-visible=true]:outline-offset-2 text-start [& data-[selected=true]:bg-whiteAlpha-100 "
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody emptyContent={"No data found"} items={sortedItems}>
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => (
                <TableCell className="py-2 px-3 relative align-middle whitespace-normal text-small font-normal [&>*]:z-1 [&>*]:relative outline-none data-[focus-visible=true]:z-10 data-[focus-visible=true]:outline-2 data-[focus-visible=true]:outline-focus data-[focus-visible=true]:outline-offset-2 before:content-[''] before:absolute before:z-0 before:inset-0 before:opacity-0  before:bg-whiteAlpha-50 group-data-[first=true]:first:before:rounded-tl-lg group-data-[first=true]:rtl:first:before:rounded-tr-lg group-data-[first=true]:rtl:first:before:rounded-tl-[unset] group-data-[first=true]:last:before:rounded-tr-lg group-data-[first=true]:rtl:last:before:rounded-tl-lg group-data-[first=true]:rtl:last:before:rounded-tr-[unset] group-data-[middle=true]:before:rounded-none group-data-[last=true]:first:before:rounded-bl-lg group-data-[last=true]:rtl:first:before:rounded-br-lg group-data-[last=true]:rtl:first:before:rounded-bl-[unset] group-data-[last=true]:last:before:rounded-br-lg group-data-[last=true]:rtl:last:before:rounded-bl-lg group-data-[last=true]:rtl:last:before:rounded-br-[unset] text-start !text-white data-[selected=true]:before:opacity-100 group-dlata-[disabed=true]:text-foreground-300 group-data-[disabled=true]:cursor-not-allowed !before:bg-whiteAlpha-50 data-[selected=true]:text-default-foreground group-aria-[selected=false]:group-data-[hover=true]:before:bg-whiteAlpha-50 group-aria-[selected=false]:group-data-[hover=true]:before:opacity-100">
                  {renderCell(item, columnKey)}
                </TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <FormProvider {...methods}>
              <form action="#" noValidate onSubmit={(e) => e.preventDefault()}>
                <ModalHeader className="flex flex-col gap-1">
                  Thêm trang thiết bị
                </ModalHeader>
                <ModalBody>
                  <CustomInput
                    name="name"
                    validation={_require}
                    placeholder="Nhập tên thiết bị"
                    ariaLabel={"Tên thiết bị"}
                    label="Tên thiết bị"
                    labelPlacement="outside"
                    classNames={{
                      input:
                        "bg-blackAlpha-100 text-white hover:bg-blackAlpha-200 focus:bg-blackAlpha-200 active:bg-blackAlpha-200",
                      label: "font-semibold",
                    }}
                    value={formState.name}
                    onChange={(e) =>
                      setFormState({ ...formState, name: e.target.value })
                    }
                  />
                  <CustomInput
                    name="price"
                    placeholder="Nhập giá"
                    validation={_require}
                    ariaLabel={"Giá"}
                    label="Giá"
                    labelPlacement="outside"
                    classNames={{
                      input:
                        "bg-blackAlpha-100 text-white hover:bg-blackAlpha-200 focus:bg-blackAlpha-200 active:bg-blackAlpha-200",
                      label: "font-semibold",
                    }}
                    value={formState.price}
                    onChange={(e) =>
                      setFormState({ ...formState, price: e.target.value })
                    }
                  />
                  <CustomInput
                    name="capacity"
                    validation={_require}
                    ariaLabel={"Sức chứa"}
                    label="Sức chứa"
                    labelPlacement="outside"
                    placeholder="Nhập sức chứa"
                    classNames={{
                      input:
                        "bg-blackAlpha-100 text-white hover:bg-blackAlpha-200 focus:bg-blackAlpha-200 active:bg-blackAlpha-200",
                      label: "font-semibold",
                    }}
                    value={formState.capacity}
                    onChange={(e) =>
                      setFormState({ ...formState, capacity: e.target.value })
                    }
                  />
                  <CustomInput
                    inputType={"select"}
                    ariaLabel={"Danh mục"}
                    name={"category"}
                    label={"Danh mục"}
                    value={formState.category}
                    id="category"
                    onChange={(e) => {
                      setFormState({
                        ...formState,
                        category: e.target.value,
                      });
                    }}
                    options={[
                      { value: "table", label: "Bàn" },
                      { value: "chair", label: "Ghế" },
                    ]}
                    validation={{ required: true }}
                  />
                  {/* <div className="flex flex-col">
                    <p className="font-semibold text-small leading-8">
                      Danh mục
                    </p>
                    <select
                    name="category"
                    className="bg-blackAlpha-100"
                    value={formState.category}
                      id="category"
                      onChange={(e) => {
                        setFormState({
                          ...formState,
                          category: e.target.value,
                        });
                      }}
                    >
                      <option value="table">Bàn</option>
                      <option value="chair">Ghế</option>
                    </select>
                  </div> */}
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="light" onPress={onClose}>
                    Close
                  </Button>
                  <Button color="primary" onPress={onSubmit}>
                    Action
                  </Button>
                </ModalFooter>
              </form>
            </FormProvider>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}

export default Page;
