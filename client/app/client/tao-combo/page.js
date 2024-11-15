"use client";

import Footer from "@/app/_components/FooterClient";
import FormInput from "@/app/_components/FormInput";
import { fetchDecors } from "@/app/_lib/decors/decorsSlice";
import { fetchCategoriesBySlug } from "@/app/_lib/features/categories/categoriesSlice";
import { getMenuList } from "@/app/_lib/features/menu/menuSlice";
import {
  fetchingPartyTypesFailure,
  fetchingPartyTypesSuccess,
} from "@/app/_lib/features/partyTypes/partyTypesSlice";
import { fetchProductByCategorySlug } from "@/app/_lib/features/products/productsSlice";
import { fetchStages } from "@/app/_lib/features/stages/stagesSlice";
import { fetchHalls } from "@/app/_lib/halls/hallsSlice";
import { fecthAllPartyTypes } from "@/app/_services/partyTypesServices";
import { API_CONFIG, makeAuthorizedRequest } from "@/app/_utils/api.config";
import pattern from "@/public/line-group.svg";
import {
  Button,
  // drawer
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Tooltip,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import {
  ArrowRightIcon,
  Bars3Icon,
  ChevronDownIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";
import { zodResolver } from "@hookform/resolvers/zod";
import { Divider, Skeleton } from "@nextui-org/react";
import { Col, Row } from "antd";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { IoSaveOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { z } from "zod";
import ServiceItem from "./ServiceItem";
import { CONFIG } from "@/app/_utils/config";
import SelectedProduct from "@/app/_components/SelectedProduct";
import { createPackage } from "@/app/_lib/features/packages/packagesSlice";
import Uploader from "@/app/_components/Uploader";
import Link from "next/link";

const partySizes = [
  {
    id: "50",
    name: "Dưới 50 khách",
  },
  {
    id: "50-100",
    name: "50 - 100 khách",
  },
  {
    id: "100-200",
    name: "100 - 200 khách",
  },
  {
    id: "200-500",
    name: "200 - 500 khách",
  },
  {
    id: ">500",
    name: "Trên 500 khách",
  },
];

const budgets = [
  {
    id: "50-100",
    name: "50 triệu - 100 triệu",
  },
  {
    id: "100-300",
    name: "Trên 100 triệu - 300 triệu",
  },
  {
    id: "300-500",
    name: "Trên 300 triệu - 500 triệu",
  },
  {
    id: "500-1000",
    name: "Trên 500 triệu -  1 tỷ",
  },
  {
    id: "1000",
    name: "Trên 1 tỷ",
  },
];

const categories = [
  {
    id: 1,
    name: "Sảnh tiệc",
  },
  {
    id: 2,
    name: "Trang trí",
  },
  {
    id: 3,
    name: "Sân khấu",
  },
  {
    id: 4,
    name: "Bánh cưới",
  },
  {
    id: 5,
    name: "Thực đơn",
  },
  {
    id: 6,
    name: "Dịch vụ khác",
  },
];

const schema = z.object({
  partyType: z
    .string({
      required_error: "Quý khách vui lòng chọn loại tiệc",
    })
    .nonempty("Quý khách vui lòng chọn loại tiệc"),
  partySize: z
    .string({
      required_error: "Quý khách vui lòng chọn số lượng khách",
    })
    .nonempty("Quý khách vui lòng chọn số lượng khách"),
  budget: z
    .string({
      required_error: "Quý khách vui lòng chọn mức dự chi",
    })
    .nonempty("Quý khách vui lòng chọn mức dự chi"),
  name: z
    .string({
      required_error: "Chúng ta có thể gọi combo này là gì?",
    })
    .min(1, { message: "Chúng ta có thể gọi combo này là gì?" }),
  description: z
    .string({
      required_error: "Mô tả một ít về combo của quý khách nhé!",
    })
    .min(1, { message: "Chúng ta có thể gọi combo này là gì?" }),
  short_description: z
    .string({
      required_error: "Mô tả ngắn gọn về combo của quý khách",
    })
    .min(1, { message: "Chúng ta có thể gọi combo này là gì?" }),
});

const initialServiceState = {
  id: "",
  name: "",
  price: "",
  images: [CONFIG.DISH_IMAGE_PLACEHOLDER],
};

const getNameByKey = (key) => {
  let name = "";
  switch (key) {
    case "hall":
      name = "Sảnh";
      break;

    case "decor":
      name = "Trang trí";
      break;

    case "stage":
      name = "Sân khấu";
      break;

    case "cake":
      name = "Bánh cưới";
      break;

    case "menu":
      name = "Thực đơn";
      break;

    case "extraServices":
      name = "Dịch vụ đi kèm";
      break;

    case "partyType":
      name = "Phí dịch vụ";

    default:
  }

  return name;
};

const parsedState = (state) => {
  let parsedState = null;
  try {
    parsedState = JSON.parse(state);
  } catch (e) {
    console.log("");
  }

  return parsedState;
};

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

function Page() {
  const [files, setFiles] = React.useState([]);
  const [partySize, setPartySize] = React.useState("");
  const [budget, setBudget] = React.useState("");
  const [partyType, setPartyType] = React.useState("");
  const { partyTypes, isFetchingPartyTypes, isFetchingPartyTypesError } =
    useSelector((store) => store.partyTypes);
  const { stages, isFetchingStages, isFetchingStagesError } = useSelector(
    (store) => store.stages
  );
  const {
    halls,
    pagination: hallsPagination,
    isFetchingHalls,
    isFetchingHallsError,
  } = useSelector((store) => store.halls);
  const { decors, isFetchingDecors, isFetchingDecorsError } = useSelector(
    (store) => store.decors
  );
  const {
    products,
    pagination: productsPagination,
    isFetchingProducts,
    isFetchingProductsError,
  } = useSelector((store) => store.products);
  const { menuList, isFetchingMenuList, isFetchingMenuListError } = useSelector(
    (store) => store.menu
  );
  const {
    categories: extraServices,
    isFetchingCategories,
    isFetchingCategoriesError,
  } = useSelector((store) => store.categories);
  const { isCreatingPakage, isCreatingPakageError } = useSelector(
    (store) => store.packages
  );
  const toast = useToast();
  const dispatch = useDispatch();
  const drawerStriggerRef = React.useRef();
  const router = useRouter();
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [hallId, setHallId] = React.useState(initialServiceState);
  const [decorId, setDecorId] = React.useState(initialServiceState);
  const [stageId, setStageId] = React.useState(initialServiceState);
  const [menuId, setMenuId] = React.useState(initialServiceState);
  const [cakeId, setCakeId] = React.useState(initialServiceState);
  const [extraServicesId, setExtraServicesId] = React.useState({});
  const [tabIndex, setTabIndex] = React.useState(0);
  const [note, setNote] = React.useState("");
  const [isImagesEmpty, setIsImagesEmpty] = React.useState(false);
  const [isImageOverSize, setIsImageOverSize] = React.useState(false);
  const [isFormatAccepted, setIsFormatAccepted] = React.useState(false);
  const [limitFilesLength, setLimitFilesLength] = React.useState(false);
  const [submitTriggered, setSubmitTriggered] = React.useState(false);
  const [isLogedin, setIsLogedIn] = React.useState(false);

  const drawerData = React.useMemo(() => {
    return {
      partyType: [parsedState(partyType)],
      hall: [parsedState(hallId)],
      decor: [parsedState(decorId)],
      stage: [parsedState(stageId)],
      menu: [parsedState(menuId)],
      cake: [parsedState(cakeId)],
      extraServices: [...Object.values(extraServicesId)],
    };
  }, [hallId, decorId, stageId, menuId, cakeId, extraServicesId]);

  const total = React.useMemo(() => {
    return Object.values(drawerData).reduce((acc, item) => {
      if (Array.isArray(item)) {
        if (item.length === 0) return acc;

        return (
          acc + item.reduce((acc, item) => (item ? acc + item.price : 0), 0)
        );
      }

      return acc + item.price;
    }, 0);
  }, [drawerData]);

  const handleFileChange = (newFiles) => {
    setFiles(newFiles);
  };

  const handleExtraServicesChange = ({ service, category }) => {
    // console.log("handleExtraServicesChange -> ", service);

    setExtraServicesId((prevState) => ({
      ...prevState,
      [category.slug]: service,
    }));
  };

  const handleHallIndexChange = (e) => {
    setHallId(e.target.value);
  };

  const handleTabChange = (tabIndex) => {
    setTabIndex(tabIndex);
  };

  const handleNextTab = () => {
    setTabIndex(tabIndex + 1);
  };

  // Drawer
  const { isOpen, onOpen, onClose } = useDisclosure();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
    setValue,
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onInputChange = (e) => {
    setValue(e.target.name, e.target.value);
  };

  const onSubmit = async (data) => {
    setSubmitTriggered(true);
    if (files.length <= 0) {
      setIsImagesEmpty(true);
      return;
    } else if (files.length > 5) {
      setLimitFilesLength(true);
      return;
    }

    if (!isFormatAccepted || isImageOverSize) {
      return;
    }

    if (!menuId) {
      toast({
        title: "Vui lòng chọn thực đơn",
        status: "error",
        position: "top-right",
      });
      return;
    }

    if (!hallId) {
      toast({
        title: "Vui lòng chọn sảnh",
        status: "error",
        position: "top-right",
      });
      return;
    }

    if (!decorId) {
      toast({
        title: "Vui lòng chọn gói trang trí",
        status: "error",
        position: "top-right",
      });
      return;
    }

    if (!stageId) {
      toast({
        title: "Vui lòng chọn gói trang trí sân khấu",
        status: "error",
        position: "top-right",
      });
      return;
    }

    if (!cakeId) {
      toast({
        title: "Chọn cho mình một chiếc bánh cười phù hợp nhé!",
        status: "error",
        position: "top-right",
      });
      return;
    }

    const formData = new FormData();

    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("short_description", data.short_description);
    formData.append("party_type_id", parsedState(partyType).id);
    formData.append("menu_id", parsedState(menuId).id);
    formData.append("decor_id", parsedState(decorId).id);
    formData.append("stage_id", parsedState(hallId).id);
    formData.append("is_show", false);
    formData.append("price", total.toString());
    formData.append(
      "other_service",
      JSON.stringify([
        { id: parsedState(stageId).id, quantity: 1 },
        { id: parsedState(cakeId).id, quantity: 1 },
        ...Object.values(extraServicesId).map((item) => ({
          id: item.id,
          quantity: 1,
        })),
      ])
    );
    files.forEach((file) => {
      formData.append("images", file);
    });
    // console.log(
    //   formData.forEach((value, key) => console.log(`${key} -> ${value}`))
    // );

    try {
      const response = await dispatch(createPackage(formData)).unwrap();

      console.log(response);

      if (response.success) {
        toast({
          title: "Tạo thành công",
          description: "Gói dịch vụ của bạn đã được tạo",
          status: "success",
          position: "top-right",
        });

        router.push(`/client/lien-he?package_id=${response.data.at(0).id}`);
      } else {
        const { statusCode } = response?.error;

        if (statusCode === 401) {
          toast({
            title: "Tạo thất bại",
            description: "Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại",
            status: "error",
            position: "top-right",
          });
        } else {
          toast({
            title: "Tạo thất bại",
            description: response?.error?.message || "Vui lòng thử lại sau",
            status: "error",
          });
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleSaveCombo = React.useCallback(() => {
    if (typeof window !== "undefined") {
      if (drawerData && !errors) {
        localStorage.setItem("combo", JSON.stringify(drawerData));
        toast({
          title: "Lưu thành công",
          description: "Dữ liệu đã được lưu trữ",
          status: "success",
        });
      } else {
        toast({
          title: "Vui lòng chọn ít nhất một dịch vụ",
          status: "warning",
        });
      }
    }
  }, [drawerData]);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fecthAllPartyTypes();
        dispatch(fetchingPartyTypesSuccess(data));
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();

    return () => {};
  }, [dispatch]);

  React.useEffect(() => {
    const fetchData = async () => {
      let result = null;

      switch (tabIndex) {
        case 0:
          result = await dispatch(fetchHalls({})).unwrap();
          break;

        case 1:
          result = await dispatch(fetchDecors({})).unwrap();
          break;

        case 2:
          result = await dispatch(fetchStages({})).unwrap();
          break;

        case 3:
          result = await dispatch(
            fetchProductByCategorySlug({ slug: API_CONFIG.WEDDING_CAKE_SLUG })
          ).unwrap();
          break;

        case 4:
          result = await dispatch(getMenuList({})).unwrap();
          break;

        case 5:
          result = await dispatch(
            fetchCategoriesBySlug({ slug: API_CONFIG.EXTRA_SERVICES_SLUG })
          ).unwrap();

        default:
          break;
      }

      if (!result) return;

      // if (result.success) {
      //   console.log("Fetch data successfully");
      // } else {
      //   console.log("Fetch data failed");
      // }
    };

    fetchData();

    return () => {};
  }, [tabIndex]);

  React.useEffect(() => {
    if (submitTriggered && Object.keys(errors).length > 0) {
      toast({
        title: "Vui lòng điền đầy đủ thông tin",
        status: "error",
        position: "top-right",
      });
    }
  }, [errors, submitTriggered, toast]);

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
    if (typeof window !== undefined) {
      const storeUser = window.localStorage.getItem("user");

      if (storeUser) setIsLogedIn(true);
    }
  }, []);

  const renderNoteArea = () => {
    return (
      <div className="bg-whiteAlpha-50 flex flex-col gap-4 p-5 rounded-2xl w-1/3 h-[70vh]">
        <span className="text-sm font-semibold leading-5 text-left">
          Ghi chú
        </span>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          name="comboNote"
          id="comboNote"
          className="rounded-2xl border border-whiteAlpha-200 outline-none resize-none w-full h-full p-2"
        ></textarea>
      </div>
    );
  };

  return (
    <>
      {!isLogedin ? (
        <section className="px-48 pb-16 pt-36 relative !font-gilroy flex flex-center flex-col">
          <h1 className="text-2xl text-gold text-center mt-11">
            Quý khách vui lòng đăng nhập để sử dụng chức năng này
          </h1>
          <Link
            href="/client/dang-nhap"
            className="mt-3 px-3 py-2 rounded-full bg-gold hover:text-white hover:brightness-90 transition"
          >
            Đăng nhập
          </Link>
        </section>
      ) : (
        <>
          {/* HERO SECTION */}
          <section className="px-48 pb-16 pt-36 relative !font-gilroy">
            <Image
              src={pattern}
              alt="joie palace pattern"
              className="absolute left-0 top-1/2 -translate-y-1/2"
            />
            <Row gutter={[20, 20]}>
              <Col span={12}>
                <h1 className="text-5xl text-gold font-gilroy font-semibold uppercase leading-normal">
                  CÔNG CỤ TẠO COMBO <br /> VÀ DỰ CHI
                </h1>
                <p className="text-base leading-normal mt-4">
                  Nắm bắt được tâm lý khách hàng, với tiêu chí “Tiện lợi- Nhanh
                  gọn - Rõ ràng”, Joie Palace giới thiệu bộ công cụ tạo tiệc và
                  dự chi hoàn toàn mới. Với mục tiêu mang đến cái nhìn tổng quát
                  về những chi tiết, những thành phần cần thiết để tạo nên một
                  bữa tiệc đang nhớ và thành công, chúng tôi ở đây để giúp bạn
                  lựa chọn được những dịch vụ phù hợp với nhu cầu, cũng như đưa
                  ra được con số hoàn hảo nhất, vừa vặn với tầm dự chi của bạn.
                </p>
              </Col>
              <Col span={12} className="flex justify-end">
                <form action="#" className="w-[400px]">
                  {partyTypes && (
                    <FormInput
                      register={register}
                      errorMessage={errors?.name?.message}
                      wrapperClassName="!mt-0"
                      theme="dark"
                      label="Quý khách dự định tổ chức tiệc..."
                      ariaLabel="Loại tiệc"
                      id="partyType"
                      name="partyType"
                      type="select"
                      options={[
                        {
                          id: "",
                          name: "Chọn loại tiệc",
                        },
                        ...partyTypes.map((p) => ({
                          id: JSON.stringify(p),
                          name: p.name,
                        })),
                      ]}
                      onChange={(e) => setPartyType(e.target.value)}
                      value={partyType}
                      className={
                        "!bg-whiteAlpha-100 hover:bg-whiteAlpha-200 focus:bg-whiteAlpha-200"
                      }
                    ></FormInput>
                  )}
                  <FormInput
                    register={register}
                    errors={errors}
                    errorMessage={errors?.name?.message}
                    theme="dark"
                    label="Với số lượng khách mời khoảng..."
                    ariaLabel="Số lượng khách mời"
                    id="partySize"
                    name="partySize"
                    type="select"
                    options={[
                      {
                        id: "",
                        name: "Chọn số lượng khách mời",
                      },
                      ...partySizes,
                    ]}
                    onChange={(e) => setPartySize(e.target.value)}
                    value={partySize}
                    className={
                      "!bg-whiteAlpha-100 hover:bg-whiteAlpha-200 focus:bg-whiteAlpha-200"
                    }
                  ></FormInput>
                  <FormInput
                    register={register}
                    errors={errors}
                    errorMessage={errors?.name?.message}
                    theme="dark"
                    label="Số tiền quý khách dự kiến chi khoảng..."
                    ariaLabel="Mức dự chi"
                    id="budget"
                    name="budget"
                    type="select"
                    options={[
                      {
                        id: "",
                        name: "Chọn số lượng khách mời",
                      },
                      ...budgets,
                    ]}
                    onChange={(e) => setBudget(e.target.value)}
                    value={budget}
                    className={
                      "!bg-whiteAlpha-100 hover:bg-whiteAlpha-200 focus:bg-whiteAlpha-200"
                    }
                  ></FormInput>

                  {partyType && partySize && budget && (
                    <AnimatePresence mode="wait" initial={false}>
                      <motion.a
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="w-full rounded-full bg-gold hover:brightness-105 py-2 px-3 mt-5 text-center hover:text-white transition flex flex-center gap-3"
                        href="#creator"
                      >
                        <ArrowRightIcon className="w-6 h-6 text-white" />
                        Tiếp tục
                      </motion.a>
                    </AnimatePresence>
                  )}
                </form>
              </Col>
            </Row>
          </section>

          {/* COMBO SECTION */}
          {partyType && partySize && budget && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              id="creator"
              className="px-48 py-16 relative !font-gilroy"
            >
              <Tabs
                variant={"unstyled"}
                position={"relative"}
                align="center"
                index={tabIndex}
                onChange={handleTabChange}
                isLazy
              >
                <TabList className="p-2 rounded-full bg-whiteAlpha-100 w-fit items-center gap-3">
                  <Tab
                    key={"generalInformations"}
                    color={"white"}
                    className="aria-[selected=true]:text-white aria-[selected=true]:opacity-100 aria-[selected=true]:bg-gold bg-transparent opacity-45 transition flex items-center gap-2 uppercase font-semibold flex-center text-center rounded-full py-2 px-6 leading-8"
                  >
                    Thông tin chung
                  </Tab>
                  {categories.map((category, index) => (
                    <Tab
                      key={index}
                      color={"white"}
                      className="aria-[selected=true]:text-white aria-[selected=true]:opacity-100 aria-[selected=true]:bg-gold bg-transparent opacity-45 transition flex items-center gap-2 uppercase font-semibold flex-center text-center rounded-full py-2 px-6 leading-8"
                    >
                      {category.name}
                    </Tab>
                  ))}
                  <Button
                    ref={drawerStriggerRef}
                    onClick={onOpen}
                    variant={"unstyled"}
                    className="!rounded-full !text-white !bg-gold !flex !flex-center"
                  >
                    <Bars3Icon className="w-6 h-6"></Bars3Icon>
                  </Button>
                </TabList>

                {isFetchingCategoriesError ||
                  isFetchingDecorsError ||
                  isFetchingHallsError ||
                  isFetchingMenuListError ||
                  isFetchingProductsError ||
                  (isFetchingStagesError && (
                    <div className="flex flex-col">
                      <p className="text-gray-400">
                        Có lỗi xảy ra khi tải dữ liệu, vui lòng thử lại sau
                      </p>
                      <Button className="text-gray bg-transparent hover:bg-transparent underline text-gray-400">
                        Thử lại
                      </Button>
                    </div>
                  ))}

                {isFetchingPartyTypes ||
                isFetchingStages ||
                isFetchingDecors ||
                isFetchingCategories ||
                isFetchingMenuList ||
                isFetchingHalls ||
                isFetchingProducts ? (
                  <PanelSkeleton />
                ) : (
                  <TabPanels className="mt-6">
                    {/* THÔNG TIN CHUNG PANEL */}
                    <TabPanel key={"generalInformations"}>
                      <motion.div
                        initial={{
                          opacity: 0,
                          y: 50,
                        }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50 }}
                        className="w-full flex gap-5"
                      >
                        {/* UPLOADER */}
                        <div className="w-1/3 text-left">
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
                            {limitFilesLength && (
                              <motion.div
                                key={"limitFilesLength"}
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="text-red-400 text-sm font-normal mt-2 mb-2"
                              >
                                <ExclamationCircleIcon className="w-4 h-4 mr-1 inline" />{" "}
                                {
                                  "Chỉ được chọn tối đa 5 ảnh cho mỗi combo của bạn!"
                                }
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>

                        {/* PANEL MAIN */}
                        <div className="w-2/3 h-full  flex flex-col gap-3 relative">
                          <div className="flex gap-3 items-center h-full relative">
                            <div className="shrink-0 w-1 h-full bg-gold absolute left-0 top-0 bottom-0"></div>
                            <span className="text-xl font-bold ml-4">
                              Thông tin cơ bản
                            </span>
                          </div>
                          <span className="text-sm font-normal text-left">
                            Mô tả rõ hơn về gói dịch vụ của quý khách
                          </span>
                          <div className="w-full flex flex-wrap gap-4">
                            <FormInput
                              register={register}
                              errors={errors}
                              name={"name"}
                              placeholder="Tên gói dịch vụ"
                              value={watch("name")}
                              onChange={onInputChange}
                              theme="light"
                              className="bg-whiteAlpha-100 focus:bg-whiteAlpha-100 focus:brightness-105 hover:bg-whiteAlpha-100 hover:brightness-110"
                            />
                            <FormInput
                              register={register}
                              errors={errors}
                              name={"short_description"}
                              placeholder="Mô tả ngắn"
                              value={watch("short_description")}
                              onChange={onInputChange}
                              type="textarea"
                              rows={2}
                              theme="light"
                              className="bg-whiteAlpha-100 focus:bg-whiteAlpha-100 focus:brightness-105 hover:bg-whiteAlpha-100 hover:brightness-110"
                            />
                            <FormInput
                              register={register}
                              errors={errors}
                              name={"description"}
                              placeholder="Mô tả chi tiết"
                              value={watch("description")}
                              type="textarea"
                              onChange={onInputChange}
                              theme="light"
                              className="bg-whiteAlpha-100 focus:bg-whiteAlpha-100 focus:brightness-105 hover:bg-whiteAlpha-100 hover:brightness-110"
                            />
                          </div>
                          <div className="w-full mt-6 flex justify-end">
                            <Button
                              onClick={handleNextTab}
                              variant={"unstyled"}
                              className="!bg-gold !rounded-full !flex !items-center !gap-2 !p-3 !text-white"
                            >
                              <svg
                                width="20"
                                height="20"
                                viewBox="0 0 20 20"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M12.0234 4.94141L17.0818 9.99974L12.0234 15.0581"
                                  stroke="white"
                                  strokeWidth="1.5"
                                  strokeMiterlimit="10"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                                <path
                                  d="M2.91797 10H16.943"
                                  stroke="white"
                                  strokeWidth="1.5"
                                  strokeMiterlimit="10"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                              <span className="text-sm leading-5 font-medium ">
                                Tiếp tục
                              </span>
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    </TabPanel>

                    {/* SẢNH PANEL */}
                    <TabPanel key={"hall"}>
                      <motion.div
                        initial={{
                          opacity: 0,
                          y: 50,
                        }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50 }}
                        className="w-full flex gap-5"
                      >
                        {/* NOTE AREA */}
                        {renderNoteArea()}

                        {/* PANEL MAIN */}
                        <div className="w-2/3 h-full  flex flex-col gap-3 relative">
                          <div className="flex gap-3 items-center h-full relative">
                            <div className="shrink-0 w-1 h-full bg-gold absolute left-0 top-0 bottom-0"></div>
                            <span className="text-xl font-bold ml-4">
                              Sảnh tiệc
                            </span>
                          </div>
                          <span className="text-sm font-normal text-left">
                            Sảnh tiệc có sức chứa cho khoảng 100 khách
                          </span>
                          <div className="w-full flex flex-wrap gap-4">
                            {halls &&
                              halls.map((hall, index) => (
                                <ServiceItem
                                  service={hall}
                                  key={index}
                                  compairState={hallId}
                                  onChange={handleHallIndexChange}
                                />
                              ))}
                          </div>
                          <div className="w-full mt-6 flex justify-end">
                            <Button
                              onClick={handleNextTab}
                              variant={"unstyled"}
                              className="!bg-gold !rounded-full !flex !items-center !gap-2 !p-3 !text-white"
                            >
                              <svg
                                width="20"
                                height="20"
                                viewBox="0 0 20 20"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M12.0234 4.94141L17.0818 9.99974L12.0234 15.0581"
                                  stroke="white"
                                  strokeWidth="1.5"
                                  strokeMiterlimit="10"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                                <path
                                  d="M2.91797 10H16.943"
                                  stroke="white"
                                  strokeWidth="1.5"
                                  strokeMiterlimit="10"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                              <span className="text-sm leading-5 font-medium ">
                                Tiếp tục
                              </span>
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    </TabPanel>

                    {/* TRANG TRÍ PANEL */}
                    <TabPanel key={"decor"}>
                      <motion.div
                        initial={{
                          opacity: 0,
                          y: 50,
                        }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50 }}
                        className="w-full flex gap-5"
                      >
                        {/* NOTE AREA */}
                        {renderNoteArea()}

                        {/* PANEL MAIN */}
                        <div className="w-2/3 h-full  flex flex-col gap-3 relative">
                          <div className="flex gap-3 items-center h-full relative">
                            <div className="shrink-0 w-1 h-full bg-gold absolute left-0 top-0 bottom-0"></div>
                            <span className="text-xl font-bold ml-4">
                              Trang trí
                            </span>
                          </div>
                          <span className="text-sm font-normal text-left">
                            Các gói trang trí phù hợp cho tiệc của quý khách
                          </span>
                          <div className="w-full flex flex-wrap gap-4">
                            {decors &&
                              decors.map((decor) => (
                                <ServiceItem
                                  service={decor}
                                  key={decor.id}
                                  compairState={decorId}
                                  onChange={(e) => setDecorId(e.target.value)}
                                />
                              ))}
                          </div>
                          <div className="w-full mt-6 flex justify-end">
                            <Button
                              onClick={handleNextTab}
                              variant={"unstyled"}
                              className="!bg-gold !rounded-full !flex !items-center !gap-2 !p-3 !text-white"
                            >
                              <svg
                                width="20"
                                height="20"
                                viewBox="0 0 20 20"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M12.0234 4.94141L17.0818 9.99974L12.0234 15.0581"
                                  stroke="white"
                                  strokeWidth="1.5"
                                  strokeMiterlimit="10"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                                <path
                                  d="M2.91797 10H16.943"
                                  stroke="white"
                                  strokeWidth="1.5"
                                  strokeMiterlimit="10"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                              <span className="text-sm leading-5 font-medium ">
                                Tiếp tục
                              </span>
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    </TabPanel>

                    {/* SÂN KHẤU PANEL */}
                    <TabPanel key={"decor"}>
                      <motion.div
                        initial={{
                          opacity: 0,
                          y: 50,
                        }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50 }}
                        className="w-full flex gap-5"
                      >
                        {/* NOTE AREA */}
                        {renderNoteArea()}

                        {/* PANEL MAIN */}
                        <div className="w-2/3 h-full  flex flex-col gap-3 relative">
                          <div className="flex gap-3 items-center h-full relative">
                            <div className="shrink-0 w-1 h-full bg-gold absolute left-0 top-0 bottom-0"></div>
                            <span className="text-xl font-bold ml-4">
                              Sân khấu
                            </span>
                          </div>
                          <span className="text-sm font-normal text-left">
                            Lựa chọn gói sân khấu phù hợp cho tiệc của quý khách
                          </span>
                          <div className="w-full flex flex-wrap gap-4">
                            {stages &&
                              stages.map((stage) => (
                                <ServiceItem
                                  service={stage}
                                  key={stage.id}
                                  compairState={stageId}
                                  onChange={(e) => setStageId(e.target.value)}
                                />
                              ))}
                          </div>
                          <div className="w-full mt-6 flex justify-end">
                            <Button
                              onClick={handleNextTab}
                              variant={"unstyled"}
                              className="!bg-gold !rounded-full !flex !items-center !gap-2 !p-3 !text-white"
                            >
                              <svg
                                width="20"
                                height="20"
                                viewBox="0 0 20 20"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M12.0234 4.94141L17.0818 9.99974L12.0234 15.0581"
                                  stroke="white"
                                  strokeWidth="1.5"
                                  strokeMiterlimit="10"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                                <path
                                  d="M2.91797 10H16.943"
                                  stroke="white"
                                  strokeWidth="1.5"
                                  strokeMiterlimit="10"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                              <span className="text-sm leading-5 font-medium ">
                                Tiếp tục
                              </span>
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    </TabPanel>

                    {/* BÁNH CƯỚI PANEL */}
                    <TabPanel key={"weddingCake"}>
                      <motion.div
                        initial={{
                          opacity: 0,
                          y: 50,
                        }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50 }}
                        className="w-full flex gap-5"
                      >
                        {/* NOTE AREA */}
                        {renderNoteArea()}

                        {/* PANEL MAIN */}
                        <div className="w-2/3 h-full  flex flex-col gap-3 relative">
                          <div className="flex gap-3 items-center h-full relative">
                            <div className="shrink-0 w-1 h-full bg-gold absolute left-0 top-0 bottom-0"></div>
                            <span className="text-xl font-bold ml-4">
                              Bánh cưới
                            </span>
                          </div>
                          <span className="text-sm font-normal text-left">
                            Lựa chọn chiếc bánh cưới ưng ý nhất cho tiệc cưới
                            của quý khách
                          </span>
                          <div className="w-full flex flex-wrap gap-4">
                            {products &&
                              products.map((product) => (
                                <ServiceItem
                                  service={product}
                                  key={product.id}
                                  compairState={cakeId}
                                  onChange={(e) => setCakeId(e.target.value)}
                                />
                              ))}
                          </div>
                          <div className="w-full mt-6 flex justify-end">
                            <Button
                              onClick={handleNextTab}
                              variant={"unstyled"}
                              className="!bg-gold !rounded-full !flex !items-center !gap-2 !p-3 !text-white"
                            >
                              <svg
                                width="20"
                                height="20"
                                viewBox="0 0 20 20"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M12.0234 4.94141L17.0818 9.99974L12.0234 15.0581"
                                  stroke="white"
                                  strokeWidth="1.5"
                                  strokeMiterlimit="10"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                                <path
                                  d="M2.91797 10H16.943"
                                  stroke="white"
                                  strokeWidth="1.5"
                                  strokeMiterlimit="10"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                              <span className="text-sm leading-5 font-medium ">
                                Tiếp tục
                              </span>
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    </TabPanel>

                    {/* THỰC ĐƠN PANEL */}
                    <TabPanel key={"menu"}>
                      <motion.div
                        initial={{
                          opacity: 0,
                          y: 50,
                        }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50 }}
                        className="w-full flex gap-5"
                      >
                        {/* NOTE AREA */}
                        {renderNoteArea()}

                        {/* PANEL MAIN */}
                        <div className="w-2/3 h-full  flex flex-col gap-3 relative">
                          <div className="flex gap-3 items-center h-full relative">
                            <div className="shrink-0 w-1 h-full bg-gold absolute left-0 top-0 bottom-0"></div>
                            <span className="text-xl font-bold ml-4">
                              Bánh cưới
                            </span>
                          </div>
                          <span className="text-sm font-normal text-left">
                            Lựa chọn chiếc bánh cưới ưng ý nhất cho tiệc cưới
                            của quý khách
                          </span>
                          <div className="w-full flex flex-wrap gap-4">
                            {menuList &&
                              menuList.map((menu) => (
                                <ServiceItem
                                  service={menu}
                                  key={menu.id}
                                  compairState={menuId}
                                  onChange={(e) => setMenuId(e.target.value)}
                                />
                              ))}
                          </div>
                          <div className="w-full mt-6 flex justify-end">
                            <Button
                              onClick={handleNextTab}
                              variant={"unstyled"}
                              className="!bg-gold !rounded-full !flex !items-center !gap-2 !p-3 !text-white"
                            >
                              <svg
                                width="20"
                                height="20"
                                viewBox="0 0 20 20"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M12.0234 4.94141L17.0818 9.99974L12.0234 15.0581"
                                  stroke="white"
                                  strokeWidth="1.5"
                                  strokeMiterlimit="10"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                                <path
                                  d="M2.91797 10H16.943"
                                  stroke="white"
                                  strokeWidth="1.5"
                                  strokeMiterlimit="10"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                              <span className="text-sm leading-5 font-medium ">
                                Tiếp tục
                              </span>
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    </TabPanel>

                    {/* EXTRA SERVICES PANEL */}
                    <TabPanel key={"extraServices"}>
                      <motion.div
                        initial={{
                          opacity: 0,
                          y: 50,
                        }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50 }}
                        className="w-full flex gap-5"
                      >
                        {/* NOTE AREA */}
                        {renderNoteArea()}

                        {/* PANEL MAIN */}
                        <div className="w-2/3 h-full  flex flex-col gap-3 relative">
                          {extraServices &&
                            extraServices.map((category, index) => (
                              <div key={index} className="text-left">
                                <div className="flex gap-3 items-center h-full relative">
                                  <div className="shrink-0 w-1 h-full bg-gold absolute left-0 top-0 bottom-0"></div>
                                  <span className="text-xl font-bold ml-4">
                                    {category.name}
                                  </span>
                                </div>
                                <span className="text-sm font-normal text-left mt-3 block">
                                  Lựa chọn các dịch vụ đi kèm
                                </span>
                                <div className="w-full flex flex-wrap gap-4 mt-5">
                                  {category.products &&
                                    category.products.map((product) => (
                                      <ServiceItem
                                        name={category.slug}
                                        service={product}
                                        key={product.id}
                                        compairState={
                                          extraServicesId[category.slug]
                                            ? JSON.stringify(
                                                extraServicesId[category.slug]
                                              )
                                            : "{}"
                                        }
                                        onChange={() =>
                                          handleExtraServicesChange({
                                            service: product,
                                            category,
                                          })
                                        }
                                      />
                                    ))}
                                </div>
                              </div>
                            ))}
                          <div className="w-full mt-6 flex justify-end">
                            <Button
                              onClick={handleSubmit(onSubmit)}
                              variant={"unstyled"}
                              className="!bg-gold !rounded-full !flex !items-center !gap-2 !p-3 !text-white"
                              isLoading={isCreatingPakage}
                            >
                              <svg
                                width="20"
                                height="20"
                                viewBox="0 0 20 20"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M12.0234 4.94141L17.0818 9.99974L12.0234 15.0581"
                                  stroke="white"
                                  strokeWidth="1.5"
                                  strokeMiterlimit="10"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                                <path
                                  d="M2.91797 10H16.943"
                                  stroke="white"
                                  strokeWidth="1.5"
                                  strokeMiterlimit="10"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                              <span className="text-sm leading-5 font-medium ">
                                Tạo và liên hệ ngay
                              </span>
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    </TabPanel>
                  </TabPanels>
                )}
              </Tabs>
            </motion.section>
          )}

          <Footer></Footer>

          {drawerData && (
            <Drawer
              size={"sm"}
              variant={"unstyled"}
              isOpen={isOpen}
              placement="left"
              onClose={onClose}
              finalFocusRef={drawerStriggerRef}
            >
              <DrawerOverlay />
              <DrawerContent className="!bg-darkGreen-primary">
                <DrawerCloseButton textColor={"white"} />
                <DrawerHeader className="!text-white">
                  Gói tiệc của bạn
                </DrawerHeader>

                {!drawerData ? (
                  <div>Vui lòng chọn thêm dịch vụ</div>
                ) : (
                  <DrawerBody>
                    {Object.keys(drawerData).map((key, i) => (
                      <div key={i} className={`${i !== 0 ? "mt-5" : ""}`}>
                        <h2 className="text-white font-semibold text-xl">
                          {getNameByKey(key)}
                        </h2>
                        <div className="flex flex-col gap-5 mt-5">
                          {drawerData[key].map((product) => {
                            if (!product) return null;
                            return (
                              <SelectedProduct
                                product={product}
                                key={product.id}
                              />
                            );
                          })}
                        </div>
                        <Divider className="mt-5 bg-gold" />
                        <div className="text-base font-semibold text-end text-white mt-3">
                          {drawerData[key] &&
                            drawerData[key].length > 0 &&
                            drawerData[key]
                              .reduce((acc, cur) => {
                                if (!cur) return acc;
                                return acc + cur.price;
                              }, 0)
                              .toLocaleString("vn-VN")}{" "}
                          VNĐ
                        </div>
                      </div>
                    ))}
                  </DrawerBody>
                )}

                <DrawerFooter className="!flex !flex-col !gap-3 !w-full">
                  <div
                    className="flex flex-col bg-whiteAlpha-100 rounded-lg w-full overflow-hidden"
                    role="wrapper"
                  >
                    <motion.div
                      layout
                      role="panel"
                      className="w-full h-52 overflow-y-auto text-white p-3"
                      initial={{
                        height: 0,
                        transform: "translateY(100px)",
                        opacity: 0,
                      }}
                      animate={{
                        height: isExpanded ? "250px" : 0,
                        transform: isExpanded
                          ? "translateY(0)"
                          : "translateY(100px)",
                        opacity: isExpanded ? 1 : 0,
                        display: isExpanded ? "block" : "none",
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      <motion.div animate={{ opacity: 1 }}>
                        <p className="text-xl">Các khoảng chi</p>
                        <div className="flex flex-col w-full gap-4 mt-5">
                          {Object.keys(drawerData).map((key) => {
                            if (
                              !Array.isArray(drawerData[key]) &&
                              !drawerData[key]
                            )
                              return null;

                            const total = drawerData[key].reduce(
                              (acc, cur) => acc + cur?.price,
                              0
                            );

                            return (
                              <div
                                className="flex items-center justify-between"
                                key={key}
                              >
                                <p className="text-base">{getNameByKey(key)}</p>
                                <p className="text-base">
                                  {total
                                    ? `${total.toLocaleString("vn-VN")} VNĐ`
                                    : "0 VNĐ"}
                                </p>
                              </div>
                            );
                          })}
                        </div>
                      </motion.div>
                    </motion.div>
                    <div
                      role="strigger"
                      className="!w-full p-3 flex items-start relative cursor-pointer z-10 bg-whiteAlpha-50 backdrop-blur-md rounded-lg"
                      onClick={() => setIsExpanded(!isExpanded)}
                    >
                      <div className="flex flex-col flex-1">
                        <h3 className="text-white font-semibold text-base">
                          Tổng dự chi
                        </h3>
                        <p className="text-white font-semibold text-xl mt-2">
                          {total
                            ? `${total.toLocaleString("vn-VN")} VNĐ`
                            : "0 VNĐ"}
                        </p>
                      </div>
                      <ChevronDownIcon
                        className="text-white w-4 h-4"
                        style={{
                          rotate: isExpanded ? "0deg" : "180deg",
                        }}
                      />
                    </div>
                  </div>

                  <div className="flex w-full">
                    <Button
                      variant={"unstyled"}
                      className="!bg-whiteAlpha-100 hover:!bg-whiteAlpha-200 !rounded-full text-white !w-fit !flex !flex-center p-3"
                      mr={3}
                      onClick={() => {
                        handleSaveCombo();
                        onClose();
                      }}
                    >
                      <Tooltip
                        label="Lưu gói tiệc"
                        aria-label="A tooltip"
                        variant={"unstyled"}
                        className="!rounded-lg !bg-whiteAlpha-100 backdrop-blur-sm !text-white"
                      >
                        <span>
                          <IoSaveOutline className="w-4 h-4 text-white font-semibold"></IoSaveOutline>
                        </span>
                      </Tooltip>
                    </Button>
                    <Button
                      variant={"unstyled"}
                      className="!bg-gold hover:brightness-90 transition !rounded-full !text-white !px-8 !py-2 !w-full !flex !flex-center items-center gap-3 !font-normal group"
                      onClick={handleSubmit(onSubmit)}
                      isLoading={isCreatingPakage}
                    >
                      {!isCreatingPakage && (
                        <ArrowRightIcon className="w-4 h-4 group-hover:animate-pulse !duration-300" />
                      )}{" "}
                      Tạo và liên hệ ngay
                    </Button>
                  </div>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          )}
        </>
      )}
    </>
  );
}

