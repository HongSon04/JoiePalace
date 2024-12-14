import {
  ExclamationCircleIcon,
  PlusIcon,
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
} from "@nextui-org/react";
import { format } from "date-fns";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React from "react";
import { BsMoon, BsSun } from "react-icons/bs";
import { useDispatch } from "react-redux";

import { ChevronDownIcon } from "@/app/_components/ChevronDownIcon";
import LoadingContent from "@/app/_components/LoadingContent";
import SearchForm from "@/app/_components/SearchForm";
import useCustomToast from "@/app/_hooks/useCustomToast";
import { API_CONFIG, makeAuthorizedRequest } from "@/app/_utils/api.config";
import { CONFIG } from "@/app/_utils/config";
import { capitalize } from "@/app/_utils/helpers";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const INITIAL_VISIBLE_COLUMNS = [
  "id",
  "name",
  "price",
  // "capacity_min",
  "capacity_max",
  "status",
  // "shift",
  "next_party",
  "actions",
];

const columns = [
  { name: "ID", uid: "id", sortable: true },
  { name: "Tên sảnh", uid: "name", sortable: true },
  { name: "Giá tiền", uid: "price", sortable: true },
  { name: "Số lượng tối thiểu", uid: "capacity_min", sortable: true },
  { name: "Số lượng tối đa", uid: "capacity_max", sortable: true },
  { name: "Trạng thái", uid: "status", sortable: true },
  { name: "Tiệc tiếp theo (14 ngày tới)", uid: "next_party", sortable: true },
  // { name: "Ngày tổ chức", uid: "organization_date", sortable: true },
  { name: "Hành động", uid: "actions" },
];

