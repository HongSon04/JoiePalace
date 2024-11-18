"use client";
import ButtonDiscover from "@/app/_components/ButtonDiscover";
import Footer from "@/app/_components/FooterClient";
import IconButton from "@/app/_components/IconButton";
import SelectedProduct from "@/app/_components/SelectedProduct";
import { API_CONFIG } from "@/app/_utils/api.config";
import { CONFIG } from "@/app/_utils/config";
import { AnimatePresence, motion } from "framer-motion";
import {
  Drawer,
  DrawerBody,
  Button,
  Tooltip,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Image,
  useDisclosure,
} from "@chakra-ui/react";
import {
  ArrowRightIcon,
  Bars3Icon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import { IoSaveOutline } from "react-icons/io5";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useReducer, useRef, useState } from "react";
import { getPackageBySlug } from "@/app/_services/packageServices";
import Loading from "@/app/loading";
import { getDecorById } from "@/app/_services/decorServices";
import { getMenuById } from "@/app/_services/menuServices";
import { getCakeWedding } from "@/app/_services/otherServices";
import { getProductById } from "@/app/_services/productsServices";
import { getStageById } from "@/app/_services/stageServices";
import Link from "next/link";

const listSpaces = [
  {
    id: 0,
    name: "Space 1",
    url: "https://i.pinimg.com/736x/42/d8/ea/42d8eaa1d9228f748c61c7d0db2c5c62.jpg",
  },
  {
    id: 1,
    name: "Space 1",
    url: "https://i.pinimg.com/736x/42/d8/ea/42d8eaa1d9228f748c61c7d0db2c5c62.jpg",
  },
  {
    id: 2,
    name: "Space 1",
    url: "https://i.pinimg.com/736x/42/d8/ea/42d8eaa1d9228f748c61c7d0db2c5c62.jpg",
  },
  {
    id: 3,
    name: "Space 1",
    url: "https://i.pinimg.com/736x/42/d8/ea/42d8eaa1d9228f748c61c7d0db2c5c62.jpg",
  },
  {
    id: 4,
    name: "Space 1",
    url: "https://i.pinimg.com/736x/42/d8/ea/42d8eaa1d9228f748c61c7d0db2c5c62.jpg",
  },
];
// const categories = [
//   {
//     id: 1,
//     name: "Sảnh tiệc",
//     products: [
//       {
//         id: "st1",
//         name: "Sảnh tiệc 1",
//         price: 1000000,
//         image: CONFIG.IMAGE_UPLOADER_PLACEHOLDER,
//       },
//       {
//         id: "st2",
//         name: "Sảnh tiệc 2",
//         price: 2000000,
//         image: CONFIG.IMAGE_UPLOADER_PLACEHOLDER,
//       },
//       {
//         id: "st3",
//         name: "Sảnh tiệc 3",
//         price: 3000000,
//         image: CONFIG.IMAGE_UPLOADER_PLACEHOLDER,
//       },
//       {
//         id: "st4",
//         name: "Sảnh tiệc 4",
//         price: 4000000,
//         image: CONFIG.IMAGE_UPLOADER_PLACEHOLDER,
//       },
//       {
//         id: "st5",
//         name: "Sảnh tiệc 5",
//         price: 5000000,
//         image: CONFIG.IMAGE_UPLOADER_PLACEHOLDER,
//       },
//       {
//         id: "st6",
//         name: "Sảnh tiệc 6",
//         price: 6000000,
//         image: CONFIG.IMAGE_UPLOADER_PLACEHOLDER,
//       },
//     ],
//   },
//   {
//     id: 2,
//     name: "Trang trí",
//     products: [
//       {
//         id: "tt1",
//         name: "Trang trí 1",
//         price: 1000000,
//         image: CONFIG.IMAGE_UPLOADER_PLACEHOLDER,
//       },
//       {
//         id: "tt2",
//         name: "Trang trí 2",
//         price: 2000000,
//         image: CONFIG.IMAGE_UPLOADER_PLACEHOLDER,
//       },
//       {
//         id: "tt3",
//         name: "Trang trí 3",
//         price: 3000000,
//         image: CONFIG.IMAGE_UPLOADER_PLACEHOLDER,
//       },
//       {
//         id: "tt4",
//         name: "Trang trí 4",
//         price: 4000000,
//         image: CONFIG.IMAGE_UPLOADER_PLACEHOLDER,
//       },
//       {
//         id: "tt5",
//         name: "Trang trí 5",
//         price: 5000000,
//         image: CONFIG.IMAGE_UPLOADER_PLACEHOLDER,
//       },
//       {
//         id: "tt6",
//         name: "Trang trí 6",
//         price: 6000000,
//         image: CONFIG.IMAGE_UPLOADER_PLACEHOLDER,
//       },
//     ],
//   },
//   {
//     id: 3,
//     name: "Sân khấu",
//     products: [
//       {
//         id: "sk1",
//         name: "Sân khấu 1",
//         price: 1000000,
//         image: CONFIG.IMAGE_UPLOADER_PLACEHOLDER,
//       },
//       {
//         id: "sk2",
//         name: "Sân khấu 2",
//         price: 2000000,
//         image: CONFIG.IMAGE_UPLOADER_PLACEHOLDER,
//       },
//       {
//         id: "sk3",
//         name: "Sân khấu 3",
//         price: 3000000,
//         image: CONFIG.IMAGE_UPLOADER_PLACEHOLDER,
//       },
//       {
//         id: "sk4",
//         name: "Sân khấu 4",
//         price: 4000000,
//         image: CONFIG.IMAGE_UPLOADER_PLACEHOLDER,
//       },
//       {
//         id: "sk5",
//         name: "Sân khấu 5",
//         price: 5000000,
//         image: CONFIG.IMAGE_UPLOADER_PLACEHOLDER,
//       },
//       {
//         id: "sk6",
//         name: "Sân khấu 6",
//         price: 6000000,
//         image: CONFIG.IMAGE_UPLOADER_PLACEHOLDER,
//       },
//     ],
//   },
//   {
//     id: 4,
//     name: "Bánh cưới",
//     products: [
//       {
//         id: "bc1",
//         name: "Bánh cưới 1",
//         price: 1000000,
//         image: CONFIG.IMAGE_UPLOADER_PLACEHOLDER,
//       },
//       {
//         id: "bc2",
//         name: "Bánh cưới 2",
//         price: 2000000,
//         image: CONFIG.IMAGE_UPLOADER_PLACEHOLDER,
//       },
//       {
//         id: "bc3",
//         name: "Bánh cưới 3",
//         price: 3000000,
//         image: CONFIG.IMAGE_UPLOADER_PLACEHOLDER,
//       },
//       {
//         id: "bc4",
//         name: "Bánh cưới 4",
//         price: 4000000,
//         image: CONFIG.IMAGE_UPLOADER_PLACEHOLDER,
//       },
//       {
//         id: "bc5",
//         name: "Bánh cưới 5",
//         price: 5000000,
//         image: CONFIG.IMAGE_UPLOADER_PLACEHOLDER,
//       },
//       {
//         id: "bc6",
//         name: "Bánh cưới 6",
//         price: 6000000,
//         image: CONFIG.IMAGE_UPLOADER_PLACEHOLDER,
//       },
//     ],
//   },
//   {
//     id: 5,
//     name: "Thực đơn",
//     products: [
//       {
//         id: "td1",
//         name: "Thực đơn 1",
//         price: 1000000,
//         image: CONFIG.IMAGE_UPLOADER_PLACEHOLDER,
//       },
//       {
//         id: "td2",
//         name: "Thực đơn 2",
//         price: 2000000,
//         image: CONFIG.IMAGE_UPLOADER_PLACEHOLDER,
//       },
//       {
//         id: "td3",
//         name: "Thực đơn 3",
//         price: 3000000,
//         image: CONFIG.IMAGE_UPLOADER_PLACEHOLDER,
//       },
//       {
//         id: "td4",
//         name: "Thực đơn 4",
//         price: 4000000,
//         image: CONFIG.IMAGE_UPLOADER_PLACEHOLDER,
//       },
//       {
//         id: "td5",
//         name: "Thực đơn 5",
//         price: 5000000,
//         image: CONFIG.IMAGE_UPLOADER_PLACEHOLDER,
//       },
//       {
//         id: "td6",
//         name: "Thực đơn 6",
//         price: 6000000,
//         image: CONFIG.IMAGE_UPLOADER_PLACEHOLDER,
//       },
//     ],
//   },
//   {
//     id: 6,
//     name: "Dịch vụ khác",
//     products: [
//       {
//         id: "dv1",
//         name: "Dịch vụ 1",
//         price: 1000000,
//         image: CONFIG.IMAGE_UPLOADER_PLACEHOLDER,
//       },
//       {
//         id: "dv2",
//         name: "Dịch vụ 2",
//         price: 2000000,
//         image: CONFIG.IMAGE_UPLOADER_PLACEHOLDER,
//       },
//       {
//         id: "dv3",
//         name: "Dịch vụ 3",
//         price: 3000000,
//         image: CONFIG.IMAGE_UPLOADER_PLACEHOLDER,
//       },
//       {
//         id: "dv4",
//         name: "Dịch vụ 4",
//         price: 4000000,
//         image: CONFIG.IMAGE_UPLOADER_PLACEHOLDER,
//       },
//       {
//         id: "dv5",
//         name: "Dịch vụ 5",
//         price: 5000000,
//         image: CONFIG.IMAGE_UPLOADER_PLACEHOLDER,
//       },
//       {
//         id: "dv6",
//         name: "Dịch vụ 6",
//         price: 6000000,
//         image: CONFIG.IMAGE_UPLOADER_PLACEHOLDER,
//       },
//     ],
//   },
// ];
const arrayMenus = [
  { id: 1, name: "Món chính", slug: "mon-chinh" },
  { id: 2, name: "Món khai vị", slug: "mon-khai-vi" },
  { id: 3, name: "Món tráng miệng", slug: "mon-trang-mieng" },
  { id: 4, name: "Đồ uống", slug: "nuoc-uong" },
];

