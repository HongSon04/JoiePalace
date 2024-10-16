"use client";
import { Image } from "@chakra-ui/react";
import { motion } from "framer-motion";
import ScrollFullPage from "@/app/_components/ScrollFullPage";
import Footer from "@/app/_components/FooterClient";
import TextFade from "@/app/_components/TextFade";
import MultiCarousel from "@/app/_components/MultiCarouselSlider";
import { useEffect, useRef, useState } from "react";
import ButtonDiscover from "@/app/_components/ButtonDiscover";
import "@/app/_styles/client.css";
import IconButton from "@/app/_components/IconButton";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import InputIndex from "@/app/_components/InputIndexClient";
import HeaderClient from "./_components/HeaderClient";

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
      urlImage: "/images-client/events/HAWA-62.jpg",
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
const offers = [
  {
    id: 1,
    title: "tặng sân khấu màn hình led cho doanh nghiệp",
    content:
      "White Palace áp dụng chương trình ưu đãi tặng sân khấu màn hình LED cho sự kiện doanh nghiệp có thời gian tổ chức từ nay đến hết 30/9/2024.",
    image: "/images-client/offers/offer1.png",
  },
  {
    id: 2,
    title:
      "tặng kì nghỉ trăng mật 2 ngày 1 đêm trên du thuyển 5 sao elite of the seas tại vịnh hạ long khi đặt tiệc cưới",
    content:
      "White Palace trân trọng dành tặng kì trăng mật lãng mạn trên du thuyền 5 sao tại Vịnh Hạ Long (kèm vé máy bay khứ hồi) cho khách hàng tổ chức sự kiện cưới tại chi nhánh bất kỳ",
    image: "/images-client/offers/offer2.png",
  },
  {
    id: 3,
    title: "tặng trang sức ngọc trai cho khách hàng tiệc cưới",
    content:
      "White Palace tặng bạn trang sức ngọc trai Long Beach Pearl trị giá 20.000.000 VND khi đặt tiệc cưới tại chi nhánh bất kỳ.",
    image: "/images-client/offers/offer3.png",
  },
];
function Home() {
  const [timeAutoPlay, setTimeAutoPlay] = useState(false);
  const carouselRef = useRef();
  const [currentSlide, setCurrentSlide] = useState(0);
  const delay = () => {
    setTimeout(() => {
      setTimeAutoPlay(true);
    }, 5000);
  };
  useEffect(() => {
    delay();
  }, []);
  const handleSlideChange = (nextSlide) => {
    setCurrentSlide(nextSlide);
  };
  return (
    <>
      <HeaderClient/>
      <ScrollFullPage>
        {/* banner */}
        <section className="section banner w-full h-screen relative top-0 left-0">
          <MultiCarousel
            removeArrowOnDeviceType={["tablet", "mobile", "desktop"]}
            autoplaySpeed={5000}
            transitionDuration={7000}
            customTransition={"transform 7000ms ease-in-out"}
            containerClass="w-screen"
            autoPlay={timeAutoPlay}
            customButtons={false}
          >
            {bannerImages.map((image, index) => (
              <div key={index}>
                <Image w={"100vw"} h={"100vh"} src={image} alt="banner" />
              </div>
            ))}
          </MultiCarousel>
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 50 },
              visible: {
                opacity: 1,
                y: -150,
                transition: {
                  duration: 1.5,
                  ease: "easeIn",
                },
              },
            }}
            initial="hidden"
            animate="visible"
            className="absolute  flex flex-col gap-8 items-center top-1/2 !-translate-y-[60%] 2md:-translate-y-1/2"
          >
            <h1 className="font-medium text-center w-full text-4xl leading-[56px] sm:text-6xl sm:leading-[80px] 2md:w-4/6">
              NƠI CỦA SỰ THANH LỊCH, <br />
              LÒNG HIẾU KHÁCH <br /> VÀ TINH THẦN DUY MỸ
            </h1>
            <span className="text-base font-normal leading-6 text-center w-[80%] 2md:w-[50%]">
              Được xây dựng và phát triển bởi IN Hospitality vào năm 2007, White
              Palace là thương hiệu đầu tiên tại Việt Nam mở ra mô hình trung
              tâm hội nghị và sự kiện. Với sự đầu tư bài bản và chuyên biệt cho
              các hội nghị và sự kiện cao cấp, White Palace luôn được chọn là
              địa điểm tổ chức của những hội nghị kinh tế lớn, những sự kiện văn
              hóa giải trí có tầm ảnh hưởng và yến tiệc đẳng cấp.
            </span>
          </motion.div>
          <div className="w-full h-auto absolute bottom-[10%] hidden justify-center items-center lg:flex">
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
        {/* location */}
        <section className="section w-full h-full flex" id="section-location">
          <div className="w-[9%] p-3 box-content sm:p-0 h-screen flex justify-center items-center bg-gold shrink-0">
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
                <div className="w-full h-full absolute top-0 left-0 z-[1] bg-blackAlpha-700 flex items-center pl-12 sm:pl-24">
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
                    replayEffect={false}
                  >
                    <span className="location-name uppercase text-gold text-5xl sm:text-6xl font-normal leading-[80px] pointer-events-none">
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
                    <ButtonDiscover className={"w-fit px-3"} />
                  </div>
                </div>
              </section>
            ))}
          </div>
        </section>
        {/* events */}
        <section className="section relative w-screen" id="section-services">
          <TextFade
            settings={{
              hidden: { opacity: 0, y: 200 },
              visible: {
                opacity: 1,
                y: 135,
                transition: {
                  duration: 1,
                  ease: "easeIn",
                },
              },
            }}
            replayEffect={true}
            styles="absolute z-10 w-screen top-[0%] left-[10%] "
          >
            <span className="uppercase text-gold absolute text-4xl sm:text-6xl font-bold leading-[100%]">
              dịch vụ
            </span>
          </TextFade>
          <MultiCarousel
            removeArrowOnDeviceType={["", "", ""]}
            autoplaySpeed={2000}
            transitionDuration={3000}
            customTransition={"3000ms ease-in-out"}
            containerClass="w-screen"
            autoPlay={timeAutoPlay}
            customButtons={false}
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
                <div className=" w-[80%] left-1/2 top-1/2 translate-y-[-50%] lg:translate-y-[-50%] lg:py-10 lg:w-1/4 absolute bg-black lg:left-3/4 translate-x-[-50%]  backdrop-blur-[15px] bg-blackAlpha-500 overflow-hidden">
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
                    styles="p-[30px] flex flex-col gap-[20px] lg:gap-[4em]"
                  >
                    <span className="uppercase text-gold leading-[60px] text-[2em] sm:text-[4em] font-normal">
                      {service.name}
                    </span>
                    <div className="flex flex-col gap-7">
                      <span className="uppercase font-bold text-[1.2em] leading-[120%]">
                        {service.title}
                      </span>
                      <span className="leading-[150%] font-normal text-xs sm:text-base">
                        {service.description}
                      </span>
                    </div>
                    <ButtonDiscover className={"w-fit px-3"} />
                  </TextFade>
                </div>
              </div>
            ))}
          </MultiCarousel>
        </section>
        {/* services */}
        <section
          className="section w-screen h-screen relative flex flex-row gap-28"
          id="section-event"
        >
          <div className="flex flex-col gap-8 lg:flex-row lg:gap-[60px]">
            <div className=" w-full pl-8 lg:w-[50%] h-fit lg:h-screen relative flex lg:justify-center items-center lg:pl-20">
              <Image
                src="/decor-cover.png"
                className="absolute top-1/2 -translate-y-1/2 -left-[50%] translate-x-[50%] object-cover"
                h={"60vh"}
                w={"auto"}
                alt=""
              />
              <div className="flex flex-col gap-14 z-10">
                <TextFade
                  settings={{
                    hidden: { opacity: 0, y: 100 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: {
                        duration: 1,
                        ease: "easeIn",
                      },
                    },
                  }}
                  replayEffect={false}
                  styles="w-[79%]"
                >
                  <span className="uppercase text-gold font-bold text-[4em] leading-[64px]">
                    TIN TỨC & SỰ KIỆN MỚI NHẤT
                  </span>
                </TextFade>
                <TextFade
                  settings={{
                    hidden: { opacity: 0, y: 100 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: {
                        duration: 1,
                        delay: 0.15,
                        ease: "easeIn",
                      },
                    },
                  }}
                  replayEffect={false}
                  styles="hidden lg:block"
                >
                  <span className="leading-[150%] font-normal text-[18px] w-[85%]">
                    Cảm ơn quý khách đã ghé thăm chuyên mục tin tức của chúng
                    tôi.Tại đây, quý khách có thể cập nhật những tin tức mới
                    nhất,điểm lại những sự kiện nổi bật nhất tại White Palace
                    vàkhám phá những ưu đãi đặc biệt dành cho sự kiện của bạn.
                  </span>
                </TextFade>
                <TextFade
                  settings={{
                    hidden: { opacity: 0, y: 100 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: {
                        duration: 1,
                        delay: 0.25,
                        ease: "easeIn",
                      },
                    },
                  }}
                  replayEffect={false}
                  styles="hidden lg:block"
                >
                  <ButtonDiscover className={"w-fit px-3"} />
                </TextFade>
              </div>
            </div>
            <div className=" w-full px-8 h-[70vh] lg:w-[50%] lg:h-screen lg:pr-20 lg:pt-[100px] lg:pb-[40px] flex gap-6">
              {events.map((event, indexEvent) => (
                <div
                  key={indexEvent}
                  className={`section-event-listCard w-[calc(50%-12px)] h-[100%] flex ${
                    indexEvent === 0 ? "flex-col-reverse" : "flex-col"
                  } gap-6 overflow-y-scroll cursor-pointer`}
                >
                  {event.map((item, indexItem) => (
                    <div
                      key={indexItem}
                      className="w-full h-1/3 sm:h-[65%] flex-shrink-0 relative"
                    >
                      <div className="w-full h-full overflow-hidden relative">
                        <Image
                          src={`${item.urlImage}`}
                          className="object-cover"
                          w={"100%"}
                          h={"100%"}
                          alt=""
                        />
                        <div className="absolute inset-0 bg-blackAlpha-600"></div>
                      </div>
                      <div className="absolute top-0 left-0 w-full h-full flex flex-col justify-between py-10 px-5">
                        <span className="font-semibold text-xs leading-[22px] 500px:text-sm sm:text-lg sm:leading-7">
                          {item.content}
                        </span>
                        <IconButton background="none" type={"button"}>
                          <Image
                            src="/arrow_circle_right.svg"
                            w={"100%"}
                            h={"100%"}
                            alt=""
                          />
                        </IconButton>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
            <TextFade
              settings={{
                hidden: { opacity: 0, y: -100 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: {
                    duration: 1,
                    delay: 0.25,
                    ease: "easeIn",
                  },
                },
              }}
              replayEffect={false}
              styles="block lg:hidden pl-8"
            >
              <ButtonDiscover className={"w-fit px-3"} />
            </TextFade>
          </div>
        </section>
        {/* offers */}
        <section className="section w-screen h-screen" id="section-offers">
          <Carousel
            afterChange={handleSlideChange}
            ref={carouselRef}
            responsive={{
              superLargeDesktop: {
                breakpoint: { max: 4000, min: 1024 },
                items: 1,
              },
              desktop: {
                breakpoint: { max: 1024, min: 768 },
                items: 1,
              },
              tablet: {
                breakpoint: { max: 768, min: 464 },
                items: 1,
              },
              mobile: {
                breakpoint: { max: 464, min: 0 },
                items: 1,
              },
            }}
            showDots={false}
            infinite={true}
            keyBoardControl={true}
            autoPlay={false}
            autoPlaySpeed={8000}
            removeArrowOnDeviceType={["tablet", "mobile", "desktop"]}
            transitionDuration={2000}
            customTransition={"2000ms ease-in-out"}
            containerClass="w-full h-full"
          >
            {offers.map((offer, index) => (
              <div key={offer.id} className="w-screen h-screen relative">
                <div className="w-full h-full absolute top-0 left-0 flex justify-center items-center overflow-hidden">
                  <Image
                    src={offer.image}
                    w={"100%"}
                    h={"100vh"}
                    className="object-cover"
                    alt=""
                  />
                </div>
                <div className="h-full flex items-center lg:items-stretch gap-3 relative py-20 px-8 lg:p-20">
                  <div className="h-full flex justify-center items-center">
                    <TextFade
                      settings={{
                        hidden: { opacity: 0, x: -40 },
                        visible: {
                          opacity: 1,
                          x: 0,
                          y: 0,
                          transition: {
                            duration: 1,
                            delay: 0.5,
                          },
                        },
                      }}
                      replayEffect={true}
                    >
                      <div className="w-[60px] sm:w-auto flex justify-center items-center lg:shrink-0">
                        <span className="h-auto uppercase -rotate-90 whitespace-nowrap font-bold text-5xl w-auto text-gold">
                          ưu đãi
                        </span>
                      </div>
                    </TextFade>
                  </div>
                  <div className="w-full lg:w-[50%] 2xl:w-[30%] h-fit lg:h-full backdrop-blur-lg bg-white/10 py-16 px-8 rounded-lg overflow-hidden">
                    <TextFade
                      settings={{
                        hidden: { opacity: 0, x: 50 },
                        visible: {
                          opacity: 1,
                          x: 0,
                          transition: {
                            duration: 1,
                            delay: 0.5,
                          },
                        },
                      }}
                      replayEffect={true}
                      styles="h-full flex flex-col justify-center gap-[50px] gap-16 2xl:gap-[100px]"
                    >
                      <span className="uppercase font-normal text-4xl leading-[54px] line-clamp-4">
                        {offer.title}
                      </span>
                      <span className="font-normal text-lg">
                        {offer.content}
                      </span>
                      <div className="w-full flex justify-between items-center">
                        <ButtonDiscover className="w-fit px-3"></ButtonDiscover>
                        <div className="flex items-center gap-4">
                          <IconButton
                            background="none"
                            type={"button"}
                            onClick={() => carouselRef.current.previous()}
                          >
                            <Image
                              src="/arrow_circle_left.svg"
                              w={"100%"}
                              h={"100%"}
                              alt=""
                            />
                          </IconButton>
                          <IconButton
                            background="none"
                            type={"button"}
                            onClick={() => carouselRef.current.next()}
                          >
                            <Image
                              src="/arrow_circle_right.svg"
                              w={"100%"}
                              h={"100%"}
                              alt=""
                            />
                          </IconButton>
                        </div>
                      </div>
                    </TextFade>
                  </div>
                </div>
              </div>
            ))}
          </Carousel>
        </section>
        {/* information */}
        <section
          className="section w-screen h-screen flex px-8 lg:px-24 2xl:px-44 pt-24 pb-9 gap-10"
          id="section-information"
        >
          <TextFade
            settings={{
              hidden: { opacity: 0, x: 0, y: 70 },
              visible: {
                opacity: 1,
                x: 0,
                y: 0,
                transition: {
                  duration: 2,
                  delay: 0.25,
                  ease: "easeOut",
                },
              },
            }}
            styles="w-screen flex flex-col items-center lg:flex-row gap-10"
            replayEffect={true}
          >
            <div className="w-full lg:w-1/2 h-1/2 lg:h-full flex flex-col gap-10">
              <h1 className="uppercase text-gold font-bold text-5xl leading-[100%]">
                thông tin liên hệ
              </h1>
              <form
                className="w-full h-auto flex flex-col gap-5 overflow-y-scroll pr-1"
                id="form-information"
              >
                <InputIndex type="text" placeholder="Họ và tên*" />
                <InputIndex type="number" placeholder="Số điện thoại*" />
                <InputIndex type="email" placeholder="Email*" />
                <InputIndex type="text" placeholder="Công ty*" />
                <div className="w-full py-3 flex items-center justify-between border border-b-white border-t-0 border-l-0 border-r-0">
                  <span>Sự kiện*</span>
                  <div className="h-full flex items-center gap-3">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="accountType"
                        value="business"
                        className="form-radio text-green-600 focus:ring-green-500 h-4 w-4"
                      />
                      <span className="ml-2 text-white">Doanh nghiệp</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="accountType"
                        value="business"
                        className="form-radio text-green-600 focus:ring-green-500 h-4 w-4"
                      />
                      <span className="ml-2 text-white">Cá nhân</span>
                    </label>
                  </div>
                </div>
                <div className="w-full flex items-center justify-between">
                  <span>Địa điểm*</span>
                  <div className="w-[40%] h-full flex items-center gap-3">
                    <select
                      name=""
                      id=""
                      className="w-full border border-darkGreen-700 p-3 py-2 rounded-sm"
                    >
                      <option className="text-black" value="1">
                        Hoàng Văn Thụ
                      </option>
                      <option className="text-black" value="2">
                        Phạm Văn Đồng
                      </option>
                      <option className="text-black" value="3">
                        Võ Văn Kiệt
                      </option>
                    </select>
                  </div>
                </div>
                <InputIndex
                  type="number"
                  min="0"
                  placeholder="Số lượng khách*"
                />
                <InputIndex type="datetime-local" placeholder="Thời gian*" />
                <InputIndex
                  type="text"
                  placeholder="Ghi chú*"
                  styles="overflow-hidden"
                />
                <div className="w-full flex justify-end">
                  <ButtonDiscover name={"Gửi"} className={"w-auto px-6"} />
                </div>
              </form>
            </div>
            <div className="w-full lg:w-1/2 h-1/2 lg:h-[70%] rounded-sm overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d7893.373649501081!2d106.68365245869786!3d10.804445099199677!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317528d0911a5c55%3A0xef4a80f1f2c1a13b!2zQuG7h25oIHZp4buHbiDEkGEgS2hvYSBIb8OgbiBN4bu5IFPDoGkgR8Oybg!5e1!3m2!1svi!2s!4v1726154120512!5m2!1svi!2s"
                width="100%"
                height="100%"
                allowfullscreen=""
                loading="lazy"
                referrerpolicy="no-referrer-when-downgrade"
              />
            </div>
          </TextFade>
        </section>
        <section className="section">
          <Footer />
        </section>
      </ScrollFullPage>
    </>
  );
}

export default Home;
