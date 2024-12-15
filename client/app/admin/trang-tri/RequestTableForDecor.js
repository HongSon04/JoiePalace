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

  import SearchForm from "@/app/_components//SearchForm";
import useApiServices from "@/app/_hooks/useApiServices";
import useCustomToast from "@/app/_hooks/useCustomToast";
import { fetchRequests, updateRequestStatus } from "@/app/_lib/features/requests/requestsSlice";
import { CONFIG } from "@/app/_utils/config";
import { capitalize } from "@/app/_utils/helpers";
import { ChevronDownIcon } from "@/app/_components/ChevronDownIcon";
import CustomPagination from "@/app/_components/CustomPagination";
import LoadingContent from "@/app/_components/LoadingContent";
import { deleteDecor, fetchDecors } from "@/app/_lib/decors/decorsSlice";
import { API_CONFIG } from "@/app/_utils/api.config";
  
  const INITIAL_VISIBLE_COLUMNS = [
    "id",
    "name",
    "products",
    "short_description",
    "price",
    "actions",
  ];
  
  const columns = [
    { name: "ID", uid: "id", sortable: true },
    { name: "Tên", uid: "name", sortable: true },
    { name: "Giá tiền", uid: "price", sortable: true },
    { name: "Mô tả ngắn", uid: "short_description" },
    { name: "Dịch vụ trang trí", uid: "products" },
    { name: "Hành động", uid: "actions" },
  ];
  
  function RequestTable() {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const router = useRouter();
    const {
      decors,
      pagination,
      isFetchingDecors,
      isFetchingDecorsError,
      isUpdatingRequest,
      isUpdatingRequestError,
      error,
    } = useSelector((store) => store.decors);
    const dispatch = useDispatch();
    const { makeAuthorizedRequest } = useApiServices();
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
    const [requestStatus, setRequestStatus] = React.useState("pending");
    const toast = useCustomToast();
    const [isShowTips, setIsShowTips] = React.useState(true);
  
    // Function to convert the custom date object to a standard Date object
    const toStandardDate = (customDate) => {
      return new Date(customDate.year, customDate.month - 1, customDate.day);
    };
  
    // Format the dates to "dd-MM-yyyy"
    const formattedStartDate = format(toStandardDate(date.start), "dd-MM-yyyy");
    const formattedEndDate = format(toStandardDate(date.end), "dd-MM-yyyy");
  
    const onStatusChange = (e) => {
      const status = e.target.value;
      setRequestStatus(status);
    };
  
    const onPageChange = (page) => {
      setCurrentPage(page);
    };
  
    const onSearchChange = React.useCallback((e) => {
      const query = e.target.value;
      setSearchQuery(query);
    }, []);
  
    React.useEffect(() => {
      const params = {
        page: currentPage,
        itemsPerPage,
        startDate: formattedStartDate,
        endDate: formattedEndDate,
      };
  
      dispatch(fetchDecors({ params }));
  
      return () => {};
    }, [
      currentPage,
      itemsPerPage,
      requestStatus,
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
      };
  
      dispatch(fetchDecors({ signal: controller.signal, params }));
  
      return () => {
        controller.abort();
      };
    }, [
      currentPage,
      itemsPerPage,
      searchQuery,
      requestStatus,
      formattedEndDate,
      formattedStartDate,
      router,
    ]);
  
    const handleDeleteDecor = React.useCallback(
      async (id) => {
        const currentBranch = JSON.parse(localStorage.getItem("currentBranch"));

        if (!currentBranch) {
          toast({
            title: "Lỗi",
            description: "Vui lòng chọn chi nhánh trước khi xem yêu cầu",
            type: "error",
          });
          router.push("/auth/chon-chi-nhanh");
          return;
        }

        const confirm = window.confirm(
          `Bạn có chắc chắn xóa trang trí này #${id}?`
        );
  
        if (!confirm) return;
  
        if (confirm) {
          const data = await makeAuthorizedRequest(API_CONFIG.DECORS.DELETE(id),"DELETE");
          console.log("Delete response:", data);
  
          if (data.success) {
            toast({
              title: "Xóa trang trí thành công",
              description: `Yêu cầu xóa trang trí thành công`,
              type: "success",
            });
  
            const params = {
              page: currentPage,
              itemsPerPage,
              startDate: formattedStartDate,
              endDate: formattedEndDate,
            };
            dispatch(
              fetchDecors({
                params,
              })
            );
          } else {
            const { message } = data?.error;
            toast({
              title: "Xóa thất bại",
              description: message || "Yêu cầu cần xem xét lại",
              type: "error",
            });
          }
        }
      },
      [
        date,
        formattedEndDate,
        formattedStartDate,
        requestStatus,
        searchQuery,
        itemsPerPage,
        currentPage,
    ])
      
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
      return [...decors].sort((a, b) => {
        const first = a[sortDescriptor.column];
        const second = b[sortDescriptor.column];
        const cmp = first < second ? -1 : first > second ? 1 : 0;
  
        return sortDescriptor.direction === "descending" ? -cmp : cmp;
      });
    }, [sortDescriptor, decors]);
  
    const renderCell = React.useCallback(
      (item, columnKey) => {
        const cellValue = item[columnKey];
        console.log(item.products)
        switch (columnKey) {
          case "name":
            return item.name;
          // case "status":
          //   // <select
          //   //   name="status"
          //   //   value={cellValue}
          //   //   className="select relative z-50"
          //   //   onClick={(e) => e.stopPropagation()}
          //   //   onMouseDown={(e) => e.stopPropagation()}
          //   // >
          //   //   {CONFIG.BOOKING_STATUS.map((status) => (
          //   //     <option value={status.key} key={status.key} className="option">
          //   //       {status.label}
          //   //     </option>
          //   //   ))}
          //   // </select>
          //   switch (cellValue) {
          //     case "pending":
          //       return (
          //         <Chip variant="flat" color="warning">
          //           Chưa xử lý
          //         </Chip>
          //       );
  
          //     case "processing":
          //       return (
          //         <Chip variant="flat" color="primary">
          //           Đang xử lý
          //         </Chip>
          //       );
          //     case "cancel":
          //       return (
          //         <Chip variant="flat" color="danger">
          //           Đã hủy
          //         </Chip>
          //       );
          //   }
          case "short_description":
            return item.short_description
          case "products":
            return item.products.map((i, index) => (
              <span className="text-white" key={i.id}>
                {i.name}{index < item.products.length - 1 ? ', ' : ''}
              </span>
            ));
            case "price":
              return new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND',
              }).format(item.price || 0);
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
                      onClick={() => handleDeleteDecor(item.id)}
                      className="text-red-400"
                    >
                      {`Xóa trang trí`}
                  </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </div>
            );
          default:
            return cellValue;
        }
      },
      [pathname]
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
                value={requestStatus}
              >
                {CONFIG.BOOKING_STATUS.map((item) => {
                  if (item.key === "success") return;
  
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
    }, [
      visibleColumns,
      isShowTips,
      itemsPerPage,
      searchQuery,
      date,
      requestStatus,
    ]);
  
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
  
    // console.log(requests);
  
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
        // onRowAction={(key) => handleUpdateStatus(key)}
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
            isFetchingDecorsError ? error : "Không tìm thấy yêu cầu"
          }
          items={sortedItems}
          isLoading={isFetchingDecors || isUpdatingRequest}
          loadingContent={<LoadingContent />}
        >
          {(item) => (
            <TableRow
              key={item.id}
              onContextMenu={(e) => {
                e.preventDefault();
                // if (item.status === "cancel") return;
  
                // handleCancelRequest(item.id);
              }}
            >
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
  