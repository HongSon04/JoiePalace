"use client";
import { useRef } from 'react';

import { Image } from "@chakra-ui/react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const CustomSliderMenu = ({ dataSlider }) => {
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
        cssEase: 'ease-in-out',
        arrows: false,
        beforeChange: (current) => {
            const idElements = document.querySelectorAll('.text-right-to-left');
            if (idElements) {
                idElements.forEach(i => {
                    i.classList.remove('text-right-to-left');
                    setTimeout(() => {
                        i.classList.add('text-right-to-left');
                    }, 500);
                });
            }
        },

    };

    return (
        <section className="h-screen max-sm:h-fit">
            <Slider ref={sliderRef} {...menuSliderSettings}>
                {dataSlider.map(i => {
                    return <div>
                        <div className="flex justify-center items-end gap-10 mt-[80px] max-lg:gap-5">
                            <div className="flex justify-center">
                                <div className="absolute text-left-to-right"><h1 className="text-5xl relative right-[210px] top-[100px] uppercase text-gold font-bold -rotate-90 max-lg:text-4xl max-lg:right-[150px]  max-lg:top-[75px] max-sm:right-[72px] max-sm:text-xl max-sm:top-[40px] ">Thực đơn</h1></div>
                                <div className="min-h-[440px] max-w-[340px] bg-custom-gradient flex flex-col justify-end p-4 gap-5 max-md:w-[100%] max-lg:max-w-[250px] max-sm:min-h-[250px] max-sm:p-2  max-sm:max-w-[135px]  max-sm:right-[80px] z-10">
                                    <h1 className="uppercase text-5xl delay-1000 text-right-to-left max-sm:text-xl" style={{ animationDelay: '0.1s' }} id='sliderEvent'>{i.name}</h1>
                                    <p className="text-base font-gilroy text-right-to-left max-sm:text-[10px] max-sm:leading-3" style={{ animationDelay: '0.3s' }}>{i.descriptions}</p>
                                    <div className='flex items-center justify-between'>
                                        <div className='flex justify-center items-center rounded-full h-10 w-[130px] bg-yellow-400 hover:bg-gold text-right-to-left max-sm:text-[10px] ' style={{ animationDelay: '0.6s' }}> <p>Khám phá</p><svg xmlns="http://www.w3.org/2000/svg" width="16" height="17" viewBox="0 0 16 17" fill="none">
                                            <path d="M7.52867 12.0286L8.47133 12.9712L12.9427 8.4999L8.47133 4.02856L7.52867 4.97123L10.3907 7.83323H4V9.16656H10.3907L7.52867 12.0286Z" fill="white" />
                                        </svg></div>
                                        <div className='flex '>
                                            <div onClick={prevSlide} className='cursor-pointer mx-3'>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="44" height="45" viewBox="0 0 44 45" fill="none">
                                                    <path d="M3.66602 22.5001C3.66602 32.6201 11.8793 40.8334 21.9993 40.8334C32.1193 40.8334 40.3327 32.6201 40.3327 22.5001C40.3327 12.3801 32.1193 4.16675 21.9993 4.16675C11.8793 4.16675 3.66602 12.3801 3.66602 22.5001ZM36.666 22.5001C36.666 30.6034 30.1027 37.1667 21.9993 37.1667C13.896 37.1667 7.33268 30.6034 7.33268 22.5001C7.33268 14.3967 13.896 7.83341 21.9993 7.83341C30.1027 7.83341 36.666 14.3967 36.666 22.5001ZM14.666 22.5001L21.9993 15.1667L24.5843 17.7517L21.6877 20.6667H29.3327V24.3334H21.6877L24.6027 27.2484L21.9993 29.8334L14.666 22.5001Z" fill="#F7F5F2" />
                                                </svg>
                                            </div>
                                            <div onClick={nextSlide} style={{ cursor: 'pointer' }}>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="44" height="45" viewBox="0 0 44 45" fill="none">
                                                    <path d="M40.3327 22.5001C40.3327 12.3801 32.1193 4.16675 21.9993 4.16675C11.8793 4.16675 3.66602 12.3801 3.66602 22.5001C3.66602 32.6201 11.8793 40.8334 21.9993 40.8334C32.1193 40.8334 40.3327 32.6201 40.3327 22.5001ZM7.33268 22.5001C7.33268 14.3967 13.896 7.83341 21.9993 7.83341C30.1027 7.83341 36.666 14.3967 36.666 22.5001C36.666 30.6034 30.1027 37.1667 21.9993 37.1667C13.896 37.1667 7.33268 30.6034 7.33268 22.5001ZM29.3327 22.5001L21.9993 29.8334L19.4143 27.2484L22.311 24.3334H14.666V20.6667H22.311L19.396 17.7517L21.9993 15.1667L29.3327 22.5001Z" fill="#F7F5F2" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="max-w-[450px] p-5 bg-white max-lg:max-w-[300px] max-sm:p-2 max-sm:w-[135px]">
                                <Image src={`/${i.img}`} alt="My Image" />
                            </div>
                        </div>
                    </div>
                })}

            </Slider>
        </section>
    );
}
export default CustomSliderMenu;