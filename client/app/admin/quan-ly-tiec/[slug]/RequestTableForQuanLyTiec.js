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
  Spinner,
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
import useApiServices from "../../../_hooks/useApiServices";
import useCustomToast from "../../../_hooks/useCustomToast";
import {
  fetchingRequestFailure,
  fetchingRequestsFailure,
  fetchRequests,
  fetchRequestsByBranch,
  updateRequestStatus,
  updatingRequestSuccess,
} from "../../../_lib/features/requests/requestsSlice";
import { CONFIG } from "../../../_utils/config";
import { capitalize } from "../../../_utils/helpers";
import { ChevronDownIcon } from "../../../_components/ChevronDownIcon";
import CustomPagination from "../../../_components/CustomPagination";
import SearchForm from "../../../_components/SearchForm";
import Loading from "../../../loading";
import LoadingContent from "../../../_components/LoadingContent";

const INITIAL_VISIBLE_COLUMNS = [
  "id",
  "name",
  "total_amount",
  "created_at",
  "status",
  "amount_booking",
  "organization_date",
  "amount_to_be_paid",
  "actions",
];

const columns = [
  { name: "ID", uid: "id", sortable: true },
  { name: "Chủ tiệc / Loại tiệc", uid: "name", sortable: true },
  { name: "Ngày đặt", uid: "created_at", sortable: true },
  { name: "Tổng giá trị", uid: "total_amount", sortable: true },
  { name: "Tiền cọc", uid: "amount_booking", sortable: true },
  { name: "Ngày dự kiến", uid: "organization_date", sortable: true },
  { name: "Số tiền cần phải thanh toán", uid: "amount_to_be_paid", sortable: true },
  { name: "Trạng thái", uid: "status", sortable: true },
  { name: "Hành động", uid: "actions" },
];

