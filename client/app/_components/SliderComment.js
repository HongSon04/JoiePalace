"use client";
import { useRef } from "react";

import { Image } from "@chakra-ui/react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ButtonDiscover from "./ButtonDiscover";
import Link from "next/link";



const SliderComment = ({ title, dataSlider, logo }) => {
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
        dots: true,
        customPaging: (i) => (
            <div className="custom-dot-line"></div>
        ),
        dotsClass: "slick-dots custom-dots-line",
        slidesToShow: 3,
        slidesToScroll: 3,
        infinite: true,
        speed: 1500,
        // autoplay: true,
        autoplaySpeed: 3000,
        cssEase: "ease-in-out",
        arrows: false,
        margin: '4px',
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
        <section className="flex items-center px-[32px]">
            <div className="w-full min-h-[458.67px] ">
                <div className="flex justify-center font-semibold text-4xl leading-[68px] text-gold font-gilroy uppercase">
                    ĐÁNH GIÁ CỦA KHÁCH HÀNG
                </div>
                <div className="">
                    <Slider ref={sliderRef} {...menuSliderSettings}>
                        {dataSlider.map((review) => (
                            <div className="p-2">
                                <div className="flex items-start bg-whiteAlpha-200 text-white p-6 rounded-lg max-w-lg">
                                    <Image
                                        src={review.avatar}
                                        alt="User profile"
                                        className="w-12 h-12 rounded-full mr-4"
                                    />
                                    <div className="min-h-[160px] flex flex-col justify-between">
                                        <p className="text-lg mb-2">
                                            <span className="text-4xl leading-none text-[#00BFA6]">“</span>
                                            {review.content}
                                        </p>
                                        <div>
                                            <div>
                                                <p className="text-sm text-gray-400">
                                                    Mức độ: <span className="text-[#00BFA6]">{review.satisfaction}</span>
                                                </p>
                                                <p className="text-xs text-gray-400 mt-1">{review.timeAgo}</p>
                                            </div>
                                            <p className="text-right text-white font-semibold mt-2">{review.author}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </Slider>
                </div>
            </div>
        </section>
    );
};
export default SliderComment;
