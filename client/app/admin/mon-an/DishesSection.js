"use client";

import CustomPagination from "@/app/_components/CustomPagination";
import Dish from "@/app/_components/Dish";
import FormInput from "@/app/_components/FormInput";
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
import { API_CONFIG } from "@/app/_utils/api.config";
import { CONFIG } from "@/app/_utils/config";
import { PlusIcon, TrashIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/modal";
import { Button, Checkbox, Spinner } from "@nextui-org/react";
import { Col, Row } from "antd";
import Image from "next/image";
import React, { Suspense } from "react";
import { useForm } from "react-hook-form";
import { IoSaveOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { z } from "zod";
import Loading from "../loading";
import SearchForm from "@/app/_components/SearchForm";
import DishesSectionSkeleton from "@/app/_components/skeletons/DishesSectionSkeleton";

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

function DishesSection({ dishCategory, categories }) {
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = React.useState(1);
  const { makeAuthorizedRequest } = useApiServices();
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
    isUpdateDishError,
  } = useSelector((store) => store.dishes);
  const [itemsPerPage, setItemsPerPage] = React.useState(10);
  const [sortByPrice, setSortByPrice] = React.useState("DESC"); // ASC or DESC
  const [searchQuery, setSearchQuery] = React.useState("");

  React.useEffect(() => {
    async function fetchData() {
      await fetchCategoryDishes(dishCategory.id, {
        page: currentPage,
        itemsPerPage: itemsPerPage,
      });
    }

    fetchData();

    return () => {};
  }, []);

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

  React.useEffect(() => {
    const abortController = new AbortController();
    const fetchData = async () => {
      try {
        await fetchCategoryDishes(dishCategory.id, {
          page: currentPage,
          itemsPerPage: itemsPerPage,
          search: searchQuery,
          priceSort: sortByPrice,
        });
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };

    fetchData();

    return () => {
      abortController.abort();
    };
  }, [currentPage, itemsPerPage, searchQuery, sortByPrice]);

  const fetchCategoryDishes = async (
    categoryId,
    params = {
      page: currentPage,
      itemsPerPage: itemsPerPage,
    }
  ) => {
    dispatch(fetchingCategoryDishes());

    const data = await makeAuthorizedRequest(
      API_CONFIG.PRODUCTS.GET_BY_CATEGORY(categoryId, params),
      "GET",
      null
    );

    if (data.success) {
      dispatch(fetchingCategoryDishesSuccess(data));
      return;
    }

    if (data.error) {
      dispatch(fetchingCategoryDishesFailure(data));
      return;
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

  return (
    <>
      <div className="mb-5">
        <div className="flex justify-between items-center">
          {/* ITEMS PER PAGE */}
          <div className="flex-center gap-3">
            <select
              name="perPage"
              id="perPage"
              className="select dark:bg-gray-800 dark:text-white h-fit"
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
            <span className="text-white">món trên trang</span>
          </div>
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
              className="select dark:bg-gray-800 dark:text-white h-fit"
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
          </div>
        </div>
        {isLoading ? (
          <DishesSectionSkeleton />
        ) : isError ? (
          <div className="flex justify-center items-center">
            <p className="text-gray-400">Failed to load dishes</p>
          </div>
        ) : (
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

        <CustomPagination
          onChange={handlePageChange}
          total={pagination ? Math.ceil(pagination.total / itemsPerPage) : 1}
          page={currentPage}
        ></CustomPagination>
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
                                errorMessage={
                                  errors?.short_description?.message
                                }
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
      </div>
    </>
  );
}

export default DishesSection;
