"use client";

import AdminHeader from "@/app/_components/AdminHeader";
import Dish from "@/app/_components/Dish";
import FormInput from "@/app/_components/FormInput";
import Uploader from "@/app/_components/Uploader";
import useApiServices from "@/app/_hooks/useApiServices";
import useCustomToast from "@/app/_hooks/useCustomToast";
import useRoleGuard from "@/app/_hooks/useRoleGuard";
import { API_CONFIG } from "@/app/_utils/api.config";
import { formatPrice } from "@/app/_utils/formaters";
import docScan from "@/public/document_scanner.svg";
import textSnippet from "@/public/text_snippet.svg";
import {
  ExclamationCircleIcon,
  PlusIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Divider, Spinner } from "@nextui-org/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Col, Image, Row } from "antd";
import { AnimatePresence, motion } from "framer-motion";
import NextImage from "next/image";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import React, { useCallback } from "react";
import { useForm } from "react-hook-form";
import { IoSaveOutline } from "react-icons/io5";
import { z } from "zod";
import Breadcrumbs from "./Breadcrumbs";
import DishesModal from "./DishesModal";
import Loading from "../../loading";

const schema = z.object({
  name: z
    .string({ required_error: "Vui lòng nhập tên thực đơn" })
    .min(1, { message: "Vui lòng nhập tên thực đơn" }),
  description: z
    .string({
      required_error: "Vui lòng nhập mô tả thực đơn",
    })
    .min(1, { message: "Vui lòng nhập mô tả thực đơn" }),
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

function Page() {
  const { isLoading } = useRoleGuard();
  const [selectedMenuDishes, setSelectedMenuDishes] = React.useState([]);
  const [imageSrc, setNextImageSrc] = React.useState("");
  const [menuDishes, setMenuDishes] = React.useState({});
  // const [isNextImagesEmpty, setIsNextImagesEmpty] = React.useState(false);
  const [isNextImageOverSize, setIsNextImageOverSize] = React.useState(false);
  const [isFormatAccepted, setIsFormatAccepted] = React.useState(false);
  const [isDishesEmpty, setIsDishesEmpty] = React.useState(true);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [files, setFiles] = React.useState([]);
  const pathname = usePathname();
  const router = useRouter();
  const params = useParams();
  const menuId = params.id;
  const isDeleted = params.isDeleted;
  const searchParams = useSearchParams();
  const toast = useCustomToast();
  const { makeAuthorizedRequest } = useApiServices();
  const [open, setOpen] = React.useState(false);

  const {
    data: foodCategories,
    isLoading: isFetchingFoodCategories,
    isError: isFetchingFoodCategoriesError,
  } = useQuery({
    queryKey: ["foodCategories"],
    queryFn: async () => {
      const response = await makeAuthorizedRequest(
        API_CONFIG.CATEGORIES.GET_BY_SLUG(API_CONFIG.FOOD_CATEGORY_SLUG)
      );

      if (response.success) {
        return response.data;
      } else {
        throw new Error(response.message);
      }
    },
    refetchOnWindowFocus: false,
  });

  const {
    data: menu,
    isLoading: isFetchingMenu,
    isError: isFetchingMenuError,
  } = useQuery({
    queryKey: ["menu", menuId],
    queryFn: async () => {
      let response = null;

      try {
        response = await makeAuthorizedRequest(
          API_CONFIG.MENU.GET_BY_ID(menuId)
        );

        if (response.success) {
          return response.data;
        } else {
          throw new Error(response.message);
        }
      } catch (error) {
        console.error(error);
      } finally {
        if (response.success) {
          console.log("response data -> ", response.data);
          console.log(
            "Array.flat(Object.values(response.data[0]?.products))",
            Object.values(response?.data[0]?.products).flat()
          );
          const menuDishesData = Object.values(response?.data[0]?.products)
            .flat()
            .reduce((a, c) => {
              if (!a[c?.category_id]) {
                a[c?.category_id] = [];
              }
              a[c?.category_id].push(c);
              return a;
            }, {});

          if (menuDishesData) {
            setMenuDishes(menuDishesData);
          }
        }
      }
    },
    refetchOnWindowFocus: false,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
    getValues,
  } = useForm({
    resolver: zodResolver(schema),
  });

  React.useEffect(() => {
    if (menu) {
      setValue("name", menu?.at(0)?.name);
      setValue("description", menu?.at(0)?.description);
    }
  }, [menu]);

  // React.useEffect(() => {
  //   console.log(Object.values(menu?.at(0)?.products));

  //   const menuDishesData = Object.values(menu?.at(0)?.products).reduce(
  //     (a, c) => {
  //       if (!a[c?.categories?.id]) {
  //         console.log("a[c.categories?.id] -> ", a[c?.categories?.id]);
  //         a[c?.categories?.id] = [];
  //       }
  //       a[c?.categories?.id].push(c);
  //       return a;
  //     },
  //     {}
  //   );
  //   if (menuDishesData) {
  //     setMenuDishes(menuDishesData);
  //   }

  //   return () => {};
  // }, [menu]);

  const total = React.useMemo(() => {
    return Object.values(menuDishes).reduce((acc, dishes) => {
      return acc + dishes?.reduce((acc, dish) => acc + dish?.price, 0);
    }, 0);
  }, [menuDishes]);

  const handleFileChange = (files) => {
    setFiles(files);
  };

  const createQueryString = useCallback(
    (name, value) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );

  // Function to handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValue(name, value);
  };

  const handleRemoveDish = React.useCallback(
    (dish) => {
      const dishCategory = dish.categories;

      setMenuDishes((prev) => {
        // Check if the category exists in the current state
        if (prev[dishCategory?.id]) {
          // Filter out the dish to be removed based on its ID
          const updatedDishes = prev[dishCategory?.id].filter(
            (item) => item.id !== dish.id // Compare by dish.id
          );

          // Return the updated state
          return {
            ...prev,
            [dishCategory?.id]: updatedDishes,
          };
        }
        return prev; // Return the previous state if the category doesn't exist
      });
    },
    [setMenuDishes]
  );

  const handleRemoveAllDishes = React.useCallback((category) => {
    setMenuDishes((prev) => {
      return {
        ...prev,
        [category.id]: [],
      };
    });
  }, []);

  const {
    mutate: updateMenu,
    isPending: isUpdatingMenu,
    isError: isUpdatingMenuError,
  } = useMutation({
    mutationKey: ["updateMenu", menuId],
    mutationFn: async (formData) => {
      const response = await makeAuthorizedRequest(
        API_CONFIG.MENU.UPDATE(menuId),
        "PATCH",
        formData
      );

      if (response.success) {
        toast({
          title: "Thành công",
          description: "Thực đơn của bạn đã được cập nhật",
          type: "success",
        });
      } else {
        if (response.error.statusCode === 401) {
          toast({
            title: "Lỗi khi cập nhật thực đơn",
            description: "Phiên đăng nhập đã hết hạn",
            type: "error",
            isClosable: true,
          });
        } else {
          toast({
            title: "Lỗi khi cập nhật thực đơn",
            description:
              response.error.message || "Có lỗi xảy ra khi cập nhật thực đơn",
            type: "error",
            isClosable: true,
          });
        }
      }
    },
    onMutate: async () => {
      setIsSubmitting(true);
    },
  });

  // Function to handle form submission
  const onSubmit = (data) => {
    setIsSubmitting(true);
    const { name, description } = data;

    const dishesIds = Object.values(menuDishes).reduce(
      (acc, dishes) => [...acc, ...dishes.map((dish) => dish.id)],
      []
    );

    Object.values(menuDishes).forEach((dishes) => {
      if (dishes.length < 1) {
        toast({
          title: "Lỗi khi tạo thực đơn",
          description: "Vui lòng chọn ít nhất một món ăn cho mỗi danh mục",
          type: "error",
        });
        return;
      }
    });

    files.forEach((file) => {
      if (file?.size > MAX_FILE_SIZE) {
        setIsNextImageOverSize(true);
        return;
      }
    });

    files.forEach((file) => {
      if (!checkFileType(file)) {
        setIsFormatAccepted(true);
        return;
      }
    });

    const formData = new FormData();

    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", total);
    formData.append("is_show", true);
    formData.append("products", JSON.stringify(dishesIds));
    files.forEach((image) => {
      formData.append("images", image);
    });

    updateMenu(formData);
  };

  return (
    <div>
      {/* HEADER */}
      <AdminHeader
        title="Cập nhật thực đơn"
        path="Thực đơn"
        showNotificationButton={true}
        showHomeButton={true}
        showSearchForm={false}
        className="flex-1"
      />

      {/* BREADCRUMBS */}
      <Breadcrumbs></Breadcrumbs>

      {isFetchingMenu || isFetchingFoodCategories ? (
        <Loading />
      ) : (
        <Row gutter={[20]}>
          <Col span={14} className="!overflow-hidden !rounded-lg">
            <Row gutter={[20]} className="!rounded-lg bg-whiteAlpha-100 p-5">
              {/* IMAGE & UPLOADER */}
              <Col span={12}>
                <div className="flex flex-col rounded-lg">
                  <Uploader
                    id={"menu-images"}
                    name={"menu-images"}
                    register={register}
                    files={files}
                    setFiles={setFiles}
                    onFileChange={handleFileChange}
                    required={false}
                  />
                  <div className="flex columns-4 gap-2">
                    {menu?.at(0)?.images.map((image, index) => (
                      <Image
                        src={image}
                        key={image}
                        alt={`menu image ${index}`}
                      />
                    ))}
                  </div>
                  <AnimatePresence>
                    {isNextImageOverSize && (
                      <motion.div
                        key={"isNextImageOverSize"}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="text-red-400 text-sm font-normal mt-2 mb-2"
                      >
                        <ExclamationCircleIcon className="w-4 h-4 mr-1 inline" />{" "}
                        {"Hãy chọn ảnh có dung lượng nhỏ hơn 5MB nhé!"}
                      </motion.div>
                    )}
                    {isFormatAccepted && (
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
                </div>
              </Col>
              {/* FORM */}
              <Col span={12}>
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="form h-fit [&>div]:mb-5 [&>div>h4]:font-semibold [&>div>h4]:mb-3 [&>div>h4]:text-white"
                >
                  {/* MENU NAME */}
                  <div className="flex flex-col">
                    <h4 className="flex gap-3">
                      <NextImage
                        src={docScan}
                        width={20}
                        height={20}
                        alt="icon"
                      />
                      Tên thực đơn
                    </h4>
                    <FormInput
                      register={register}
                      errors={errors}
                      theme="dark"
                      name="name"
                      value={watch("name")}
                      label=""
                      type="text"
                      ariaLabel={"Tên thực đơn"}
                      onChange={handleInputChange}
                      placeholder="Ex: Thực đơn tiệc cưới"
                      wrapperClassName="!mt-0"
                      className="!bg-whiteAlpha-50 hover:!bg-whiteAlpha-100"
                    ></FormInput>
                  </div>
                  {/* MENU DESCRIPTION */}
                  <div className="flex flex-col">
                    <h4 className="flex gap-3">
                      <NextImage
                        src={textSnippet}
                        width={20}
                        height={20}
                        alt="icon"
                      />
                      Mô tả thực đơn
                    </h4>
                    <FormInput
                      register={register}
                      errors={errors}
                      theme="dark"
                      className="!bg-whiteAlpha-50 hover:!bg-whiteAlpha-100"
                      name="description"
                      value={watch("description")}
                      label=""
                      type="textarea"
                      ariaLabel={"Số lượng món khai vị"}
                      onChange={handleInputChange}
                      placeholder="Ex: Thực đơn giành cho chú rể Nguyễn Văn A và cô dâu Trần Thị B"
                      wrapperClassName="!mt-0"
                    ></FormInput>
                  </div>
                  <footer className="flex justify-end">
                    <Button
                      className="bg-teal-400 text-white font-normal rounded-full"
                      size="medium"
                      color="primary"
                      startContent={
                        !isUpdatingMenu ? (
                          <IoSaveOutline className="w-4 h-4" />
                        ) : (
                          <Spinner size="sm" color="white" />
                        )
                      }
                      type="submit"
                      onClick={handleSubmit(onSubmit)}
                    >
                      {isUpdatingMenu
                        ? "Đang cập nhật thực đơn..."
                        : "Cập nhật thực đơn"}
                    </Button>
                  </footer>
                </form>
                <Divider className="my-5 bg-whiteAlpha-100" />
                <div className="text-white">
                  <h4 className="flex gap-3 text-base font-medium">
                    Chi phí thực đơn
                  </h4>

                  {foodCategories?.at(0)?.childrens?.map((category, index) => (
                    <div
                      className="flex justify-between mt-3"
                      key={category.name + index}
                    >
                      <p className="text-white">
                        {category.name}: {menuDishes[category?.id]?.length || 0}{" "}
                        món
                      </p>
                      <p className="text-white">
                        {formatPrice(
                          menuDishes[category?.id]?.reduce(
                            (acc, cur) => (acc += cur?.price),
                            0
                          )
                        ) || 0}
                      </p>
                    </div>
                  ))}

                  <div className="flex justify-between mt-3 text-white">
                    <p>
                      Tổng: {Object.values(menuDishes).flat().length || 0} món
                    </p>
                    <p>{formatPrice(total)}</p>
                  </div>
                </div>
              </Col>
            </Row>
          </Col>
          {/* DISHES LIST */}
          <Col span={10}>
            <div className="w-full">
              {foodCategories?.at(0)?.childrens?.map((category, index) => (
                <div key={category?.name + category?.id} className="mb-5">
                  {/* HEADER */}
                  <div className="flex justify-between items-center w-full p-3 rounded-xl bg-whiteAlpha-100">
                    <div className="flex flex-col gap-1">
                      <h4 className="text-lg leading-7 font-semibold text-white">
                        {index + 1} {"."} {category?.name}
                      </h4>
                      <p className="text-md leading-6 font-normal text-white">
                        Tổng: {menuDishes[category?.id]?.length || 0} món
                      </p>
                    </div>
                  </div>
                  {/* DISHES LIST */}
                  {Array.isArray(menuDishes[category?.id]) &&
                  menuDishes[category?.id]?.length > 0 ? (
                    menuDishes[category?.id]?.map((dish) => {
                      if (dish.categories?.id === category?.id) {
                        return (
                          <div
                            className="relative group"
                            key={dish?.id + dish.name}
                          >
                            <Button
                              onClick={() => handleRemoveDish(dish)}
                              className="absolute h-full inset-0 bg-blackAlpha-200 opacity-0 group-hover:opacity-100 flex-center z-50"
                            >
                              <XMarkIcon className="w-6 h-6 text-white" />
                            </Button>
                            <Dish
                              dish={dish}
                              className={"mt-3 !h-fit !hover:brightness-95"}
                            />
                          </div>
                        );
                      }
                      return null; // Return null if the dish doesn't match the category
                    })
                  ) : (
                    <div className="p-3 text-white mt-3 flex-center text-center rounded-lg bg-whiteAlpha-100">
                      <p>Chưa có món ăn nào trong danh mục này</p>
                    </div>
                  )}
                  <Button
                    isIconOnly
                    onClick={() => {
                      router.push(
                        pathname +
                          "?" +
                          createQueryString("dishesCategory", category.slug)
                      );
                      setOpen(true);
                    }}
                    className="bg-whiteAlpha-100 p-3 group rounded-lg shadow-md flex items-center hover:whiteAlpha-200 cursor-pointer flex-center h-fit w-full mt-3"
                    radius="full"
                  >
                    <PlusIcon className="w-5 h-5 text-white font-semibold" />
                  </Button>
                  <Divider className="mt-5 bg-whiteAlpha-100" />
                  <DishesModal
                    isOpen={open}
                    onOpenChange={setOpen}
                    category={category}
                    categories={foodCategories}
                    selectedMenuDishes={selectedMenuDishes}
                    setSelectedMenuDishes={setSelectedMenuDishes}
                    setMenuDishes={setMenuDishes}
                    menuDishes={menuDishes}
                    onRemoveAllDishes={handleRemoveAllDishes}
                  />
                </div>
              ))}
            </div>
          </Col>
        </Row>
      )}
    </div>
  );
}

export default Page;