function StagesTable() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  const [currentBranch, setCurrentBranch] = React.useState({});
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
  const [requestStatus, setRequestStatus] = React.useState("false");
  const toast = useCustomToast();
  const [isShowTips, setIsShowTips] = React.useState(true);
  const queryClient = useQueryClient();

  const fetchStages = React.useCallback(
    async (searchQuery, signal) => {
      const response = await axios.get(
        API_CONFIG.STAGES.GET_ALL({
          branch_id: currentBranch.id,
          search: searchQuery,
        }),
        { signal }
      );

      return response.data;
    },
    [currentBranch.id]
  );

  const {
    data: stages,
    isLoading: isFetchingStages,
    isError: isFetchingStagesError,
  } = useQuery({
    queryKey: ["stages", currentBranch.id, searchQuery], // Include searchQuery in the key
    queryFn: async () => {
      const abortController = new AbortController();
      const signal = abortController.signal;

      // If searchQuery is provided, fetch filtered stages; otherwise, fetch all stages
      return fetchStages(searchQuery, signal);
    },
    enabled: !!currentBranch.id, // Only run the query if currentBranch.id is available
    keepPreviousData: true, // Keep previous data while loading new data
  });

  console.log("stages -> ", stages);

  const {
    data: bookings,
    isLoading: isFetchingBookings,
    isError: isFetchingBookingsError,
  } = useQuery({
    queryKey: ["fetch_bookings", currentBranch.id],
    queryFn: async () => {
      // Get the current date
      const today = format(new Date(), "dd-MM-yyyy");
      // Get the next 14 days of the current date
      const nextWeek = format(
        new Date(new Date().getTime() + 14 * 24 * 60 * 60 * 1000),
        "dd-MM-yyyy"
      );

      const response = await makeAuthorizedRequest(
        API_CONFIG.BOOKINGS.GET_ALL({
          branch_id: currentBranch.id,
          startDate: today,
          endDate: nextWeek,
        }),
        "GET"
      );

      if (response.success) {
        return response;
      } else {
        throw new Error(response.message);
      }
    },
  });

  const {
    mutate,
    isPending: isDeletingStage,
    isError: isDeletingStageError,
  } = useMutation({
    mutationFn: async (id) => {
      if (typeof window == "undefined") return;

      const confirm = window.confirm("Bạn có chắc chắn muốn xóa sảnh này?");

      if (!confirm) return;

      const response = await makeAuthorizedRequest(
        API_CONFIG.STAGES.DESTROY(id),
        "DELETE"
      );

      if (!response.success) {
        throw new Error(response.message);
      }

      return response;
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries("fetch_stages");
      toast({
        title: "Xóa sảnh thành công",
        description: response?.message || "Sảnh đã được xóa thành công",
        type: "success",
      });
    },
    onError: (error) => {
      toast({
        title: "Xóa sảnh thất bại",
        description: error?.message || "Có lỗi xảy ra khi xóa sảnh",
        type: "error",
      });
    },
  });

  const mappedStages = React.useMemo(() => {
    console.log("stages -> ", stages);

    // if (!stages || !bookings?.data) return;

    return stages?.data?.map((stage) => {
      const booking = bookings?.data?.find((booking) => {
        return booking.stage_id == stage.id;
      });

      let status = "";
      let nextPartyDate = "";

      if (booking) {
        const today = new Date();

        const currentTime = new Date().getHours();
        const currentShift = currentTime < 12 ? "Sáng" : "Chiều";

        const bookingDate = new Date(booking.organization_date);
        const bookingTime = bookingDate.getHours();

        if (bookingDate < today) {
          status = "Không hoạt động";
        }

        if (bookingTime < currentTime && bookingDate === today) {
          status = "Đã hoàn thành";
        }

        if (
          bookingTime === currentTime &&
          booking?.shift === currentShift &&
          bookingDate === today
        ) {
          status = "Đang tổ chức";
        }

        if (bookingDate > today) {
          status = "Sắp diễn ra";
          nextPartyDate = format(bookingDate, "dd-MM-yyyy");
        }
      } else {
        status = "Không có tiệc";
      }

      return {
        ...stage,
        status,
      };
    });
  }, [stages, bookings?.data]);

  const onStatusChange = (e) => {
    const status = e.target.value;
    setRequestStatus(status);
  };

  const onSearchChange = React.useCallback((e) => {
    const query = e.target.value;
    setSearchQuery(query);
  }, []);

  const [selectedKeys, setSelectedKeys] = React.useState(new Set([]));
  const [visibleColumns, setVisibleColumns] = React.useState(
    new Set(INITIAL_VISIBLE_COLUMNS)
  );
  const [sortDescriptor, setSortDescriptor] = React.useState({
    column: "organization_date",
    direction: "descending",
  });
  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    );
  }, [visibleColumns]);
  const sortedItems = React.useMemo(() => {
    if (!mappedStages) return [];

    return [...mappedStages].sort((a, b) => {
      const first = a[sortDescriptor.column];
      const second = b[sortDescriptor.column];
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, mappedStages]);

  const renderCell = React.useCallback(
    (item, columnKey) => {
      const cellValue = item[columnKey];
      switch (columnKey) {
        case "price":
          return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
          }).format(item.price || 0);
        case "capacity_min":
          return item.capacity_min;
        case "capacity_max":
          return item.capacity_max;
        case "name":
          return item.name;
        case "status":
          return (
            <Chip variant="flat" color={"default"} className="text-white">
              {item?.status}
            </Chip>
          );

        case "shift":
          return cellValue === "Sáng" ? (
            <Chip
              className="text-gray-800 bg-white"
              startContent={<BsSun size={12} className="text-gray-800" />}
            >
              {cellValue}
            </Chip>
          ) : (
            <Chip
              className="text-white bg-blackAlpha-500"
              startContent={<BsMoon size={12} className="text-white" />}
            >
              {cellValue}
            </Chip>
          );
        case "organization_date":
          if (!bookings) return;

          const booking = bookings.data.find(
            (booking) => booking.stage_id === item.id
          );
          return booking ? (
            <span>
              {format(new Date(booking.organization_date), "dd-MM-yyyy")}
            </span>
          ) : (
            <span>Chưa có dữ liệu</span>
          );
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
                  <DropdownItem
                    className="text-red-400"
                    onClick={() => mutate(item.id)}
                  >
                    {`Xóa sảnh`}
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
          );

        default:
          return cellValue; // Fallback for unhandled cases
      }
    },
    [pathname]
  );

  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-4 mt-8">
        <div className="flex justify-end gap-3 items-center">
          {/* <label className="flex items-center text-default-400 text-small">
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
          </label> */}
          {/* <SearchForm
            placeholder={"Tìm kiếm theo tên"}
            classNames={{
              input: "text-white",
            }}
            value={searchQuery}
            onChange={onSearchChange}
          /> */}
          <div className="flex gap-3 items-center">
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
              className="select rounded-full text-small !h-[40px]"
              onChange={onStatusChange}
              value={requestStatus}
            >
              {CONFIG.STAGE_STATUS.map((item) => {
                if (item.key === "success") return;

                return (
                  <option key={item.key} value={item.key} className="option">
                    {item.label}
                  </option>
                );
              })}
            </select>
            <div className="flex-1 justify-end flex">
              {/* Create button */}
              <Link href={`${pathname}/tao-sanh`}>
                <Button
                  className="bg-whiteAlpha-100 text-white"
                  radius="full"
                  endContent={<PlusIcon className="w-5 h-5" />}
                >
                  Tạo sảnh mới
                </Button>
              </Link>
            </div>
          </div>
        </div>
        {/* {isShowTips && (
          <div className="flex justify-between px-3 py-2 rounded-md bg-whiteAlpha-100">
            <p
              className={`text-small text-gray-400 flex items-center gap-1 hover:text-gray-200 transition-all`}
            >
              <ExclamationCircleIcon className="w-5 h-5" /> Mẹo: Nhấp đúp chuột
              vào yêu cầu để CẬP NHẬT TRẠNG THÁI nhanh
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsShowTips(false)}
                className="w-fit bg-transparent !p-0 min-w-0 min-h-0 rounded-full group"
              >
                <XMarkIcon className="w-5 h-5 text-gray-400 group-hover:text-gray-300" />
              </button>
            </div>
          </div>
        )} */}
      </div>
    );
  }, [
    visibleColumns,
    isShowTips,
    itemsPerPage,
    searchQuery,
    date,
    requestStatus,
  ]);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const storedBranch = JSON.parse(
        window.localStorage.getItem("currentBranch")
      );

      if (storedBranch) {
        setCurrentBranch(storedBranch);
      }
    }
  }, []);

  return (
    <Table
      aria-label="Example table with custom cells, pagination and sorting"
      isHeaderSticky
      // bottomContent={bottomContent}
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
        emptyContent={"Không tìm thấy yêu cầu"}
        items={sortedItems}
        isLoading={isFetchingStages || isFetchingBookings || isDeletingStage}
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

export default StagesTable;
