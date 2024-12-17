import { ChevronDownIcon } from "@/app/_components/ChevronDownIcon";
import CustomPagination from "@/app/_components/CustomPagination";
import LoadingContent from "@/app/_components/LoadingContent";
import SearchForm from "@/app/_components/SearchForm";
import useApiServices from "@/app/_hooks/useApiServices";
import useCustomToast from "@/app/_hooks/useCustomToast";
import { API_CONFIG } from "@/app/_utils/api.config";
import { CONFIG } from "@/app/_utils/config";
import { formatPrice, toStandardDate } from "@/app/_utils/formaters";
import { capitalize } from "@/app/_utils/helpers";
import { EllipsisVerticalIcon as VerticalDotsIcon } from "@heroicons/react/24/outline";
import { parseDate } from "@internationalized/date";
import {
  Button,
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
} from "@nextui-org/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Image } from "antd";
import { format } from "date-fns";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { useDispatch } from "react-redux";

const INITIAL_VISIBLE_COLUMNS = ["id", "images", "name", "price", "actions"];

const columns = [
  { name: "ID", uid: "id", sortable: true },
  { name: "Hình ảnh", uid: "images" },
  { name: "Tên", uid: "name", sortable: true },
  { name: "Giá", uid: "price", sortable: true },
  { name: "Hành động", uid: "actions" },
];

