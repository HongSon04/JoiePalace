"use client";

import { motion, AnimatePresence } from "framer-motion";
import ClientDish from "@/app/_components/ClientDish";
import ClientDishesSection from "@/app/_components/ClientDishesSection";
import Dish from "@/app/_components/Dish";
import Footer from "@/app/_components/FooterClient";
import Uploader from "@/app/_components/Uploader";
import useCustomToast from "@/app/_hooks/useCustomToast";
import {
  fetchCategoriesBySlug,
  setSelectedCategory,
} from "@/app/_lib/features/categories/categoriesSlice";
import { API_CONFIG } from "@/app/_utils/api.config";
import { CONFIG } from "@/app/_utils/config";
import Loading from "@/app/loading";
import { useToast } from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { Col, Row } from "antd";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useForm } from "react-hook-form";
import { FaLink } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import { z } from "zod";
import { ExclamationCircleIcon } from "@heroicons/react/24/outline";
import { formData } from "zod-form-data";
import { createMenu } from "@/app/_lib/features/menu/menuSlice";
import { formatPrice } from "@/app/_utils/formaters";
import LoadingContent from "@/app/_components/LoadingContent";

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

const schema = z.object({
  name: z
    .string({
      required_error:
        "Hãy đặt cho thực đơn của quý khách một cái tên thật sự ý nghĩa nhé!",
    })
    .min(3, { message: "Vui lòng nhập tên dài hơn" }),
  description: z
    .string({
      required_error:
        "Hãy thể hiện ý nghĩa buổi tiệc từ thực đơn của quý khách",
    })
    .min(10, {
      message: "Hãy thể hiện ý nghĩa buổi tiệc từ thực đơn của quý khách",
    }),
});

