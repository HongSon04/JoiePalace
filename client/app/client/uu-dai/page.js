"use client";

import ButtonDiscover from "@/app/_components/ButtonDiscover";
import Footer from "@/app/_components/FooterClient";
import IconButton from "@/app/_components/IconButton";
import ScrollFullPage from "@/app/_components/ScrollFullPage";
import TextFade from "@/app/_components/TextFade";
import { Image } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import "@/app/_styles/client.css";

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
const OfferPage = () => {
  const carouselRef = useRef();
  const carouselRef2 = useRef();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [timeAutoPlay, setTimeAutoPlay] = useState(false);
  const handleSlideChange = (nextSlide) => {
    setCurrentSlide(nextSlide);
  };
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
      {/* <section className="section w-screen h-screen" id="section-offers">
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
              <div className="h-full flex gap-3 items-center relative pt-20 px-8 lg:p-20">
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
                    replayEffect={false}
                  >
                    <div className="w-[60px] sm:w-auto flex justify-center items-center shrink-0">
                      <span className="h-auto uppercase -rotate-90 whitespace-nowrap font-bold text-5xl w-auto text-gold">
                        ưu đãi
                      </span>
                    </div>
                  </TextFade>
                </div>
                <div className="w-full lg:w-[30%] h-fit lg:h-full backdrop-blur-lg bg-white/10 py-16 px-8 rounded-lg overflow-hidden">
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
                    replayEffect={false}
                    styles="h-full flex flex-col justify-between  gap-16 "
                  >
                    <span className="uppercase font-normal text-4xl leading-[54px] line-clamp-4">
                      {offer.title}
                    </span>
                    <span className="font-normal text-lg">{offer.content}</span>
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
      </section> */}
      <section className="section w-screen px-8 lg:px-44" id="section-offers2">
        <div className="w-full h-auto flex flex-col gap-8 lg:gap-16 ">
          <div className="w-full h-auto flex justify-between">
            <span className="uppercase text-gold leading-[60px] font-bold text-4xl lg:text-6xl">
              ưu đãi khác
            </span>
            <div className="flex items-center gap-4">
              <IconButton
                background="none"
                type={"button"}
                onClick={() => carouselRef2.current.previous()}
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
                onClick={() => carouselRef2.current.next()}
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
          <div className="w-full h-full lg:h-[240px]">
            <Carousel
              afterChange={handleSlideChange}
              ref={carouselRef2}
              responsive={{
                superLargeDesktop: {
                  breakpoint: { max: 4000, min: 1024 },
                  items: 3,
                },
                desktop: {
                  breakpoint: { max: 1024, min: 768 },
                  items: 4,
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
              infinite={false}
              keyBoardControl={true}
              autoPlay={false}
              autoPlaySpeed={8000}
              slidesToSlide={3}
              removeArrowOnDeviceType={["tablet", "mobile", "desktop"]}
              transitionDuration={2000}
              customTransition={"2000ms ease-in-out"}
              containerClass="w-full h-full flex flex-col lg:flex-row page-offers"
            >
              {offers.map((offer, index) => (
                <div key={offer.id} className="w-full h-[240px] relative">
                  <Image
                    src={offer.image}
                    w={"100%"}
                    h={"100%"}
                    className="object-cover absolute top-0 left-0"
                    alt=""
                  />
                  <div className="w-full h-auto absolute bottom-0 left-0 p-6">
                    <span className="uppercase text-sm font-bold">
                      {offer.content}
                    </span>
                  </div>
                </div>
              ))}
            </Carousel>
          </div>
        </div>
      </section>
      <section className="section w-screen h-screen">
        <Footer />
      </section>
    </ScrollFullPage>
  );
};
export default OfferPage;
