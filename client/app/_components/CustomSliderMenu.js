"use client";
import { useEffect, useRef, useState } from "react";

import { Image } from "@chakra-ui/react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ButtonDiscover from "./ButtonDiscover";
import { API_CONFIG } from "@/app/_utils/api.config";
import useApiServices from "@/app/_hooks/useApiServices";


const CustomSliderMenu = () => {
  const { makeAuthorizedRequest } = useApiServices();
  const [listMenu, setListMenu] = useState([]);
  const sliderRef = useRef(null);

  const nextSlide = () => {
    if (sliderRef.current) {
      sliderRef.current.slickNext();
    }
  };

  const prevSlide = () => {
    if (sliderRef.current) {
      sliderRef.current.slickPrev();
    }
  };

  const menuSliderSettings = {
    dots: false,
    slidesToShow: 1,
    slidesToScroll: 1,
    infinite: true,
    speed: 1500,
    // autoplay: true,
    autoplaySpeed: 3000,
    cssEase: "ease-in-out",
    arrows: false,
    beforeChange: (current) => {
      const idElements = document.querySelectorAll(".text-right-to-left");
      if (idElements) {
        idElements.forEach((i) => {
          i.classList.remove("text-right-to-left");
          setTimeout(() => {
            i.classList.add("text-right-to-left");
          }, 500);
        });
      }
    },
  };



  useEffect(() => {
    const getMenu = async () => {
      const data = await makeAuthorizedRequest(
        API_CONFIG.MENU.GET_ALL(),
        'GET',
        '',
        null,
        '/client/dang-nhap'
      );

      if (data.success) {
        // const MenuToShow = data.data.filter(feedback => feedback.is_show);
        setListMenu(data.data);
      } else {
        console.error("Error fetching Menu:", data);
        return [];
      }
    };
    getMenu();
  }, []);

  // const dataSlider = [
  //   {
  //     id: 1,
  //     name: "set menu",
  //     img: "Alacarte-Menu-Thumbnail.png",
  //     descriptions:
  //       "Phép màu giúp chúng ta vượt ra khỏi những giới hạn về định nghĩa, tự do sáng tạo thế giới trải nghiệm, khi kết hợp cùng Flavors - Hương vị của niềm hân hoan, hạnh phúc và năng lượng tích cực. Món ăn là phép màu và hương vị là chìa khóa mở ra những trải nghiệm. Hãy cùng nhau khám phá!",
  //     link: ""
  //   },
  //   {
  //     id: 2,
  //     name: "set menu 2",
  //     img: "Alacarte-Menu-Thumbnail.png",
  //     descriptions:
  //       "Phép màu giúp chúng ta vượt ra khỏi những giới hạn về định nghĩa, tự do sáng tạo thế giới trải nghiệm, khi kết hợp cùng Flavors - Hương vị của niềm hân hoan, hạnh phúc và năng lượng tích cực. Món ăn là phép màu và hương vị là chìa khóa mở ra những trải nghiệm. Hãy cùng nhau khám phá!",
  //   },
  // ];
  const dataSlider = listMenu.map(menu => {

    return {
      id: menu.id,
      name: menu.name,
      img: (menu.images)[0],
      descriptions: menu ? menu.description : "Phép màu giúp chúng ta vượt ra khỏi những giới hạn về định nghĩa, tự do sáng tạo thế giới trải nghiệm, khi kết hợp cùng Flavors - Hương vị của niềm hân hoan, hạnh phúc và năng lượng tích cực. Món ăn là phép màu và hương vị là chìa khóa mở ra những trải nghiệm. Hãy cùng nhau khám phá!",
      link: `/client/chi-tiet-thuc-don/${menu.slug}`,
    };
  });
  // console.log('dataSlider',dataSlider);

  return (
    <Slider ref={sliderRef} {...menuSliderSettings}>
      {dataSlider.map((i, index) => {
        return (
          <div key={index}>
            <div className="flex flex-row justify-center items-end gap-10 mt-20 max-md:mt-10">
              <div className="flex justify-center">
                <div className="absolute text-left-to-right">
                  <h1 className="text-5xl relative right-[210px] top-[100px] uppercase text-gold font-bold -rotate-90 max-lg:text-4xl max-lg:right-[150px] max-lg:top-[75px] max-sm:right-[72px] max-sm:text-xl max-sm:top-[40px] max-sm:hidden">
                    Thực đơn
                  </h1>
                </div>
                <div className="min-h-[440px] max-w-[340px] bg-custom-gradient flex flex-col justify-between p-4 gap-5 max-md:w-full max-lg:max-w-[250px] max-sm:min-h-[250px] max-sm:p-2 max-sm:max-w-[135px] z-10">
                  <div>
                    <h1
                      className="uppercase text-5xl delay-1000 text-right-to-left max-sm:text-xl"
                      style={{ animationDelay: "0.1s" }}
                      id="sliderEvent"
                    >
                      {i.name}
                    </h1>
                    <p
                      className="text-base font-gilroy text-right-to-left max-sm:text-[10px] max-sm:leading-3"
                      style={{ animationDelay: "0.3s" }}
                    >
                      {i.descriptions}
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <ButtonDiscover className="w-fit px-3" link={i.link} />
                    <div className="flex">
                      <div onClick={prevSlide} className="cursor-pointer mx-3">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="44"
                          height="45"
                          viewBox="0 0 44 45"
                          fill="none"
                        >
                          <path
                            d="M3.66602 22.5001C3.66602 32.6201 11.8793 40.8334 21.9993 40.8334C32.1193 40.8334 40.3327 32.6201 40.3327 22.5001C40.3327 12.3801 32.1193 4.16675 21.9993 4.16675C11.8793 4.16675 3.66602 12.3801 3.66602 22.5001ZM36.666 22.5001C36.666 30.6034 30.1027 37.1667 21.9993 37.1667C13.896 37.1667 7.33268 30.6034 7.33268 22.5001C7.33268 14.3967 13.896 7.83341 21.9993 7.83341C30.1027 7.83341 36.666 14.3967 36.666 22.5001ZM14.666 22.5001L21.9993 15.1667L24.5843 17.7517L21.6877 20.6667H29.3327V24.3334H21.6877L24.6027 27.2484L21.9993 29.8334L14.666 22.5001Z"
                            fill="#F7F5F2"
                          />
                        </svg>
                      </div>
                      <div onClick={nextSlide} style={{ cursor: "pointer" }}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="44"
                          height="45"
                          viewBox="0 0 44 45"
                          fill="none"
                        >
                          <path d="M40.3327 22.5001C40.3327 12.3801 32.1193 4.16675 21.9993 4.16675C11.8793 4.16675 3.66602 12.3801 3.66602 22.5001C3.66602 32.6201 11.8793 40.8334 21.9993 40.8334C32.1193 40.8334 40.3327 32.6201 40.3327 22.5001ZM7.33268 22.5001C7.33268 14.3967 13.896 7.83341 21.9993 7.83341C30.1027 7.83341 36.666 14.3967 36.666 22.5001C36.666 30.6034 30.1027 37.1667 21.9993 37.1667C13.896 37.1667 7.33268 30.6034 7.33268 22.5001ZM29.3327 22.5001L21.9993 29.8334L19.4143 27.2484L22.311 24.3334H14.666V20.6667H22.311L19.396 17.7517L21.9993 15.1667L29.3327 22.5001Z"
                            fill="#F7F5F2"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-[450px] h-[650px]  p-5 bg-white max-lg:max-w-[300px] max-sm:max-h-[257px] max-sm:p-2 max-sm:w-[135px]">
                <Image
                  src={`${i.img || '/Alacarte-Menu-Thumbnail.png'}`}
                  alt="menu"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
        );
      })}
    </Slider>
  );
};
export default CustomSliderMenu;