const Page = () => {
  const router = useRouter();
  const { slug } = useParams();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const drawerStriggerRef = useRef();
  const [isExpanded, setIsExpanded] = useState(false);
  const [optionIndex, setOptionIndex] = useState(0);
  const [dataPackage, setDataPackage] = useState(null);
  const [dataToShow, setDataToShow] = useState(null);
  const [dataAll, setDataAll] = useState(null);
  const [dataOtherService, setDataOtherService] = useState(null);
  const [categories, setCategories] = useState(null);

  useEffect(() => {
    const fecthData = async () => {
      const data = await getPackageBySlug(slug);
      setDataPackage(data.data[0]);
      const hall = await getStageById(data.data[0].stage_id || 42);
      const decor = await getDecorById(data.data[0].decor_id);
      const stage = await getProductById(
        JSON.parse(data.data[0].other_service)[0].id
      );
      const cake = await getCakeWedding(
        JSON.parse(data.data[0].other_service)[1]?.id
      );
      const menu = await getMenuById(data.data[0].menu_id);
      // other services call api
      const otherServices = [JSON.parse(data.data[0].other_service).slice(2)];
      const idOtherServices = otherServices[0].map((service) => service.id);

      const productPromises = idOtherServices.map((id) => getProductById(id));
      const otherServiceData = await Promise.all(productPromises);
      setDataOtherService(otherServiceData);

      // set new data for detail package
      const newData = {
        hall: hall[0],
        decor: decor[0],
        stage: stage[0],
        cake: cake[0],
        menu: menu[0],
      };
      setDataAll(newData);
      setDataToShow(newData?.hall);
      setCategories([
        {
          id: 1,
          name: "Sảnh tiệc",
          products: [
            {
              id: `st${newData?.hall?.id}`,
              name: newData?.hall?.name,
              price: newData?.hall?.price,
              image: newData?.hall?.images[0],
            },
          ],
        },
        {
          id: 2,
          name: "Trang trí",
          products: [
            newData?.decor?.products?.flatMap((item, index) => {
              return {
                id: `tt${item?.id}`,
                name: item?.name,
                price: item?.price,
                image: item?.images[0],
              };
            })[0],
          ],
        },
        {
          id: 3,
          name: "Sân khấu",
          products: [
            {
              id: `sk${newData?.stage?.id}`,
              name: newData?.stage?.name,
              price: newData?.stage?.price,
              image: newData?.stage?.images[0],
            },
          ],
        },
        {
          id: 4,
          name: "Bánh cưới",
          products: [
            {
              id: `bc${newData?.cake?.id}`,
              name: newData?.cake?.name,
              price: newData?.cake?.price,
              image: newData?.cake?.images[0],
            },
          ],
        },
        {
          id: 5,
          name: "Thực đơn",
          products: arrayMenus?.flatMap((menu) => {
            return newData?.menu?.products[menu.slug]?.flatMap((item) => {
              return {
                id: `td${item?.id}`,
                name: item?.name,
                price: item?.price,
                image: item?.images[0],
              };
            });
          }),
        },
        {
          id: 6,
          name: "Dịch vụ khác",
          products: otherServiceData.flatMap((sevice, index) => {
            return sevice.flatMap((item, index) => {
              return {
                id: `dvk${item?.id}`,
                name: item?.name,
                price: item?.price,
                image: item?.images[0],
              };
            });
          }),
        },
      ]);
    };
    fecthData();
  }, [slug]);

  if (!dataPackage && !dataToShow && !categories) return <Loading></Loading>;
  console.log(dataToShow);

  return (
    <>
      <div className="w-full px-48">
        <section className="w-full h-screen pt-[150px] pb-[60px] flex justify-between items-center relative z-10">
          <div className="w-2/5 h-auto flex flex-col gap-8 z-10">
            <small className="text-gold text-base font-normal leading-6">
              {dataPackage.short_description}
            </small>
            <h1 className="uppercase text-gold text-5xl font-semibold leading-[68px]">
              {dataPackage.name}
            </h1>
            <p className="text-base font-normal leading-6">
              {dataPackage.description}
            </p>
            <div className="w-full h-auto flex gap-3">
              <Link
                href={`/client/lien-he?package_id=${dataPackage.id}`}
                className="w-auto h-auto hover:text-white"
              >
                <ButtonDiscover className="px-10" name={"LIÊN HỆ NGAY"} />
              </Link>

              {/* <IconButton className="w-fit px-4 z-10">TẠO NGAY</IconButton> */}
            </div>
          </div>
          <div className="w-2/5 h-full overflow-hidden">
            <Image
              src="https://wallpapers.com/images/hd/wedding-aesthetic-reception-iie309969jsfu8zp.jpg"
              className="w-full h-full object-cover"
              alt=""
            />
          </div>
          <div className="overflow-hidden absolute left-[-13%] z-[0]">
            <Image
              src="/image21.png"
              className="w-full h-full object-cover"
              alt=""
            />
          </div>
        </section>
        <section className="w-full py-[60px] min-h-screen flex flex-col items-center gap-8">
          <div className="flex w-fit justify-center gap-4 py-2 px-4 items-center rounded-full bg-whiteAlpha-50">
            <span
              onClick={() => {
                setOptionIndex(0);
                setDataToShow(dataAll.hall);
              }}
              className={`text-base font-semibold leading-8 ${
                optionIndex === 0 ? "bg-gold" : "opacity-50"
              } flex py-2 px-6 justify-center items-center rounded-full cursor-pointer transition duration-300`}
            >
              SẢNH TIỆC
            </span>
            <span
              onClick={() => {
                setOptionIndex(1);
                setDataToShow([
                  { name: "Trang trí", data: dataAll?.decor?.products },
                  { name: "Sân khấu", data: dataAll?.stage },
                  { name: "Bánh cưới", data: dataAll?.cake },
                ]);
              }}
              className={`text-base font-semibold leading-8 ${
                optionIndex === 1 ? "bg-gold" : "opacity-50"
              } flex py-2 px-6 justify-center items-center rounded-full cursor-pointer transition duration-300`}
            >
              LỄ
            </span>
            <span
              onClick={() => {
                setOptionIndex(2);
                setDataToShow({
                  name: dataAll.menu.name,
                  data: dataAll.menu.products,
                });
              }}
              className={`text-base font-semibold leading-8 ${
                optionIndex === 2 ? "bg-gold" : "opacity-50"
              } flex py-2 px-6 justify-center items-center rounded-full cursor-pointer transition duration-300`}
            >
              THỰC ĐƠN
            </span>
            <span
              onClick={() => {
                setOptionIndex(3);
                setDataToShow(dataOtherService);
              }}
              className={`text-base font-semibold leading-8 ${
                optionIndex === 3 ? "bg-gold" : "opacity-50"
              } flex py-2 px-6 justify-center items-center rounded-full cursor-pointer transition duration-300`}
            >
              DỊCH VỤ KHÁC
            </span>
            <button
              ref={drawerStriggerRef}
              onClick={onOpen}
              className="bg-gold w-12 h-12 rounded-full flex justify-center items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="21"
                height="20"
                viewBox="0 0 21 20"
                fill="none"
              >
                <path d="M18 2.5H3V4.16667H18V2.5Z" fill="white" />
                <path d="M18 15.8333H3V17.5H18V15.8333Z" fill="white" />
                <path d="M18 9.16667H3V10.8333H18V9.16667Z" fill="white" />
              </svg>
            </button>
          </div>
          <div className="w-full flex gap-5">
            <div className="bg-whiteAlpha-50 flex flex-col gap-4 p-5 rounded-2xl w-1/3 h-[70vh]">
              <span className="text-sm font-semibold leading-5">Ghi chú</span>
              <textarea
                name=""
                id=""
                className="rounded-2xl border border-1-white resize-none w-full h-full p-2"
              ></textarea>
            </div>
            <div className="w-2/3 h-full  flex flex-col gap-3 relative">
              <div className="flex gap-3 items-center">
                <span className="text-3xl font-bold">{dataToShow?.name}</span>
              </div>
              <span className="text-sm font-normal">
                {dataToShow?.description}
              </span>
              <div className="w-full flex flex-wrap gap-4">
                {optionIndex === 0 ? (
                  <div className="w-[calc(25%-16px)] aspect-w-1 aspect-h-1 p-2 gap-3 flex flex-col rounded-lg cursor-pointer">
                    <div className="overflow-hidden h-[150px] max-h-[150px] rounded-lg">
                      <Image
                        src={dataToShow?.images[0]}
                        className="w-full h-full object-cover"
                        alt={dataToShow?.name || ""}
                      />
                    </div>
                    <span className="text-sm font-normal">
                      {dataToShow?.name}
                    </span>
                  </div>
                ) : optionIndex === 1 ? (
                  <div className="w-full h-full  flex flex-col gap-3 relative">
                    {dataToShow.map((item, index) => (
                      <>
                        <div className="flex gap-3 items-center">
                          <span className="text-3xl font-bold">
                            {item?.name}
                          </span>
                        </div>
                        <div className="w-full flex flex-wrap gap-4">
                          {index === 0 ? (
                            item?.data?.map((key, index) => (
                              <div
                                key={index}
                                className="w-[calc(25%-16px)] aspect-w-1 aspect-h-1 p-2 gap-3 flex flex-col rounded-lg cursor-pointer"
                              >
                                <div className="overflow-hidden h-[100%] max-h-[150px] rounded-lg">
                                  <Image
                                    src={key?.images[0]}
                                    className="w-full h-full object-cover"
                                    alt={""}
                                  />
                                </div>
                                <span className="text-sm font-normal">
                                  {key?.name}
                                </span>
                              </div>
                            ))
                          ) : (
                            <div className="w-[calc(25%-16px)] aspect-w-1 aspect-h-1 p-2 gap-3 flex flex-col rounded-lg cursor-pointer">
                              <div className="overflow-hidden h-[100%] max-h-[150px] rounded-lg">
                                <Image
                                  src={item?.data?.images[0]}
                                  className="w-full h-full object-cover"
                                  alt={""}
                                />
                              </div>
                              <span className="text-sm font-normal">
                                {item?.data?.name}
                              </span>
                            </div>
                          )}
                        </div>
                      </>
                    ))}
                  </div>
                ) : optionIndex === 2 ? (
                  <div className="w-full h-full  flex flex-col gap-3 relative">
                    <>
                      <div className="w-full flex flex-col flex-wrap gap-6">
                        {arrayMenus.map((menu, index) => (
                          <div key={menu?.id} className="flex flex-col gap-4">
                            <h2 className="text-lg">{menu?.name}</h2>
                            <div className="flex gap-4 flex-wrap">
                              {dataToShow?.data[menu.slug]?.map((item) => (
                                <div
                                  key={item?.id}
                                  className={`w-[calc(25%-16px)] aspect-w-1 aspect-h-1 p-2 gap-3 flex flex-col rounded-lg cursor-pointer`}
                                >
                                  <div className="overflow-hidden h-[150px] max-h-[150px] rounded-lg">
                                    <Image
                                      src={item?.images[0]}
                                      className="w-full h-full object-cover"
                                      alt={item?.name || ""}
                                    />
                                  </div>
                                  <span className="text-sm font-normal">
                                    {item?.name}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  </div>
                ) : (
                  <div className="w-full flex flex-wrap gap-4">
                    {dataToShow?.map((item, index) => (
                      <div
                        key={item[0]?.id}
                        className={`w-[calc(25%-16px)] p-2 gap-3 flex flex-col rounded-lg cursor-pointer`}
                      >
                        <div className="overflow-hidden h-[100%] max-h-[150px] rounded-lg">
                          <Image
                            src={item[0]?.images[0]}
                            className="w-full h-full object-cover"
                            alt={item[0]?.name || ""}
                          />
                        </div>
                        <span className="text-sm font-normal">
                          {item[0]?.name}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="w-full bottom-0 flex justify-end">
                <Link
                  href={`/client/lien-he?package_id=${dataPackage.id}`}
                  className="w-auto h-auto hover:text-white"
                >
                  <ButtonDiscover name={"Liên hệ ngay"} className="px-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>
        <section>
          <Footer />
        </section>
        c
      </div>
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
            {categories?.map((category, i) => (
              <div key={category.id} className={`${i !== 0 ? "mt-5" : ""}`}>
                <h2 className="text-white font-semibold text-xl">
                  {category.name}
                </h2>
                <div className="flex flex-col gap-3 mt-3">
                  {category.products.map((product) => (
                    <SelectedProduct product={product} key={product.id} />
                  ))}
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
                  height: isExpanded ? "150px" : 0,
                  transform: isExpanded ? "translateY(0)" : "translateY(100px)",
                  opacity: isExpanded ? 1 : 0,
                  display: isExpanded ? "block" : "none",
                }}
                transition={{ duration: 0.3 }}
              >
                <motion.p animate={{ opacity: 1 }}>
                  <h4 className="text-xl">Các khoảng chi</h4>
                  <div className="flex flex-col w-full gap-4 mt-5">
                    {categories?.map((c) => {
                      const total = c.products.reduce(
                        (acc, cur) => acc + cur.price,
                        0
                      );

                      return (
                        <div
                          className="flex items-center justify-between"
                          key={c.id}
                        >
                          <span className="text-base">{c.name}</span>
                          <span className="text-base">
                            {total.toLocaleString("vn-VN")} VNĐ
                          </span>
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
                  <span className="text-white font-semibold text-xl mt-2">
                    {categories
                      ?.reduce(
                        (acc, cur) =>
                          acc +
                          cur.products.reduce((acc, cur) => acc + cur.price, 0),
                        0
                      )
                      .toLocaleString("vn-VN") + " VNĐ"}
                  </span>
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
              <Link href={`/client/lien-he?package_id=${dataPackage.id}`}>
                <Button
                  variant={"unstyled"}
                  className="!bg-gold hover:brightness-90 transition !rounded-full !text-white !px-8 !py-2 !w-full !flex !flex-center items-center gap-3 !font-normal group"
                  onClick={onClose}
                >
                  <ArrowRightIcon className="w-4 h-4 group-hover:animate-pulse !duration-300" />{" "}
                  Liên hệ ngay
                </Button>
              </Link>
            </div>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default Page;
