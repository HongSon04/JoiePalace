"use client";
import { useEffect, useRef, useState } from "react";
import { Image } from "@chakra-ui/react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ButtonDiscover from "./ButtonDiscover";
import Link from "next/link";

const SliderMenuDish = ({ title, dataSlider, logo, idDish }) => {
    const sliderRef = useRef(null);
    const [dataDish, setDataDish] = useState([]);
    useEffect(() => {
        setDataDish(dataSlider)
    }, [])
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
        dots: true,
        customPaging: (i) => (
            <div className="custom-dot-line"></div>
        ),
        dotsClass: "slick-dots custom-dots-line",
        slidesToShow: 1.35,
        slidesToScroll: 1,
        infinite: false,
        speed: 1500,
        autoplaySpeed: 3000,
        cssEase: "ease-in-out",
        arrows: false,
    };

    return (
        <section className="flex items-center w-[60%] max-xl:w-[80%] max-2md:w-[95%] m-auto max-sm:py-[40px] " id={idDish}>
            <div className="w-full min-h-[458.67px] ">
                <div className="flex justify-between items-center">
                    <div className="flex items-center">
                        <div className="mr-4">
                            <Image
                                className="max-2md:w-[40px]"
                                src={logo.src}
                                alt={logo.name}
                            />
                        </div>
                        <div className="font-semibold text-3xl leading-[68px] text-left font-gilroy text-gold max-2md:text-base">{title}</div>
                    </div>
                    {dataDish.length > 1 && (
                        <div className="flex ">
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
                                    <path
                                        d="M40.3327 22.5001C40.3327 12.3801 32.1193 4.16675 21.9993 4.16675C11.8793 4.16675 3.66602 12.3801 3.66602 22.5001C3.66602 32.6201 11.8793 40.8334 21.9993 40.8334C32.1193 40.8334 40.3327 32.6201 40.3327 22.5001ZM7.33268 22.5001C7.33268 14.3967 13.896 7.83341 21.9993 7.83341C30.1027 7.83341 36.666 14.3967 36.666 22.5001C36.666 30.6034 30.1027 37.1667 21.9993 37.1667C13.896 37.1667 7.33268 30.6034 7.33268 22.5001ZM29.3327 22.5001L21.9993 29.8334L19.4143 27.2484L22.311 24.3334H14.666V20.6667H22.311L19.396 17.7517L21.9993 15.1667L29.3327 22.5001Z"
                                        fill="#F7F5F2"
                                    />
                                </svg>
                            </div>
                        </div>
                    )}
                </div>
                <div className="">
                    <div className="affterSilderMenu"></div>
                    {dataDish.length < 1 ? (
                        <div className="flex flex-col items-center justify-center p-5 text-center relative top-[70px]">
                            <h2 className="font-bold text-xl text-white-700">Hiện tại menu chưa có phần món ăn.</h2>
                            <Link className="flex items-end text-gold mb-5 hover:text-gold " href={'/client/mon-an'}>
                                <div className="font-medium text-2xl leading-[40px] font-gilroy border-b-1 border-gold mr-8 max-2md:text-xl">Thêm món</div>
                            </Link>
                        </div>
                    ) : dataDish.length === 1 ? (
                        <div className="!flex items-center justify-center gap-6 max-sm:flex-col ">
                            <div className="flex justify-center items-center rounded-full border-gold border w-fit h-fit p-[10px]">
                                <div className="flex justify-center items-center rounded-full border-gold border w-fit h-fit p-[10px]">
                                    <div className="flex justify-center items-center w-[200px] h-[200px] max-2md:w-[150px] max-2md:h-[150px]">
                                        <Image
                                            className="object-cover h-[200px] w-[200px] max-2md:w-[150px] max-2md:h-[150px]"
                                            src={`/${dataDish[0].image}`}
                                            alt={dataDish[0].name}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col gap-6 ">
                                <h1 className="font-bold text-xl leading-[40px] text-left font-gilroy uppercase max-2md:text-lg">{dataDish[0].name}</h1>
                                <p className="font-normal text-lg leading-[40px] text-left font-gilroy max-2md:text-base">{dataDish[0].price}</p>
                                <p className="font-normal text-base text-left font-gilroy w-[80%] max-2md:text-[13px]">{dataDish[0].description}</p>
                                <Link className="font-normal text-lg leading-[40px] text-left font-gilroy text-gold border-b border-gold hover:text-gold w-fit max-2md:text-base" href={dataDish[0].link}>Khám phá</Link>
                            </div>
                        </div>
                    ) : (
                        <Slider ref={sliderRef} {...menuSliderSettings}>
                            {dataDish.length > 0 ? (
                                dataDish.map((item) => {
                                    return (
                                        <div key={item.id} className="!flex items-center justify-center gap-6 max-sm:flex-col ">
                                            <div className="flex justify-center items-center rounded-full border-gold border w-fit h-fit p-[10px]">
                                                <div className="flex justify-center items-center rounded-full border-gold border w-fit h-fit p-[10px]">
                                                    <div className="flex justify-center items-center w-[200px] h-[200px] max-2md:w-[150px] max-2md:h-[150px] bg">
                                                        <Image
                                                            className="object-cover h-[200px] w-[200px] max-2md:w-[150px] max-2md:h-[150px] rounded-full bg-cloche"
                                                            src={`${item.image}`}
                                                            alt=''
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex flex-col gap-6 w-full">
                                                <h1 className="font-bold text-xl leading-[40px] text-left font-gilroy uppercase max-2md:text-lg">{item.name}</h1>
                                                <p className="font-normal text-lg leading-[40px] text-left font-gilroy max-2md:text-base">{item.price}</p>
                                                <p className="font-normal text-base text-left font-gilroy w-[80%] max-2md:text-[13px]">{item.description}</p>
                                                <Link className="font-normal text-lg leading-[40px] text-left font-gilroy text-gold border-b border-gold hover:text-gold w-fit max-2md:text-base" href={item.link}>Khám phá</Link>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <p className="text-center text-lg text-red-500">Hiện tại chưa có món ăn nào.</p>
                            )}
                        </Slider>
                    )}
                </div>
            </div>
        </section>
    );
};

export default SliderMenuDish;

