"use client";

import Footer from "@/app/_components/FooterClient";
import FormInput from "@/app/_components/FormInput";
import { fetchDecors } from "@/app/_lib/decors/decorsSlice";
import { fetchCategoriesBySlug } from "@/app/_lib/features/categories/categoriesSlice";
import { getMenuList } from "@/app/_lib/features/menu/menuSlice";
import {
  fetchingPartyTypesFailure,
  fetchingPartyTypesSuccess,
  getPartyTypes,
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
  MinusIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import { zodResolver } from "@hookform/resolvers/zod";
import { Checkbox, Divider, Skeleton } from "@nextui-org/react";
import { Col, Row, Image } from "antd";
import { AnimatePresence, motion } from "framer-motion";
import NextImage from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
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
import { getBranches } from "@/app/_lib/features/branch/branchSlice";
import {
  decodeWeddingPackageName,
  generateUniqueWeddingPackageName,
} from "@/app/_utils/helpers";
import { FaRandom } from "react-icons/fa";
import { formatPrice } from "@/app/_utils/formaters";
import {
  getBeaverageById,
  getBeaverages,
} from "@/app/_lib/features/beaverages/beaveragesSlice";

const categories = [
  {
    id: 1,
    name: "Sảnh tiệc",
  },
  {
    id: 2,
    name: "Lễ",
  },
  {
    id: 3,
    name: "Thực đơn",
  },
  {
    id: 4,
    name: "Đồ uống",
  },
  {
    id: 5,
    name: "Dịch vụ khác",
  },
];

const schema = z.object({
  partyType: z
    .string({
      required_error: "Quý khách vui lòng chọn loại tiệc",
    })
    .nonempty("Quý khách vui lòng chọn loại tiệc"),
  branch: z
    .string({
      required_error: "Quý khách vui lòng chọn chi nhánh",
    })
    .nonempty("Quý khách vui lòng chọn chi nhánh"),
  partySize: z
    .string({
      required_error: "Quý khách vui lòng chọn số lượng khách mời dự kiến",
    })
    .nonempty("Quý khách vui lòng chọn số lượng khách mời dự kiến"),
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
    .min(1, { message: "Mô tả một ít về combo của quý khách nhé!" }),
  short_description: z
    .string({
      required_error: "Mô tả ngắn gọn về combo của quý khách",
    })
    .min(1, { message: "Mô tả ngắn gọn về combo của quý khách" }),
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

    case "ceremony":
      name = "Lễ";
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
      break;

    case "beaverages":
      name = "Đồ uống";

    default:
  }

  return name;
};

const parsedState = (state) => {
  let parsedState = null;
  try {
    parsedState = JSON.parse(state);
  } catch (e) {
    return;
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

const getBudget = (budget, unit = "million") => {
  if (unit === "million") {
    return {
      text: `${budget} triệu`,
      value: budget * 1000000,
    };
  } else if (unit === "billion") {
    return {
      text: `${budget} tỷ`,
      value: budget * 1000000000,
    };
  }
};

function Page() {
  const [files, setFiles] = React.useState([]);
  const searchParams = useSearchParams();
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
  const { branches, isFetchingBranches, isFetchingBranchesError } = useSelector(
    (store) => store.branch
  );
  const {
    beaverages: beaveragesList,
    isFetchingBeaverages,
    isFetchingBeaveragesError,
  } = useSelector((store) => store.beaverages);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
    setValue,
    getValues,
    getFieldState,
  } = useForm({
    resolver: zodResolver(schema),
  });

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
  const [branchId, setBranchId] = React.useState();
  const [priceUnit, setPriceUnit] = React.useState("million");
  const [tabIndex, setTabIndex] = React.useState(0);
  const [note, setNote] = React.useState("");
  const [isNextImagesEmpty, setIsNextImagesEmpty] = React.useState(false);
  const [isNextImageOverSize, setIsNextImageOverSize] = React.useState(false);
  const [isFormatAccepted, setIsFormatAccepted] = React.useState(false);
  const [limitFilesLength, setLimitFilesLength] = React.useState(false);
  const [submitTriggered, setSubmitTriggered] = React.useState(false);
  const [isLogedin, setIsLogedIn] = React.useState(false);
  const [beaverages, setBeaverages] = React.useState({});
  const [isSkipWarning, setIsSkipWarning] = React.useState(false);

  const handleIncrement = React.useCallback((productId) => {
    setBeaverages((prevQuantities) => ({
      ...prevQuantities,
      [productId]: (prevQuantities[productId] || 0) + 1,
    }));
  }, []);

  const handleDecrement = React.useCallback((productId) => {
    setBeaverages((prevQuantities) => {
      const newQuantities = { ...prevQuantities };
      if (newQuantities[productId] > 1) {
        newQuantities[productId] -= 1;
      } else {
        delete newQuantities[productId];
      }
      return newQuantities;
    });
  }, []);

  const handleQuantityChange = React.useCallback((productId, value) => {
    const quantity = Math.max(Number(value), 0);
    setBeaverages((prevQuantities) => {
      const newQuantities = { ...prevQuantities };
      if (quantity > 0) {
        newQuantities[productId] = quantity;
      } else {
        delete newQuantities[productId];
      }
      return newQuantities;
    });
  }, []);

  const handleRandomName = () => {
    const name = generateUniqueWeddingPackageName();
    setValue("name", decodeWeddingPackageName(name).userFriendlyName);
  };

  const drawerData = React.useMemo(() => {
    return {
      partyType: [parsedState(getValues("partyType"))],
      hall: [parsedState(hallId)],
      decor: [parsedState(decorId)],
      stage: [parsedState(stageId)],
      menu: [parsedState(menuId)],
      cake: [parsedState(cakeId)],
      extraServices: [...Object.values(extraServicesId)],
      beaverages: beaveragesList,
    };
  }, [
    hallId,
    decorId,
    stageId,
    menuId,
    cakeId,
    extraServicesId,
    beaveragesList,
    getValues,
  ]);

  const total = React.useMemo(() => {
    return Object.keys(drawerData).reduce((acc, key) => {
      if (Array.isArray(drawerData[key])) {
        return (
          acc +
          drawerData[key].reduce((innerAcc, item) => {
            if (item) {
              switch (key) {
                case "menu":
                  return (
                    innerAcc +
                    item.price * Math.ceil(Number(getValues("partySize")) / 10)
                  );
                  break;

                case "beaverages":
                  return innerAcc + item.price * (beaverages[item.id] || 0);

                default:
                  return innerAcc + item.price;
                  break;
              }
            }

            return innerAcc;
          }, 0)
        );
      }

      return acc + (drawerData[key]?.price || 0);
    }, 0);
  }, [drawerData, getValues("partySize")]);

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

  const onInputChange = (e) => {
    setValue(e.target.name, e.target.value);
  };

  const onSubmit = async (data) => {
    setSubmitTriggered(true);
    if (files.length <= 0) {
      setIsNextImagesEmpty(true);
      return;
    } else if (files.length > 5) {
      setLimitFilesLength(true);
      return;
    }

    if (!isFormatAccepted || isNextImageOverSize) {
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

    console.log(menuId);

    console.log("data -> ", data);

    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("short_description", data.short_description);
    formData.append("party_type_id", parsedState(data.partyType).id);
    formData.append("menu_id", parsedState(menuId) && parsedState(menuId).id);
    formData.append(
      "decor_id",
      parsedState(decorId) && parsedState(decorId).id
    );
    formData.append("stage_id", parsedState(decorId) && parsedState(hallId).id);
    formData.append("is_show", false);
    formData.append("price", total.toString());
    formData.append("budget", data.budget);
    formData.append("number_of_guests", data.partySize);
    formData.append(
      "other_service",
      JSON.stringify([
        { id: parsedState(stageId) && parsedState(stageId).id, quantity: 1 },
        { id: parsedState(cakeId) && parsedState(cakeId).id, quantity: 1 },
        ...Object.values(extraServicesId).map((item) => ({
          id: item.id,
          quantity: 1,
        })),
        ...beaveragesList.map((i) => ({
          id: i.id,
          quantity: beaverages[i.id] || 0,
        })),
      ])
    );
    files.forEach((file) => {
      formData.append("images", file);
    });

    console.log(
      formData.forEach((value, key) => console.log(`${key} -> ${value}`))
    );

    toast({
      title: "Combo của quý khách đang được tạo",
      description: "Vui lòng đợi trong giây lát",
      status: "info",
      position: "top-right",
      duration: 5000,
    });

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
      if (drawerData) {
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
      const result = await Promise.all(
        Object.keys(beaverages).map((key) => {
          return dispatch(getBeaverageById(key)).unwrap();
        })
      );

      dispatch(
        getBeaverages(
          result.flat().map((b) => ({ ...b, quantity: beaverages[b.id] }))
        )
      );
    };

    fetchData();

    return () => {};
  }, [beaverages]);

  React.useEffect(() => {
    if (typeof window == undefined) return;

    const storeUser = window.localStorage.getItem("user");
    if (storeUser) setIsLogedIn(true);

    // const params = new URLSearchParams(window.location.search);
    // const partySize = params.get("partySize") || "";
    // const budget = params.get("budget") || "";
    // const partyType = params.get("partyType") || "";

    // setValue("partySize", partySize);
    // setValue("budget", budget);
    // setValue("partyType", partyType);
  }, []);

  // React.useEffect(() => {
  //   const params = new URLSearchParams(window.location.search);
  //   const partySize = params.get("partySize") || "";
  //   const budget = params.get("budget") || "";
  //   const partyTypeId = params.get("partyType") || "";
  //   const branchId = params.get("branch") || "";

  //   setValue("partySize", partySize);
  //   setValue("budget", budget);

  //   if (branchId && branches.length > 0) {
  //     const branch = branches.find((b) => b.id == branchId);

  //     if (branch) {
  //       setValue("branch", JSON.stringify(branch));
  //     }
  //   }

  //   if (partyTypeId && partyTypes.length > 0) {
  //     const partyType = partyTypes.find((type) => type.id == partyTypeId);

  //     if (partyType) {
  //       setValue("partyType", JSON.stringify(partyType));
  //     }
  //   }
  // }, [partyTypes]);

  // React.useEffect(() => {
  //   const subscription = watch((value, { name, type }) => {
  //     const params = new URLSearchParams(window.location.search);
  //     if (value.partySize) params.set("partySize", value.partySize);
  //     if (value.budget) params.set("budget", value.budget);
  //     if (value.partyType) {
  //       const parsedPartyType = parsedState(value.partyType);
  //       params.set("partyType", parsedPartyType.id);
  //     }
  //     if (value.branch) {
  //       const parsedBranch = parsedState(value.branch);
  //       params.set("branch", parsedBranch.id);
  //     }
  //     router.replace(`?${params.toString()}`);
  //   });
  //   return () => subscription.unsubscribe();
  // }, []);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [branches, partyTypes] = await Promise.all([
          dispatch(getBranches({})).unwrap(),
          dispatch(getPartyTypes({})).unwrap(),
        ]);

        // console.log("party types -> ", partyTypes);
        // console.log("branches -> ", branches);

        if (branches.success) {
          // console.log("Fetch branches successfully");
        }

        if (partyTypes.success) {
          // console.log("Fetch party types successfully");
        }
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
          try {
            const branch_id = parsedState(getValues("branch")).id;

            console.log(branch_id);

            result = await dispatch(
              fetchHalls({
                branch_id,
              })
            ).unwrap();
          } catch (error) {
            console.log(error);
          }
          break;

        case 1:
          try {
            const result = await Promise.all([
              dispatch(fetchDecors({})).unwrap(),
              dispatch(fetchStages({})).unwrap(),
              dispatch(
                fetchProductByCategorySlug({
                  slug: API_CONFIG.WEDDING_CAKE_SLUG,
                })
              ).unwrap(),
            ]);
          } catch (error) {
            console.log(error);
          }
          break;

        case 2:
          try {
            result = await dispatch(
              getMenuList({ params: { itemsPerPage: 9999 } })
            ).unwrap();
          } catch (error) {
            console.log(error);
          }
          break;

        case 3:
          try {
            result = await dispatch(
              fetchProductByCategorySlug({
                slug: API_CONFIG.BEAVERAGE_CATEGORY_SLUG,
              })
            ).unwrap();
          } catch (error) {
            console.log(error);
          }
          break;

        case 4:
          try {
            result = await dispatch(
              fetchCategoriesBySlug({ slug: API_CONFIG.EXTRA_SERVICES_SLUG })
            ).unwrap();
          } catch (error) {
            console.log(error);
          }

          break;

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
  }, [tabIndex, branchId]);

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
      setIsNextImageOverSize(true);
    } else {
      setIsNextImageOverSize(false);
    }

    if (files.some((file) => !checkFileType(file))) {
      setIsFormatAccepted(false);
    } else {
      setIsFormatAccepted(true);
    }
  }, [files]);

  React.useEffect(() => {
    if (isSkipWarning) return;

    const toastId = "budget-warning";

    if (!toast.isActive(toastId)) {
      if (total > getBudget(getValues("budget"), priceUnit).value)
        toast({
          id: toastId,
          title: "Cảnh báo vượt quá mức dự chi",
          description:
            "Tổng chi phí của gói tiệc đang vượt quá mức dự chi\n. Đây chỉ là cảnh báo, quý khách vẫn có thể tiếp tục tạo combo",
          status: "warning",
          position: "top-right",
          isClosable: true,
        });
    }
  }, [total, getValues("budget"), isSkipWarning]);

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
    <form onSubmit={handleSubmit(onSubmit)}>
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
            <NextImage
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
                      errorMessage={errors?.partyType?.message}
                      wrapperClassName="!mt-0"
                      theme="dark"
                      label="Quý khách định tổ chức loại tiệc..."
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
                      onChange={onInputChange}
                      value={watch("partyType")}
                      className={
                        "!bg-whiteAlpha-100 hover:bg-whiteAlpha-200 focus:bg-whiteAlpha-200"
                      }
                    ></FormInput>
                  )}
                  {branches && (
                    <FormInput
                      register={register}
                      errorMessage={errors?.branch?.message}
                      theme="dark"
                      label="Quý khách dự định tổ chức tiệc ở..."
                      ariaLabel="Địa điểm tổ chức tiệc / chi nhánh nhà hàng"
                      id="branch"
                      name="branch"
                      type="select"
                      options={[
                        {
                          id: "",
                          name: "Chọn chi nhánh",
                        },
                        ...branches.map((p) => ({
                          id: JSON.stringify(p),
                          name: p.name,
                        })),
                      ]}
                      onChange={onInputChange}
                      value={watch("branch")}
                      className={
                        "!bg-whiteAlpha-100 hover:bg-whiteAlpha-200 focus:bg-whiteAlpha-200"
                      }
                    ></FormInput>
                  )}
                  <FormInput
                    register={register}
                    errors={errors}
                    errorMessage={errors?.partySize?.message}
                    theme="dark"
                    label="Với số lượng khách mời khoảng..."
                    placeholder="Ví dụ: 500"
                    ariaLabel="Số lượng khách mời"
                    id="partySize"
                    name="partySize"
                    type="text"
                    onChange={onInputChange}
                    value={watch("partySize")}
                    className={
                      "!bg-whiteAlpha-100 hover:bg-whiteAlpha-200 focus:bg-whiteAlpha-200"
                    }
                  ></FormInput>
                  <div className="flex flex-col">
                    <div className="flex gap-3">
                      <FormInput
                        register={register}
                        errors={errors}
                        errorMessage={errors?.budget?.message}
                        placeholder="Ví dụ: 500"
                        theme="dark"
                        label="Với mức dự chi khoảng..."
                        ariaLabel="Mức dự chi"
                        id="budget"
                        name="budget"
                        type="text"
                        onChange={onInputChange}
                        value={watch("budget")}
                        className={
                          "!bg-whiteAlpha-100 hover:bg-whiteAlpha-200 focus:bg-whiteAlpha-200"
                        }
                      ></FormInput>
                      <FormInput
                        register={register}
                        errorMessage={"Vui lòng chọn đơn vị"}
                        theme="dark"
                        label="Đơn vị"
                        ariaLabel="Đơn vị cho mức dự chi"
                        id="priceUnit"
                        name="priceUnit"
                        type="select"
                        options={[
                          {
                            id: "million",
                            name: "Triệu",
                          },
                          {
                            id: "billion",
                            name: "Tỷ",
                          },
                        ]}
                        onChange={(e) => setPriceUnit(e.target.value)}
                        value={priceUnit}
                        className={
                          "!bg-whiteAlpha-100 hover:bg-whiteAlpha-200 focus:bg-whiteAlpha-200"
                        }
                      ></FormInput>
                    </div>
                  </div>
                  <Checkbox
                    isSelected={isSkipWarning}
                    onValueChange={setIsSkipWarning}
                    color={"default"}
                    classNames={{
                      base: "mt-3",
                      label: "text-gray-400",
                    }}
                  >
                    Bỏ qua cảnh báo vượt quá mức dự chi
                  </Checkbox>

                  {getValues("partyType") &&
                    getValues("partySize") &&
                    getValues("budget") &&
                    getValues("branch") && (
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
          {watch("partySize") &&
            getValues("budget") &&
            getValues("partyType") &&
            getValues("branch") && (
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
                    {categories.map((category, index) => (
                      <Tab
                        key={index}
                        color={"white"}
                        className="aria-[selected=true]:text-white aria-[selected=true]:opacity-100 aria-[selected=true]:bg-gold bg-transparent opacity-45 transition flex items-center gap-2 uppercase font-semibold flex-center text-center rounded-full py-2 px-6 leading-8"
                      >
                        {category.name}
                      </Tab>
                    ))}
                    <Tab
                      key={"generalInformations"}
                      color={"white"}
                      className="aria-[selected=true]:text-white aria-[selected=true]:opacity-100 aria-[selected=true]:bg-gold bg-transparent opacity-45 transition flex items-center gap-2 uppercase font-semibold flex-center text-center rounded-full py-2 px-6 leading-8"
                    >
                      Thông tin chung
                    </Tab>
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

                      {/* LỄ PANEL */}
                      <TabPanel key={"ceremony"}>
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

                          <div className="w-2/3">
                            {/* Trang trí */}
                            <div className="flex flex-col gap-3 relative">
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
                                      type={"decor"}
                                      service={decor}
                                      key={decor.id}
                                      compairState={decorId}
                                      onChange={(e) =>
                                        setDecorId(e.target.value)
                                      }
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

                            {/* Sân khấu */}
                            <div className="flex flex-col gap-3 relative">
                              <div className="flex gap-3 items-center h-full relative">
                                <div className="shrink-0 w-1 h-full bg-gold absolute left-0 top-0 bottom-0"></div>
                                <span className="text-xl font-bold ml-4">
                                  Sân khấu
                                </span>
                              </div>
                              <span className="text-sm font-normal text-left">
                                Lựa chọn gói sân khấu phù hợp cho tiệc của quý
                                khách
                              </span>
                              <div className="w-full flex flex-wrap gap-4">
                                {stages &&
                                  stages.map((stage) => (
                                    <ServiceItem
                                      type={"decor"}
                                      service={stage}
                                      key={stage.id}
                                      compairState={stageId}
                                      onChange={(e) =>
                                        setStageId(e.target.value)
                                      }
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

                            {/* PANEL MAIN */}
                            <div className="flex flex-col gap-3 relative">
                              <div className="flex gap-3 items-center h-full relative">
                                <div className="shrink-0 w-1 h-full bg-gold absolute left-0 top-0 bottom-0"></div>
                                <span className="text-xl font-bold ml-4">
                                  Bánh cưới
                                </span>
                              </div>
                              <span className="text-sm font-normal text-left">
                                Lựa chọn chiếc bánh cưới ưng ý nhất cho tiệc
                                cưới của quý khách
                              </span>
                              <div className="w-full flex flex-wrap gap-4">
                                {products &&
                                  products.map((product) => (
                                    <ServiceItem
                                      type={"decor"}
                                      service={product}
                                      key={product.id}
                                      compairState={cakeId}
                                      onChange={(e) =>
                                        setCakeId(e.target.value)
                                      }
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
                                Thực đơn
                              </span>
                            </div>
                            <span className="text-sm font-normal text-left">
                              Lựa chọn thực đơn phù hợp cho tiệc của quý khách
                            </span>
                            <div className="w-full flex flex-wrap gap-4">
                              {menuList &&
                                menuList.map((menu) => (
                                  <ServiceItem
                                    type="menu"
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

                      {/* ĐỒ UỐNG PANEL */}
                      <TabPanel key={"beaverage"}>
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
                                Đồ uống
                              </span>
                            </div>
                            <span className="text-sm font-normal text-left">
                              Quý khách có thể lựa chọn nhiều loại đồ uống phù
                              hợp
                            </span>
                            <div className="w-full mt-3 columns-2">
                              {products &&
                                products.map((b) => (
                                  <div
                                    className="flex w-full mb-8 gap-3"
                                    key={b.id}
                                  >
                                    <div className="relative rounded-lg overflow-hidden">
                                      <Image
                                        src={b.images.at(0)}
                                        alt={b.name}
                                        width={100}
                                        height={100}
                                      />
                                    </div>
                                    <div className="flex flex-col">
                                      <span className="text-md font-semibold text-start">
                                        {b.name}
                                      </span>
                                      <span className="text-sm font-normal text-start mt-3">
                                        {formatPrice(b.price)}
                                      </span>
                                      <div className="flex items-center mt-3 p-2 rounded-lg bg-whiteAlpha-100 w-fit">
                                        <Button
                                          variant={"unstyled"}
                                          onClick={() => handleDecrement(b.id)}
                                          className="!flex !flex-center !w-fit !h-fit !min-w-0 !min-h-0"
                                        >
                                          <MinusIcon className="w-4 h-4 text-gold" />
                                        </Button>
                                        <input
                                          type="number"
                                          value={beaverages[b.id] || 0}
                                          onChange={(e) =>
                                            handleQuantityChange(
                                              b.id,
                                              e.target.value
                                            )
                                          }
                                          className="w-12 text-center"
                                        />
                                        <Button
                                          variant={"unstyled"}
                                          onClick={() => handleIncrement(b.id)}
                                          className="!flex !flex-center !w-fit !h-fit !min-w-0 !min-h-0"
                                        >
                                          <PlusIcon className="w-4 h-4 text-gold" />
                                        </Button>
                                      </div>
                                    </div>
                                  </div>
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
                              {isNextImagesEmpty && (
                                <motion.div
                                  key={"isNextImagesEmpty"}
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
                              {isNextImageOverSize && (
                                <motion.div
                                  key={"isNextImageOverSize"}
                                  initial={{ opacity: 0, y: -10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: -10 }}
                                  className="text-red-400 text-sm font-normal mt-2 mb-2"
                                >
                                  <ExclamationCircleIcon className="w-4 h-4 mr-1 inline" />{" "}
                                  {
                                    "Hãy chọn ảnh có dung lượng nhỏ hơn 5MB nhé!"
                                  }
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
                              Rất tốt, bây giờ hãy điền thông tin cơ bản cho
                              combo của quý khách!
                            </span>
                            <div className="w-full flex flex-wrap gap-4">
                              <div className="flex gap-3 items-end w-full">
                                <FormInput
                                  register={register}
                                  errors={errors}
                                  errorMessage={errors?.name?.message}
                                  name={"name"}
                                  wrapperClassName="!mt-0 flex-1"
                                  placeholder={`Ví dụ: ${
                                    decodeWeddingPackageName(
                                      generateUniqueWeddingPackageName()
                                    ).userFriendlyName
                                  }`}
                                  value={watch("name")}
                                  onChange={onInputChange}
                                  theme="light"
                                  className="bg-whiteAlpha-100 focus:bg-whiteAlpha-100 focus:brightness-105 hover:bg-whiteAlpha-100 hover:brightness-110 !h-[44px]"
                                />
                                <Button
                                  className="!bg-whiteAlpha-100 hover:!bg-whiteAlpha-200 rounded-lg !h-[44px]"
                                  onClick={handleRandomName}
                                >
                                  <FaRandom className="text-white w-5 h-5" />
                                </Button>
                              </div>
                              <FormInput
                                register={register}
                                errors={errors}
                                errorMessage={
                                  errors?.short_description?.message
                                }
                                name={"short_description"}
                                placeholder="Mô tả ngắn"
                                value={watch("short_description")}
                                onChange={onInputChange}
                                type="textarea"
                                rows={2}
                                theme="light"
                                wrapperClassName="!mt-0"
                                className="bg-whiteAlpha-100 focus:bg-whiteAlpha-100 focus:brightness-105 hover:bg-whiteAlpha-100 hover:brightness-110"
                              />
                              <FormInput
                                register={register}
                                errors={errors}
                                errorMessage={errors?.description?.message}
                                name={"description"}
                                placeholder="Mô tả chi tiết"
                                value={watch("description")}
                                type="textarea"
                                onChange={onInputChange}
                                theme="light"
                                wrapperClassName="!mt-0"
                                className="bg-whiteAlpha-100 focus:bg-whiteAlpha-100 focus:brightness-105 hover:bg-whiteAlpha-100 hover:brightness-110"
                              />
                            </div>
                            <div className="w-full mt-6 flex justify-end">
                              <Button
                                type="submit"
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
                          {drawerData[key].map((product, index) => {
                            if (!product) return null;
                            return (
                              <SelectedProduct product={product} key={index} />
                            );
                          })}
                        </div>
                        <Divider className="mt-5 bg-gold" />
                        <div className="text-base text-end text-white mt-3">
                          {drawerData[key] && drawerData[key].length > 0 && (
                            <div>
                              {key === "menu" ? (
                                <div>
                                  {(
                                    drawerData[key].reduce((acc, cur) => {
                                      if (!cur) return acc;
                                      return acc + cur.price;
                                    }, 0) *
                                    Math.ceil(Number(watch("partySize")) / 10)
                                  ).toLocaleString("vn-VN") + "VNĐ"}
                                  <div className="text-md text-end text-gray-400 mt-1">
                                    {`Đây là số tiền dựa trên số bàn ước tính: ${Math.ceil(
                                      watch("partySize") / 10
                                    )}`}
                                  </div>
                                </div>
                              ) : key === "beaverages" ? (
                                drawerData[key]
                                  .reduce((acc, cur) => {
                                    if (!cur) return acc;
                                    return acc + cur.price * cur.quantity;
                                  }, 0)
                                  .toLocaleString("vn-VN")
                              ) : (
                                drawerData[key]
                                  .reduce((acc, cur) => {
                                    if (!cur) return acc;
                                    return acc + cur.price;
                                  }, 0)
                                  .toLocaleString("vn-VN") + "VNĐ"
                              )}
                            </div>
                          )}
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
                        <p className="text-xl underline underline-offset-4">
                          Các khoảng chi
                        </p>
                        <div className="flex flex-col w-full gap-4 mt-5">
                          {Object.keys(drawerData).map((key) => {
                            if (
                              !Array.isArray(drawerData[key]) &&
                              !drawerData[key]
                            )
                              return null;

                            const total = drawerData[key].reduce((acc, cur) => {
                              switch (key) {
                                case "menu":
                                  return (
                                    acc +
                                    cur?.price *
                                      Math.ceil(watch("partySize") / 10)
                                  );
                                  break;

                                case "beaverages":
                                  return acc + cur?.price * cur?.quantity;
                                  break;

                                default:
                                  return acc + cur?.price;
                                  break;
                              }
                            }, 0);

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
                      type="submit"
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
    </form>
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
