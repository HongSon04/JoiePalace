"use client";

import FormInput from "@/app/_components/FormInput";
import useApiServices from "@/app/_hooks/useApiServices";
import useCustomToast from "@/app/_hooks/useCustomToast";
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

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(schema),
  });

  const dispatch = useDispatch();
  const { isLoading, isError } = useSelector((store) => store.dishes);
  const { makeAuthorizedRequest } = useApiServices();

  const handleAddDishCategory = async (data) => {
    dispatch(addingDishCategory());

    const response = await makeAuthorizedRequest(
      API_CONFIG.CATEGORIES.CREATE,
      "POST",
      {
        ...data,
      }
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
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Thêm danh mục món ăn
              </ModalHeader>
              <ModalBody>
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="w-full flex gap-4 flex-col items-end"
                >
                  <FormInput
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
                  />
                  <FormInput
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
                    wrapperClassName={"w-full text-gray-600 !mt-0"}
                  />
                  <FormInput
                    type={"textarea"}
                    register={register}
                    id={"categoryDescription"}
                    name={"categoryDescription"}
                    ariaLabel={"Mô tả danh mục"}
                    placeholder={"Mô tả danh mục đầy đủ"}
                    errors={errors}
                    errorMessage={errors?.categoryDescription?.message}
                    className={"!bg-gray-100 !mt-0 !text-gray-600"}
                    wrapperClassName={"w-full text-gray-600 !mt-0"}
                  />
                  <div className="flex w-full justify-end items-center gap-5">
                    <Button
                      onClick={onClose}
                      className="bg-gray-100 hover:brightness-95 text-gray-600 font-semibold shadow-sm"
                      startContent={
                        <XMarkIcon className="w-5 h-5 text-gray-600 font-semibold shrink-0" />
                      }
                    >
                      Hủy
                    </Button>
                    <Button
                      className="bg-teal-400 hover:bg-teal-500 text-white font-semibold"
                      startContent={
                        !isLoading ? (
                          <PlusIcon className="w-5 h-5 text-white font-semibold shrink-0" />
                        ) : null
                      }
                      type="submit"
                      isLoading={isLoading}
                    >
                      {isLoading
                        ? "Đang thêm danh mục"
                        : isError
                        ? "Thử lại"
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

export default AddDishCategory;
