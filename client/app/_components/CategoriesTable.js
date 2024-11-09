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
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  useDisclosure,
  User,
} from "@nextui-org/react";
import { format } from "date-fns";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { Suspense } from "react";
import { BsMoon, BsSun } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import useApiServices from "../_hooks/useApiServices";
import useCustomToast from "../_hooks/useCustomToast";
import {
  addCategory,
  deleteCategory,
  fetchRequests,
  updateRequestStatus,
} from "../_lib/features/categories/categoriesSlice";
import { CONFIG } from "../_utils/config";
import { capitalize } from "../_utils/helpers";
import { ChevronDownIcon } from "./ChevronDownIcon";
import CustomPagination from "./CustomPagination";
import LoadingContent from "./LoadingContent";
import SearchForm from "./SearchForm";
import { fetchParentCategory } from "../_lib/features/categories/categoriesSlice";
import Loading from "../loading";
import AddDishCategory from "../admin/thuc-pham/AddDishCategory";
import AddCategoryButton from "./AddCategoryButton";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Col, Row } from "antd";
import Uploader from "./Uploader";
import { motion, AnimatePresence } from "framer-motion";
import FormInput from "./FormInput";

const INITIAL_VISIBLE_COLUMNS = [
  "name",
  "short_description",
  "description",
  "created_at",
  "actions",
];

const columns = [
  { name: "Tên", uid: "name", sortable: true },
  { name: "Mô tả ngắn", uid: "short_description", sortable: true },
  { name: "Mô tả chi tiết", uid: "description", sortable: true },
  { name: "Ngày tạo", uid: "created_at", sortable: true },
  { name: "Hành động", uid: "actions", sortable: true },
];

const schema = z.object({
  name: z
    .string({
      required_error: "Vui lòng nhập tên danh mục",
    })
    .min(1, { message: "Vui lòng nhập tên danh mục" })
    .max(35, "Tên danh mục không được quá 35 ký tự"),
  short_description: z
    .string({
      required_error: "Vui lòng nhập mô tả ngắn về danh mục",
    })
    .min(1, { message: "Vui lòng nhập mô tả ngắn về danh mục" })
    .max(100, "Mô tả không được quá 100 ký tự"),
  description: z
    .string({
      required_error: "Vui lòng nhập mô tả đầy đủ về danh mục",
    })
    .min(1, { message: "Vui lòng nhập mô tả đầy đủ về danh mục" })
    .max(255, "Mô tả không được quá 255 ký tự"),
});

const MAX_FILE_SIZE = 5000000;

function checkFileType(file) {
  if (file?.name) {
    const fileType = file.name.split(".").pop();
    if (fileType === "jpg" || fileType === "jpeg" || fileType === "png")
      return true;
  }
  return false;
}

const checkFileSize = (file) => {
  if (file?.size) {
    return file.size <= MAX_FILE_SIZE;
  }
  return false;
};

