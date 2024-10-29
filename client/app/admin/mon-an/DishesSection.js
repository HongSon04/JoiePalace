"use client";

import Dish from "@/app/_components/Dish";
import FormInput from "@/app/_components/FormInput";
import useApiServices from "@/app/_hooks/useApiServices";
import {
  addingDish,
  addingDishFailure,
  addingDishSuccess,
  fetchingCategoryDishes,
  fetchingCategoryDishesFailure,
  fetchingCategoryDishesSuccess,
  setSelectedDish,
} from "@/app/_lib/features/dishes/dishesSlice";
import { API_CONFIG } from "@/app/_utils/api.config";
import { PlusIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/modal";
import { Button, Spinner } from "@nextui-org/react";
import { Col, Row } from "antd";
import React, { Suspense } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { z } from "zod";
import Loading from "../loading";
import Uploader from "@/app/_components/Uploader";

const schema = z.object({
  name: z.string().nonempty("Tên món không được để trống"),
  price: z.string().nonempty("Giá món không được để trống"),
  short_description: z.string().nonempty("Mô tả ngắn không được để trống"),
  description: z.string().nonempty("Mô tả chi tiết không được để trống"),
  category: z.string().nonempty("Danh mục món ăn không được để trống"),
});

function DishesSection({ dishCategory, categories }) {
  const dispatch = useDispatch();
  const { makeAuthorizedRequest } = useApiServices();
  const { selectedDish } = useSelector((store) => store.dishes);
  const [categoryDishes, setCategoryDishes] = React.useState(null);
  const [isOpenDetailModal, setIsOpenDetailModal] = React.useState(false);
  const [defaultValue, setDefaultValue] = React.useState({
    name: "",
    price: "",
    short_description: "",
    description: "",
    category: "",
  });

  const { isLoading, isError } = useSelector((store) => store.dishes);

  React.useEffect(() => {
    const fetchCategoryDishes = async (categoryId) => {
      dispatch(fetchingCategoryDishes());

      const data = await makeAuthorizedRequest(
        API_CONFIG.PRODUCTS.GET_BY_CATEGORY(categoryId),
        "GET",
        null
      );

      if (data.success) {
        dispatch(fetchingCategoryDishesSuccess());
        setCategoryDishes(data.data);
        return;
      }

      if (data.error) {
        dispatch(fetchingCategoryDishesFailure());
        return;
      }
    };

    fetchCategoryDishes(dishCategory.id);

    return () => {};
  }, []);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const openDetailModal = () => {
    if (selectedDish) {
      // Set the form values to the selected dish data
      setDefaultValue({
        name: selectedDish.name,
        price: selectedDish.price,
        short_description: selectedDish.short_description,
        description: selectedDish.description,
        category: selectedDish.category_id, // Assuming category_id is part of the selectedDish
      });
    } else {
      // Reset to empty values for adding a new dish
      setDefaultValue({
        name: "",
        price: "",
        short_description: "",
        description: "",
        category: "",
      });
    }
    onOpen();
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: defaultValue, // Set default values here
  });

  // Call reset with the default values when opening the modal
  const handleOnOpenChange = (isOpen) => {
    if (isOpen) {
      reset(defaultValue); // Reset the form with the current default values
    }
    onOpenChange(isOpen);
  };

  const [files, setFiles] = React.useState([]);

  const handleFileChange = (newFiles) => {
    setFiles(newFiles);
  };

  const handleAddDish = async (data) => {
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
    } else {
      console.error("No valid images to upload");
      return; // Prevent submission if no images are valid
    }

    dispatch(addingDish());

    console.log("Adding dish with data:", formData);

    const response = await makeAuthorizedRequest(
      API_CONFIG.PRODUCTS.CREATE,
      "POST",
      formData
    );

    if (response.success) {
      dispatch(addingDishSuccess());
      onOpenChange();
    } else {
      dispatch(addingDishFailure(response.message));
    }
  };

  const onSubmit = async (data) => {
    await handleAddDish(data);
  };

  return (
    <>
      {isLoading && (
        <div className="flex justify-center items-center">
          <Spinner size="large" />
        </div>
      )}
      {isError && (
        <div className="flex justify-center items-center">
          <p className="text-red-500">Failed to load dishes</p>
        </div>
      )}
      {!isLoading && !isError && (
        <div className="mb-5">
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
                  <Dish
                    dish={dish}
                    onClick={() => {
                      dispatch(setSelectedDish(dish));
                      openDetailModal();
                    }}
                  />
                </Col>
              ))}
            {/* Add button */}
            <Col
              span={8}
              md={{
                span: 6,
              }}
            >
              <Button
                onPress={() => {
                  // When the add button is clicked, reset to empty values
                  setDefaultValue({
                    name: "",
                    price: "",
                    short_description: "",
                    description: "",
                    category: "",
                  });
                  onOpen();
                }}
                isIconOnly
                className="bg-whiteAlpha-100 p-3 group rounded-lg shadow-md flex items-center hover:whiteAlpha-200 cursor-pointer flex-center h-full w-full"
                radius="full"
              >
                <PlusIcon className="w-5 h-5 text-white font-semibold" />
              </Button>
            </Col>
          </Row>

          {/* MODAL */}
          {isOpen && (
            <Suspense fallback={<Loading />}>
              <>
                <Modal
                  size="3xl"
                  isOpen={isOpen}
                  onOpenChange={(isOpen) => {
                    if (isOpen) {
                      reset(defaultValue); // Reset the form with the current default values
                    }
                    onOpenChange(isOpen);
                  }}
                  placement="top-center"
                  scrollBehavior="outside"
                >
                  <ModalContent>
                    {(onClose) => (
                      <>
                        <form onSubmit={handleSubmit(onSubmit)}>
                          <ModalHeader className="flex flex-col gap-1">
                            Thêm món ăn
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
                                ></FormInput>
                                <FormInput
                                  theme="dark"
                                  id={"price"}
                                  name={"price"} // Must have: because you have to using it to register the input
                                  label={"Giá món"} // If empty: label won't show
                                  ariaLabel={"Price of dish"} // Must have: for accessibility
                                  type={"number"}
                                  register={register}
                                  errors={errors}
                                  errorMessage={errors?.price?.message}
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
                                ></FormInput>
                              </Col>
                            </Row>
                          </ModalBody>
                          <ModalFooter>
                            <Button
                              radius="full"
                              onPress={() => {
                                reset();
                                onClose();
                              }}
                              startContent={<XMarkIcon />}
                              className="bg-gray-200 hover:bg-gray-300 text-gray-800"
                            >
                              Hủy
                            </Button>
                            <Button
                              type="submit"
                              radius="full"
                              className="bg-teal-400 hover:bg-teal-500 text-white"
                              startContent={
                                isLoading ? null : (
                                  <PlusIcon className="w-5 h-5" />
                                )
                              }
                              isLoading={isLoading}
                            >
                              {isLoading ? "Đang thêm món ăn" : "Thêm"}
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
      )}
    </>
  );
}

export default DishesSection;
