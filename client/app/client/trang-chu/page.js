"use client";
import { Image } from "@chakra-ui/react";
import { motion } from "framer-motion";
import ScrollFullPage from "@/app/_components/ScrollFullPage";
import Footer from "@/app/_components/FooterClient";
import TextFade from "@/app/_components/TextFade";
import MultiCarousel from "@/app/_components/MultiCarouselSlider";
import { useEffect, useState } from "react";
import ButtonDiscover from "@/app/_components/ButtonDiscover";
import "@/app/_styles/index.css";

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
const services = [
  {
    id: 1,
    name: "sự kiện",
    title: "hơn cả sự mong đợi",
    description:
      "Với những giá trị riêng biệt trong thẩm mỹ kiến trúc và chất lượng dịch vụ, White Palace là không gian hoàn hảo để triển khai bất kì kế hoạch sự kiện nào mà bạn đang ấp ủ, từ các buổi yến tiệc mang dấu ấn cá nhân như tiệc thôi nôi, sinh nhật, tiệc cưới đến các chương trình nghệ thuật giải trí sáng tạo, các sự kiện trọng thể của doanh nghiệp như sự kiện ra mắt sản phẩm, tiệc tri ân khách hàng, tiệc tất niên, triển lãm thương mại.",
  },
  {
    id: 2,
    name: "tiệc cưới",
    title: "Chạm đến trái tim",
    description:
      "Tiệc cưới – bức tranh tình yêu vượt mọi ngôn từ cảm xúc, bước khởi đầu hoàn hảo cho cuộc hôn nhân viên mãn. Vì vậy, hãy để chúng tôi giúp bạn san sẻ niềm hạnh phúc đến những người yêu thương bằng một chuyến du hành mỹ vị khó quên, với đa dạng lựa chọn, từ những set menu đã được nghiên cứu kỹ lưỡng hay bạn có thể tự chọn thực đơn theo đặc điểm khách mời.",
  },
  {
    id: 3,
    name: "hội nghị",
    title: "dấu ấn thành công",
    description:
      "White Palace là địa điểm hoàn hảo để bạn có thể tổ chức cùng lúc hội nghị hàng ngàn khách mời, hội thảo chuyên đề và các buổi họp cấp cao. Tất cả đều có thể diễn ra cùng với dịch vụ hội nghị chuyên nghiệp, được phục vụ bởi hàng trăm nhân sự tại đây. Tùy vào mục đích và loại hình hội nghị mà bạn có thể lựa chọn cho mình hình thức bố trí và dịch vụ phù hợp.",
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
  }, []);
  return (
    <ScrollFullPage>
      <section className="section banner w-full h-screen relative top-0 left-0">
        <MultiCarousel
          removeArrowOnDeviceType={["tablet", "mobile", "desktop"]}
          autoplaySpeed={5000}
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
                        duration: 1,
                        ease: "easeIn",
                      },
                    },
                  }}
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
                  <ButtonDiscover className={"w-[10%]"} />
                </div>
              </div>
            </section>
          ))}
        </div>
      </section>
      <section className="section relative w-screen" id="section-services">
        <TextFade
          settings={{
            hidden: { opacity: 0, y: 400 },
            visible: {
              opacity: 1,
              y: 135,
              transition: {
                duration: 1,
                ease: "easeIn",
              },
            },
          }}
          replayEffect={false}
          styles="absolute z-10 w-screen top-[0%] left-[10%]"
        >
          <span className="uppercase text-gold absolute text-6xl font-bold leading-[100%]">
            dịch vụ
          </span>
        </TextFade>
        <MultiCarousel
          removeArrowOnDeviceType={["tablet", "mobile", ""]}
          autoplaySpeed={2000}
          transitionDuration={3000}
          customTransition={"3000ms ease-in-out"}
          containerClass="w-screen"
          autoPlay={timeAutoPlay}
        >
          {services.map((service, index) => (
            <div key={service.id} className="w-screen h-screen flex relative">
              <div className="w-[73%] h-full overflow-hidden relative">
                <Image
                  src={`/images-client/service-section/service-img-${service.id}.png`}
                  w={"100%"}
                  h={"100%"}
                  className="object-cover"
                  alt=""
                />
                <div className="absolute inset-0 bg-blackAlpha-400"></div>
              </div>
              <div className="w-[27%] h-full relative">
                <Image
                  className="absolute left-0 translate-x-[50%] top-0 translate-y-[30%]"
                  src="/decor-cover.png"
                  alt=""
                />
                <span className="absolute w-9 h-[40vh] bg-gold right-0 bottom-0 translate-y-[-75%]"></span>
              </div>
              <div className="w-1/4 absolute bg-black left-3/4 translate-x-[-50%] bottom-[8%] backdrop-blur-[15px] bg-blackAlpha-500 overflow-hidden">
                <TextFade
                  settings={{
                    hidden: { opacity: 0, x: 30 },
                    visible: {
                      opacity: 1,
                      x: 0,
                      transition: {
                        duration: 0.5,
                        delay: 0,
                      },
                    },
                  }}
                  replayEffect={false}
                  styles="p-[30px] flex flex-col gap-[4em]"
                >
                  <span className="uppercase text-gold leading-[60px] text-[4em] font-normal">
                    {service.name}
                  </span>
                  <div className="flex flex-col gap-7">
                    <span className="uppercase font-bold text-[1.2em] leading-[120%]">
                      {service.title}
                    </span>
                    <span className="leading-[150%] font-normal text-base">
                      {service.description}
                    </span>
                  </div>
                  <ButtonDiscover className={"w-[45%]"} />
                </TextFade>
              </div>
            </div>
          ))}
        </MultiCarousel>
      </section>
      <section className="section">
        <Footer />
      </section>
    </ScrollFullPage>
  );
}

export default Home;
