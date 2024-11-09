"use client";
import { useRef } from "react";

import { Image } from "@chakra-ui/react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ButtonDiscover from "./ButtonDiscover";
import Link from "next/link";



const SliderMenuDrink = ({ title, dataSlider, logo }) => {
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
        customPaging: (i) => (
            <div className="custom-dot-line"></div>
        ),
        dotsClass: "slick-dots custom-dots-line",
        slidesToShow: 2.124,
        slidesToScroll: 2,
        infinite: true,
        speed: 1500,
        // autoplay: true,
        autoplaySpeed: 3000,
        cssEase: "ease-in-out",
        arrows: false,
        responsive: [            
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1.139,
                    slidesToScroll: 1,
                },
            },
        ],
    };

    return (
        <section className="flex items-center w-[60%] max-xl:w-[80%] max-2md::w-[95%] m-auto max-sm:py-[40px]">
            <div className="w-full min-h-[450px] ">
                <div className="flex justify-between items-center">
                    <div className="flex">
                        <div className="mr-4">
                            <Image
                            className="max-2md:w-[40px]"
                                src={logo.src}
                                alt={logo.name}
                            />
                        </div>
                        <div className="font-semibold text-3xl leading-[68px] text-left font-gilroy text-gold max-sm:text-xl">{title}</div>
                    </div>
                    <div className="flex gap-8 max-sm:flex-col max-sm:gap-2  justify-center items-center">
                        <div className="flex justify-center">
                            <div
                                onClick={prevSlide}
                                className="cursor-pointer mx-3"
                            >
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
                            <div
                                onClick={nextSlide} style={{ cursor: "pointer" }}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="44"
                                    height="45"
                                    viewBox="0 0 44 45"
                                    fill="none"
                                >
                                    <path
                                        d="M40.3327 22.5001C40.3327 12.3801 32.1193 4.16675 21.9993 4.16675C11.8793 4.16675 3.66602 12.3801 3.66602 22.5001C3.66602 32.6201 11.8793 40.8334 21.9993 40.8334C32.1193 40.8334 40.3327 32.6201 40.3327 22.5001ZM7.33268 22.5001C7.33268 14.3967 13.896 7.83341 21.9993 7.83341C30.1027 7.83341 36.666 14.3967 36.666 22.5001C36.666 30.6034 30.1027 37.1667 21.9993 37.1667C13.896 37.1667 7.33268 30.6034 7.33268 22.5001ZM29.3327 22.5001L21.9993 29.8334L19.4143 27.2484L22.311 24.3334H14.666V20.6667H22.311L19.396 17.7517L21.9993 15.1667L29.3327 22.5001Z"
                                        fill="#F7F5F2"
                                    />
                                </svg>
                            </div>
                        </div>
                        <button
                            className={`bg-gold flex justify-center items-center gap-1 py-2 px-3 rounded-3xl cursor-pointer `} >
                            <span className="text-[1em] flex items-center h-6">Thêm món</span>
                        </button>
                    </div>
                </div>
                <div className="">
                    <Slider ref={sliderRef} {...menuSliderSettings}>
                        {dataSlider.map((item) => (
                            <div key={item.id} className="!flex items-center justify-center gap-6 max-sm:flex-col">
                                <div className="flex justify-center items-center w-fit h-fit p-[10px]">
                                    <p className="text-2xl"> 1.</p>
                                    <Image
                                        className="object-cover "
                                        src={`/${item.image}`}
                                        alt={item.name}

                                    />
                                </div>
                                <div className="flex flex-col gap-6">
                                    <h1 className="font-bold text-xl leading-[40px] text-left font-gilroy uppercase max-2md:text-lg">{item.name}</h1>
                                    <p className="font-normal text-lg leading-[40px] text-left font-gilroy max-2md:text-base">{item.price}</p>
                                    <p className="font-normal text-base text-left font-gilroy w-[80%] max-2md:text-[13px]">{item.description}</p>
                                    <Link className="font-normal text-lg leading-[40px] text-left font-gilroy text-gold border-b border-gold hover:text-gold w-fit max-2md:text-base" href={item.link}>Khám phá</Link>
                                </div>
                            </div>
                        ))}
                    </Slider>
                </div>
            </div>
        </section>
    );
};
export default SliderMenuDrink;
