"use cient";
import Loading from "@/app/loading";
import {
  EllipsisVerticalIcon as VerticalDotsIcon,
  PlusIcon,
  XMarkIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { Col, Row } from "antd";
import FormInput from "@/app/_components/FormInput";
import Uploader from "@/app/_components/Uploader";
import { motion, AnimatePresence } from "framer-motion";
import useCustomToast from "@/app/_hooks/useCustomToast";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod/dist/zod";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import {
  addCategory,
  deleteCategory,
  fetchRequests,
  updateRequestStatus,
} from "@/app/_lib/features/categories/categoriesSlice";
import { FaPen } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { Image } from "@chakra-ui/react";
import { API_CONFIG } from "@/app/_utils/api.config";

const INITIAL_VISIBLE_COLUMNS = [
  "name",
  "short_description",
  "description",
  "created_at",
  "actions",
];
const schema = z.object({
  title: z
    .string({
      required_error: "Vui lòng nhập tên bài viết",
    })
    .min(1, { message: "Vui lòng nhập tên bài viết" })
    .max(35, "Tên bài viết không được quá 35 ký tự"),
  content: z
    .string({
      required_error: "Vui lòng nhập mô tả ngắn về bài viết",
    })
    .min(1, { message: "Vui lòng nhập mô tả ngắn về bài viết" })
    .max(100, "Mô tả không được quá 100 ký tự"),
  short_description: z
    .string({
      required_error: "Vui lòng nhập mô tả ngắn về bài viết",
    })
    .min(1, { message: "Vui lòng nhập mô tả ngắn về bài viết" })
    .max(100, "Mô tả không được quá 100 ký tự"),
  description: z
    .string({
      required_error: "Vui lòng nhập mô tả đầy đủ về bài viết",
    })
    .min(1, { message: "Vui lòng nhập mô tả đầy đủ về bài viết" })
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

const BlogsTabs = () => {
  const dispatch = useDispatch();
  const [categories, setCategories] = useState(null);
  const [blogs, setBlogs] = useState(null);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const inputRef = React.useRef();
  const [files, setFiles] = React.useState([]);
  const toast = useCustomToast();
  const [isShowTips, setIsShowTips] = React.useState(true);
  const [isImagesEmpty, setIsImagesEmpty] = React.useState(false);
  const [isImageOverSize, setIsImageOverSize] = React.useState(false);
  const [isFormatAccepted, setIsFormatAccepted] = React.useState(false);
  const [dataToShow, setDataToShow] = React.useState(null);
  const [category_id, setCategory_id] = React.useState(null);
  const router = useRouter();

  const { isAddingCategory } = useSelector((store) => store.categories);
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
  useEffect(() => {
    const fecthData = async () => {
      const blogCategories = await axios.get(API_CONFIG.PACKAGES.GET_BY_ID(10)
      );
      const blogs = await axios.get(API_CONFIG.BLOGS.GET_ALL);
      const listCategoriesBlog = blogCategories?.data?.data[0]?.childrens;
      const listBlogs = blogs?.data?.data;

      setCategory_id(listCategoriesBlog[0].id);
      setBlogs(listBlogs);
      setCategories(listCategoriesBlog);
      setDataToShow(
        listBlogs.filter(
          (item) => item.category_id === listCategoriesBlog[0].id
        )
      );
    };
    fecthData();
  }, []);
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
  const getNumberBlog = (category) => {
    let totalBlogCount = 0;
    blogs.filter((blog) => {
      if (blog.category_id == category) totalBlogCount++;
    });
    return totalBlogCount;
  };
  // handle delete blog category
  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    setCategory_id(value);
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
      router.refresh();
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
  const onInputChange = (e) => {
    setValue(e.target.name, e.target.value);
  };
  const handleFileChange = (newFiles) => {
    setFiles(newFiles);
  };
  const handleAddBlog = async (data) => {
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
    formData.append("category_id", category_id);
    formData.append("content", data.content);
    formData.append("description", data.description);
    formData.append("short_description", data.short_description);
    files.forEach((file) => {
      formData.append("images", file);
    });

    console.log("Form data -> ", formData);

    // dispatch add category

    // const response = await dispatch(addCategory({ data: formData })).unwrap();

    // if (response.success) {
    //   toast({
    //     title: "Thành công",
    //     description: "Danh mục đã được thêm",
    //     type: "success",
    //     isClosable: true,
    //   });
    //   reset();
    // } else {
    //   if (response.error.statusCode === 401) {
    //     toast({
    //       title: "Lỗi thêm danh mục",
    //       description: "Phiên đăng nhập đã hết hạn",
    //       type: "error",
    //       isClosable: true,
    //     });
    //   } else {
    //     toast({
    //       title: "Lỗi thêm danh mục",
    //       description:
    //         response.error.message || "Có lỗi xảy ra khi thêm danh mục",
    //       type: "error",
    //       isClosable: true,
    //     });
    //   }
    // }
  };
  const onSubmit = async (data) => {
    await handleAddBlog(data);
    router.refresh();
  };

  if (!categories || !blogs || !dataToShow) return <Loading />;
  console.log("categories", categories);
  return (
    <>
      <div className="w-full min-h-[100vh] mt-12 flex flex-col gap-[30px]">
        <div className="w-full flex gap">
          {categories.map((category) => (
            <span
              onClick={() => {
                setDataToShow(
                  blogs.filter((item) => item.category_id === category.id)
                );
              }}
              key={category.id}
              className="text-[#9BA2AE] py-2 px-4 cursor-pointer"
            >
              {category.name}
            </span>
          ))}
        </div>
        <div className="w-full flex justify-end">
          <Button
            onClick={onOpen}
            radius="full"
            className="bg-whiteAlpha-100 hover:bg-whiteAlpha-200 text-white font-medium !shrink-0"
            startContent={
              <PlusIcon className="w-5 h-5 text-white font-semibold shrink-0" />
            }
          >
            Thêm bài viết
          </Button>
        </div>
        {dataToShow.length > 0 ? (
          <div className="w-full min-h-[500px] flex gap-16">
            <div className="w-[65%] min-h-[200px] flex flex-col gap-5">
              {dataToShow.map((item) => (
                <div key={item.id} className="w-full flex gap-4">
                  <div className="w-[170px] h-[160px] overflow-hidden">
                    <Image
                      src={item.images[0]}
                      className="w-full h-full object-cover"
                      alt=""
                    />
                  </div>
                  <div className="flex flex-col gap-4">
                    <span className="uppercase text-xs text-[#9BA2AE]">
                      Công nghệ
                    </span>
                    <span className="text-white text-sm font-bold leading-5">
                      {item.title}
                    </span>
                    <span className="uppercase text-xs text-[#9BA2AE]">
                      {(() => {
                        const date = new Date(item.created_at);
                        const day = date.getUTCDate();
                        const month = date.getUTCMonth() + 1; // Tháng bắt đầu từ 0
                        const year = date.getUTCFullYear();
                        return `${day}/${month}/${year}`; // Hoặc bạn có thể định dạng theo cách khác
                      })()}
                    </span>
                    <div className="w-full flex justify-between text-sm text-[#9BA2AE]">
                      <span className="flex gap-1 items-center cursor-pointer">
                        <FaPen /> Chỉnh sửa
                      </span>
                      <span className="flex gap-1 items-center cursor-pointer">
                        <MdDelete /> Xóa
                      </span>
                      <span className="opacity-0">lskd</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {/* đọc nhiều nhất */}
            <div className="w-[35%] min-h-[200px] flex flex-col gap-8 ">
              <span className="text-white uppercase">Đọc nhiều nhất</span>
              <div className="w-full flex gap-4 border-l-1 border-whiteAlpha-50 pl-8">
                <div className="flex flex-col gap-4">
                  <span className="uppercase text-xs text-[#9BA2AE]">
                    Công nghệ
                  </span>
                  <span className="text-white text-sm font-bold leading-5">
                    Designing for AI Hallucination: Can Design Help Tackle
                    Machine Challenges?
                  </span>
                  <span className="uppercase text-xs text-[#9BA2AE]">
                    05/12/2024
                  </span>
                  <div className="w-full flex justify-between text-sm text-[#9BA2AE]">
                    <span className="flex gap-1 items-center cursor-pointer">
                      <FaPen /> Chỉnh sửa
                    </span>
                    <span className="flex gap-1 items-center cursor-pointer">
                      <MdDelete /> Xóa
                    </span>
                    <span className="opacity-0">lskd</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <span className="text-white">Chưa có dữ liệu</span>
        )}
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
                Thêm bài viết
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
                      <select
                        name="category_id"
                        value={category_id}
                        onChange={handleSelectChange}
                        className="w-[100%] border bg-transparent p-3 py-2 rounded-sm text-black border-1-[#000000]"
                      >
                        {categories.map((item) => (
                          <option key={item.id} value={item.id}>
                            {item.name}
                          </option>
                        ))}
                      </select>
                      <FormInput
                        theme="dark"
                        inputRef={inputRef}
                        type={"text"}
                        register={register}
                        id={"title"}
                        name={"title"}
                        ariaLabel={"Tên bài viết"}
                        placeholder={"Nhập tên bài viết"}
                        errors={errors}
                        errorMessage={errors?.name?.message}
                        className={"!bg-gray-100 !mt-0 !text-gray-600"}
                        wrapperClassName={"w-full text-gray-600 !mt-0"}
                        value={watch("title")}
                        onChange={onInputChange}
                      />
                      <FormInput
                        theme="dark"
                        type={"textarea"}
                        register={register}
                        cols={3}
                        rows={3}
                        id={"content"}
                        name={"content"}
                        ariaLabel={"Nội dung bài viết"}
                        placeholder={"Nhập nội dung bài viết"}
                        errors={errors}
                        errorMessage={errors?.content?.message}
                        className={"!bg-gray-100 !mt-0 !text-gray-600"}
                        wrapperClassName={"w-full text-gray-600 !mt-3"}
                        value={watch("content")}
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
};

export default BlogsTabs;
