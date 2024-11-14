"use client";
import "../../_styles/globals.css";
import {
  ChevronDownIcon,
  ExclamationCircleIcon,
  EllipsisVerticalIcon as VerticalDotsIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { parseDate } from "@internationalized/date";
import {useInfiniteScroll} from "@nextui-org/use-infinite-scroll";
import {useAsyncList} from "@react-stately/data";

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
import React, { useState } from "react";
import { BsMoon, BsSun } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";

import useCustomToast from "@/app/_hooks/useCustomToast";
import useApiServices from "@/app/_hooks/useApiServices";
import { fetchRequests } from "@/app/_lib/features/requests/requestsSlice";
import { CONFIG } from "@/app/_utils/config";
import SearchForm from "@/app/_components/SearchForm";
import CustomPagination from "@/app/_components/CustomPagination";
import LoadingContent from "@/app/_components/LoadingContent";
import { capitalize } from "@mui/material";
import { formatPrice } from "@/app/_utils/formaters";
import "../../_styles/client.css";
const INITIAL_VISIBLE_COLUMNS = [
  "id",
  "name",
  "type_party",
  "created_at",
  "total_amount",
  "deposits_amount",
  "deposits_expired_at",
  "remaining_amount",
  "organization_date",
  "pay_date",
  "status",
  "number_of_guests",
  "table_all",
  "branches_name",
  "stages_name",
  "actions",
];

const columns = [
  { name: "ID", uid: "id", sortable: true },
  { name: "Chủ tiệc", uid: "name" },
  { name: "Ngày đặt ", uid: "created_at", sortable: true },
  { name: "Tổng giá trị", uid: "total_amount", sortable: true },
  { name: "Tiền cọc", uid: "deposits_amount", sortable: true },
  { name: "Ngày đặt cọc", uid: "deposits_expired_at", sortable: true },
  { name: "Còn lại phải thanh toán", uid: "remaining_amount", sortable: true },
  { name: "Ngày tổ chức", uid: "organization_date", sortable: true },
  { name: "Trạng thái thanh toán", uid: "status", sortable: true },
  { name: "Ngày thanh toán", uid: "pay_date", sortable: true },
  { name: "Số lượng khách dự kiến", uid: "number_of_guests", sortable: true },
  { name: "Số lượng bàn (chính thức + dự phòng)", uid: "table_all", sortable: true },
  { name: "Chi nhánh", uid: "branches_name" },
  { name: "Sảnh", uid: "stages_name" },
  { name: "Hành động", uid: "actions" },
];

function BookingsTable({userId }) {
  
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
  // console.log(requests);
  
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

  const toStandardDate = (customDate) => {
    return new Date(customDate.year, customDate.month - 1, customDate.day);
  };

  const formattedStartDate = format(toStandardDate(date.start), "dd-MM-yyyy");
  const formattedEndDate = format(toStandardDate(date.end), "dd-MM-yyyy");
  const [status, setStatus] = useState(""); 

  React.useEffect(() => {
    const params = {
      user_id: userId,
      page: currentPage,
      itemsPerPage: 6,
      startDate: formattedStartDate,
      endDate: formattedEndDate,
    };

    dispatch(fetchRequests({ params }));
  }, [currentPage, itemsPerPage,  userId,status]);

  React.useEffect(() => {
    const controller = new AbortController();
    const params = {
      user_id: userId,
      itemsPerPage: 6,
      page: currentPage,
      search: searchQuery,
   
      
    };

    dispatch(fetchRequests({ signal: controller.signal, params }));

    return () => {
      controller.abort();
    };
  }, [currentPage, itemsPerPage, date, searchQuery,  userId, status]);
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
      // console.log(renderCell);
      
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
          case "organization_date":
            return format(new Date(cellValue), "dd/MM/yyyy, hh:mm a");
          case "pay_date":
            const pay_date = item.organization_date;
            if (pay_date) {
              return format(new Date(pay_date), "dd/MM/yyyy");
            } else {
              return "N/A"; 
            }
          case "created_at":
            return format(new Date(cellValue), "dd/MM/yyyy");
          case "deposits_expired_at":
            const depositsDetails = item.booking_details?.[0]?.deposits;
          
            if (depositsDetails?.expired_at) {
              const expiredAt = depositsDetails.expired_at;
              return format(new Date(expiredAt), "dd/MM/yyyy");
            } else {
              return "N/A";  
            }
            
          case "deposits_amount":
            const bookingDetails = item.booking_details?.[0];  
            if (bookingDetails) {
              const depositsAmount = bookingDetails?.deposits?.amount ?? "N/A";
              return formatPrice(depositsAmount);
            } else {
              return "N/A";
            }
           
          case "total_amount":
            const totalAmountDetails = item.booking_details?.[0];  
            if (totalAmountDetails) {
              const totalAmount = totalAmountDetails?.total_amount ?? "N/A";
              return formatPrice(totalAmount);  
            } else {
              return "N/A";  
            }
          
          case "remaining_amount":
            const remainingAmountDetails = item.booking_details?.[0];
            if (remainingAmountDetails) {
              const remainingAmount = (remainingAmountDetails?.total_amount - remainingAmountDetails?.deposits?.amount) ?? "N/A";
              return formatPrice(remainingAmount);  
            } else {
              return "N/A"; 
            }
          case "table_all":
            const totalTableDetails = item.booking_details?.[0]; 
            if (totalTableDetails) {
              const tableCount = totalTableDetails?.table_count;
              const spareTableCount = totalTableDetails?.spare_table_count;
              if (tableCount != null) {
                if (spareTableCount != null) {
                  return `${tableCount} + ${spareTableCount}`;
                } else {
                  return `${tableCount}`; 
                }
              } else {
                return "N/A"; 
              }
            } else {
              return "N/A"; 
            }
            
          case "branches_name":
            const bookingBranches = item.branches;
            
            if (bookingBranches) {
              const branches_name = bookingBranches?.name
              
              return branches_name ?? "N/A";
            } else {
              return "N/A";
            }
            
          
          case "stages_name":
            const bookingStages = item.stages;
            if (bookingStages) {
              const stages_name = bookingStages?.name;
              return stages_name ?? "N/A";
            } else {
              return "N/A";
            }
            
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
            <li className={`status ${
                  item.is_deposit 
                      ? item.status === 'pending' ? 'chua-thanh-toan' :
                        item.status === 'processing' ? 'da-hoan-tien' :
                        item.status === 'success' ? 'da-thanh-toan ' :
                        item.status === 'cancel' ? 'da-huy' :
                        ''
                      : 'da-dat-coc' 
              }`}>
                  {item.is_deposit 
                      ? item.status === 'pending' ? 'Đang chờ' :
                        item.status === 'processing' ? 'Đang xử lý' :
                        item.status === 'success' ? 'Thành công' :
                        item.status === 'cancel' ? 'Đã hủy' :
                        ''
                      : 'Chưa đặt cọc'
                  }
            </li>
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
                    <Link href={`/admin/quan-ly-tiec/${item.branches?.slug}/${item.id}`}>Xem chi tiết</Link>
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
          );
        default:
          return cellValue;
      }
    },
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
        
      </div>
    );
  }, [visibleColumns, isShowTips, itemsPerPage, searchQuery, date]);
  const itemPerPage = 6;
  const bottomContent = React.useMemo(() => {
    return (
      <CustomPagination
        page={currentPage}
        total={pagination.lastPage}
        itemPerPage = {itemPerPage}
        onChange={onPageChange}
        classNames={{
          base: "flex justify-center",
        }}
      />
    );
  }, [currentPage, pagination.lastPage]);

  return (
    <div className="overflow-x-auto table-container"> 
      <Table
        aria-label="Example table with custom cells, pagination and sorting"
        isHeaderSticky
        bottomContent={bottomContent}
        bottomContentPlacement="inside"
        
        classNames={{ 
          thead:
            "has-[role=columnheader]:bg-whiteAlpha-200  [&>tr>th]:bg-whiteAlpha-200",
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
    </div>
  );
}

export default BookingsTable;
