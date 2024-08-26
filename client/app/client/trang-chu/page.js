"use client";
import Image from "next/image";
import mouseIcon from "../../../public/mouse.svg";
import { motion } from "framer-motion";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "@/app/_styles/index.css";

const bannerImages = ["/banner-2.png", "/banner.png"];
function Home() {
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
  const bannerSliderSettings = {
    dots: false,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    speed: 7000,
    autoplay: true,
    autoplaySpeed: 3000,
    cssEase: "ease-in-out",
  };
  return (
    <main className="w-full min-h-screen flex flex-col">
      <div className="banner w-full h-screen relative top-0 left-0">
        <div className="w-full h-full">
          <Slider {...bannerSliderSettings}>
            {bannerImages.map((image, index) => (
              <div key={index}>
                <img key={index} src={image} alt="banner" />
              </div>
            ))}
          </Slider>
        </div>
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
            <Image className="" src={mouseIcon} layout="" alt="My Image" />
          </motion.div>
        </div>
      </div>
    </main>
  );
}

export default Home;
