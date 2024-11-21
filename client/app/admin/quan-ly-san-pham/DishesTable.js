"use client";

import CustomPagination from "@/app/_components/CustomPagination";
import FormInput from "@/app/_components/FormInput";
import { SearchIcon } from "@/app/_components/SearchIcon";
import Uploader from "@/app/_components/Uploader";
import useApiServices from "@/app/_hooks/useApiServices";
import useCustomToast from "@/app/_hooks/useCustomToast";
import {
  addingDish,
  addingDishFailure,
  addingDishSuccess,
  deleteDishFailure,
  deleteDishRequest,
  deleteDishSuccess,
  fetchingCategoryDishes,
  fetchingCategoryDishesFailure,
  fetchingCategoryDishesSuccess,
  setSelectedDish,
} from "@/app/_lib/features/dishes/dishesSlice";
import { fetchingProductsFailure } from "@/app/_lib/products/productsSlice";
import { API_CONFIG } from "@/app/_utils/api.config";
import { CONFIG } from "@/app/_utils/config";
import {
  PlusIcon,
  TrashIcon,
  EllipsisVerticalIcon as VerticalDotsIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import { Col, Row } from "antd";
import Image from "next/image";
import React, { Suspense } from "react";
import { useForm } from "react-hook-form";
import { IoSaveOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { z } from "zod";
import Loading from "../loading";

const statusColorMap = {
  active: "success",
  paused: "danger",
  vacation: "warning",
};

const INITIAL_VISIBLE_COLUMNS = [
  "images",
  "name",
  "price",
  "short_description",
  "description",
  // "status",
  "actions",
];

// is_confirm = false;
// is_deposit = false;
// status = 'pending';

const schema = z.object({
  name: z.string().nonempty("Tên món không được để trống"),
  price: z.union([
    z.string().nonempty("Giá món không được để trống"),
    z.number().min(1, "Giá món không được để trống"),
  ]),
  category: z.union([
    z.string().nonempty("Danh mục món không được để trống"),
    z.number().min(1, "Danh mục món không được để trống"),
  ]),
  short_description: z.string().nonempty("Mô tả ngắn không được để trống"),
  description: z.string().nonempty("Mô tả chi tiết không được để trống"),
});

function DishesTable({ dishCategory, categories }) {
  const dispatch = useDispatch();
  const { makeAuthorizedRequest } = useApiServices();
  const [currentPage, setCurrentPage] = React.useState(1);
  const [isOpenDetailModal, setIsOpenDetailModal] = React.useState(false);
  const [imgSrc, setImgSrc] = React.useState(CONFIG.DISH_IMAGE_PLACEHOLDER);
  const {
    selectedDish,
    pagination,
    categoryDishes: dishes,
    isLoading,
    isError,
    isAddingDish,
    isUpdatingDish,
    isUpdateDishError,
  } = useSelector((store) => store.dishes);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  // Fetch data when categoryId or currentPage changes
  React.useEffect(() => {
    async function fetchData() {
      if (dishCategory && dishCategory.id) {
        // Nếu có categoryId, lấy món ăn theo danh mục
        await fetchCategoryDishes(dishCategory.id);
      } else {
        // Nếu không có categoryId, lấy tất cả món ăn
        await fetchingProducts();
      }
    }

    fetchData();

    return () => {};
  }, [currentPage, dishCategory?.id]); // Cập nhật khi trang hoặc category thay đổi

  // Fetch dishes by categoryId
  const fetchCategoryDishes = async (
    categoryId,
    params = { page: currentPage }
  ) => {
    dispatch(fetchingCategoryDishes());

    const data = await makeAuthorizedRequest(
      API_CONFIG.PRODUCTS.GET_BY_CATEGORY(categoryId, params),
      "GET",
      null
    );

    if (data.success) {
      dispatch(fetchingCategoryDishesSuccess(data));
    }

    if (data.error) {
      dispatch(fetchingCategoryDishesFailure(data));
    }
  };

  // Fetch all dishes if no categoryId is passed
  const fetchingProducts = async (params = { page: currentPage }) => {
    dispatch(fetchingCategoryDishes()); // Có thể đổi thành `fetchingProducts` nếu cần

    const data = await makeAuthorizedRequest(
      API_CONFIG.PRODUCTS.GET_ALL(params),
      "GET",
      null
    );

    if (data.success) {
      dispatch(fetchingProductsSuccess(data)); // Thay đổi thành `fetchingProductsSuccess`
    }

    if (data.error) {
      dispatch(fetchingProductsFailure(data)); // Thay đổi thành `fetchingProductsFailure`
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(schema),
  });

  const toast = useCustomToast();

  const [files, setFiles] = React.useState([]);

  const handleFileChange = (newFiles) => {
    setFiles(newFiles);
  };

  const handleUpdateDish = async (data) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("price", data.price);
    formData.append("short_description", data.short_description);
    formData.append("description", data.description);
    formData.append("category_id", dishCategory.id);

    // Append each file to the FormData
    if (files && files.length > 0) {
      files.forEach((file) => {
        formData.append("images", file); // Append each image to the FormData
        console.log("Appending file:", file); // Log each file being appended
      });
    }

    dispatch(addingDish());

    // console.log("Adding dish with data:", formData);

    const response = await makeAuthorizedRequest(
      API_CONFIG.PRODUCTS.UPDATE(selectedDish.id),
      "PATCH",
      formData
    );

    if (response.success) {
      console.log("Update dish response:", response);

      dispatch(addingDishSuccess(response.data));
      toast({
        title: "Đã cập nhật món ăn",
        description: "Món ăn đã được cập nhật thành công",
        type: "success",
      });
      setIsOpenDetailModal(false);
    } else {
      dispatch(addingDishFailure(response.message));
      toast({
        title: "Lỗi khi cập nhật món ăn",
        description: response.message,
        type: "error",
      });
    }
  };

  const handleAddDish = async (data) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("price", data.price);
    formData.append("short_description", data.short_description);
    formData.append("description", data.description);
    formData.append("category_id", data.category);

    // Append each file to the FormData
    if (files && files.length > 0) {
      files.forEach((file) => {
        formData.append("images", file); // Append each image to the FormData
        console.log("Appending file:", file); // Log each file being appended
      });
    }

    dispatch(addingDish());

    // console.log("Adding dish with data:", formData);

    const response = await makeAuthorizedRequest(
      API_CONFIG.PRODUCTS.CREATE,
      "POST",
      formData
    );

    if (response.success) {
      dispatch(addingDishSuccess(response.data));
      toast({
        title: "Đã thêm món ăn",
        description: "Món ăn đã được thêm vào thành công",
        type: "success",
      });

      await fetchCategoryDishes(dishCategory.id);
    } else {
      dispatch(addingDishFailure(response.message));
      toast({
        title: "Lỗi khi thêm món ăn",
        description: response.message,
        type: "error",
      });
    }
  };

  const handleDeleteDish = async (dishId) => {
    const confirm = window.confirm("Bạn có chắc chắn muốn xóa món ăn này?");

    if (!confirm) return;

    dispatch(deleteDishRequest());

    const data = await makeAuthorizedRequest(
      API_CONFIG.PRODUCTS.DELETE(dishId),
      "DELETE"
    );

    if (data.success) {
      dispatch(deleteDishSuccess(data));
      toast({
        title: "Đã xóa món ăn",
        description: "Món ăn đã được xóa thành công",
        type: "success",
      });

      await fetchCategoryDishes(dishCategory.id);
    } else {
      dispatch(deleteDishFailure(data.message));
      toast({
        title: "Lỗi khi xóa món ăn",
        description: data.message,
        type: "error",
      });
    }

    setIsOpenDetailModal(false);
  };

  const openDetailModal = () => {
    setIsOpenDetailModal(true);
  };

  const handleAddButtonClick = () => {
    reset(); // Reset the form
    setIsOpenDetailModal(true);
  };

  const onInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const inputValue = type === "checkbox" ? checked : value;
    setValue(name, inputValue);
  };

  const handleModalClose = () => {
    // Perform any additional actions here
    dispatch(setSelectedDish(null)); // Reset the selected dish

    // // Reset the form or any other state if needed
    reset();

    // Finally, close the modal
    setIsOpenDetailModal(false);
  };

  const onSubmit = async (data) => {
    if (selectedDish) {
      await handleUpdateDish(data); // Update dish if selected
    } else {
      await handleAddDish(data); // Add new dish
    }
  };

  React.useEffect(() => {
    const handle = () => {
      if (selectedDish) {
        // console.log("Selected dish in useEffect hook:", selectedDish);
        setImgSrc(
          (selectedDish && selectedDish?.images[0]) ||
            CONFIG.DISH_IMAGE_PLACEHOLDER
        );

        // Set form values
        setValue("name", selectedDish.name);
        setValue("price", selectedDish.price);
        setValue("short_description", selectedDish.short_description);
        setValue("description", selectedDish.description);
        setValue("category", selectedDish.category_id);
      } else {
        setIsOpenDetailModal(false);
        reset();
      }
    };

    handle();

    return () => {};
  }, [selectedDish]);

  // TABLE SET UP
  const statusOptions = React.useMemo(
    () => [
      { name: "Đã xử lý", uid: 1 },
      { name: "Chưa xử lý", uid: 2 },
    ],
    []
  );

  const columns = React.useMemo(
    () => [
      { name: "Ảnh", uid: "images", sortable: false },
      { name: "Tên món ăn", uid: "name", sortable: true },
      { name: "Giá món ăn", uid: "price", sortable: true },
      { name: "Mô tả ngắn", uid: "short_description" },
      { name: "Mô tả đầy đủ", uid: "description" },
      // { name: "Trạng thái", uid: "status", sortable: true },
      { name: "Hành động", uid: "actions" },
    ],
    []
  );

  const [filterValue, setFilterValue] = React.useState("");
  const [selectedKeys, setSelectedKeys] = React.useState(new Set([]));
  const [visibleColumns, setVisibleColumns] = React.useState(
    new Set(INITIAL_VISIBLE_COLUMNS)
  );
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [page, setPage] = React.useState(1);
  const [image, setImage] = React.useState(CONFIG.DISH_IMAGE_PLACEHOLDER);

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    );
  }, [visibleColumns]);

  const filteredItems = React.useMemo(() => {
    if (!dishes) return [];

    let filtereddishes = [...dishes];

    if (hasSearchFilter) {
      filtereddishes = filtereddishes.filter((dish) =>
        dish.name.toLowerCase().includes(filterValue.toLowerCase())
      );
    }

    return filtereddishes;
  }, [dishes, filterValue]);

  const renderCell = React.useCallback((dish, columnKey) => {
    const cellValue = dish[columnKey];

    switch (columnKey) {
      case "images":
        return (
          <div className="w-14 h-14 mr-3 relative group-hover:scale-125 transition-transform shrink-0">
            <Image
              sizes="80px"
              priority
              src={image}
              alt={dish.name}
              fill
              className="rounded-full w-fit object-cover shrink-0"
              onError={() => setImage(CONFIG.DISH_IMAGE_PLACEHOLDER)}
            />
          </div>
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
                <DropdownItem
                  onClick={() => {
                    dispatch(setSelectedDish(dish));
                    openDetailModal();
                  }}
                >
                  Xem món ăn
                </DropdownItem>
                <DropdownItem onClick={openDetailModal}>
                  Chỉnh sửa món ăn
                </DropdownItem>
                <DropdownItem
                  className="text-red-400"
                  onClick={() => handleDeleteDish(selectedDish.id)}
                >
                  Xóa món ăn
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        );
      default:
        return cellValue;
    }
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
      <div className="flex flex-col gap-4">
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
            <Button
              onClick={handleAddButtonClick}
              radius="full"
              className="bg-whiteAlpha-100 hover:bg-whiteAlpha-200 text-white font-medium !shrink-0"
              startContent={
                <PlusIcon className="w-5 h-5 text-white font-semibold shrink-0" />
              }
            >
              Thêm món ăn
            </Button>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            Tổng {dishes && dishes.length} món ăn
          </span>
        </div>
      </div>
    );
  }, [
    filterValue,
    statusFilter,
    visibleColumns,
    dishes && dishes.length,
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
        <CustomPagination
          onChange={handlePageChange}
          total={pagination ? pagination.lastPage : 1}
          page={currentPage}
        ></CustomPagination>
      </div>
    );
  }, [selectedKeys, hasSearchFilter]);

  return (
    <>
      <Table
        aria-label="Example table with custom cells, pagination and sorting"
        isHeaderSticky
        bottomContent={bottomContent}
        bottomContentPlacement="outside"
        classNames={{
          thead:
            "!bg-whiteAlpha-100 has-[role=columnheader]:bg-whiteAlpha-200 [&>tr>th]:bg-whiteAlpha-200",
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
        topContent={topContent}
        topContentPlacement="outside"
        onSelectionChange={setSelectedKeys}
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
        <TableBody emptyContent={"No dishes found"} items={filteredItems}>
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
      {/* MODAL */}
      {isOpenDetailModal && (
        <Suspense fallback={<Loading />}>
          <>
            <Modal
              size="3xl"
              isOpen={isOpenDetailModal}
              onOpenChange={handleModalClose}
              placement="top-center"
              scrollBehavior="outside"
            >
              <ModalContent>
                {(onClose) => (
                  <>
                    <form onSubmit={handleSubmit(onSubmit)}>
                      <ModalHeader className="flex flex-col gap-1">
                        {selectedDish
                          ? `Chi tiết món ăn: ${selectedDish.name}`
                          : "Thêm món ăn"}
                      </ModalHeader>
                      <ModalBody>
                        <Row gutter={20}>
                          <Col span={12} className="h-full">
                            {/* IMAGE & UPLOADER */}
                            <Uploader
                              onFileChange={handleFileChange}
                              files={files}
                              setFiles={setFiles}
                            />
                            {selectedDish && (
                              <Image
                                src={imgSrc}
                                onError={() =>
                                  setImgSrc(CONFIG.DISH_IMAGE_PLACEHOLDER)
                                }
                                alt={"image"}
                                sizes="200px"
                                width={50}
                                height={50}
                                className="rounded-lg mt-3"
                              />
                            )}
                          </Col>
                          <Col span={12}>
                            <FormInput
                              theme="dark"
                              id={"name"}
                              name={"name"} // Must have: because you have to using it to register the input
                              label={"Tên món"} // If empty: label won't show
                              ariaLabel={"Name of dish"} // Must have: for accessibility
                              type={"text"}
                              register={register}
                              errors={errors}
                              errorMessage={errors?.name?.message}
                              wrapperClassName="!mt-0"
                              // defaultValue={formData.name} // Set default value
                              value={watch("name")}
                              onChange={onInputChange}
                            ></FormInput>
                            <FormInput
                              theme="dark"
                              id={"price"}
                              name={"price"} // Must have: because you have to using it to register the input
                              label={"Giá món"} // If empty: label won't show
                              ariaLabel={"Price of dish"} // Must have: for accessibility
                              type={"text"}
                              register={register}
                              errors={errors}
                              errorMessage={errors?.price?.message}
                              // defaultValue={formData.price} // Set default value
                              value={watch("price")}
                              onChange={onInputChange}
                            ></FormInput>
                            <FormInput
                              type="select"
                              theme="dark"
                              id={"category"}
                              name={"category"} // Must have: because you have to using it to register the input
                              label={"Danh mục món ăn"} // If empty: label won't show
                              ariaLabel={"Danh mục món ăn"} // Must have: for accessibility
                              register={register}
                              errors={errors}
                              errorMessage={errors?.category?.message}
                              required={false}
                              options={[
                                {
                                  id: "",
                                  name: "Chọn danh mục",
                                },
                                ...categories,
                              ]}
                              // defaultValue={formData.category} // Set default value
                              value={watch("category")}
                              onChange={onInputChange}
                            ></FormInput>
                            <FormInput
                              theme="dark"
                              id={"short_description"}
                              name={"short_description"} // Must have: because you have to using it to register the input
                              label={"Mô tả ngắn"} // If empty: label won't show
                              ariaLabel={"Mô tả ngắn của món ăn"} // Must have: for accessibility
                              type={"textarea"}
                              register={register}
                              errors={errors}
                              errorMessage={errors?.short_description?.message}
                              rows={4}
                              // defaultValue={formData.short_description} // Set default value
                              value={watch("short_description")}
                              onChange={onInputChange}
                            ></FormInput>
                            <FormInput
                              theme="dark"
                              id={"description"}
                              name={"description"} // Must have: because you have to using it to register the input
                              label={"Mô tả chi tiết"} // If empty: label won't show
                              ariaLabel={"Mô tả chi tiết của món ăn"} // Must have: for accessibility
                              type={"textarea"}
                              register={register}
                              errors={errors}
                              errorMessage={errors?.description?.message}
                              // defaultValue={formData.description} // Set default value
                              value={watch("description")}
                              onChange={onInputChange}
                            ></FormInput>
                          </Col>
                        </Row>
                      </ModalBody>
                      <ModalFooter>
                        {selectedDish ? (
                          <Button
                            radius="full"
                            onPress={() => {
                              handleDeleteDish(selectedDish.id);
                            }}
                            startContent={
                              <TrashIcon className="shrink-0 w-4 h-4" />
                            }
                            className="bg-red-200 hover:bg-red-300 text-red-500"
                          >
                            Xóa món ăn
                          </Button>
                        ) : (
                          <Button
                            radius="full"
                            onPress={() => {
                              reset();
                              onClose();
                            }}
                            startContent={
                              <XMarkIcon className="w-4 h-4 shrink-0" />
                            }
                            className="bg-gray-200 hover:bg-gray-300 text-gray-800"
                          >
                            Hủy
                          </Button>
                        )}
                        <Button
                          type="submit"
                          radius="full"
                          className="bg-teal-400 hover:bg-teal-500 text-white"
                          startContent={(() => {
                            if (selectedDish) {
                              return isUpdatingDish ? null : (
                                <IoSaveOutline className="w-4 h-4 shrink-0" />
                              );
                            } else {
                              return isAddingDish ? null : (
                                <PlusIcon className="w-4 h-4 shrink-0" />
                              );
                            }
                          })()}
                          isLoading={
                            selectedDish ? isUpdatingDish : isAddingDish
                          }
                        >
                          {(() => {
                            if (selectedDish) {
                              return isUpdatingDish
                                ? "Đang cập nhật..."
                                : "Cập nhật món ăn";
                            } else {
                              return isAddingDish
                                ? "Đang thêm..."
                                : "Thêm món ăn";
                            }
                          })()}
                        </Button>
                      </ModalFooter>
                    </form>
                  </>
                )}
              </ModalContent>
            </Modal>
          </>
        </Suspense>
      )}
    </>
  );
}

export default DishesTable;
