"use client";

import FormInput from "@/app/_components/FormInput";
import Uploader from "@/app/_components/Uploader";
import useApiServices from "@/app/_hooks/useApiServices";
import useCustomToast from "@/app/_hooks/useCustomToast";
import {
  fetchingParentCategory,
  fetchingParentCategoryFailure,
  fetchingParentCategorySuccess,
} from "@/app/_lib/features/categories/categoriesSlice";
import {
  addingDishCategory,
  addingDishCategoryFailure,
  addingDishCategorySuccess,
} from "@/app/_lib/features/dishes/dishesSlice";
import { API_CONFIG } from "@/app/_utils/api.config";
import { PlusIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/modal";
import { Button } from "@nextui-org/react";
import { Col, Row } from "antd";
import React from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { z } from "zod";

const schema = z.object({
  categoryName: z
    .string()
    .nonempty("Tên danh mục không được để trống")
    .max(35, "Tên danh mục không được quá 35 ký tự"),
  shortDescription: z
    .string()
    .nonempty("Vui lòng nhập mô tả ngắn về danh mục")
    .max(100, "Mô tả không được quá 100 ký tự"),
  categoryDescription: z
    .string()
    .nonempty("Vui lòng nhập mô tả về danh mục")
    .max(255, "Mô tả không được quá 255 ký tự"),
});

function AddDishCategory() {
  const toast = useCustomToast();

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [parentCategory, setParentCategory] = React.useState(null);

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

  const dispatch = useDispatch();
  const { isLoading, isError } = useSelector((store) => store.dishes);
  const { makeAuthorizedRequest } = useApiServices();
  const [files, setFiles] = React.useState([]);

  const handleFileChange = (newFiles) => {
    setFiles(newFiles);
  };

  const handleAddDishCategory = async (data) => {
    dispatch(addingDishCategory());

    const formData = new FormData();

    formData.append("category_id", parseInt(data.category_id, 10));
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("short_description", data.short_description);

    files.forEach((file) => {
      formData.append("images", file);
    });

    console.log("Form data -> ", formData);

    const response = await makeAuthorizedRequest(
      API_CONFIG.CATEGORIES.CREATE,
      "POST",
      formData
    );

    if (response?.success) {
      dispatch(addingDishCategorySuccess());
      toast({
        title: "Thành công",
        description: "Danh mục món ăn đã được thêm",
        type: "success",
        isClosable: true,
      });
      reset();
    } else {
      dispatch(addingDishCategoryFailure());
      toast({
        title: "Lỗi thêm danh mục món ăn",
        description:
          response.error.error === "Unauthorized"
            ? "Phiên đăng nhập đã hết hạn"
            : "Có lỗi xảy ra khi thêm danh mục món ăn",
        type: "error",
        isClosable: true,
      });
    }
  };

  const onSubmit = async (data) => {
    await handleAddDishCategory({
      category_id: parseInt(parentCategory.id, 10),
      name: data.categoryName,
      description: data.categoryDescription,
      short_description: data.shortDescription,
    });
  };

  const inputRef = React.useRef();

  React.useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen, inputRef]);

  const getParentCategory = async () => {
    dispatch(fetchingParentCategory());

    const response = await makeAuthorizedRequest(
      API_CONFIG.CATEGORIES.GET_BY_SLUG(API_CONFIG.FOOD_CATEGORY_SLUG),
      "GET"
    );

    if (response.success) {
      dispatch(fetchingParentCategorySuccess());
      setParentCategory(response.data.at(0));
    } else {
      dispatch(fetchingParentCategoryFailure());
      toast({
        title: "Có lỗi khi lấy dữ liệu danh mục",
        description: response.message,
      });
    }

    return response;
  };

  React.useEffect(() => {
    async function fetchData() {
      await getParentCategory();
    }

    fetchData();

    return () => {};
  }, []);

  return (
    <>
      <Button
        onClick={onOpen}
        radius="full"
        className="bg-whiteAlpha-100 hover:bg-whiteAlpha-200 text-white font-medium !shrink-0"
        startContent={
          <PlusIcon className="w-5 h-5 text-white font-semibold shrink-0" />
        }
      >
        Thêm danh mục món ăn
      </Button>
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
                Thêm danh mục món ăn
              </ModalHeader>
              <ModalBody>
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="w-full flex gap-4 flex-col flex-center"
                >
                  <Row gutter={20}>
                    <Col span={12}>
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
                        inputRef={inputRef}
                        type={"text"}
                        register={register}
                        id={"categoryName"}
                        name={"categoryName"}
                        ariaLabel={"Tên danh mục"}
                        placeholder={"Nhập tên danh mục"}
                        errors={errors}
                        errorMessage={errors?.categoryName?.message}
                        className={"!bg-gray-100 !mt-0 !text-gray-600"}
                        wrapperClassName={"w-full text-gray-600 !mt-0"}
                        value={watch("categoryName")}
                        onChange={onInputChange}
                      />
                      <FormInput
                        theme="dark"
                        type={"textarea"}
                        register={register}
                        cols={3}
                        rows={3}
                        id={"shortDescription"}
                        name={"shortDescription"}
                        ariaLabel={"Mô tả ngắn"}
                        placeholder={"Nhập mô tả ngắn"}
                        errors={errors}
                        errorMessage={errors?.shortDescription?.message}
                        className={"!bg-gray-100 !mt-0 !text-gray-600"}
                        wrapperClassName={"w-full text-gray-600 !mt-3"}
                        value={watch("shortDescription")}
                        onChange={onInputChange}
                      />
                      <FormInput
                        theme="dark"
                        type={"textarea"}
                        register={register}
                        id={"categoryDescription"}
                        name={"categoryDescription"}
                        ariaLabel={"Mô tả danh mục"}
                        placeholder={"Mô tả danh mục đầy đủ"}
                        errors={errors}
                        errorMessage={errors?.categoryDescription?.message}
                        className={"!bg-gray-100 !mt-0 !text-gray-600"}
                        wrapperClassName={"w-full text-gray-600 !mt-3"}
                        value={watch("categoryDescription")}
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
                        !isLoading ? (
                          <PlusIcon className="w-5 h-5 text-white font-semibold shrink-0" />
                        ) : null
                      }
                      type="submit"
                      isLoading={isLoading}
                      radius="full"
                    >
                      {isLoading ? "Đang thêm danh mục..." : "Thêm danh mục"}
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

export default AddDishCategory;
