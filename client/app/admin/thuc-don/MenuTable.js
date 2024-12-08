import {
  ExclamationCircleIcon,
  EllipsisVerticalIcon as VerticalDotsIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { parseDate } from "@internationalized/date";
import {
  Button,
  Chip,
  DateRangePicker,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  User,
} from "@nextui-org/react";
import { format } from "date-fns";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React from "react";
import { BsMoon, BsSun } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import useApiServices from "@/app/_hooks/useApiServices";
import useCustomToast from "@/app/_hooks/useCustomToast";
import {
  deleteMenu,
  destroyMenu,
  fetchRequests,
  getDeletedMenuList,
  getMenuList,
  updateRequestStatus,
} from "@/app/_lib/features/menu/menuSlice";
import { CONFIG } from "@/app/_utils/config";
import { capitalize } from "@/app/_utils/helpers";
import { ChevronDownIcon } from "@/app/_components/ChevronDownIcon";
import CustomPagination from "@/app/_components/CustomPagination";
import LoadingContent from "@/app/_components/LoadingContent";
import SearchForm from "@/app/_components/SearchForm";
import { Image } from "antd";
import { formatPrice } from "@/app/_utils/formaters";

const INITIAL_VISIBLE_COLUMNS = ["id", "images", "name", "price", "actions"];

const columns = [
  { name: "ID", uid: "id", sortable: true },
  { name: "Hình ảnh", uid: "images" },
  { name: "Tên", uid: "name", sortable: true },
  { name: "Giá", uid: "price", sortable: true },
  { name: "Hành động", uid: "actions" },
];

function MenuTable() {
  const pathname = usePathname();
  const router = useRouter();
  const {
    menuList,
    isFetchingMenuList,
    isFetchingMenuListError,
    isDeletingMenu,
    pagination,
    error,
  } = useSelector((store) => store.menu);
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = React.useState(1);
  const [itemsPerPage, setItemsPerPage] = React.useState(10);
  const [date, setDate] = React.useState({
    start: parseDate(
      format(new Date(new Date().getFullYear(), 0, 1), "yyyy-MM-dd")
    ),
    end: parseDate(
      format(new Date(new Date().getFullYear(), 11, 31), "yyyy-MM-dd")
    ),
  });
  const [searchQuery, setSearchQuery] = React.useState("");
  const [menuStatus, setMenuStatus] = React.useState(CONFIG.MENU_STATUS[0].key);
  const toast = useCustomToast();

  // Function to convert the custom date object to a standard Date object
  const toStandardDate = (customDate) => {
    return new Date(customDate.year, customDate.month - 1, customDate.day);
  };

  // Format the dates to "dd-MM-yyyy"
  const formattedStartDate = format(toStandardDate(date.start), "dd-MM-yyyy");
  const formattedEndDate = format(toStandardDate(date.end), "dd-MM-yyyy");

  const onStatusChange = (e) => {
    const status = e.target.value;
    setMenuStatus(status);
  };

  const onPageChange = (page) => {
    setCurrentPage(page);
  };

  const onSearchChange = React.useCallback((e) => {
    const query = e.target.value;
    setSearchQuery(query);
  }, []);

  const handleDeleteMenu = async (id) => {
    const result = await dispatch(deleteMenu(id)).unwrap();

    console.log(result);

    if (result.success) {
      toast({
        title: "Xóa thực đơn thành công",
        description: 'Bạn vẫn có thể xem trong mục "Đã xóa"',
        type: "success",
      });
    } else {
      if (result.error.statusCode == 401) {
        toast({
          title: "Xóa thực đơn thất bại",
          description: "Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại",
          type: "error",
        });
      } else {
        toast({
          title: "Xóa thực đơn thất bại",
          description: "Vui lòng thử lại sau",
          type: "error",
        });
      }
    }
  };

  const handleDestroyMenu = async (id) => {
    try {
      const result = await dispatch(destroyMenu(id)).unwrap();

      if (result.success) {
        toast({
          title: "Xóa thành công",
          description: "Thực đơn đã bị xóa vĩnh viễn",
          type: "success",
        });
      } else {
        toast({
          title: "Xóa thất bại",
          description: "Vui lòng thử lại sau",
          type: "error",
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  React.useEffect(() => {
    const params = {
      status: menuStatus,
      page: currentPage,
      itemsPerPage,
      startDate: formattedStartDate,
      endDate: formattedEndDate,
      is_show: true,
    };

    if (menuStatus === "active") {
      dispatch(getMenuList({ params }));
    } else {
      dispatch(getDeletedMenuList({ params }));
    }

    return () => {};
  }, [
    currentPage,
    itemsPerPage,
    menuStatus,
    formattedEndDate,
    formattedStartDate,
    router,
  ]);

  React.useEffect(() => {
    const controller = new AbortController();

    const params = {
      page: currentPage,
      itemsPerPage,
      search: searchQuery,
      startDate: formattedStartDate,
      endDate: formattedEndDate,
      is_show: true,
    };

    dispatch(getMenuList({ signal: controller.signal, params }));

    return () => {
      controller.abort();
    };
  }, [
    currentPage,
    itemsPerPage,
    searchQuery,
    menuStatus,
    formattedEndDate,
    formattedStartDate,
    router,
  ]);

  const [selectedKeys, setSelectedKeys] = React.useState(new Set([]));
  const [visibleColumns, setVisibleColumns] = React.useState(
    new Set(INITIAL_VISIBLE_COLUMNS)
  );
  const [sortDescriptor, setSortDescriptor] = React.useState({
    column: "id",
    direction: "ascending",
  });
  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    );
  }, [visibleColumns]);
  const sortedItems = React.useMemo(() => {
    return [...menuList].sort((a, b) => {
      const first = a[sortDescriptor.column];
      const second = b[sortDescriptor.column];
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, menuList]);

  const renderCell = React.useCallback(
    (item, columnKey) => {
      const cellValue = item[columnKey];

      switch (columnKey) {
        case "images":
          return (
            <Image
              src={cellValue.at(0) || CONFIG.IMAGE_PLACEHOLDER}
              alt="menu image"
              width={50}
              height={80}
              className="rounded-lg object-cover"
            />
          );
        case "name":
          return (
            <div className="flex items-center gap-2">
              <span>{cellValue}</span>
            </div>
          );
        case "price":
          return <span>{formatPrice(cellValue)}</span>;
        case "actions":
          return (
            <div className="relative flex justify-center items-center gap-2">
              <Dropdown>
                <DropdownTrigger>
                  <Button isIconOnly size="sm" variant="light">
                    <VerticalDotsIcon className="text-default-300" />
                  </Button>
                </DropdownTrigger>
                <DropdownMenu>
                  <DropdownItem>
                    <Link href={`${pathname}/${item.id}`}>Xem chi tiết</Link>
                  </DropdownItem>

                  {menuStatus == "deleted" ? (
                    <DropdownItem
                      onClick={() => handleDestroyMenu(item.id)}
                      className={`text-red-400 ${
                        item.status === "cancel" ? "hidden" : ""
                      }`}
                    >
                      {`Xóa vĩnh viễn`}
                    </DropdownItem>
                  ) : (
                    <DropdownItem
                      onClick={() => handleDeleteMenu(item.id)}
                      className={`text-red-400 ${
                        item.status === "cancel" ? "hidden" : ""
                      }`}
                    >
                      {`Xóa thực đơn này`}
                    </DropdownItem>
                  )}
                </DropdownMenu>
              </Dropdown>
            </div>
          );
        default:
          return cellValue;
      }
    },
    [pathname, menuStatus]
  );

  const onItemsPerPageChange = React.useCallback((e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  }, []);

  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-4 mt-8">
        <div className="flex justify-between gap-3 items-center">
          <label className="flex items-center text-default-400 text-small">
            Dòng trên trang:
            <select
              className="bg-transparent outline-none text-default-400 text-small"
              onChange={onItemsPerPageChange}
              value={itemsPerPage}
            >
              {CONFIG.ITEMS_PER_PAGE.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
          <div className="flex gap-3 items-center">
            <SearchForm
              placeholder={"Tìm kiếm theo tên"}
              classNames={{
                input: "text-white",
              }}
              value={searchQuery}
              onChange={onSearchChange}
            />
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  endContent={<ChevronDownIcon className="text-small" />}
                  className="text-gray-200 bg-whiteAlpha-100"
                  radius="full"
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
            <select
              className="select rounded-full"
              onChange={onStatusChange}
              value={menuStatus}
            >
              {CONFIG.MENU_STATUS.map((item) => {
                return (
                  <option key={item.key} value={item.key} className="option">
                    {item.label}
                  </option>
                );
              })}
            </select>
            <div className="flex-1 justify-end flex">
              <DateRangePicker
                value={date}
                onChange={setDate}
                className="w-fit"
                aria-label="Date Range Picker"
                classNames={{
                  inputWrapper: "!bg-whiteAlpha-100 rounded-full",
                  "start-input": "text-white *:text-white",
                  "end-input": "text-white *:text-white",
                  innerWrapper:
                    "text-white [&>data-[slot=start-input]>data-[slot=segment]]:text-white",
                  segment:
                    "text-white data-[editable=true]:text-white data-[editable=true]:data-[placeholder=true]:text-white",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }, [visibleColumns, itemsPerPage, searchQuery, date, menuStatus]);

  const bottomContent = React.useMemo(() => {
    return (
      <CustomPagination
        page={currentPage}
        total={pagination.lastPage}
        onChange={onPageChange}
        classNames={{
          base: "flex justify-center",
        }}
      />
    );
  }, [currentPage, pagination.lastPage]);

  // console.log(menu);

  return (
    <Table
      aria-label="Example table with custom cells, pagination and sorting"
      isHeaderSticky
      bottomContent={bottomContent}
      bottomContentPlacement="inside"
      classNames={{
        thead:
          "has-[role=columnheader]:bg-whiteAlpha-200 [&>tr>th]:bg-whiteAlpha-200",
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
      selectionMode="single"
      sortDescriptor={sortDescriptor}
      topContent={topContent}
      topContentPlacement="outside"
      onSelectionChange={setSelectedKeys}
      onSortChange={setSortDescriptor}
      selectionBehavior="replace"
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
      <TableBody
        emptyContent={
          isFetchingMenuListError ? error : "Không tìm thấy thực đơn"
        }
        items={sortedItems}
        isLoading={isFetchingMenuList || isDeletingMenu}
        loadingContent={<LoadingContent />}
      >
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
  );
}

export default MenuTable;