function RequestTable() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    requests,
    pagination,
    isFetchingRequests,
    isFetchingRequestsError,
    isUpdatingRequest,
    isUpdatingRequestError,
  } = useSelector((store) => store.requests);
  const dispatch = useDispatch();
  const { makeAuthorizedRequest } = useApiServices();
  const [currentPage, setCurrentPage] = React.useState(
    searchParams.get("page") || 1
  );
  const [itemsPerPage, setItemsPerPage] = React.useState(10);
  const [date, setDate] = React.useState({
    start: parseDate(
      format(new Date(new Date().getFullYear(), 0, 1), "yyyy-MM-dd")
    ),
    end: parseDate(
      format(new Date(new Date().getFullYear(), 11, 31), "yyyy-MM-dd")
    ),
  });
  const [branchDetail_id, setBranchDetail_id] = React.useState(null)

  React.useEffect(() => {
    if(typeof window !== 'undefined') {
      const storeUser = JSON.parse(localStorage.getItem('user'));
      if(storeUser?.branch_id) {
        setBranchDetail_id(storeUser.branch_id)
      }
    }
  },[])

  const [searchQuery, setSearchQuery] = React.useState("");
  const toast = useCustomToast();
  const [isShowTips, setIsShowTips] = React.useState(true);

  const onPageChange = (page) => {
    setCurrentPage(page);
  };

  const onSearchChange = React.useCallback((e) => {
    const query = e.target.value;
    setSearchQuery(query);
  }, []);

  React.useEffect(() => {
    const params = {
      is_confirm: false,
      is_deposit: false,
      // status: "pending",
      branch_id: branchDetail_id,
      page: currentPage,
      itemsPerPage,
      // startDate: formatDate(date.start, "dd-MM-yyyy"),
      // endDate: formatDate(date.end, "dd-MM-yyyy"),
    };

    dispatch(fetchRequestsByBranch({ params }));

    return () => {};
  }, [currentPage, itemsPerPage]);

  React.useEffect(() => {
    const controller = new AbortController();

    const params = {
      is_confirm: false,
      is_deposit: false,
      status: "pending",
      branch_id: branchDetail_id,
      page: currentPage,
      itemsPerPage,
      search: searchQuery,
    };

    dispatch(fetchRequestsByBranch({ signal: controller.signal, params }));

    return () => {
      controller.abort();
    };
  }, [currentPage, itemsPerPage, date, searchQuery]);

  const handleUpdateStatus = React.useCallback(
    async (id) => {
      const confirm = window.confirm(
        `Bạn có chắc chắn muốn cập nhật trạng thái yêu cầu #${id}?`
      );

      if (!confirm) return;

      if (confirm) {
        const data = await dispatch(
          updateRequestStatus({
            requestId: id,
            requestData: {
              is_deposit: false,
              is_confirm: false,
              status: "processing",
            },
          })
        ).unwrap();

        if (data.success) {
          toast({
            title: "Cập nhật trạng thái thành công",
            description: "Yêu cầu đã được xử lý",
            type: "success",
          });
        } else {
          toast({
            title: "Cập nhật trạng thái thất bại",
            description: "Yêu cầu chưa được cập nhật",
            type: "error",
          });
        }
      }
    },
    [dispatch, makeAuthorizedRequest, fetchRequestsByBranch, toast]
  );
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
    return [...requests].sort((a, b) => {
      const first = a[sortDescriptor.column];
      const second = b[sortDescriptor.column];
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, requests]);

  const renderCell = React.useCallback(
    (item, columnKey) => {
      const cellValue = item[columnKey];
      switch (columnKey) {
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
        case "total_amount": 
        const totalAmount = item.booking_details?.reduce((total, detail) => total + detail.total_amount, 0)
        return new Intl.NumberFormat('vi-VN', {
          style: 'currency',
          currency: 'VND',
        }).format(totalAmount);

        case "amount_booking":
          const amount_booking = item.booking_details?.map((detail) => detail.deposits?.amount ? `${detail.deposits.amount}` : "Chưa có tiền cọc")
          return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
          }).format(amount_booking);

        case 'amount_to_be_paid': 
        const bookingDetails = item.booking_details?.[0];
        const totalAmount_paid = bookingDetails?.total_amount || 0;
        const depositAmount = bookingDetails?.deposits?.amount || 0;
        const amountPaid = totalAmount_paid - depositAmount;
      
        return new Intl.NumberFormat('vi-VN', {
          style: 'currency',
          currency: 'VND',
        }).format(amountPaid);
        
        case "deposit_amount":
        case "created_at": return format(new Date(cellValue), "dd/MM/yyyy, hh:mm a");
        case "organization_date":
          return format(new Date(cellValue), "dd/MM/yyyy, hh:mm a");
        case "name":
          return (
            <User
              avatarProps={{ radius: "lg", src: item.avatar }}
              description={item.email}
              name={cellValue}
            >
              {item.email}
            </User>
          );
        case "status":
          return (
            // <select
            //   name="status"
            //   value={cellValue}
            //   className="select relative z-50"
            //   onClick={(e) => e.stopPropagation()}
            //   onMouseDown={(e) => e.stopPropagation()}
            // >
            //   {CONFIG.BOOKING_STATUS.map((status) => (
            //     <option value={status.key} key={status.key} className="option">
            //       {status.label}
            //     </option>
            //   ))}
            // </select>
            <Chip variant="flat" color="warning">
              Chưa xử lý
            </Chip>
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
                  <DropdownItem onClick={() => handleUpdateStatus(item.id)}>
                    Cập nhật trạng thái
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
          );
        default:
          return cellValue;
      }
    },
    [handleUpdateStatus, pathname]
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
            <div className="flex-1 justify-end flex">
              <DateRangePicker
                value={date}
                onChange={setDate}
                className="w-fit"
                aria-label="Date Range Picker"
                classNames={{
                  inputWrapper: "!bg-whiteAlpha-100",
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
        {isShowTips && (
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
        )}
      </div>
    );
  }, [visibleColumns, isShowTips, itemsPerPage, searchQuery, date]);

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
      onRowAction={(key) => handleUpdateStatus(key)}
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
        emptyContent={"No requests found"}
        items={sortedItems}
        isLoading={isFetchingRequests || isUpdatingRequest}
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

export default RequestTable;