function BranchesTable() {
  const pathname = usePathname();
  const [page, setpage] = React.useState(1);
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
  const [branchStatus, setbranchStatus] = React.useState(
    CONFIG.MENU_STATUS[0].key
  );
  const toast = useCustomToast();
  const { makeAuthorizedRequest } = useApiServices();
  const queryClient = useQueryClient();

  const {
    data: branches,
    isLoading: isFetchingBranches,
    isError: isFetchingBranchesError,
  } = useQuery({
    queryKey: ["branches", searchQuery, branchStatus, page, itemsPerPage],
    queryFn: async () => {
      const api =
        branchStatus === "deleted"
          ? API_CONFIG.MENU.GET_ALL_DELETED({
              search: searchQuery,
              page,
              itemsPerPage,
              startDate: formattedStartDate,
              endDate: formattedEndDate,
              is_show: true,
            })
          : API_CONFIG.MENU.GET_ALL({
              search: searchQuery,
              page: page,
              itemsPerPage,
              startDate: formattedStartDate,
              endDate: formattedEndDate,
              is_show: true,
            });

      const response = await makeAuthorizedRequest(api);

      if (response.success) return response;
      else throw new Error("Failed to fetch menu");
    },
  });

  // Format the dates to "dd-MM-yyyy"
  const formattedStartDate = format(toStandardDate(date.start), "dd-MM-yyyy");
  const formattedEndDate = format(toStandardDate(date.end), "dd-MM-yyyy");

  const onStatusChange = (e) => {
    const status = e.target.value;
    setbranchStatus(status);
  };

  const onPageChange = (page) => {
    setpage(page);
  };

  const onSearchChange = React.useCallback((e) => {
    const query = e.target.value;
    setSearchQuery(query);
  }, []);

  const {
    mutate: deleteMenu,
    isPending: isDeletingMenu,
    isError: isDeletingMenuError,
  } = useMutation({
    mutationKey: ["deleteMenu"],
    mutationFn: async (id) => {
      toast({
        title: "Đang xóa thực đơn...",
        description: "Vui lòng chờ!",
        type: "info",
      });

      try {
        const response = await makeAuthorizedRequest(
          API_CONFIG.MENU.DELETE(id),
          "DELETE",
          { menu_id: id }
        );

        if (response.success) {
          toast({
            title: "Xóa thành công",
            description: "Thực đơn đã được xóa",
            type: "success",
          });
        } else {
          if (response.error.statusCode === 401) {
            toast({
              title: "Lỗi khi xóa thực đơn",
              description: "Phiên đăng nhập đã hết hạn",
              type: "error",
              isClosable: true,
            });
          } else {
            toast({
              title: "Lỗi khi xóa thực đơn",
              description:
                response.error.message || "Có lỗi xảy ra khi xóa thực đơn",
              type: "error",
              isClosable: true,
            });
          }
        }
      } catch (error) {
        return error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menu"] });
    },
  });

  const {
    mutate: destroyMenu,
    isPending: isDestroyingMenu,
    isError: isDestroyingMenuError,
  } = useMutation({
    mutationKey: ["destroyMenu"],
    mutationFn: async (id) => {
      if (typeof window === undefined) return;

      const confirm = window.confirm(
        "Bạn có chắc muốn xóa vĩnh viễn thực đơn này"
      );

      if (!confirm) return;

      toast({
        title: "Đang xóa vĩnh viễn thực đơn...",
        description: "Vui lòng chờ!",
        type: "info",
      });

      try {
        const response = await makeAuthorizedRequest(
          API_CONFIG.MENU.DESTROY(id),
          "DELETE",
          { menu_id: id }
        );

        if (response.success) {
          toast({
            title: "Xóa vĩnh viễn thành công",
            description: "Thực đơn đã được xóa vĩnh viễn",
            type: "success",
          });
        } else {
          if (response.error.statusCode === 401) {
            toast({
              title: "Lỗi khi xóa vĩnh viễn thực đơn",
              description: "Phiên đăng nhập đã hết hạn",
              type: "error",
              isClosable: true,
            });
          } else {
            toast({
              title: "Lỗi khi xóa vĩnh viễn thực đơn",
              description:
                response.error.message ||
                "Có lỗi xảy ra khi xóa vĩnh viễn thực đơn",
              type: "error",
              isClosable: true,
            });
          }
        }
      } catch (error) {
        return error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menu"] });
    },
  });

  const {
    mutate: restoreMenu,
    isPending: isRestoringMenu,
    isError: isRestoringMenuError,
  } = useMutation({
    mutationKey: ["restoreMenu"],
    mutationFn: async (id) => {
      toast({
        title: "Đang khôi phục thực đơn...",
        description: "Vui lòng chờ!",
        type: "info",
      });

      try {
        const response = await makeAuthorizedRequest(
          API_CONFIG.MENU.RESTORE(id),
          "PUT",
          { menu_id: id }
        );

        if (response.success) {
          toast({
            title: "Khôi phục thành công",
            description: "Thực đơn đã được khôi phục",
            type: "success",
          });
        } else {
          if (response.error.statusCode === 401) {
            toast({
              title: "Lỗi khi khôi phục thực đơn",
              description: "Phiên đăng nhập đã hết hạn",
              type: "error",
              isClosable: true,
            });
          } else {
            toast({
              title: "Lỗi khi khôi phục thực đơn",
              description:
                response.error.message ||
                "Có lỗi xảy ra khi khôi phục thực đơn",
              type: "error",
              isClosable: true,
            });
          }
        }
      } catch (error) {
        return rejectWithValue(error.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menu"] });
    },
  });

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
    if (!menu?.data) return [];

    return [...menu?.data].sort((a, b) => {
      const first = a[sortDescriptor.column];
      const second = b[sortDescriptor.column];
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, menu?.data]);

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

                {branchStatus == "deleted" ? (
                  <DropdownMenu>
                    <DropdownItem>
                      <Link href={`${pathname}/${item.id}`}>Xem chi tiết</Link>
                    </DropdownItem>
                    <DropdownItem onClick={() => restoreMenu(item.id)}>
                      {`Khôi phục thực đơn`}
                    </DropdownItem>
                    <DropdownItem
                      onClick={() => destroyMenu(item.id)}
                      className={`text-red-400 ${
                        item.status === "cancel" ? "hidden" : ""
                      }`}
                    >
                      {`Xóa vĩnh viễn`}
                    </DropdownItem>
                  </DropdownMenu>
                ) : (
                  <DropdownMenu>
                    <DropdownItem>
                      <Link href={`${pathname}/${item.id}`}>Xem chi tiết</Link>
                    </DropdownItem>
                    <DropdownItem
                      onClick={() => deleteMenu(item.id)}
                      className={`text-red-400 ${
                        item.status === "cancel" ? "hidden" : ""
                      }`}
                    >
                      {`Xóa thực đơn này`}
                    </DropdownItem>
                  </DropdownMenu>
                )}
              </Dropdown>
            </div>
          );
        default:
          return cellValue;
      }
    },
    [pathname, branchStatus]
  );

  const onItemsPerPageChange = React.useCallback((e) => {
    setItemsPerPage(Number(e.target.value));
    setpage(1);
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
              value={branchStatus}
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
  }, [visibleColumns, itemsPerPage, searchQuery, date, branchStatus]);

  const bottomContent = React.useMemo(() => {
    return (
      <CustomPagination
        page={page}
        total={menu?.pagination?.lastPage}
        onChange={onPageChange}
        classNames={{
          base: "flex justify-center",
        }}
      />
    );
  }, [page, menu?.pagination?.lastPage]);

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
        emptyContent={"Không tìm thấy thực đơn"}
        items={sortedItems}
        isLoading={isFetchingMenu}
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

export default BranchesTable;
