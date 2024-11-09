"use client";

import ClientServiceCard from "@/app/_components/ClientServiceCard";
import Footer from "@/app/_components/FooterClient";
import FormInput from "@/app/_components/FormInput";
import SelectedProduct from "@/app/_components/SelectedProduct";
import {
  fetchingPartyTypesFailure,
  fetchingPartyTypesSuccess,
} from "@/app/_lib/features/partyTypes/partyTypesSlice";
import { fecthAllPartyTypes } from "@/app/_services/partyTypesServices";
import { CONFIG } from "@/app/_utils/config";
import Loading from "@/app/loading";
import pattern from "@/public/line-group.svg";
import {
  Button,
  Divider,
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
} from "@chakra-ui/react";
import {
  ArrowRightIcon,
  Bars3Icon,
  CheckIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import { zodResolver } from "@hookform/resolvers/zod";
import { Col, Row } from "antd";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { IoSaveOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { z } from "zod";

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

const schema = z.object({
  partyType: z.string().nonempty("Vui lòng chọn loại tiệc"),
  partySize: z.string().nonempty("Vui lòng chọn số lượng khách"),
  budget: z.string().nonempty("Vui lòng chọn mức dự chi"),
});

const categories = [
  {
    id: 1,
    name: "Sảnh tiệc",
    products: [
      {
        id: "st1",
        name: "Sảnh tiệc 1",
        price: 1000000,
        image: CONFIG.IMAGE_UPLOADER_PLACEHOLDER,
      },
      {
        id: "st2",
        name: "Sảnh tiệc 2",
        price: 2000000,
        image: CONFIG.IMAGE_UPLOADER_PLACEHOLDER,
      },
      {
        id: "st3",
        name: "Sảnh tiệc 3",
        price: 3000000,
        image: CONFIG.IMAGE_UPLOADER_PLACEHOLDER,
      },
      {
        id: "st4",
        name: "Sảnh tiệc 4",
        price: 4000000,
        image: CONFIG.IMAGE_UPLOADER_PLACEHOLDER,
      },
      {
        id: "st5",
        name: "Sảnh tiệc 5",
        price: 5000000,
        image: CONFIG.IMAGE_UPLOADER_PLACEHOLDER,
      },
      {
        id: "st6",
        name: "Sảnh tiệc 6",
        price: 6000000,
        image: CONFIG.IMAGE_UPLOADER_PLACEHOLDER,
      },
    ],
  },
  {
    id: 2,
    name: "Trang trí",
    products: [
      {
        id: "tt1",
        name: "Trang trí 1",
        price: 1000000,
        image: CONFIG.IMAGE_UPLOADER_PLACEHOLDER,
      },
      {
        id: "tt2",
        name: "Trang trí 2",
        price: 2000000,
        image: CONFIG.IMAGE_UPLOADER_PLACEHOLDER,
      },
      {
        id: "tt3",
        name: "Trang trí 3",
        price: 3000000,
        image: CONFIG.IMAGE_UPLOADER_PLACEHOLDER,
      },
      {
        id: "tt4",
        name: "Trang trí 4",
        price: 4000000,
        image: CONFIG.IMAGE_UPLOADER_PLACEHOLDER,
      },
      {
        id: "tt5",
        name: "Trang trí 5",
        price: 5000000,
        image: CONFIG.IMAGE_UPLOADER_PLACEHOLDER,
      },
      {
        id: "tt6",
        name: "Trang trí 6",
        price: 6000000,
        image: CONFIG.IMAGE_UPLOADER_PLACEHOLDER,
      },
    ],
  },
  {
    id: 3,
    name: "Sân khấu",
    products: [
      {
        id: "sk1",
        name: "Sân khấu 1",
        price: 1000000,
        image: CONFIG.IMAGE_UPLOADER_PLACEHOLDER,
      },
      {
        id: "sk2",
        name: "Sân khấu 2",
        price: 2000000,
        image: CONFIG.IMAGE_UPLOADER_PLACEHOLDER,
      },
      {
        id: "sk3",
        name: "Sân khấu 3",
        price: 3000000,
        image: CONFIG.IMAGE_UPLOADER_PLACEHOLDER,
      },
      {
        id: "sk4",
        name: "Sân khấu 4",
        price: 4000000,
        image: CONFIG.IMAGE_UPLOADER_PLACEHOLDER,
      },
      {
        id: "sk5",
        name: "Sân khấu 5",
        price: 5000000,
        image: CONFIG.IMAGE_UPLOADER_PLACEHOLDER,
      },
      {
        id: "sk6",
        name: "Sân khấu 6",
        price: 6000000,
        image: CONFIG.IMAGE_UPLOADER_PLACEHOLDER,
      },
    ],
  },
  {
    id: 4,
    name: "Bánh cưới",
    products: [
      {
        id: "bc1",
        name: "Bánh cưới 1",
        price: 1000000,
        image: CONFIG.IMAGE_UPLOADER_PLACEHOLDER,
      },
      {
        id: "bc2",
        name: "Bánh cưới 2",
        price: 2000000,
        image: CONFIG.IMAGE_UPLOADER_PLACEHOLDER,
      },
      {
        id: "bc3",
        name: "Bánh cưới 3",
        price: 3000000,
        image: CONFIG.IMAGE_UPLOADER_PLACEHOLDER,
      },
      {
        id: "bc4",
        name: "Bánh cưới 4",
        price: 4000000,
        image: CONFIG.IMAGE_UPLOADER_PLACEHOLDER,
      },
      {
        id: "bc5",
        name: "Bánh cưới 5",
        price: 5000000,
        image: CONFIG.IMAGE_UPLOADER_PLACEHOLDER,
      },
      {
        id: "bc6",
        name: "Bánh cưới 6",
        price: 6000000,
        image: CONFIG.IMAGE_UPLOADER_PLACEHOLDER,
      },
    ],
  },
  {
    id: 5,
    name: "Thực đơn",
    products: [
      {
        id: "td1",
        name: "Thực đơn 1",
        price: 1000000,
        image: CONFIG.IMAGE_UPLOADER_PLACEHOLDER,
      },
      {
        id: "td2",
        name: "Thực đơn 2",
        price: 2000000,
        image: CONFIG.IMAGE_UPLOADER_PLACEHOLDER,
      },
      {
        id: "td3",
        name: "Thực đơn 3",
        price: 3000000,
        image: CONFIG.IMAGE_UPLOADER_PLACEHOLDER,
      },
      {
        id: "td4",
        name: "Thực đơn 4",
        price: 4000000,
        image: CONFIG.IMAGE_UPLOADER_PLACEHOLDER,
      },
      {
        id: "td5",
        name: "Thực đơn 5",
        price: 5000000,
        image: CONFIG.IMAGE_UPLOADER_PLACEHOLDER,
      },
      {
        id: "td6",
        name: "Thực đơn 6",
        price: 6000000,
        image: CONFIG.IMAGE_UPLOADER_PLACEHOLDER,
      },
    ],
  },
  {
    id: 6,
    name: "Dịch vụ khác",
    products: [
      {
        id: "dv1",
        name: "Dịch vụ 1",
        price: 1000000,
        image: CONFIG.IMAGE_UPLOADER_PLACEHOLDER,
      },
      {
        id: "dv2",
        name: "Dịch vụ 2",
        price: 2000000,
        image: CONFIG.IMAGE_UPLOADER_PLACEHOLDER,
      },
      {
        id: "dv3",
        name: "Dịch vụ 3",
        price: 3000000,
        image: CONFIG.IMAGE_UPLOADER_PLACEHOLDER,
      },
      {
        id: "dv4",
        name: "Dịch vụ 4",
        price: 4000000,
        image: CONFIG.IMAGE_UPLOADER_PLACEHOLDER,
      },
      {
        id: "dv5",
        name: "Dịch vụ 5",
        price: 5000000,
        image: CONFIG.IMAGE_UPLOADER_PLACEHOLDER,
      },
      {
        id: "dv6",
        name: "Dịch vụ 6",
        price: 6000000,
        image: CONFIG.IMAGE_UPLOADER_PLACEHOLDER,
      },
    ],
  },
];

const listSpaces = [
  {
    id: 0,
    name: "Space 1",
    url: "https://i.pinimg.com/736x/42/d8/ea/42d8eaa1d9228f748c61c7d0db2c5c62.jpg",
    price: 1000000,
  },
  {
    id: 1,
    name: "Space 1",
    url: "https://i.pinimg.com/736x/42/d8/ea/42d8eaa1d9228f748c61c7d0db2c5c62.jpg",
    price: 2000000,
  },
  {
    id: 2,
    name: "Space 1",
    url: "https://i.pinimg.com/736x/42/d8/ea/42d8eaa1d9228f748c61c7d0db2c5c62.jpg",
    price: 3000000,
  },
  {
    id: 3,
    name: "Space 1",
    url: "https://i.pinimg.com/736x/42/d8/ea/42d8eaa1d9228f748c61c7d0db2c5c62.jpg",
    price: 4000000,
  },
  {
    id: 4,
    name: "Space 1",
    url: "https://i.pinimg.com/736x/42/d8/ea/42d8eaa1d9228f748c61c7d0db2c5c62.jpg",
    price: 5000000,
  },
];

const colors = [
  {
    id: "c1",
    name: "Trắng",
    color: "#fff",
  },
  {
    id: "c2",
    name: "Vàng gold",
    color: "#B5905B",
  },
  {
    id: "c3",
    name: "Xanh lá",
    color: "#4ADD80",
  },
  {
    id: "c4",
    name: "Teal",
    color: "#2DD3BE",
  },
];

const flowers = [
  {
    id: "fl1",
    name: "Hoa hồng",
    products: [
      {
        id: "hh1",
        name: "Hoa hồng đỏ",
        image:
          "https://i.pinimg.com/736x/42/d8/ea/42d8eaa1d9228f748c61c7d0db2c5c62.jpg",
        price: 2000000,
      },
      {
        id: "hh2",
        name: "Hoa hồng trắng",
        image:
          "https://i.pinimg.com/736x/42/d8/ea/42d8eaa1d9228f748c61c7d0db2c5c62.jpg",
        price: 2000000,
      },
      {
        id: "hh3",
        name: "Hoa hồng phấn",
        image:
          "https://i.pinimg.com/736x/42/d8/ea/42d8eaa1d9228f748c61c7d0db2c5c62.jpg",
        price: 2000000,
      },
      {
        id: "hh1",
        name: "Hoa hồng đỏ",
        image:
          "https://i.pinimg.com/736x/42/d8/ea/42d8eaa1d9228f748c61c7d0db2c5c62.jpg",
        price: 2000000,
      },
      {
        id: "hh2",
        name: "Hoa hồng trắng",
        image:
          "https://i.pinimg.com/736x/42/d8/ea/42d8eaa1d9228f748c61c7d0db2c5c62.jpg",
        price: 2000000,
      },
      {
        id: "hh3",
        name: "Hoa hồng phấn",
        image:
          "https://i.pinimg.com/736x/42/d8/ea/42d8eaa1d9228f748c61c7d0db2c5c62.jpg",
        price: 2000000,
      },
      {
        id: "hh1",
        name: "Hoa hồng đỏ",
        image:
          "https://i.pinimg.com/736x/42/d8/ea/42d8eaa1d9228f748c61c7d0db2c5c62.jpg",
        price: 2000000,
      },
      {
        id: "hh2",
        name: "Hoa hồng trắng",
        image:
          "https://i.pinimg.com/736x/42/d8/ea/42d8eaa1d9228f748c61c7d0db2c5c62.jpg",
        price: 2000000,
      },
      {
        id: "hh3",
        name: "Hoa hồng phấn",
        image:
          "https://i.pinimg.com/736x/42/d8/ea/42d8eaa1d9228f748c61c7d0db2c5c62.jpg",
        price: 2000000,
      },
    ],
  },
  {
    id: "fl2",
    name: "Cẩm tú cầu",
    products: [
      {
        id: "ctc1",
        name: "Cẩm tú cầu tím",
        image:
          "https://i.pinimg.com/736x/42/d8/ea/42d8eaa1d9228f748c61c7d0db2c5c62.jpg",
        price: 2000000,
      },
      {
        id: "ctc2",
        name: "Cẩm tú cầu trắng",
        image:
          "https://i.pinimg.com/736x/42/d8/ea/42d8eaa1d9228f748c61c7d0db2c5c62.jpg",
        price: 2000000,
      },
      {
        id: "ctc3",
        name: "Cẩm tú cầu hồng",
        image:
          "https://i.pinimg.com/736x/42/d8/ea/42d8eaa1d9228f748c61c7d0db2c5c62.jpg",
        price: 2000000,
      },
      {
        id: "ctc1",
        name: "Cẩm tú cầu tím",
        image:
          "https://i.pinimg.com/736x/42/d8/ea/42d8eaa1d9228f748c61c7d0db2c5c62.jpg",
        price: 2000000,
      },
      {
        id: "ctc2",
        name: "Cẩm tú cầu trắng",
        image:
          "https://i.pinimg.com/736x/42/d8/ea/42d8eaa1d9228f748c61c7d0db2c5c62.jpg",
        price: 2000000,
      },
      {
        id: "ctc3",
        name: "Cẩm tú cầu hồng",
        image:
          "https://i.pinimg.com/736x/42/d8/ea/42d8eaa1d9228f748c61c7d0db2c5c62.jpg",
        price: 2000000,
      },
      {
        id: "ctc1",
        name: "Cẩm tú cầu tím",
        image:
          "https://i.pinimg.com/736x/42/d8/ea/42d8eaa1d9228f748c61c7d0db2c5c62.jpg",
        price: 2000000,
      },
      {
        id: "ctc2",
        name: "Cẩm tú cầu trắng",
        image:
          "https://i.pinimg.com/736x/42/d8/ea/42d8eaa1d9228f748c61c7d0db2c5c62.jpg",
        price: 2000000,
      },
      {
        id: "ctc3",
        name: "Cẩm tú cầu hồng",
        image:
          "https://i.pinimg.com/736x/42/d8/ea/42d8eaa1d9228f748c61c7d0db2c5c62.jpg",
        price: 2000000,
      },
    ],
  },
];

function Page() {
  const [partySize, setPartySize] = React.useState("");
  const [budget, setBudget] = React.useState("");
  const [partyType, setPartyType] = React.useState("");
  const { partyTypes, isFetchingPartyTypes, isFetchingPartyTypesError } =
    useSelector((store) => store.partyTypes);
  const dispatch = useDispatch();
  const drawerStriggerRef = React.useRef();
  const router = useRouter();
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [spaceId, setSpaceId] = React.useState(null);
  const [colorId, setColorId] = React.useState(null);
  const [flowerId, setFlowerId] = React.useState(null);
  const [tabIndex, setTabIndex] = React.useState(0);
  const [note, setNote] = React.useState("");

  const handleFlowerChange = (e) => {
    setFlowerId(e.target.value);
  };

  const handleColorIdChange = (e) => {
    setTabIndex(e.target.value);
  };

  const handleTabChange = (tabIndex) => {
    setTabIndex(tabIndex);
  };

  const handleNextTab = () => {
    setTabIndex(tabIndex + 1);
  };

  const handleSpaceIndexChange = (e) => {
    setSpaceId(e.target.value);
  };

  // Drawer
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleNext = () => {
    router.push("/client/tao-combo#creator");
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm({
    resolver: zodResolver(schema),
  });

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fecthAllPartyTypes();
        dispatch(fetchingPartyTypesSuccess(data));
      } catch (error) {
        console.log(error);
        dispatch(fetchingPartyTypesFailure());
      }
    };

    fetchData();

    return () => {};
  }, [dispatch]);

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

  if (isFetchingPartyTypes) {
    return <Loading></Loading>;
  }

  return (
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
              Nắm bắt được tâm lý khách hàng, với tiêu chí “Tiện lợi- Nhanh gọn
              - Rõ ràng”, Joie Palace giới thiệu bộ công cụ tạo tiệc và dự chi
              hoàn toàn mới. Với mục tiêu mang đến cái nhìn tổng quát về những
              chi tiết, những thành phần cần thiết để tạo nên một bữa tiệc đang
              nhớ và thành công, chúng tôi ở đây để giúp bạn lựa chọn được những
              dịch vụ phù hợp với nhu cầu, cũng như đưa ra được con số hoàn hảo
              nhất, vừa vặn với tầm dự chi của bạn.
            </p>
          </Col>
          <Col span={12} className="flex justify-end">
            <form action="#" className="w-[400px]">
              {partyTypes && (
                <FormInput
                  register={register}
                  errors={errors}
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
                    ...partyTypes,
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
                  <NextButton onClick={handleNext} />
                </AnimatePresence>
              )}
            </form>
          </Col>
        </Row>
      </section>

      {/* COMBO SECTION */}
      <section id="creator" className="px-48 py-16 relative !font-gilroy">
        <Tabs
          variant={"unstyled"}
          position={"relative"}
          align="center"
          index={tabIndex}
          onChange={handleTabChange}
        >
          <TabList className="p-2 rounded-full bg-whiteAlpha-100 w-fit items-center gap-3">
            {categories.map((category) => (
              <Tab
                key={category.id}
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
          <TabPanels className="mt-6">
            {/* SẢNH PANEL */}
            <TabPanel>
              <div className="w-full flex gap-5">
                {/* NOTE AREA */}
                {renderNoteArea()}

                {/* PANEL MAIN */}
                <div className="w-2/3 h-full  flex flex-col gap-3 relative">
                  <div className="flex gap-3 items-center h-full relative">
                    <div className="shrink-0 w-1 h-full bg-gold absolute left-0 top-0 bottom-0"></div>
                    <span className="text-xl font-bold ml-4">Sảnh tiệc</span>
                  </div>
                  <span className="text-sm font-normal text-left">
                    Sảnh tiệc có sức chứa cho khoảng 100 khách
                  </span>
                  <div className="w-full flex flex-wrap gap-4">
                    {listSpaces.map((space, index) => (
                      <label
                        key={space.id}
                        className={`flex flex-col items-center gap-3 cursor-pointer p-3 rounded-lg ${
                          spaceId == space.id ? "bg-whiteAlpha-400" : ""
                        }`}
                      >
                        <input
                          type="radio"
                          name={"space"}
                          value={space.id}
                          checked={spaceId == space.id}
                          onChange={handleSpaceIndexChange}
                          className="hidden"
                        />
                        <div className="w-[110px] h-[100px] relative overflow-hidden rounded-lg">
                          <Image
                            fill
                            sizes="100px"
                            src={space.url}
                            alt={space.name}
                            className="object-cover"
                          />
                        </div>
                        <span className="text-white text-start w-full text-sm ">
                          {space.name}
                        </span>
                        <span className="text-white text-start w-full text-sm ">
                          {space.price.toLocaleString()} VNĐ
                        </span>
                      </label>
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
                          stroke-width="1.5"
                          stroke-miterlimit="10"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <path
                          d="M2.91797 10H16.943"
                          stroke="white"
                          stroke-width="1.5"
                          stroke-miterlimit="10"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                      <span className="text-sm leading-5 font-medium ">
                        Tiếp tục
                      </span>
                    </Button>
                  </div>
                </div>
              </div>
            </TabPanel>

            {/* TRANG TRÍ PANEL */}
            <TabPanel>
              <div className="w-full flex gap-5">
                {/* NOTE AREA */}
                {renderNoteArea()}

                <div className="w-2/3 h-full flex flex-col gap-5 relative">
                  {/* COLOR */}
                  <>
                    <div className="flex gap-3 items-center h-full relative">
                      <div className="shrink-0 w-1 h-full bg-gold absolute left-0 top-0 bottom-0"></div>
                      <span className="text-xl font-bold ml-4">
                        Màu sắc chủ đạo
                      </span>
                    </div>
                    <span className="text-sm font-normal text-left">
                      Joie Palace sẽ dựa trên màu sắc do quý khách chọn, để tạo
                      nên không gian ưng ý nhất
                    </span>
                    <div className="w-full flex flex-wrap gap-4">
                      {colors.map((color, index) => (
                        <label
                          key={color.id}
                          className={`flex flex-col items-center border-4 border-transparent gap-3 cursor-pointer rounded-lg`}
                        >
                          <div
                            className={`w-11 h-11 rounded-md`}
                            style={{
                              backgroundColor: color.color,
                              borderColor:
                                colorId == color.id ? "border-[#006FEE]" : "",
                            }}
                          ></div>
                          {colorId == color.id && (
                            <div className="flex flex-center rounded-[4px] absolute top-0 right-0">
                              <CheckIcon className="w-1 h-1 text-white" />
                            </div>
                          )}
                          <input
                            type="radio"
                            name={"color"}
                            value={color.id}
                            checked={colorId == color.id}
                            onChange={handleColorIdChange}
                            className="hidden"
                          />
                        </label>
                      ))}
                    </div>
                  </>

                  <Divider className="bg-whiteAlpha-50" />

                  {/* HOA */}
                  <>
                    <div className="flex gap-3 items-center h-full relative">
                      <div className="shrink-0 w-1 h-full bg-gold absolute left-0 top-0 bottom-0"></div>
                      <span className="text-xl font-bold ml-4">HOA</span>
                    </div>
                    <span className="text-sm font-normal text-left">
                      Chọn một loại hoa chủ đạo
                    </span>
                    {flowers.map((flower, index) => (
                      <div className="w-full flex flex-col" key={index}>
                        <h4 className="text-base text-left">
                          {index + 1}.{flower.name}
                        </h4>
                        <div className="overflow-x-auto w-full flex">
                          {flower.products.map((p) => (
                            <ClientServiceCard
                              name={"flower"}
                              service={p}
                              key={p.id}
                              state={flowerId}
                              onChange={handleFlowerChange}
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </>

                  {/* BUTTON */}
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
                          stroke-width="1.5"
                          stroke-miterlimit="10"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <path
                          d="M2.91797 10H16.943"
                          stroke="white"
                          stroke-width="1.5"
                          stroke-miterlimit="10"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                      <span className="text-sm leading-5 font-medium ">
                        Tiếp tục
                      </span>
                    </Button>
                  </div>
                </div>
              </div>
            </TabPanel>

            {/* SÂN KHẤU PANEL */}
            <TabPanel>
              <div className="w-full flex gap-5">
                {/* NOTE AREA */}
                {renderNoteArea()}

                <div className="w-2/3 h-full flex flex-col gap-5 relative">
                  {/* COLOR */}
                  <>
                    <div className="flex gap-3 items-center h-full relative">
                      <div className="shrink-0 w-1 h-full bg-gold absolute left-0 top-0 bottom-0"></div>
                      <span className="text-xl font-bold ml-4">
                        Màu sắc chủ đạo
                      </span>
                    </div>
                    <span className="text-sm font-normal text-left">
                      Joie Palace sẽ dựa trên màu sắc do quý khách chọn, để tạo
                      nên không gian ưng ý nhất
                    </span>
                    <div className="w-full flex flex-wrap gap-4">
                      {colors.map((color, index) => (
                        <label
                          key={color.id}
                          className={`flex flex-col items-center border-4 border-transparent gap-3 cursor-pointer rounded-lg`}
                        >
                          <div
                            className={`w-11 h-11 rounded-md`}
                            style={{
                              backgroundColor: color.color,
                              borderColor:
                                colorId == color.id ? "border-[#006FEE]" : "",
                            }}
                          ></div>
                          {colorId == color.id && (
                            <div className="flex flex-center rounded-[4px] absolute top-0 right-0">
                              <CheckIcon className="w-1 h-1 text-white" />
                            </div>
                          )}
                          <input
                            type="radio"
                            name={"color"}
                            value={color.id}
                            checked={colorId == color.id}
                            onChange={handleColorIdChange}
                            className="hidden"
                          />
                        </label>
                      ))}
                    </div>
                  </>

                  <Divider className="bg-whiteAlpha-50" />

                  {/* HOA */}
                  <>
                    <div className="flex gap-3 items-center h-full relative">
                      <div className="shrink-0 w-1 h-full bg-gold absolute left-0 top-0 bottom-0"></div>
                      <span className="text-xl font-bold ml-4">HOA</span>
                    </div>
                    <span className="text-sm font-normal text-left">
                      Chọn một loại hoa chủ đạo
                    </span>
                    {flowers.map((flower, index) => (
                      <div className="w-full flex flex-col" key={index}>
                        <h4 className="text-base text-left">
                          {index + 1}.{flower.name}
                        </h4>
                        <div className="overflow-x-auto w-full flex">
                          {flower.products.map((p) => (
                            <ClientServiceCard
                              name={"flower"}
                              service={p}
                              key={p.id}
                              state={flowerId}
                              onChange={handleFlowerChange}
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </>

                  {/* BUTTON */}
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
                          stroke-width="1.5"
                          stroke-miterlimit="10"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <path
                          d="M2.91797 10H16.943"
                          stroke="white"
                          stroke-width="1.5"
                          stroke-miterlimit="10"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                      <span className="text-sm leading-5 font-medium ">
                        Tiếp tục
                      </span>
                    </Button>
                  </div>
                </div>
              </div>
            </TabPanel>

            {/* BÁNH CƯỚI PANEL */}
            <TabPanel>
              <div className="w-full flex gap-5">
                {/* NOTE AREA */}
                {renderNoteArea()}

                <div className="w-2/3 h-full flex flex-col gap-5 relative">
                  {/* COLOR */}
                  <>
                    <div className="flex gap-3 items-center h-full relative">
                      <div className="shrink-0 w-1 h-full bg-gold absolute left-0 top-0 bottom-0"></div>
                      <span className="text-xl font-bold ml-4">
                        Màu sắc chủ đạo
                      </span>
                    </div>
                    <span className="text-sm font-normal text-left">
                      Joie Palace sẽ dựa trên màu sắc do quý khách chọn, để tạo
                      nên không gian ưng ý nhất
                    </span>
                    <div className="w-full flex flex-wrap gap-4">
                      {colors.map((color, index) => (
                        <label
                          key={color.id}
                          className={`flex flex-col items-center border-4 border-transparent gap-3 cursor-pointer rounded-lg`}
                        >
                          <div
                            className={`w-11 h-11 rounded-md`}
                            style={{
                              backgroundColor: color.color,
                              borderColor:
                                colorId == color.id ? "border-[#006FEE]" : "",
                            }}
                          ></div>
                          {colorId == color.id && (
                            <div className="flex flex-center rounded-[4px] absolute top-0 right-0">
                              <CheckIcon className="w-1 h-1 text-white" />
                            </div>
                          )}
                          <input
                            type="radio"
                            name={"color"}
                            value={color.id}
                            checked={colorId == color.id}
                            onChange={handleColorIdChange}
                            className="hidden"
                          />
                        </label>
                      ))}
                    </div>
                  </>

                  <Divider className="bg-whiteAlpha-50" />

                  {/* HOA */}
                  <>
                    <div className="flex gap-3 items-center h-full relative">
                      <div className="shrink-0 w-1 h-full bg-gold absolute left-0 top-0 bottom-0"></div>
                      <span className="text-xl font-bold ml-4">HOA</span>
                    </div>
                    <span className="text-sm font-normal text-left">
                      Chọn một loại hoa chủ đạo
                    </span>
                    {flowers.map((flower, index) => (
                      <div className="w-full flex flex-col" key={index}>
                        <h4 className="text-base text-left">
                          {index + 1}.{flower.name}
                        </h4>
                        <div className="overflow-x-auto w-full flex">
                          {flower.products.map((p) => (
                            <ClientServiceCard
                              name={"flower"}
                              service={p}
                              key={p.id}
                              state={flowerId}
                              onChange={handleFlowerChange}
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </>

                  {/* BUTTON */}
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
                          stroke-width="1.5"
                          stroke-miterlimit="10"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <path
                          d="M2.91797 10H16.943"
                          stroke="white"
                          stroke-width="1.5"
                          stroke-miterlimit="10"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                      <span className="text-sm leading-5 font-medium ">
                        Tiếp tục
                      </span>
                    </Button>
                  </div>
                </div>
              </div>
            </TabPanel>

            {/* THỰC ĐƠN PANEL */}
            <TabPanel>
              <div className="w-full flex gap-5">
                {/* NOTE AREA */}
                {renderNoteArea()}

                <div className="w-2/3 h-full flex flex-col gap-5 relative">
                  {/* COLOR */}
                  <>
                    <div className="flex gap-3 items-center h-full relative">
                      <div className="shrink-0 w-1 h-full bg-gold absolute left-0 top-0 bottom-0"></div>
                      <span className="text-xl font-bold ml-4">
                        Màu sắc chủ đạo
                      </span>
                    </div>
                    <span className="text-sm font-normal text-left">
                      Joie Palace sẽ dựa trên màu sắc do quý khách chọn, để tạo
                      nên không gian ưng ý nhất
                    </span>
                    <div className="w-full flex flex-wrap gap-4">
                      {colors.map((color, index) => (
                        <label
                          key={color.id}
                          className={`flex flex-col items-center border-4 border-transparent gap-3 cursor-pointer rounded-lg`}
                        >
                          <div
                            className={`w-11 h-11 rounded-md`}
                            style={{
                              backgroundColor: color.color,
                              borderColor:
                                colorId == color.id ? "border-[#006FEE]" : "",
                            }}
                          ></div>
                          {colorId == color.id && (
                            <div className="flex flex-center rounded-[4px] absolute top-0 right-0">
                              <CheckIcon className="w-1 h-1 text-white" />
                            </div>
                          )}
                          <input
                            type="radio"
                            name={"color"}
                            value={color.id}
                            checked={colorId == color.id}
                            onChange={handleColorIdChange}
                            className="hidden"
                          />
                        </label>
                      ))}
                    </div>
                  </>

                  <Divider className="bg-whiteAlpha-50" />

                  {/* HOA */}
                  <>
                    <div className="flex gap-3 items-center h-full relative">
                      <div className="shrink-0 w-1 h-full bg-gold absolute left-0 top-0 bottom-0"></div>
                      <span className="text-xl font-bold ml-4">HOA</span>
                    </div>
                    <span className="text-sm font-normal text-left">
                      Chọn một loại hoa chủ đạo
                    </span>
                    {flowers.map((flower, index) => (
                      <div className="w-full flex flex-col" key={index}>
                        <h4 className="text-base text-left">
                          {index + 1}.{flower.name}
                        </h4>
                        <div className="overflow-x-auto w-full flex">
                          {flower.products.map((p) => (
                            <ClientServiceCard
                              name={"flower"}
                              service={p}
                              key={p.id}
                              state={flowerId}
                              onChange={handleFlowerChange}
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </>

                  {/* BUTTON */}
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
                          stroke-width="1.5"
                          stroke-miterlimit="10"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <path
                          d="M2.91797 10H16.943"
                          stroke="white"
                          stroke-width="1.5"
                          stroke-miterlimit="10"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                      <span className="text-sm leading-5 font-medium ">
                        Tiếp tục
                      </span>
                    </Button>
                  </div>
                </div>
              </div>
            </TabPanel>

            {/* EXTRA SERVICES PANEL */}
            <TabPanel>
              <div className="w-full flex gap-5">
                {/* NOTE AREA */}
                {renderNoteArea()}

                <div className="w-2/3 h-full flex flex-col gap-5 relative">
                  {/* COLOR */}
                  <>
                    <div className="flex gap-3 items-center h-full relative">
                      <div className="shrink-0 w-1 h-full bg-gold absolute left-0 top-0 bottom-0"></div>
                      <span className="text-xl font-bold ml-4">
                        Màu sắc chủ đạo
                      </span>
                    </div>
                    <span className="text-sm font-normal text-left">
                      Joie Palace sẽ dựa trên màu sắc do quý khách chọn, để tạo
                      nên không gian ưng ý nhất
                    </span>
                    <div className="w-full flex flex-wrap gap-4">
                      {colors.map((color, index) => (
                        <label
                          key={color.id}
                          className={`flex flex-col items-center border-4 border-transparent gap-3 cursor-pointer rounded-lg`}
                        >
                          <div
                            className={`w-11 h-11 rounded-md`}
                            style={{
                              backgroundColor: color.color,
                              borderColor:
                                colorId == color.id ? "border-[#006FEE]" : "",
                            }}
                          ></div>
                          {colorId == color.id && (
                            <div className="flex flex-center rounded-[4px] absolute top-0 right-0">
                              <CheckIcon className="w-1 h-1 text-white" />
                            </div>
                          )}
                          <input
                            type="radio"
                            name={"color"}
                            value={color.id}
                            checked={colorId == color.id}
                            onChange={handleColorIdChange}
                            className="hidden"
                          />
                        </label>
                      ))}
                    </div>
                  </>

                  <Divider className="bg-whiteAlpha-50" />

                  {/* HOA */}
                  <>
                    <div className="flex gap-3 items-center h-full relative">
                      <div className="shrink-0 w-1 h-full bg-gold absolute left-0 top-0 bottom-0"></div>
                      <span className="text-xl font-bold ml-4">HOA</span>
                    </div>
                    <span className="text-sm font-normal text-left">
                      Chọn một loại hoa chủ đạo
                    </span>
                    {flowers.map((flower, index) => (
                      <div className="w-full flex flex-col" key={index}>
                        <h4 className="text-base text-left">
                          {index + 1}.{flower.name}
                        </h4>
                        <div className="overflow-x-auto w-full flex">
                          {flower.products.map((p) => (
                            <ClientServiceCard
                              name={"flower"}
                              service={p}
                              key={p.id}
                              state={flowerId}
                              onChange={handleFlowerChange}
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </>

                  {/* BUTTON */}
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
                          stroke-width="1.5"
                          stroke-miterlimit="10"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <path
                          d="M2.91797 10H16.943"
                          stroke="white"
                          stroke-width="1.5"
                          stroke-miterlimit="10"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                      <span className="text-sm leading-5 font-medium ">
                        Tiếp tục
                      </span>
                    </Button>
                  </div>
                </div>
              </div>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </section>

      <Footer></Footer>

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
          <DrawerHeader className="!text-white">Gói tiệc của bạn</DrawerHeader>
            
          <DrawerBody>
            {categories.map((category, i) => (
              <div key={category.id} className={`${i !== 0 ? "mt-5" : ""}`}>
                <h2 className="text-white font-semibold text-xl">
                  {category.name}
                </h2>
                <div className="flex flex-col gap-5 mt-5">
                  {category.products.map((product) => (
                    <SelectedProduct product={product} key={product.id} />
                  ))}
                </div>
                <Divider className="mt-5" />
                <div className="text-base font-semibold text-end text-white mt-3">
                  {category.products
                    .reduce((acc, cur) => acc + cur.price, 0)
                    .toLocaleString("vn-VN")}{" "}
                  VNĐ
                </div>
              </div>
            ))}
          </DrawerBody>

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
                  transform: isExpanded ? "translateY(0)" : "translateY(100px)",
                  opacity: isExpanded ? 1 : 0,
                  display: isExpanded ? "block" : "none",
                }}
                transition={{ duration: 0.3 }}
              >
                <motion.p animate={{ opacity: 1 }}>
                  <h4 className="text-xl">Các khoảng chi</h4>
                  <div className="flex flex-col w-full gap-4 mt-5">
                    {categories.map((c) => {
                      const total = c.products.reduce(
                        (acc, cur) => acc + cur.price,
                        0
                      );

                      return (
                        <div
                          className="flex items-center justify-between"
                          key={c.id}
                        >
                          <p className="text-base">{c.name}</p>
                          <p className="text-base">
                            {total.toLocaleString("vn-VN")} VNĐ
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </motion.p>
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
                    {categories
                      .reduce(
                        (acc, cur) =>
                          acc +
                          cur.products.reduce((acc, cur) => acc + cur.price, 0),
                        0
                      )
                      .toLocaleString("vn-VN") + " VNĐ"}
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
                onClick={onClose}
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
                onClick={onClose}
              >
                <ArrowRightIcon className="w-4 h-4 group-hover:animate-pulse !duration-300" />{" "}
                Tạo và liên hệ ngay
              </Button>
            </div>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
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