const NextButton = ({ onClick }) => {
  return (
    <motion.button
      {...framer_button}
      className="flex items-center gap-3 flex-center bg-gold text-white px-8 py-2 rounded-full mt-5 w-full"
      onClick={(e) => {
        e.preventDefault();
        onClick();
      }}
    >
      <ArrowRightIcon className="w-5 h-5 text-white"></ArrowRightIcon>
      Tiếp tục
    </motion.button>
  );
};

const framer_button = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 10 },
  transition: { duration: 0.3 },
};

export default Page;

export function PanelSkeleton() {
  return (
    <div className="w-full flex gap-5 mt-6">
      {/* NOTE AREA */}
      <Skeleton className="w-1/3 rounded-lg bg-whiteAlpha-50">
        <div className="bg-whiteAlpha-50 flex flex-col gap-4 p-5 rounded-2xl full h-[70vh]"></div>
      </Skeleton>

      {/* PANEL MAIN */}
      <div className="w-2/3 h-full  flex flex-col gap-3 relative">
        <div>
          <div className="flex flex-col justify-start">
            <Skeleton className="flex gap-3 items-center h-full relative bg-whiteAlpha-50 rounded-lg">
              <Skeleton className="w-[250px] rounded-lg h-5"></Skeleton>
            </Skeleton>
            <Skeleton className="rounded-lg w-[400px] h-5 bg-whiteAlpha-50 mt-3"></Skeleton>
          </div>

          <div className="w-full flex flex-wrap gap-4 mt-5">
            {
              // eslint-disable-next-line
              [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((index) => (
                <div key={index}>
                  <Skeleton className="rounded-lg bg-whiteAlpha-50">
                    <div className="w-[110px] h-[110px] rounded-lg "></div>
                  </Skeleton>
                  <Skeleton className="rounded-lg mt-3 bg-whiteAlpha-50">
                    <div className="w-full h-5 rounded-lg bg-whiteAlpha-50"></div>
                  </Skeleton>
                  <Skeleton className="rounded-lg mt-3 bg-whiteAlpha-50">
                    <div className="w-full h-5 rounded-lg bg-whiteAlpha-50"></div>
                  </Skeleton>
                </div>
              ))
            }
          </div>
        </div>
      </div>
    </div>
  );
}