function Page() {
  const [files, setFiles] = React.useState([]);
  const [selectedDishes, setSelectedDishes] = React.useState([]);
  const {
    register,
    formState: { errors },
    reset,
    watch,
    handleSubmit,
    setValue,
    getValues,
  } = useForm({
    resolver: zodResolver(schema),
  });
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const {
    categories,
    isLoading: isFetchingCategories,
    isError: isErrorFetchingCategories,
    error: errorFetchingCategories,
    selectedCategory,
  } = useSelector((store) => store.categories);
  const { isCreatingMenu, isCreatingMenuError } = useSelector(
    (store) => store.menu
  );
  const [categoryDishes, setCategoryDishes] = React.useState({});
  const dispatch = useDispatch();
  const [isSaved, setIsSaved] = React.useState(false);
  const toast = useToast();
  const [isImagesEmpty, setIsImagesEmpty] = React.useState(false);
  const [isImageOverSize, setIsImageOverSize] = React.useState(false);
  const [isFormatAccepted, setIsFormatAccepted] = React.useState(false);
  const [isDishesEmpty, setIsDishesEmpty] = React.useState(true);

  const menuPrice = React.useMemo(() => {
    const total = Object.keys(categoryDishes).reduce((acc, key) => {
      return (
        acc + categoryDishes[key].reduce((acc, dish) => (acc += dish.price), 0)
      );
    }, 0);

    console.log("Total price:", total);
    return total;
  }, [categoryDishes]);

  const dishesId = React.useMemo(() => {
    return Object.keys(categoryDishes).reduce((acc, key) => {
      return [...acc, ...categoryDishes[key].map((dish) => dish.id)];
    }, []);
  }, [categoryDishes]);

  const handleSaveMenu = React.useCallback(
    async (data) => {
      console.log(JSON.stringify(dishesId));

      if (files.length <= 0) {
        setIsImagesEmpty(true);
        return;
      }

      if (isDishesEmpty) {
        toast({
          position: "top-right",
          isClosable: true,
          status: "error",
          title: "Danh sách món ăn trống",
          description: "Hãy chọn ít nhất một món ăn cho thực đơn của bạn nhé!",
        });
        return;
      }

      if (!isFormatAccepted || isImageOverSize) {
        console.log("isFormatAccepted -> ", isFormatAccepted);
        console.log("isImageOverSize -> ", isImageOverSize);

        console.log(files);
        console.log("Image error");
        return;
      }

      const formData = new FormData();

      // console.log("Dishes id -> ", dishesId);

      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("products", JSON.stringify(dishesId));
      formData.append("price", menuPrice);
      files.forEach((file) => {
        formData.append("images", file);
      });
      formData.append("is_show", Boolean(false));

      const response = await dispatch(createMenu(formData)).unwrap();

      if (response.success) {
        toast({
          position: "top-right",
          isClosable: true,
          status: "success",
          title: "Thực đơn của bạn đã được lưu thành công",
          description: "Quý khách có thể xem thực đơn của mình tại đây",
        });
      } else {
        toast({
          position: "top-right",
          isClosable: true,
          status: "error",
          title: "Đã có lỗi xảy ra khi lưu thực đơn",
          description: "Vui lòng thử lại sau",
        });
      }

      setIsSaved(true);
    },
    [
      isDishesEmpty,
      isFormatAccepted,
      isImageOverSize,
      isImagesEmpty,
      dishesId,
      menuPrice,
      files,
    ]
  );

  const onSubmit = async (data) => {
    await handleSaveMenu(data);
  };

  const handleInputChange = (e) => {
    const { value, name } = e.target;
    setValue(name, value);
  };

  const handleFileChange = (newFiles) => {
    setFiles(newFiles);
  };

  const handleSetSelectedCategory = (category) => {
    dispatch(setSelectedCategory(category));
  };

  const handleAddDish = (dish) => {
    const { slug: categorySlug } = dish.category;
    if (categoryDishes[categorySlug]) {
      setCategoryDishes({
        ...categoryDishes,
        [categorySlug]: [...categoryDishes[categorySlug], dish],
      });
    } else {
      setCategoryDishes({
        ...categoryDishes,
        [categorySlug]: [dish],
      });
    }

    toast({
      position: "top-right",
      isClosable: true,
      render: () => (
        <div className="text-white font-gilroy p-3 rounded-lg bg-gold">
          <h3 className="text-base font-semibold leading-6">Thêm thành công</h3>
          <p className="text-md font-normal">
            {dish.name} đã được thêm vào danh mục {dish.category.name}
          </p>
        </div>
      ),
    });
  };

  const handleRemoveDish = (dish) => {
    const { slug: categorySlug } = dish.category;

    if (categoryDishes[categorySlug]) {
      setCategoryDishes({
        ...categoryDishes,
        [categorySlug]: categoryDishes[categorySlug].filter(
          (d) => d.id !== dish.id
        ),
      });
    }

    toast({
      position: "top-right",
      isClosable: true,
      render: () => (
        <div className="text-white font-gilroy p-3 rounded-lg bg-gold">
          <h3 className="text-base font-semibold leading-6">Đã xóa món ăn</h3>
          <p className="text-md font-normal">
            {dish.name} đã được xóa khỏi danh mục {dish.category.name}
          </p>
        </div>
      ),
    });
  };

  React.useEffect(() => {
    dispatch(fetchCategoriesBySlug({ slug: API_CONFIG.FOOD_CATEGORY_SLUG }));
    return () => {};
  }, []);

  React.useEffect(() => {
    if (files.some((file) => file.size > MAX_FILE_SIZE)) {
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

  React.useEffect(() => {
    if (Object.keys(categoryDishes).length > 0) {
      setIsDishesEmpty(false);
    } else {
      setIsDishesEmpty(true);
    }
  }, [categoryDishes]);

  React.useEffect(() => {
    const handleBeforeUnload = (event) => {
      // You can customize the message shown in the confirmation dialog
      const message = "Are you sure you want to leave this page?";
      event.returnValue = message; // For most browsers
      return message; // For some older browsers
    };

    // Add event listeners
    if (!isSaved) {
      window.addEventListener("beforeunload", handleBeforeUnload);
    }

    // Cleanup function to remove event listeners
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isSaved]);

  // LATER: Remove this
  React.useEffect(() => {
    console.log(errors);
    console.log(categoryDishes);
  }, [errors, categoryDishes]);

  if (isFetchingCategories) {
    return <Loading />;
  }

  return (
    <>
      {isErrorFetchingCategories ? (
        <section className="responsive-container !pt-44 text-white text-center font-gilroy p-5 flex flex-col flex-center gap-5">
          <h2 className="text-xl text-gray-400">
            Đã có lỗi xảy ra khi tải dữ liệu trang
          </h2>
          <h2 className="text-xl text-gray-400">
            Quý khách vui lòng thử lại sau
          </h2>

          <Button
            className="text-gold text-base underline underline-offset-2 w-fit hover:!bg-whiteAlpha-50"
            variant="ghost"
            onClick={() => {
              // new Promise((resolve) => {
              //   setTimeout(() => {
              //     resolve();
              //   }, 5000);
              // });
              dispatch(
                fetchCategoriesBySlug({ slug: API_CONFIG.FOOD_CATEGORY_SLUG })
              );
            }}
          >
            Thử lại
          </Button>
        </section>
      ) : (
        <>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="responsive-container !pt-40 relative"
          >
            {/* PATTERN */}
            <Image
              src={CONFIG.CLIENT_PATTERN}
              alt="client pattern"
              className="absolute left-0 top-1/2 -translate-y-1/2"
            />
            <Row gutter={[30]} align={"center"}>
              <Col xs={24} sm={24} md={12} lg={8} xl={8}>
                <div className="flex flex-col gap-8 font-gilroy relative">
                  {/* TIP */}
                  <div className="tip flex gap-2">
                    {/* icon */}
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M13.5735 0.6525C12.7035 -0.2175 11.2935 -0.2175 10.4235 0.6525L0.6525 10.425C-0.2175 11.295 -0.2175 12.7035 0.6525 13.572L10.4265 23.346C11.2965 24.216 12.705 24.216 13.5735 23.346L23.3475 13.572C24.2175 12.702 24.2175 11.2935 23.3475 10.425L13.5735 0.6525ZM11.9985 6C12.801 6 13.4295 6.693 13.3485 7.4925L12.8235 12.753C12.8059 12.9597 12.7113 13.1522 12.5585 13.2925C12.4058 13.4327 12.2059 13.5106 11.9985 13.5106C11.7911 13.5106 11.5912 13.4327 11.4385 13.2925C11.2857 13.1522 11.1911 12.9597 11.1735 12.753L10.6485 7.4925C10.6296 7.30385 10.6505 7.11334 10.7098 6.93325C10.769 6.75316 10.8653 6.58747 10.9925 6.44687C11.1197 6.30626 11.2749 6.19386 11.4482 6.11689C11.6214 6.03993 11.8089 6.00011 11.9985 6ZM12.0015 15C12.3993 15 12.7809 15.158 13.0622 15.4393C13.3435 15.7206 13.5015 16.1022 13.5015 16.5C13.5015 16.8978 13.3435 17.2794 13.0622 17.5607C12.7809 17.842 12.3993 18 12.0015 18C11.6037 18 11.2221 17.842 10.9408 17.5607C10.6595 17.2794 10.5015 16.8978 10.5015 16.5C10.5015 16.1022 10.6595 15.7206 10.9408 15.4393C11.2221 15.158 11.6037 15 12.0015 15Z"
                        fill="#B5905B"
                      />
                    </svg>
                    <span className="text-gold text-base">
                      Mẹo: Click vào để chỉnh sửa trực tiếp
                    </span>
                  </div>
                  {/* INPUTS */}
                  <div className="flex flex-col w-full">
                    <input
                      type="text"
                      name="name"
                      id="name"
                      className="bg-transparent text-white placeholder:text-gray-400 text-5xl font-bold px-3 py-2 rounded-lg placeholder:opacity-40 w-full outline-none focus:bg-whiteAlpha-100"
                      placeholder="TÊN THỰC ĐƠN"
                      value={watch("name")}
                      {...register("name")}
                      onChange={handleInputChange}
                    />
                    <AnimatePresence>
                      {errors["name"] && (
                        <motion.div
                          key={errors["name"].message}
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="text-red-400 text-sm font-normal mt-2"
                        >
                          <ExclamationCircleIcon className="w-4 h-4 mr-1 inline" />{" "}
                          {errors["name"].message}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  <div className="flex flex-col w-full">
                    <textarea
                      {...register("description")}
                      value={watch("description")}
                      onChange={handleInputChange}
                      name="description"
                      id="description"
                      cols="30"
                      rows="10"
                      className="bg-transparent text-white placeholder:text-gray-400 text-2xl font-bold px-3 py-2 rounded-lg placeholder:opacity-40 outline-none focus:bg-whiteAlpha-100"
                      placeholder="Mô tả thực đơn"
                    ></textarea>
                    <AnimatePresence>
                      {errors["description"] && (
                        <motion.div
                          key={errors["description"].message}
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="text-red-400 text-sm font-normal mt-2"
                        >
                          <ExclamationCircleIcon className="w-4 h-4 mr-1 inline" />{" "}
                          {errors["description"].message}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {categories.map((category) => (
                    <a
                      key={category.id}
                      href={`#${category.slug}`}
                      className="text-gold text-4xl underline-offset-0 hover:brightness-110 hover:text-gold flex items-center gap-2"
                    >
                      <FaLink />{" "}
                      <span className="underline underline-offset-4">
                        {category.name}
                      </span>
                    </a>
                  ))}
                </div>
              </Col>
              <Col xs={24} sm={24} md={12} lg={8} xl={8}>
                <div className="">
                  <Uploader
                    register={register}
                    errors={errors}
                    files={files}
                    setFiles={setFiles}
                    onFileChange={handleFileChange}
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
                        {"Hãy chọn ít nhất một ảnh cho thực đơn của bạn nhé!"}
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
                        {"Vui lòng chọn ảnh có định dạng jpg, jpeg hoặc png!"}
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <Button
                    type="submit"
                    className="!text-base !bg-gold !hover:brightness-90 !transition !rounded-full w-full !text-white"
                    isLoading={isCreatingMenu}
                  >
                    {isCreatingMenu ? "Đang lưu thực đơn" : "Lưu thực đơn"}
                  </Button>
                  {categories && Object.keys(categoryDishes).length > 0 && (
                    <div className="p-3 rounded-lg bg-whiteAlpha-100 text-white flex flex-col gap-5 mt-5">
                      <h2 className="text-xl">Tổng giá trị thực đơn: </h2>
                      <div className="flex w-full flex-col gap-4">
                        {Object.keys(categoryDishes).map((key) => (
                          <div
                            className="flex justify-between items-center"
                            key={key}
                          >
                            <p className="text-base">
                              {categories.find((c) => c.slug === key).name} (
                              {categoryDishes[key].length} món)
                            </p>
                            <p className="text-base">
                              {formatPrice(
                                categoryDishes[key].reduce(
                                  (a, c) => (a += c.price),
                                  0
                                )
                              )}
                            </p>
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-between items-center border-t-1 border-whiteAlpha-200 pt-3">
                        <p className="text-xl">Tổng cộng:</p>
                        <p className="text-xl">{formatPrice(menuPrice)}</p>
                      </div>
                    </div>
                  )}
                </div>
              </Col>
            </Row>
          </form>
          {/* SINGLE DISHES SECTION */}
          {categories &&
            categories.map((category, index) => {
              return (
                <ClientDishesSection
                  key={index}
                  index={index}
                  category={category}
                  onOpenChange={onOpenChange}
                  onOpen={onOpen}
                  isOpen={isOpen}
                  onSelectCategory={handleSetSelectedCategory}
                  categoryDishes={categoryDishes}
                  onAddDish={handleAddDish}
                  onRemoveDish={handleRemoveDish}
                />
              );
            })}
        </>
      )}

      {/* CATEGORY DISHES MODAL */}
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size="4xl"
        scrollBehavior="inside"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {selectedCategory &&
                  selectedCategory.name &&
                  selectedCategory.name}
              </ModalHeader>
              <ModalBody>
                <Row gutter={[24, 24]} align={"center"}>
                  {/* DISHES */}
                  {selectedCategory && selectedCategory.products ? (
                    selectedCategory.products.map((dish, index) => (
                      <Col xs={24} sm={24} md={12} lg={12} xl={12} key={index}>
                        <ClientDish
                          dish={dish}
                          size="sm"
                          addable
                          addAction={() =>
                            handleAddDish({
                              ...dish,
                              category: selectedCategory,
                            })
                          }
                          removable={false}
                          removeAction={() =>
                            handleRemoveDish({
                              ...dish,
                              category: selectedCategory,
                            })
                          }
                          tooltipClassName="!bg-gold"
                          isAdded={
                            categoryDishes[selectedCategory.slug] &&
                            categoryDishes[selectedCategory.slug].find(
                              (d) => d.id === dish.id
                            )
                          }
                        />
                      </Col>
                    ))
                  ) : (
                    <Col span={24} className="flex flex-col gap-2 flex-center">
                      <div className="text-gray-400 text-xl text-center">
                        Danh mục hiện đang trống
                      </div>
                      <Link
                        href="/client/mon-an"
                        className="underline text-gold hover:text-gold hover:underline hover:brightness-110"
                      >
                        Xem Thêm
                      </Link>
                    </Col>
                  )}
                </Row>
              </ModalBody>
              <ModalFooter>
                <Button onPress={onClose} className="rounded-full">
                  Hủy
                </Button>
                <Button
                  onPress={onClose}
                  className="bg-gold rounded-full text-white"
                >
                  Lưu
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <Footer></Footer>
    </>
  );
}

export default Page;
