"use client";
import ButtonDiscover from "@/app/_components/ButtonDiscover";
import MultiCarousel from "@/app/_components/MultiCarouselSlider";
import ScrollFullPage from "@/app/_components/ScrollFullPage";
import TextFade from "@/app/_components/TextFade";
import { Image } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import "@/app/_styles/index.css";
import IconButton from "@/app/_components/IconButton";

const events = [
  [
    {
      id: 1,
      content: "MÀN CHÀO SÂN ĐẦY MẠNH MẼ VÀ ẤN TƯỢNG CỦA SUZUKI XL7 HYBRID",
      urlImage: "/images-client/events/fev.jpg",
    },
    {
      id: 2,
      content:
        "KHI SẮC TRẮNG THANH KHIẾT TÔ ĐIỂM CHO KHÔNG GIAN CƯỚI NGHỆ THUẬT CỦA WHITE PALACE PHẠM VĂN ĐỒNG",
      urlImage: "/images-client/events/46-1.jpg",
    },
    {
      id: 3,
      content:
        "ĐẠI HỘI ĐẠI BIỂU LẦN IX CỦA HAWA: WHITE PALACE PHẠM VĂN ĐỒNG ĐÓN TIẾP CỘNG ĐỒNG DOANH NGHIỆP NGÀNH GỖ VÀ MỸ NGHỆ",
      urlImage: "/images-client/events/HAWA62.jpg",
    },
  ],
  [
    {
      id: 1,
      content:
        "SOCIAL & AFFILIATE GLOBAL SUMMIT 2024: SỰ KIỆN LỚN NHẤT NĂM CHO CỘNG ĐỒNG DOANH NGHIỆP VÀ PUBLISHER/KOC",
      urlImage: "/images-client/events/SAGS-64-1.jpg",
    },
    {
      id: 2,
      content:
        "NGÀY HỘI NAILS DAY 2024: SỰ KIỆN ĐẲNG CẤP QUY TỤ HÀNG NGHÌN NGƯỜI YÊU NAIL TRÊN KHẮP VIỆT NAM",
      urlImage: "/images-client/events/NDKP-138.jpg",
    },
    {
      id: 3,
      content:
        "TIỆC THÔI NÔI TẠI SẢNH SERENE – LỜI CHÚC BÌNH AN CHO BÉ TRONG CỘT MỐC ĐẦU ĐỜI",
      urlImage: "/images-client/events/evr.jpg",
    },
  ],
];
const textContainerVariants = {
  hidden: { opacity: 0, y: 400 },
  visible: {
    opacity: 1,
    y: 200,
    transition: {
      duration: 1.5,
      ease: "easeIn",
    },
  },
};
const Test = () => {
  const [timeAutoPlay, setTimeAutoPlay] = useState(false);
  const containerRef = useRef(null);
  const middleDivRef = useRef(null);
  const delay = () => {
    setTimeout(() => {
      setTimeAutoPlay(true);
    }, 5000);
  };
  useEffect(() => {
    delay();
    if (middleDivRef.current) {
      middleDivRef.current.scrollIntoView({
        block: "center", // Đặt phần tử giữa ở giữa
        behavior: "smooth", // Cuộn mượt mà
      });
    }
  }, []);
  return (
    <ScrollFullPage>
      <section
        className="section w-screen relative flex flex-row gap-28"
        id="section-event"
      >
        <div className="w-[50%] h-screen relative flex justify-center items-center pl-20">
          <Image
            src="/decor-cover.png"
            className="absolute top-1/2 -translate-y-1/2 -left-[50%] translate-x-[50%] object-cover"
            h={"60vh"}
            w={"auto"}
            alt=""
          />
          <div className="flex flex-col gap-14 z-10">
            <span className="uppercase text-gold font-bold text-[4em] leading-[64px] w-[80%]">
              TIN TỨC & SỰ KIỆN MỚI NHẤT
            </span>
            <span className="leading-[150%] font-normal text-[18px] w-[85%]">
              Cảm ơn quý khách đã ghé thăm chuyên mục tin tức của chúng tôi.Tại
              đây, quý khách có thể cập nhật những tin tức mới nhất,điểm lại
              những sự kiện nổi bật nhất tại White Palace vàkhám phá những ưu
              đãi đặc biệt dành cho sự kiện của bạn.
            </span>
            <ButtonDiscover className={"w-[20%]"} />
          </div>
        </div>
        <div className="w-[50%] h-screen pr-20 pt-[100px] pb-[40px] flex gap-6">
          {/*  */}
          {events.map((event, index) => (
            <div
              key={index}
              ref={containerRef}
              className="section-event-listCard w-[calc(50%-12px)] h-[100%] flex flex-col gap-6 overflow-y-scroll cursor-pointer"
            >
              <div className="w-full h-[65%] flex-shrink-0 bg-black">
                {/* <div className={`bg-[url(${event.urlImage})]`}></div> */}
              </div>
              <div
                ref={middleDivRef}
                className="w-full h-[65%] flex-shrink-0 bg-red-500"
              ></div>
              <div className="w-full h-[65%] flex-shrink-0 bg-blue-500"></div>
            </div>
          ))}
        </div>
      </section>
      <section className="section w-screen h-screen">
        <IconButton className="!border !border-white">kaka</IconButton>
      </section>
    </ScrollFullPage>
  );
};

export default Test;