function CategoriesTable() {
  const router = useRouter();
  const {
    categories,
    pagination,
    isLoading,
    isError,
    error,
    isAddingCategory,
    isAddingCategoryError,
  } = useSelector((store) => store.categories);
  // console.log("categories -> ", categories);
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
  const toast = useCustomToast();
  const [isShowTips, setIsShowTips] = React.useState(true);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isImagesEmpty, setIsImagesEmpty] = React.useState(false);
  const [isImageOverSize, setIsImageOverSize] = React.useState(false);
  const [isFormatAccepted, setIsFormatAccepted] = React.useState(false);
  const inputRef = React.useRef();
  const [files, setFiles] = React.useState([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onInputChange = (e) => {
    setValue(e.target.name, e.target.value);
  };

  const handleFileChange = (newFiles) => {
    setFiles(newFiles);
  };

  const handleAddCategory = async (data) => {
    // console.log("data -> ", data);

    // Check if there are no images or images do not meet the requirements
    if (isImagesEmpty) {
      setIsImagesEmpty(true);
      return;
    }

    if (!isFormatAccepted || isImageOverSize) {
      // console.log("isFormatAccepted -> ", isFormatAccepted);
      // console.log("isImageOverSize -> ", isImageOverSize);
      // console.log("isImagesEmpty -> ", isImagesEmpty);
      // console.log(files);
      // console.log("Image error");
      return;
    }

    // append data to form data
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("short_description", data.short_description);
    files.forEach((file) => {
      formData.append("images", file);
    });

    // console.log("Form data -> ", formData);

    // dispatch add category
    const response = await dispatch(addCategory({ data: formData })).unwrap();

    if (response.success) {
      toast({
        title: "Thành công",
        description: "Danh mục đã được thêm",
        type: "success",
        isClosable: true,
      });
      reset();
    } else {
      if (response.error.statusCode === 401) {
        toast({
          title: "Lỗi thêm danh mục",
          description: "Phiên đăng nhập đã hết hạn",
          type: "error",
          isClosable: true,
        });
      } else {
        toast({
          title: "Lỗi thêm danh mục",
          description:
            response.error.message || "Có lỗi xảy ra khi thêm danh mục",
          type: "error",
          isClosable: true,
        });
      }
    }
  };

  const handleDeleteCategory = async (id) => {
    const response = await dispatch(deleteCategory({ id })).unwrap();

    if (response.success) {
      toast({
        title: "Thành công",
        description: "Danh mục đã được xóa",
        type: "success",
        isClosable: true,
      });
    } else {
      if (response.error.statusCode === 401) {
        toast({
          title: "Lỗi xóa danh mục",
          description: "Phiên đăng nhập đã hết hạn",
          type: "error",
          isClosable: true,
        });
      } else {
        toast({
          title: "Lỗi xóa danh mục",
          description:
            response.error.message || "Có lỗi xảy ra khi xóa danh mục",
          type: "error",
          isClosable: true,
        });
      }
    }
  };

  const onSubmit = async (data) => {
    await handleAddCategory(data);
  };

  React.useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen, inputRef]);

  React.useEffect(() => {
    if (files.some((file) => !checkFileSize(file))) {
      setIsImageOverSize(true);
    } else {
      setIsImageOverSize(false);
    }

    if (files.some((file) => !checkFileType(file))) {
      setIsFormatAccepted(false);
    } else {
      setIsFormatAccepted(true);
    }
  }, [files]);

  // Function to convert the custom date object to a standard Date object
  const toStandardDate = (customDate) => {
    return new Date(customDate.year, customDate.month - 1, customDate.day);
  };

  // Format the dates to "dd-MM-yyyy"
  const formattedStartDate = format(toStandardDate(date.start), "dd-MM-yyyy");
  const formattedEndDate = format(toStandardDate(date.end), "dd-MM-yyyy");

  const onPageChange = (page) => {
    setCurrentPage(page);
  };

  const onSearchChange = React.useCallback((e) => {
    const query = e.target.value;
    setSearchQuery(query);
  }, []);

  React.useEffect(
    () => {
      // const params = {
      //   is_confirm: false,
      //   is_deposit: false,
      //   status: requestStatus,
      //   page: currentPage,
      //   itemsPerPage,
      //   startDate: formattedStartDate,
      //   endDate: formattedEndDate,
      // };

      dispatch(fetchParentCategory());

      return () => {};
    },
    [
      // currentPage,
      // itemsPerPage,
      // requestStatus,
      // formattedEndDate,
      // formattedStartDate,
      // router,
    ]
  );

  React.useEffect(
    () => {
      const controller = new AbortController();

      // const params = {
      //   is_confirm: false,
      //   is_deposit: false,
      //   status: requestStatus,
      //   page: currentPage,
      //   itemsPerPage,
      //   search: searchQuery,
      //   startDate: formattedStartDate,
      //   endDate: formattedEndDate,
      // };

      dispatch(fetchParentCategory({ signal: controller.signal }));

      return () => {
        controller.abort();
      };
    },
    [
      // currentPage,
      // itemsPerPage,
      // searchQuery,
      // requestStatus,
      // formattedEndDate,
      // formattedStartDate,
      // router,
    ]
  );

  const [selectedKeys, setSelectedKeys] = React.useState(new Set([]));
  const [visibleColumns, setVisibleColumns] = React.useState(
    new Set(INITIAL_VISIBLE_COLUMNS)
  );

  const [sortDescriptor, setSortDescriptor] = React.useState({
    column: "created_at",
    direction: "descending",
  });

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    );
  }, [visibleColumns]);

  const sortedItems = React.useMemo(() => {
    if (!categories) return [];

    return [...categories].sort((a, b) => {
      const first = a[sortDescriptor.column];
      const second = b[sortDescriptor.column];
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, categories]);

  const renderCell = React.useCallback((item, columnKey) => {
    const cellValue = item[columnKey];

    switch (columnKey) {
      case "created_at":
        return format(new Date(cellValue), "dd/MM/yyyy, hh:mm a");
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
                  <Link href={`/admin/quan-ly-danh-muc/${item.id}`}>
                    Xem chi tiết
                  </Link>
                </DropdownItem>
                <DropdownItem
                  className="text-red-400"
                  onClick={() => handleDeleteCategory(item.id)}
                >
                  Xóa danh mục
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        );
      default:
        return <p className="truncate">{cellValue}</p>;
    }
  }, []);

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
            <Button
              onClick={onOpen}
              radius="full"
              className="bg-whiteAlpha-100 hover:bg-whiteAlpha-200 text-white font-medium !shrink-0"
              startContent={
                <PlusIcon className="w-5 h-5 text-white font-semibold shrink-0" />
              }
            >
              Thêm danh mục
            </Button>
          </div>
        </div>
      </div>
    );
  }, [visibleColumns, isShowTips, itemsPerPage, searchQuery, date]);

  const bottomContent = React.useMemo(() => {
    if (!pagination) return null;

    return (
      <CustomPagination
        page={currentPage}
        total={pagination?.lastPage || 1}
        onChange={onPageChange}
        classNames={{
          base: "flex justify-center",
        }}
      />
    );
  }, [currentPage, pagination.lastPage]);

  const handleGoToCategory = (id) => {
    router.push(`/admin/quan-ly-danh-muc/${id}`);
  };

  return (
    <>
      <div className="min-w-0 overflow-x-auto">
        <Table
          className="min-w-max"
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
          onRowClick={(item) => handleGoToCategory(item.id)}
        >
          <TableHeader
            columns={headerColumns}
            className="!bg-whiteAlpha-100 has-[role=columnheader]:bg-whiteAlpha-200 here"
          >
            {(column) => (
              <TableColumn
                key={column.uid}
                align={"start"}
                allowsSorting={column.sortable}
                className="group px-3 h-10 align-middle bg-whiteAlpha-200 whitespace-nowrap text-white text-tiny font-semibold first:rounded-l-lg rtl:first:rounded-r-lg rtl:first:rounded-l-[unset] last:rounded-r-lg rtl:last:rounded-l-lg rtl:last:rounded-r-[unset] data-[sortable=true]:cursor-pointer data-[hover=true]:text-foreground-400 outline-none data-[focus-visible=true]:z-10 data-[focus-visible=true]:outline-2 data-[focus-visible=true]:outline-focus data-[focus-visible=true]:outline-offset-2 text-start [& data-[selected=true]:bg-whiteAlpha-100 "
              >
                {column.name}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody
            emptyContent={
              isError ? (
                error
              ) : (
                <div className="flex flex-col gap-3 justify-center items-center">
                  <p className="text-gray-400">Không có danh mục nào</p>
                  <button
                    className="text-gray-400 underline"
                    onClick={() => dispatch(fetchParentCategory())}
                  >
                    Thử lại
                  </button>
                </div>
              )
            }
            items={sortedItems}
            isLoading={isLoading}
            loadingContent={<LoadingContent />}
          >
            {(item) => (
              <TableRow
                key={item.id}
                onContextMenu={(e) => {
                  e.preventDefault();
                }}
              >
                {(columnKey) => (
                  <TableCell className="py-2 px-3 relative align-middle whitespace-normal text-small font-normal [&>*]:z-1 [&>*]:relative outline-none data-[focus-visible=true]:z-10 data-[focus-visible=true]:outline-2 data-[focus-visible=true]:outline-focus data-[focus-visible=true]:outline-offset-2 before:content-[''] before:absolute before:z-0 before:inset-0 before:opacity-0  before:bg-whiteAlpha-50 group-data-[first=true]:first:before:rounded-tl-lg group-data-[first=true]:rtl:first:before:rounded-tr-lg group-data-[first=true]:rtl:first:before:rounded-tl-[unset] group-data-[first=true]:last:before:rounded-tr-lg group-data-[first=true]:rtl:last:before:rounded-tl-lg group-data-[first=true]:rtl:last:before:rounded-tr-[unset] group-data-[middle=true]:before:rounded-none group-data-[last=true]:first:before:rounded-bl-lg group-data-[last=true]:rtl:first:before:rounded-br-lg group-data-[last=true]:rtl:first:before:rounded-bl-[unset] group-data-[last=true]:last:before:rounded-br-lg group-data-[last=true]:rtl:last:before:rounded-bl-lg group-data-[last=true]:rtl:last:before:rounded-br-[unset] text-start !text-white data-[selected=true]:before:opacity-100 group-dlata-[disabed=true]:text-foreground-300 group-data-[disabled=true]:cursor-not-allowed !before:bg-whiteAlpha-50 data-[selected=true]:text-default-foreground group-aria-[selected=false]:group-data-[hover=true]:before:bg-whiteAlpha-50 group-aria-[selected=false]:group-data-[hover=true]:before:opacity-100 min-w-0">
                    {renderCell(item, columnKey)}
                  </TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <Modal
        size="3xl"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        scrollBehavior="outside"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Thêm danh mục
              </ModalHeader>
              <ModalBody>
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="w-full flex gap-4 flex-col flex-center"
                >
                  <Row gutter={20} className="w-full">
                    <Col span={12}>
                      {/* IMAGE & UPLOADER */}
                      <Uploader
                        onFileChange={handleFileChange}
                        files={files}
                        setFiles={setFiles}
                      />
                      <AnimatePresence>
                        {isImagesEmpty && (
                          <motion.div
                            key={"isImagesEmpty"}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="text-red-400 text-sm font-normal mt-2 mb-2"
                          >
                            <ExclamationCircleIcon className="w-4 h-4 mr-1 inline" />{" "}
                            {
                              "Hãy chọn ít nhất một ảnh cho thực đơn của bạn nhé!"
                            }
                          </motion.div>
                        )}
                        {isImageOverSize && (
                          <motion.div
                            key={"isImageOverSize"}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="text-red-400 text-sm font-normal mt-2 mb-2"
                          >
                            <ExclamationCircleIcon className="w-4 h-4 mr-1 inline" />{" "}
                            {"Hãy chọn ảnh có dung lượng nhỏ hơn 5MB nhé!"}
                          </motion.div>
                        )}
                        {!isFormatAccepted && (
                          <motion.div
                            key={"isFormatAccepted"}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="text-red-400 text-sm font-normal mt-2 mb-2"
                          >
                            <ExclamationCircleIcon className="w-4 h-4 mr-1 inline" />{" "}
                            {
                              "Vui lòng chọn ảnh có định dạng jpg, jpeg hoặc png!"
                            }
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </Col>
                    <Col span={12}>
                      <FormInput
                        theme="dark"
                        inputRef={inputRef}
                        type={"text"}
                        register={register}
                        id={"name"}
                        name={"name"}
                        ariaLabel={"Tên danh mục"}
                        placeholder={"Nhập tên danh mục"}
                        errors={errors}
                        errorMessage={errors?.name?.message}
                        className={"!bg-gray-100 !mt-0 !text-gray-600"}
                        wrapperClassName={"w-full text-gray-600 !mt-0"}
                        value={watch("name")}
                        onChange={onInputChange}
                      />
                      <FormInput
                        theme="dark"
                        type={"textarea"}
                        register={register}
                        cols={3}
                        rows={3}
                        id={"short_description"}
                        name={"short_description"}
                        ariaLabel={"Mô tả ngắn"}
                        placeholder={"Nhập mô tả ngắn"}
                        errors={errors}
                        errorMessage={errors?.short_description?.message}
                        className={"!bg-gray-100 !mt-0 !text-gray-600"}
                        wrapperClassName={"w-full text-gray-600 !mt-3"}
                        value={watch("short_description")}
                        onChange={onInputChange}
                      />
                      <FormInput
                        theme="dark"
                        type={"textarea"}
                        register={register}
                        id={"description"}
                        name={"description"}
                        ariaLabel={"Mô tả danh mục"}
                        placeholder={"Mô tả danh mục đầy đủ"}
                        errors={errors}
                        errorMessage={errors?.description?.message}
                        className={"!bg-gray-100 !mt-0 !text-gray-600"}
                        wrapperClassName={"w-full text-gray-600 !mt-3"}
                        value={watch("description")}
                        onChange={onInputChange}
                      />
                    </Col>
                  </Row>
                  <div className="flex w-full justify-end items-center gap-5">
                    <Button
                      onClick={onClose}
                      className="bg-gray-100 hover:brightness-95 text-gray-600 font-semibold shadow-sm"
                      startContent={
                        <XMarkIcon className="w-5 h-5 text-gray-600 font-semibold shrink-0" />
                      }
                      radius="full"
                    >
                      Hủy
                    </Button>
                    <Button
                      className="bg-teal-400 hover:bg-teal-500 text-white "
                      startContent={
                        !isAddingCategory ? (
                          <PlusIcon className="w-5 h-5 text-white font-semibold shrink-0" />
                        ) : null
                      }
                      type="submit"
                      isLoading={isAddingCategory}
                      radius="full"
                    >
                      {isAddingCategory
                        ? "Đang thêm danh mục..."
                        : "Thêm danh mục"}
                    </Button>
                  </div>
                </form>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

export default CategoriesTable;
