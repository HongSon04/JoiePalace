"use client";
import React, { useEffect, useCallback, useState } from "react";
import mouseIcon from "../../../public/mouse.svg";
import { motion } from "framer-motion";
import { Image } from "@chakra-ui/react";
import Footer from "@/app/_components/FooterClient";
import ButtonDiscover from "@/app/_components/ButtonDiscover";
import { CONFIG } from "@/app/_utils/config";
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
import Link from "next/link";
import dynamic from "next/dynamic";
import { fetchDecors } from "@/app/_lib/decors/decorsSlice";
import { useDispatch, useSelector } from "react-redux";
import ServiceItem from "../tao-combo/ServiceItem";


const CustomSliderMenu = dynamic(() => import("@/app/_components/CustomSliderMenu"), {
  ssr: false,
});

const ScrollFullPage = dynamic(() => import("@/app/_components/ScrollFullPage"), {
  ssr: false,
});

const isBrowser = typeof window !== "undefined";
const initialServiceState = {
  id: "",
  name: "",
  price: "",
  images: [CONFIG.DISH_IMAGE_PLACEHOLDER],
};

function Event() {
  const [decorId, setDecorId] = React.useState(initialServiceState);

  const dispatch = useDispatch();

  const { decors } = useSelector(
    (store) => store.decors
  );
  console.log('decors', decors);

  useEffect(() => {
    if (isBrowser) {
      console.log("Client-side logic here");
    }
    const fetchData = async () => {
      try {
        const result = await Promise.all([
          dispatch(fetchDecors({})).unwrap(),
        ]);
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="m-auto h-full" id="fullpage">
      <ScrollFullPage>
        <div className="section ">
          <section className="select-none flex max-h-screen justify-between items-start max-lg:pt-20 lg:px-[25px] xl:max-w-screen-xl m-auto">
            <div className="flex flex-col justify-center lg:h-screen z-10 max-lg:w-[75%] max-md:hidden">
              <Image
                className="w-full h-full object-cover"
                src="/trang-tri.png"
                alt=""
              />
            </div>
            <div className="flex flex-col mx-5 z-30 w-[400px] md:h-screen lg:justify-center max-sm:mx-2 ">
              <h1 className="text-gold mb-10 font-bold text-fade-in font-gilroy text-7xl max-xl:text-5xl max-sm:text-xl max-sm:mb-2 uppercase">
                Trang trí
              </h1>
              <p className="flex-wrap text-white text-fade-in text-base font-gilroy max-sm:text-[13px] max-sm:leading-6">
                Với phong cách thiết kế tinh tế và sự sáng tạo độc đáo, JOIE PALACE mang đến không gian trang trí hoàn hảo cho mọi sự kiện của bạn. Từ những buổi tiệc nhỏ như sinh nhật, thôi nôi đến các sự kiện lớn như tiệc cưới hay hội nghị doanh nghiệp, chúng tôi cam kết mang đến dịch vụ trang trí ấn tượng. Đội ngũ chuyên nghiệp của chúng tôi sẽ biến không gian của bạn thành một tác phẩm nghệ thuật, từ những chi tiết nhỏ nhất đến tổng thể, giúp bạn ghi dấu ấn trong lòng khách mời. Hãy để JOIE PALACE là điểm khởi đầu cho những ý tưởng trang trí tuyệt vời nhất của bạn!              </p>
            </div>
            <div className="bgYellow lg:before:h-screen w-[350px] mb:w-[250px] relative flex flex-col md:justify-center lg:h-full max-lg:pb-[100px]">
              <div className="max-lg:mt-[80px]">
                <div className="bg-gray-500 max-w-[55%] relative top-[20px] left-[20px] z-10">
                  <Image
                    className="w-full h-full object-cover"
                    src="/trang-tri4.png"
                    alt=""
                  />
                </div>
                <div className="bg-gray-400 max-w-[55%] relative top-[-30px] left-[35%] z-20">
                  <Image
                    className="w-full h-full object-cover"
                    src="/trang-tri2.png"
                    alt=""
                  />
                </div>
              </div>
            </div>
          </section>
          <div className="w-full h-auto absolute bottom-[10%] flex justify-center items-center max-lg:hidden">
            <motion.div
              animate={{
                y: [0, -20, 20, 10, 20, 15, 20],
              }}
              transition={{
                duration: 2,
                ease: "easeOut",
                repeat: Infinity,
                repeatType: "loop",
                repeatDelay: 0,
              }}
            >
              <Image src="/mouse.svg" alt="My Image" />
            </motion.div>
          </div>
        </div>

        <section className="section h-screen flex justify-center">
          <div className="flex flex-col gap-3 relativ mt-[100px]">
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
          </div>

        </section>
        <section className="section">
          <Footer />
        </section>
      </ScrollFullPage>
    </div>
  );
}

export default Event;
