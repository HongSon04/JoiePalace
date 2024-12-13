"use client";
import Footer from "@/app/_components/FooterClient";
import ScrollFullPage from "@/app/_components/ScrollFullPage";
import { Image } from "@chakra-ui/react";
import IconButton from "@/app/_components/IconButton";
import ButtonDiscover from "@/app/_components/ButtonDiscover";
import { useParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Carousel from "react-multi-carousel";
import TextFade from "@/app/_components/TextFade";
import "@/app/_styles/client.css";
import { fetchBranchBySlug } from "@/app/_services/branchesServices";

const section6 = [
  {
    id: 1,
    url: "/images-client/branch/hoang-van-thu/DIWA-2.jpg",
    name: "diwa",
  },
  {
    id: 2,
    url: "/images-client/branch/hoang-van-thu/SOULIX-2-1.jpg",
    name: "soulix",
  },
  {
    id: 3,
    url: "/images-client/branch/hoang-van-thu/ALPAS-4.jpg",
    name: "alpas",
  },
  {
    id: 4,
    url: "/images-client/branch/hoang-van-thu/CHILLAX-2.jpg",
    name: "chillax",
  },
];
const textContainerVariants = {
  hidden: { opacity: 0, y: 150, x: 0 },
  visible: {
    opacity: 1,
    y: 130,
    transition: {
      duration: 1.5,
      ease: "easeIn",
    },
  },
};
const spaces = [
  {
    id: 1,
    name: "Kiểu lớp học",
    description:
      "Dãy bàn, ghế hội nghị hướng lên sân khấu, thường có diễn giả, không gian thuận tiện cho việc ghi chép, đọc tài liệu. Thích hợp cho những sự kiện có ghi chép hoặc có phát tài liệu để người tham dự tham khảo hoặc dùng máy tính xách tay. Đây là giải pháp sắp xếp thoải mái nhất cho những cuộc họp dài và có không gian cho khách mời để vật dụng hoặc gác tay.",
    url: [
      "/HVT-CLASSROOM-1-260x420.jpg",
      "/HVT-CLASSROOM-2-260x420.jpg",
      "/HVT-CLASSROOM-3-260x420.jpg",
    ],
  },
  {
    id: 2,
    name: "Kiểu bán nguyệt",
    description:
      "Sắp xếp ghế một nửa bàn để người tham gia có thể hướng về sân khấu hoặc diễn giả. Thích hợp với các buổi đào tạo, workshop cần có nhiều đóng góp ý kiến, thảo luận và tương tác của người tham gia.",
    url: [
      "/HVT-SEMI-CIRCLE-1-260x420.jpg",
      "/HVT-SEMI-CIRCLE-2-260x420.jpg",
      "/HVT-SEMI-CIRCLE-3-260x420.jpg",
      "/HVT-SEMI-CIRCLE-4-260x420.jpg",
    ],
  },
  {
    id: 3,
    name: "kiểu rạp hát",
    description:
      "Chỗ ngồi thường đối diện với sân khấu, với bàn họp hay các diễn giả và đặc biệt không có bàn kèm theo. Thích hợp cho những sự kiện người tham dự là khán giả, không phù hợp cho các sự kiện ăn uống hoặc ghi chép.",
    url: [
      "/WP-HVT-THEATER-1-260x420 (1).jpg",
      "/WP-HVT-THEATER-2-260x420 (1).jpg",
      "/WP-HVT-THEATER-3-260x420.jpg",
      "/WP-HVT-THEATER-4-260x420 (1).jpg",
    ],
  },
];
const designs = [
  {
    id: 1,
    name: "DIWA",
    url: "/images-client/branch/hoang-van-thu/DIWA-2.jpg",
    description:
      "Lấy cảm hứng từ lễ hội đèn trời nổi tiếng, các kiến trúc sư đã kiến tạo nên không gian lãng mạn, huyền ảo tại Diwa. Sở hữu công năng linh hoạt với sức chứa từ 300 đến 1.200 khách, sảnh Diwa có thể đáp ứng đa dạng các loại hình sự kiện, từ tiệc sinh nhật, sự kiện cưới đến các buổi hội nghị, hội thảo, tiệc tất niên, gala dinner,…",
  },
  {
    id: 2,
    name: "SOULIX",
    url: "/images-client/branch/hoang-van-thu/SOULIX-2-1.jpg",
    description:
      "Sở hữu thiết kế trần gỗ đan xen độc đáo kết hợp cùng hạt ánh sáng lung linh, Soulix mang đến không gian thanh lịch, ấm cúng cho các sự kiện quy mô nhỏ, các buổi tiệc thân mật dành cho gia đình, bạn bè như tiệc sinh nhật, thôi nôi, lễ đính hôn, kỷ niệm ngày cưới,…",
  },
  {
    id: 3,
    name: "ALPAS",
    url: "/images-client/branch/hoang-van-thu/ALPAS-4.jpg",
    description:
      "Kiến trúc mang đậm dấu ấn nghệ thuật với chuỗi hạt ánh sáng tỏa lung tinh từ trần gỗ đã kiến tạo nên không gian thanh lịch và ấm áp tại Alpas. Là đại sảnh lớn nhất với sức chứa lên đến 2.000 khách, Alpas là sự lựa chọn tối ưu cho các sự kiện giải trí, triển lãm nghệ thuật hay hội nghị thương mại quy mô lớn.",
  },
  {
    id: 4,
    name: "CHILLAX",
    url: "/images-client/branch/hoang-van-thu/CHILLAX-2.jpg",
    description:
      "Lan tỏa cảm hứng sáng tạo với thiết kế gỗ đan xen đầy cá tính, Chillax là sự lựa chọn lý tưởng cho các sự kiện đề cao tính gắn kết có quy mô dưới 100 khách như workshop giao lưu, hội thảo, họp báo,…",
  },
];
const PageLocation = () => {
  const [branch, setBranch] = useState(null);
  const carouselRef = useRef();
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [currentSlide, setCurrentSlide] = useState(0);
  const carouselMapRef1 = useRef(null);
  const carouselMapRef2 = useRef(null);
  const [currentSpace, setCurrentSpace] = useState(spaces[0]);
  const [currentDesign, setCurrentDesign] = useState(designs[0]);
  const { slug } = useParams();
  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  // call api
  useEffect(() => {
    const getBranch = async (slug) => {
      const branchBySlug = await fetchBranchBySlug(slug);
      setBranch(branchBySlug[0]);
    };
    getBranch(slug);
  }, [slug]);
  const handlePrevious = () => {
    if (carouselMapRef1.current && carouselMapRef2.current) {
      carouselMapRef1.current.previous();
      carouselMapRef2.current.previous();
    }
  };
  const handleNext = () => {
    if (carouselMapRef1.current && carouselMapRef2.current) {
      carouselMapRef1.current.next();
      carouselMapRef2.current.next();
    }
  };
  const handleSlideChange = (nextSlide) => {
    setCurrentSlide(nextSlide);
  };
  if (!branch) return;
  const splitIntoSpans = (str) => {
    const words = str.split(" ");
    const result = [];

    for (let i = 0; i < words.length; i += 2) {
      const span = words.slice(i, i + 2).join(" ");
      result.push(span);
    }

    return result;
  };

  const spans = splitIntoSpans(branch.slogan);
  const JsxContent = (
    <>
      {/* banner */}
      <section className="section banner w-full h-screen relative top-0 left-0">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          <Image
            src={branch.images[0]}
            w={"100%"}
            h={"100%"}
            className="object-cover"
            alt=""
          />
        </div>
        <motion.div
          variants={textContainerVariants}
          initial="hidden"
          animate="visible"
          className="absolute h-auto flex flex-col gap-8 items-center w-full top-[50%] left-0 !translate-y-[-50%] lg:translate-y-0"
        >
          {spans.map((span, index) => (
            <span
              key={index}
              className={`text-[42px] ${
                index % 2 === 1 ? "sm:text-[84px]" : "sm:text-[64px]"
              } font-medium leading-[42px] ${
                index % 2 === 1 ? "sm:leading-[80px]" : "sm:leading-[80px]"
              } text-center w-full px-8 lg:px-0 lg:w-4/6`}
            >
              {span}
            </span>
          ))}
        </motion.div>
        <div className="w-full h-auto absolute bottom-[10%] hidden lg:flex justify-center items-center">
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
      <section className="section">
        <div className="w-screen h-[60vh] lg:h-screen grid grid-cols-12 grid-rows-12 gap-y-5 lg:py-0">
          {branch.slogan_images.map((url, index) => {
            <div
              key={index}
              className={`grid ${
                index === 0
                  ? "col-start-2 col-end-6 row-start-5 xs:row-start-4 row-end-10 md:col-start-1 md:col-end-3 md:row-start-1 md:row-end-7 pt-5"
                  : index === 1
                  ? "col-start-3 col-end-7 row-start-8 xs:row-start-9 row-end-13 md:col-start-2 md:col-end-4 md:row-start-6 md:row-end-13 pb-5"
                  : "col-start-8 col-end-12 row-start-5 xs:row-start-4 row-end-13 md:col-start-10 md:col-end-13 md:row-start-1 md:row-end-13"
              } overflow-hidden`}
            >
              <Image
                src={url}
                w={"100%"}
                h={"100%"}
                className="object-cover"
                alt={url + "/" + index}
              />
            </div>;
          })}
          {/* <div className="grid col-start-3 col-end-7 row-start-8 xs:row-start-9 row-end-13 md:col-start-2 md:col-end-4 md:row-start-6 md:row-end-13 pb-5 overflow-hidden">
            <Image
              src="https://whitepalace.com.vn/wp-content/uploads/2024/01/venue-2.png"
              w={"100%"}
              h={"100%"}
              className="object-cover"
              alt=""
            />
          </div>
          <div className="grid col-start-8 col-end-12 row-start-5 xs:row-start-4 row-end-13 md:col-start-10 md:col-end-13 md:row-start-1 md:row-end-13 overflow-hidden">
            <Image
              src="https://whitepalace.com.vn/wp-content/uploads/2024/01/venue-3.png"
              w={"100%"}
              h={"100%"}
              className="object-cover"
              alt=""
            />
          </div> */}
          <div className="grid col-start-2 col-end-12 row-start-1 row-end-4 md:col-start-4 md:col-end-10 md:px-10 md:row-start-1 md:row-end-13 z-30">
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
              replayEffect={true}
            >
              <span className="w-full h-full flex text-center justify-center items-center text-[10px] sxs:text-xs 2md:text-base font-normal leading-4 md:leading-7">
                {branch.slogan_description}
              </span>
            </TextFade>
          </div>
        </div>
      </section>
      <section
        className="section w-screen h-[50vh] lg:h-screen"
        id="location__section-3"
      >
        <div className="w-full h-full grid grid-cols-12 grid-rows-12 gap-y-5 lg:px-44 relative">
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
            replayEffect={true}
            className="absolute top-[20px] lg:top-20"
          >
            <div className="w-full relative flex flex-col gap-7">
              <span className="uppercase text-[24px] sm:text-[30px] lg:text-5xl font-semibold text-gold inline-block w-[70%] lg:px-44 lg:w-[70%] ml-[12%] lg:ml-0">
                sơ đồ tổng thể công suất & kích thước
              </span>
              <span className="h-1 w-[10%] bg-gold flex absolute left-0 top-[50%]"></span>
            </div>
          </TextFade>
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
            replayEffect={true}
            className="row-start-9 row-end-13 col-start-1 lg:col-start-7 col-end-13 z-30"
          >
            <div className="w-full h-auto relative flex flex-col gap-4 px-[12%] lg:pl-9 pt-7">
              <span className="text-xs sm:text-sm lg:text-lg">
                {branch.diagram_description}
              </span>
            </div>
          </TextFade>
          <div className="buttonSlide flex justify-between px-[10%] lg:px-0 lg:flex-none lg:justify-normal col-start-1 col-end-13 row-start-7 row-end-8 z-[998] relative">
            <IconButton
              background="none"
              type={"button"}
              className="lg:absolute left-[-50px]"
              onClick={handlePrevious}
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
              className="lg:absolute right-[-50px]"
              onClick={handleNext}
            >
              <Image
                src="/arrow_circle_right.svg"
                w={"100%"}
                h={"100%"}
                alt=""
              />
            </IconButton>
          </div>
          <div className="col-start-1 col-end-13 row-start-4 row-end-9 lg:col-start-1 lg:col-end-13 lg:row-start-5 lg:row-end-12 z-20 flex gap-10 justify-center lg:justify-normal">
            <div className="w-1/2 h-full flex justify-center items-center">
              <Carousel
                ref={carouselMapRef1}
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
                autoPlaySpeed={0}
                removeArrowOnDeviceType={["tablet", "mobile", "desktop"]}
                transitionDuration={1000}
                customTransition={"1000ms ease-in-out"}
                containerClass="w-full h-full"
              >
                {branch.diagram_images.map((url, index) => {
                  <div key={index} className="w-full h-full overflow-hidden">
                    <Image
                      src={url}
                      className="w-full h-full object-cover"
                      alt=""
                    />
                  </div>;
                })}
              </Carousel>
            </div>
            <div className="w-[30%] h-[60%] carosel-right hidden lg:block">
              <Carousel
                // afterChange={handleSlideChange}
                ref={carouselMapRef2}
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
                autoPlaySpeed={0}
                transitionDuration={1000}
                customTransition={"1000ms ease-in-out"}
                removeArrowOnDeviceType={["tablet", "mobile", "desktop"]}
                containerClass="w-full h-full"
              >
                {branch.diagram_images.map((url, index) => {
                  <div key={index} className="w-full h-full overflow-hidden">
                    <Image
                      src={url}
                      className="w-full h-full object-cover"
                      alt=""
                    />
                  </div>;
                })}
              </Carousel>
            </div>
          </div>
        </div>
      </section>
      <section
        className="section w-screen h-[55vh] lg:h-screen"
        id="location__section-4"
      >
        <div className="w-full h-full grid grid-cols-12 grid-rows-12 gap-y-5 lg:px-44 relative">
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
            replayEffect={true}
            className="lg:absolute top-20"
          >
            <div className="w-screen lg:w-full h-auto relative flex flex-col gap-4 lg:gap-7 z-20">
              <span className="uppercase px-[12%] lg:ml-0 font-semibold text-gold inline-block lg:px-44 text-[24px] sm:text-[30px] lg:text-5xl">
                trang thiết bị
              </span>
              <span className="z-10 px-[12%] lg:w-[70%] lg:ml-0 lg:pl-44 text-xs sm:text-sm lg:text-base">
                {branch.equipment_description}
              </span>
              <span className="h-1 w-[15%] bg-gold flex absolute left-0 top-[25%]"></span>
            </div>
          </TextFade>
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
            replayEffect={true}
            className="row-start-10 row-end-13 col-start-7 col-end-13"
          >
            <div className="w-full h-auto relative flex flex-col gap-2 lg:gap-4">
              <span className="text-xs sm:text-sm lg:text-base">
                - Thiết bị âm thanh, ánh sáng công nghệ cao
              </span>
              <span className="text-xs sm:text-sm lg:text-base">
                - Màn hình LED hiện đại
              </span>
              <span className="text-xs sm:text-sm lg:text-base">
                - Hệ thống móc treo trần đa năng
              </span>
              <span className="text-xs sm:text-sm lg:text-base">
                - Hệ sàn chịu tải lớn
              </span>
            </div>
          </TextFade>
          {/* images start */}
          {branch.equipment_images.map((url, index) => {
            <div
              key={index}
              className={`overflow-hidden ${
                index === 0
                  ? "row-start-7 lg:row-start-5 row-end-13 col-start-3 col-end-7 pr-5 z-20"
                  : index === 1
                  ? " pt-6 lg:pt-0 col-start-4 lg:col-start-6 col-end-9 row-start-3 lg:row-start-1 row-end-9 lg:row-end-7 z-10"
                  : " col-start-7 col-end-11 lg:col-end-13 row-start-4 lg:row-start-2 row-end-10"
              }`}
            >
              <Image src={url} className="w-full h-full object-cover" alt="" />
            </div>;
          })}
          {/* images end */}
        </div>
      </section>
      <section
        className="section w-screen h-fit lg:h-screen flex flex-col gap-10 lg:gap-20 py-20"
        id="location__section-5"
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
          replayEffect={true}
        >
          <div className="w-full h-auto relative">
            <span className="uppercase text-[24px] sm:text-[30px] lg:text-5xl font-semibold text-gold inline-block px-[12%] lg:px-44">
              không gian hội nghị
            </span>
            <span className="h-1 w-[6%] bg-gold flex absolute left-0 bottom-2"></span>
          </div>
        </TextFade>
        <div className="w-full h-auto flex flex-col-reverse lg:flex-row lg:justify-between gap-8 lg:gap-16 px-[12%] lg:px-44">
          <TextFade
            settings={{
              hidden: { opacity: 0, x: 0, y: 100 },
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
            replayEffect={true}
            styles="w-full lg:w-1/2"
          >
            <div className="w-full flex flex-col gap-6 lg:gap-12">
              <div className="w-full flex justify-between lg:justify-normal lg:flex-col gap-12">
                {spaces.map((space, index) => (
                  <span
                    onClick={(e) => setCurrentSpace(spaces[index])}
                    key={space.id}
                    className={`w-full flex text-gold text-[18px] sm:text-[30px] lg:text-4xl font-medium space-active cursor-pointer ${
                      currentSpace.id === index + 1
                        ? "opacity-100"
                        : "!opacity-50"
                    }`}
                  >
                    {space.name}
                  </span>
                ))}
              </div>
              <div className="text-white text-xs sm:text-sm lg:text-base w-full">
                {currentSpace?.description}
              </div>
            </div>
          </TextFade>
          <div className="w-full lg:w-1/2 overflow-hidden">
            <Carousel
              responsive={{
                superLargeDesktop: {
                  breakpoint: { max: 4000, min: 1024 },
                  items: 2,
                },
                desktop: {
                  breakpoint: { max: 1024, min: 768 },
                  items: 2,
                },
                tablet: {
                  breakpoint: { max: 768, min: 464 },
                  items: 3,
                },
                mobile: {
                  breakpoint: { max: 464, min: 0 },
                  items: 3,
                },
              }}
              showDots={false}
              infinite={false}
              keyBoardControl={true}
              autoPlay={false}
              autoPlaySpeed={0}
              removeArrowOnDeviceType={["tablet", "mobile", "desktop"]}
              containerClass="w-full h-full"
            >
              {currentSpace?.url?.map((imageUrl, index) => (
                <div key={index} className="w-full h-full p-2">
                  <Image src={imageUrl} w={"100%"} h={"100%"} alt="" />
                </div>
              ))}
            </Carousel>
          </div>
        </div>
      </section>
      <section className="section w-screen h-screen" id="location__section-6">
        <div className="w-screen h-screen relative top-0 left-0">
          <div className="w-screen h-screen absolute top-0 left-0 overflow-hidden">
            <Image
              src={currentDesign.url}
              w={"100%"}
              h={"100%"}
              className="object-cover"
              alt=""
            />
            <div
              className="w-full h-full absolute top-0 left-0 !bg-[rgb(88 79 79 / 46%)]"
              id="bg_fill"
            ></div>
          </div>
          <div className="w-screen h-screen flex flex-col justify-center items-center gap-9 absolute top-0 left-0 px-[12%] lg:px-44">
            <div className="w-full h-auto flex justify-end">
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
            <div className="w-full h-auto flex flex-col lg:flex-row gap-6">
              <div className="w-full lg:w-1/2 h-auto flex flex-col gap-4 lg:gap-8">
                <span className="uppercase text-5xl font-semibold">
                  {currentDesign.name}
                </span>
                <span className="text-xs sm:text-sm lg:text-base font-normal leading-4 lg:leading-7 ">
                  {currentDesign.description}
                </span>
                <div className="lg:mt-9">
                  <ButtonDiscover className="px-4" />
                </div>
              </div>
              <span className="w-full h-[1px] lg:w-[1px] lg:h-full bg-white"></span>
              <div className="w-full lg:w-1/2 h-[15vh] md:h-[18vh] lg:h-full overflow-hidden flex">
                <Carousel
                  afterChange={handleSlideChange}
                  ref={carouselRef}
                  responsive={{
                    superLargeDesktop: {
                      breakpoint: { max: 4000, min: 1024 },
                      items: 3,
                    },
                    desktop: {
                      breakpoint: { max: 1024, min: 768 },
                      items: 3,
                    },
                    tablet: {
                      breakpoint: { max: 768, min: 464 },
                      items: 2,
                    },
                    mobile: {
                      breakpoint: { max: 464, min: 0 },
                      items: 1,
                    },
                  }}
                  showDots={false}
                  infinite={false}
                  keyBoardControl={true}
                  autoPlay={false}
                  autoPlaySpeed={0}
                  removeArrowOnDeviceType={["tablet", "mobile", "desktop"]}
                  containerClass="w-full h-full"
                >
                  {designs.map((design, index) => (
                    <div
                      onClick={() => setCurrentDesign(designs[index])}
                      key={design.id}
                      className="w-full h-full px-2 flex justify-center items-center relative cursor-pointer"
                    >
                      <div className="w-full h-full overflow-hidden">
                        <Image
                          src={design.url}
                          className="w-full h-full object-cover"
                          alt=""
                        />
                      </div>
                      <span className="absolute uppercase bottom-4 text-lg md:xl font-bold lg:text-2xl">
                        {design.name}
                      </span>
                    </div>
                  ))}
                </Carousel>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="section w-screen h-screen">
        <div className="h-screen flex items-center">
          <div className="w-full h-full flex flex-col lg:flex-row lg:justify-center lg:items-center gap-7 lg:gap-14 px-[12%] lg:px-44 py-5 lg:py-0">
            <div className="w-full lg:w-1/2 h-[50%] lg:h-full flex flex-col justify-center gap-8 lg:gap-16">
              <span className="uppercase text-[24px] sm:text-[30px] lg:text-5xl font-bold text-gold">
                thông tin liên hệ
              </span>
              <div className="w-full h-auto flex flex-col gap-6 lg:gap-11">
                <span className="uppercase text-[18px] sm:text-[20px] lg:text-2xl font-normal">
                  joice palace phạm văn đồng
                </span>
                <div className="w-full h-auto flex flex-col gap-6">
                  <div className="w-full flex gap-3 lg:gap-6">
                    <Image src="/room.svg" alt="" />
                    <span className="text-xs sm:text-sm lg:text-base font-normal">
                      194 Hoàng Văn Thụ, Quận Phú Nhuận, Thành phố Hồ Chí Minh
                    </span>
                  </div>
                  <div className="w-full flex gap-6">
                    <Image src="/mail.svg" alt="" />
                    <span className="text-xs sm:text-sm lg:text-base font-normal">
                      info@joicepalace.com.vn
                    </span>
                  </div>
                  <div className="w-full flex gap-6">
                    <Image src="/phone.svg" alt="" />
                    <span className="text-xs sm:text-sm lg:text-base font-normal">
                      035 243 1477
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full lg:w-1/2 h-[50%]  rounded-sm overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.9101447446287!2d106.71386767480566!3d10.825879989325873!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317529b446117cb9%3A0x7549cfeabc04d7d0!2zV2hpdGUgUGFsYWNlIFBo4bqhbSBWxINuIMSQ4buTbmc!5e1!3m2!1svi!2s!4v1726236625632!5m2!1svi!2s"
                width="100%"
                height="100%"
                loading="lazy"
              ></iframe>
            </div>
          </div>
        </div>
      </section>
      <section className="section w-screen h-fit lg:h-screen">
        <Footer />
      </section>
    </>
  );
  return screenWidth > 1024 ? (
    <ScrollFullPage>{JsxContent}</ScrollFullPage>
  ) : (
    <div className="w-screen flex flex-col">{JsxContent}</div>
  );
};
export default PageLocation;
