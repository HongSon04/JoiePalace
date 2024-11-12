"use client";

import FormInput from "@/app/_components/FormInput";
import Uploader from "@/app/_components/Uploader";
import useApiServices from "@/app/_hooks/useApiServices";
import useCustomToast from "@/app/_hooks/useCustomToast";
import { addCategory } from "@/app/_lib/features/categories/categoriesSlice";
import {
  ExclamationCircleIcon,
  PlusIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
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
import { AnimatePresence, motion } from "framer-motion";
import React from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { z } from "zod";

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

function AddCategoryButton() {
  const toast = useCustomToast();

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isImagesEmpty, setIsImagesEmpty] = React.useState(false);
  const [isImageOverSize, setIsImageOverSize] = React.useState(false);
  const [isFormatAccepted, setIsFormatAccepted] = React.useState(false);
  const { isAddingCategory, isAddingCategoryError } = useSelector(
    (state) => state.categories
  );

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
  const [files, setFiles] = React.useState([]);

  const handleFileChange = (newFiles) => {
    setFiles(newFiles);
  };

  const handleAddCategory = async (data) => {
    console.log("data -> ", data);

    // Check if there are no images or images do not meet the requirements
    if (isImagesEmpty) {
      setIsImagesEmpty(true);
      return;
    }

    if (!isFormatAccepted || isImageOverSize) {
      console.log("isFormatAccepted -> ", isFormatAccepted);
      console.log("isImageOverSize -> ", isImageOverSize);
      console.log("isImagesEmpty -> ", isImagesEmpty);

      console.log(files);
      console.log("Image error");
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

    console.log("Form data -> ", formData);

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

  const onSubmit = async (data) => {
    await handleAddCategory(data);
  };

  const inputRef = React.useRef();

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
        Thêm danh mục
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

export default AddCategoryButton;
