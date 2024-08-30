"use client";
import { Image } from "@chakra-ui/react";
import { motion } from "framer-motion";
import ScrollFullPage from "@/app/_components/ScrollFullPage";
import Footer from "@/app/_components/FooterClient";
import TextFade from "@/app/_components/TextFade";
import MultiCarousel from "@/app/_components/MultiCarouselSlider";
import "@/app/_styles/index.css";
import { useEffect, useState } from "react";

const bannerImages = ["/banner.png", "/banner2.png"];
const locations = [
  {
    id: 1,
    name: "hoàng văn thụ",
    descriptoin: "Không gian tinh tế gợi mở sự sáng tạo",
  },
  {
    id: 2,
    name: "phạm văn đồng",
    descriptoin: "địa điểm xứng tầm cho sự kiện đỉnh cao",
  },
  {
    id: 3,
    name: "võ văn kiệt",
    descriptoin: "không gian duy mỹ nâng tầm sự kiện",
  },
];
const textContainerVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: -150,
    transition: {
      duration: 1.5,
      ease: "easeIn",
    },
  },
};
function Home() {
  const [timeAutoPlay, setTimeAutoPlay] = useState(false);
  const delay = () => {
    setTimeout(() => {
      setTimeAutoPlay(true);
    }, 5000);
  };
  useEffect(() => {
    delay();
  },[])
  return (
    <ScrollFullPage>
      <section className="section banner w-full h-screen relative top-0 left-0">
        <MultiCarousel
          removeArrowOnDeviceType={["tablet", "mobile", "desktop"]}
          autoplaySpeed={14000}
          transitionDuration={7000}
          customTransition={"transform 7000ms ease-in-out"}
          containerClass="w-screen"
          autoPlay={timeAutoPlay}
        >
          {bannerImages.map((image, index) => (
            <div key={index}>
              <Image w={"100vw"} h={"100vh"} src={image} alt="banner" />
            </div>
          ))}
        </MultiCarousel>
        <motion.div
          variants={textContainerVariants}
          initial="hidden"
          animate="visible"
          className="absolute top-1/2 -translate-y-1/2 flex flex-col gap-8 items-center"
        >
          <h1 className="text-6xl font-medium leading-[80px] text-center w-4/6">
            NƠI CỦA SỰ THANH LỊCH, <br />
            LÒNG HIẾU KHÁCH <br /> VÀ TINH THẦN DUY MỸ
          </h1>
          <span className="text-base font-normal leading-6 text-center w-[45%]">
            Được xây dựng và phát triển bởi IN Hospitality vào năm 2007, White
            Palace là thương hiệu đầu tiên tại Việt Nam mở ra mô hình trung tâm
            hội nghị và sự kiện. Với sự đầu tư bài bản và chuyên biệt cho các
            hội nghị và sự kiện cao cấp, White Palace luôn được chọn là địa điểm
            tổ chức của những hội nghị kinh tế lớn, những sự kiện văn hóa giải
            trí có tầm ảnh hưởng và yến tiệc đẳng cấp.
          </span>
        </motion.div>
        <div className="w-full h-auto absolute bottom-[10%] flex justify-center items-center">
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
      </section>
      <section className="section w-full h-full flex" id="section-location">
        <div className="w-[9%] h-screen flex justify-center items-center bg-gold shrink-0">
          <span className="h-auto uppercase -rotate-90 whitespace-nowrap font-bold text-5xl w-auto">
            địa điểm
          </span>
        </div>
        <div className="w-[91%] h-screen flex flex-col bg-white gap-[2px] overflow-hidden">
          {locations.map((location, index) => (
            <section
              key={location.id}
              className="location-section-item relative w-full h-1/3 bg-pink-100 hover:h-[95%] transition-all duration-500 overflow-hidden"
            >
              <div
                className={`location-image-bg absolute top-0 left-0 w-full h-full scale-150 pointer-events-none overflow-hidden`}
              >
                <Image
                  src={`/images-client/locations/venues-placeholder-${
                    index + 1
                  }-scaled.jpg`}
                  w={"100%"}
                  h={"100%"}
                  className="object-cover"
                  alt=""
                ></Image>
              </div>
              <div className="w-full h-full absolute top-0 left-0 z-[1] bg-blackAlpha-700 flex items-center pl-24">
                <TextFade
                  settings={{
                    hidden: { opacity: 0, x: 150 },
                    visible: {
                      opacity: 1,
                      x: 0,
                      transition: {
                        duration: 1.5,
                        ease: "easeIn",
                        delay: 0.5,
                      },
                    },
                  }}
                  replayEffect={false}
                >
                  <span className="location-name uppercase text-gold text-6xl font-normal leading-[80px] pointer-events-none">
                    {location.name}
                  </span>
                </TextFade>
                <div className="location-detail w-full h-full flex flex-col justify-between absolute top-0 left-0 pl-24 py-1">
                  <div className="flex flex-col gap-3">
                    <span className="uppercase text-5xl font-normal">
                      JOIE PALACE
                    </span>
                    <span className="uppercase text-2xl font-thin">
                      {location.name}
                    </span>
                  </div>
                  <div className="w-[50%]">
                    <span className="uppercase text-gold text-6xl font-normal leading-[80px]">
                      {location.descriptoin}
                    </span>
                  </div>
                  <button className="bg-gold flex justify-center items-center gap-1 px-6 h-12 w-[11%] rounded-3xl cursor-pointer">
                    <span className="text-lg">Khám phá</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 16 16"
                      fill="none"
                    >
                      <path
                        d="M7.52867 11.5286L8.47133 12.4712L12.9427 7.9999L8.47133 3.52856L7.52867 4.47123L10.3907 7.33323H4V8.66656H10.3907L7.52867 11.5286Z"
                        fill="white"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </section>
          ))}
        </div>
      </section>
      <section className="section">
        <Footer />
      </section>
    </ScrollFullPage>
  );
}

export default Home;
