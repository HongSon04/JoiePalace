"use client";

import CustomPagination from "@/app/_components/CustomPagination";
import Dish from "@/app/_components/Dish";
import FormInput from "@/app/_components/FormInput";
import SearchForm from "@/app/_components/SearchForm";
import DishesSectionSkeleton from "@/app/_components/skeletons/DishesSectionSkeleton";
import Uploader from "@/app/_components/Uploader";
import useApiServices from "@/app/_hooks/useApiServices";
import useCustomToast from "@/app/_hooks/useCustomToast";
import {
  addDish,
  deleteDish,
  fetchCategoryDishes,
  setSelectedDish,
  updateDish,
} from "@/app/_lib/features/dishes/dishesSlice";
import { CONFIG } from "@/app/_utils/config";
import { PlusIcon, TrashIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/modal";
import { Image } from "@nextui-org/react";
import NextImage from "next/image";
import { Button, Switch } from "@nextui-org/react";
import { Col, Row } from "antd";
import React, { Suspense } from "react";
import { useForm } from "react-hook-form";
import { IoSaveOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { z } from "zod";
import Loading from "../loading";

// Define a schema for individual file validation
const fileSchema = z
  .instanceof(File)
  .refine((file) => file.size <= 5 * 1024 * 1024, {
    message: "Kích thước ảnh không được vượt quá 5MB",
  })
  .refine((file) => ["image/jpeg", "image/png"].includes(file.type), {
    message: "Chỉ chấp nhận ảnh định dạng JPEG hoặc PNG",
  });

const schema = z.object({
  name: z
    .string({
      required_error: "Tên món ăn không được để trống",
    })
    .min(1, { message: "Tên món không được để trống" }),
  price: z.union([
    z
      .string({
        required_error: "Giá món ăn không được để trống",
      })
      .min(1, { message: "Giá món không được để trống" }),
    z.number().min(1, { message: "Giá món không được để trống" }),
  ]),
  category: z.union([
    z
      .string({
        required_error: "Danh mục không được để trống",
      })
      .min(1, { message: "Danh mục món không được để trống" }),
    z
      .number({
        required_error: "Danh mục không được để trống",
      })
      .min(1, { message: "Danh mục món không được để trống" }),
  ]),
  short_description: z
    .string({
      required_error: "Mô tả ngắn không được để trống",
    })
    .min(1, { message: "Mô tả ngắn không được để trống" }),
  description: z
    .string({
      required_error: "Mô tả chi tiết không được để trống",
    })
    .min(1, { message: "Mô tả chi tiết không được để trống" }),
  images: z.array(fileSchema).refine((files) => files.length > 0, {
    message: "Vui lòng chọn ít nhất một ảnh",
  }),
});

function DishesSection({ dishCategory, categories }) {
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = React.useState(1);
  const [isOpenDetailModal, setIsOpenDetailModal] = React.useState(false);
  const [imgSrc, setImgSrc] = React.useState(CONFIG.DISH_IMAGE_PLACEHOLDER);
  const {
    selectedDish,
    pagination,
    categoryDishes,
    isLoading,
    isError,
    isAddingDish,
    isUpdatingDish,
  } = useSelector((store) => store.dishes);
  const toast = useCustomToast();
  const [itemsPerPage, setItemsPerPage] = React.useState(10);
  const [sortByPrice, setSortByPrice] = React.useState("DESC");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [files, setFiles] = React.useState([]);
  const [resetAfterSubmit, setResetAfterSubmit] = React.useState(false);

  const handleFileChange = (newFiles) => {
    setFiles(newFiles);
    console.log("Files changed -> ", newFiles);
  };

  const handleSearch = async (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSortByPrice = (e) => {
    setSortByPrice(e.target.value);
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(e.target.value);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
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

  const openDetailModal = () => {
    setIsOpenDetailModal(true);
  };

  const handleAddButtonClick = () => {
    dispatch(setSelectedDish(null));
    setIsOpenDetailModal(true);
  };

  const onInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const inputValue = type === "checkbox" ? checked : value;
    setValue(name, inputValue);
  };

  const handleModalClose = React.useCallback(() => {
    dispatch(setSelectedDish(null));
    reset();
    setFiles([]);
    setIsOpenDetailModal(false);
  }, []);

  const onSubmit = React.useCallback(
    async (data) => {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("price", data.price);
      formData.append("category_id", data.category);
      formData.append("short_description", data.short_description);
      formData.append("description", data.description);
      files.forEach((file) => {
        formData.append("images", file);
        console.log("File appended -> ", file);
      });

      console.log("Files that should be appended to form data -> ", files);
      console.log("form data that's gonna be submit -> ", formData);

      // Log FormData content
      for (let pair of formData.entries()) {
        console.log(pair[0] + ": " + pair[1]);
      }

      try {
        if (selectedDish) {
          const result = await dispatch(
            updateDish({ dishId: selectedDish.id, dishData: formData })
          ).unwrap();

          console.log("Result from updating dish -> ", result);

          if (result)
            toast({
              title: "Cập nhật thành công",
              description: "Món ăn đã được cập nhật",
              type: "success",
            });
        } else {
          const result = await dispatch(addDish(formData)).unwrap();

          // console.log("Result from adding dish -> ", result);

          if (result)
            toast({
              title: "Thêm thành công",
              description: "Món ăn đã được thêm vào danh sách",
              type: "success",
            });
          if (resetAfterSubmit) {
            reset();
            setFiles([]);
          }
        }
      } catch (error) {
        toast({
          title: "Lỗi!",
          description: error || "Có lỗi xảy ra khi thêm món ăn",
          type: "error",
        });
      }
    },
    [selectedDish, files, resetAfterSubmit]
  );

  const handleDeleteDish = React.useCallback((dishId) => {
    const confirm = window.confirm("Bạn có chắc chắn muốn xóa món ăn này?");

    if (!confirm) return;

    dispatch(deleteDish(dishId));
  }, []);

  React.useEffect(() => {
    const handle = () => {
      if (selectedDish) {
        setImgSrc(
          (selectedDish && selectedDish?.images[0]) ||
            CONFIG.DISH_IMAGE_PLACEHOLDER
        );
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

  React.useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    const params = {
      page: currentPage, // or any other page you want to start with
      itemsPerPage,
      search: searchQuery,
      priceSort: sortByPrice,
    };
    dispatch(
      fetchCategoryDishes({ categoryId: dishCategory.id, params, signal })
    );

    return () => {
      abortController.abort();
    };
  }, [dishCategory.id, currentPage, itemsPerPage, searchQuery, sortByPrice]);

  // useEffect for other dependencies
  React.useEffect(() => {
    const params = {
      page: currentPage,
      itemsPerPage,
      search: searchQuery,
      priceSort: sortByPrice,
    };

    dispatch(fetchCategoryDishes({ categoryId: dishCategory.id, params }));
  }, [dishCategory.id, currentPage, itemsPerPage, sortByPrice]);

  return (
    <>
      <div className="mb-5">
        <div className="flex justify-between items-center">
          {/* ITEMS PER PAGE */}
          <label htmlFor="perPage" className="flex-center gap-3 text-gray-300">
            Số món trên trang
            <select
              name="perPage"
              id="perPage"
              className="select light:bg-gray-800 light:text-white h-fit"
              onChange={handleItemsPerPageChange}
              value={itemsPerPage}
            >
              <option value="10" className="option">
                10
              </option>
              <option value="20" className="option">
                20
              </option>
              <option value="50" className="option">
                50
              </option>
              <option value="50" className="option">
                60
              </option>
              <option value="50" className="option">
                80
              </option>
              <option value="50" className="option">
                100
              </option>
            </select>
          </label>
          <div className="flex-1 flex gap-3 justify-end">
            <SearchForm
              classNames={{
                input: "w-full text-white",
              }}
              placeholder={"Tìm kiếm món ăn..."}
              value={searchQuery}
              onChange={handleSearch}
            />
            <select
              name="sortByPrice"
              id="sortByPrice"
              className="select dark:bg-gray-800 dark:text-white h-fit !rounded-full"
              onChange={handleSortByPrice}
              value={sortByPrice}
            >
              <option value="ASC" className="option">
                Giá tăng dần
              </option>
              <option value="DESC" className="option">
                Giá giảm dần
              </option>
            </select>
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
        {isLoading && <DishesSectionSkeleton />}
        {isError && (
          <div className="flex flex-col gap-3 justify-center items-center">
            <p className="text-gray-400">Tải món ăn thất bại</p>
            <button
              className="text-gray-400 underline"
              onClick={() =>
                dispatch(
                  fetchCategoryDishes({
                    categoryId: dishCategory.id,
                    params: { page: currentPage, itemsPerPage },
                  })
                )
              }
            >
              Thử lại
            </button>
          </div>
        )}
        {!isLoading && !isError && (
          <Row gutter={[12, 12]} className="mt-3">
            {categoryDishes &&
              categoryDishes.map((dish, index) => (
                <Col
                  span={8}
                  md={{
                    span: 6,
                  }}
                  key={index}
                >
                  <div className="w-full flex gap-2 items-center min-w-0">
                    {/* <Checkbox /> */}
                    <Dish
                      dish={dish}
                      onClick={() => {
                        dispatch(setSelectedDish(dish));
                        openDetailModal(dish); // Pass the dish to openDetailModal
                      }}
                      onContextMenu={(e) => {
                        e.preventDefault();
                        handleDeleteDish(dish.id);
                      }}
                      className={"flex-1 min-w-0"}
                    ></Dish>
                  </div>
                </Col>
              ))}
            <Col
              span={8}
              md={{
                span: 6,
              }}
            >
              <Button
                onPress={handleAddButtonClick}
                isIconOnly
                className="bg-whiteAlpha-100 p-3 group rounded-lg shadow-md flex items-center hover:whiteAlpha-200 cursor-pointer flex-center h-full w-full"
                radius="full"
              >
                <PlusIcon className="w-5 h-5 text-white font-semibold" />
              </Button>
            </Col>
          </Row>
        )}
        {pagination && pagination.lastPage > 1 && (
          <CustomPagination
            onChange={handlePageChange}
            total={pagination.lastPage}
            page={currentPage}
          ></CustomPagination>
        )}
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
                                id={"images"}
                                name={"images"}
                                placeholder={
                                  "Chọn ảnh món ăn hoặc kéo thả vào đây"
                                }
                                register={register}
                                errors={errors}
                              />
                              {selectedDish && (
                                <Image
                                  as={NextImage}
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
                                theme="light"
                                className="!text-gray-800 !placeholder:text-gray-400"
                                labelClassName="!text-gray-800"
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
                                theme="light"
                                className="!text-gray-800 !placeholder:text-gray-400"
                                labelClassName="!text-gray-800"
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
                                theme="light"
                                className="!text-gray-800 !placeholder:text-gray-400"
                                labelClassName="!text-gray-800"
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
                                theme="light"
                                className="!text-gray-800 !placeholder:text-gray-400"
                                labelClassName="!text-gray-800"
                                id={"short_description"}
                                name={"short_description"} // Must have: because you have to using it to register the input
                                label={"Mô tả ngắn"} // If empty: label won't show
                                ariaLabel={"Mô tả ngắn của món ăn"} // Must have: for accessibility
                                type={"textarea"}
                                register={register}
                                errors={errors}
                                errorMessage={
                                  errors?.short_description?.message
                                }
                                rows={4}
                                // defaultValue={formData.short_description} // Set default value
                                value={watch("short_description")}
                                onChange={onInputChange}
                              ></FormInput>
                              <FormInput
                                theme="light"
                                className="!text-gray-800 !placeholder:text-gray-400"
                                labelClassName="!text-gray-800"
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
                          <div className="flex flex-1 justify-start">
                            {!selectedDish && (
                              <Switch
                                isSelected={resetAfterSubmit}
                                onValueChange={setResetAfterSubmit}
                                aria-label="Xóa dữ liệu sau khi thêm"
                                size="small"
                                classNames={{
                                  label: "text-gray-400 text-md",
                                }}
                              >
                                Xóa dữ liệu sau khi thêm
                              </Switch>
                            )}
                          </div>
                          <div className="flex gap-3 items-center">
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
                          </div>
                        </ModalFooter>
                      </form>
                    </>
                  )}
                </ModalContent>
              </Modal>
            </>
          </Suspense>
        )}
      </div>
    </>
  );
}

export default DishesSection;
