"use client";
import { useRef } from 'react';

import ScrollFullPage from "@/app/_components/ScrollFullPage";
import mouseIcon from "../../../public/mouse.svg";
import { motion } from "framer-motion";
import { Image } from "@chakra-ui/react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "@/app/_styles/index.css";

function Event() {
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
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
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
        <div className="m-auto h-full" id="fullpage">
            <ScrollFullPage>
                <div className="section">
                        <section className='flex h-screen justify-between items-start max-lg:pt-20 lg:px-[25px] xl:max-w-screen-xl m-auto'>
                            <div className="flex flex-col justify-center lg:h-screen z-10">
                                <img className="w-full h-full object-cover" src="https://whitepalace.com.vn/wp-content/uploads/2024/01/event-1.png" alt="" />
                            </div>
                            <div className="flex flex-col mx-5 z-30 w-[400px] md:h-screen lg:justify-center max-sm:mx-2">
                                <h1 className="text-gold mb-10 font-bold text-fade-in font-gilroy text-7xl max-lg:text-5xl max-sm:text-xl max-sm:mb-2">Sự kiện</h1>
                                <p className="flex-wrap text-white text-fade-in text-base font-gilroy max-sm:text-[10px] max-sm:leading-3">
                                    Với những giá trị riêng biệt trong thẩm mỹ kiến trúc và chất lượng dịch vụ, White Palace là không gian hoàn hảo để triển khai bất kì kế hoạch sự kiện nào mà bạn đang ấp ủ, từ các buổi yến tiệc mang dấu ấn cá nhân như tiệc thôi nôi, sinh nhật, tiệc cưới đến các chương trình nghệ thuật giải trí sáng tạo, các sự kiện trọng thể của doanh nghiệp như tiệc ra mắt sản phẩm, tiệc tri ân khách hàng, tiệc tất niên, triển lãm thương mại.
                                </p>
                            </div>
                            <div className="bgYellow w-[350px] mb:w-[250px] relative flex flex-col md:justify-center lg:h-full max-lg:bottom-[100px] max-lg:pb-[80px] max-sm:pb-[50px]">
                                <div className="max-lg:mt-[80px]">
                                    <div className="bg-gray-500 max-w-[60%] relative top-[20px] left-[20px] z-10">
                                        <img className="w-full h-full object-cover" src="https://whitepalace.com.vn/wp-content/uploads/2024/01/event-2.png" alt="" />
                                    </div>
                                    <div className="bg-gray-400 max-w-[60%] relative top-[-20px] left-[35%] z-20">
                                        <img className="w-full h-full object-cover" src="https://whitepalace.com.vn/wp-content/uploads/2024/01/event-3.png" alt="" />
                                    </div>
                                </div>
                            </div>
                        </section>
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
                    </div>
                    <div className="section">
                        <section className="h-[89vh] mt-[80px] overflow-y-scroll sectionEvent affterSS2 max-sm:after:w-[48px] max-sm:after:h-[20%]">
                            <div className="ml-[180px] mt-[100px] max-lg:mt-0 max-lg:ml-10">
                                <h1 className="uppercase text-5xl wrap text-gold font-bold font-gilroy text-fade-in max-lg:text-5xl max-sm:text-xl">Dịch vụ <br /> sự kiện</h1>
                            </div>
                            <div className="w-full relative bottom-[140px] max-xl:bottom-[-150px]  ">   
                                <div className="flex justify-center relative top-[100px] xl:max-w-screen-xl m-auto">
                                    <div className="relative left-[190px] max-xl:left-[135px] max-xl:top-[60px]  z-10 top-[100px] max-lg:top-[-20px] max-sm:top-[-130px] max-sm:left-[50px]">
                                        <div className="max-w-[371px] max-h-[464px]  ">
                                            <Image src="/meeting-4.png" alt="" />
                                        </div>
                                    </div>
                                    <div className="relative bottom-[200px] ">
                                        <div className="max-w-[395px] ">
                                            <Image src="/meeting-5.png" alt="" />
                                        </div>
                                    </div>
                                    <div className="relative right-[135px] z-[-1]  max-lg:right-[40px] max-lg:bottom-[90px] max-sm:right-[25px] max-sm:bottom-[160px]">
                                        <div className="max-w-[641px] max-h-[430px] ">
                                        <Image src="/meeting-6.png" alt="" />
                                        </div>
                                        <p className="max-w-[641px] text-base relative left-[70px] top-[25px] text-fade-in max-lg:left-0 max-lg:top-0 max-sm:text-[10px] max-sm:leading-4">
                                            Mọi không gian tại White Palace được thiết kế để có thể tùy biến một cách linh hoạt, phù hợp với mọi quy mô và hình thức tổ chức sự kiện. Từ những sự kiện trưng bày, triển lãm, đến những chương trình biểu diễn nghệ thuật hay hội nghị, ra mắt sản phẩm,... đều có thể lựa chọn được không gian phù hợp tại đây.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                <div className="section">
                    <section className="h-screen ">
                        <Slider ref={sliderRef} {...menuSliderSettings}>
                            <div>
                                <div className="flex justify-center items-end gap-10 mt-[80px] max-lg:gap-5">
                                    <div className="flex justify-center">
                                        <div className="absolute text-left-to-right"><h1 className="text-5xl relative right-[210px] top-[100px] uppercase text-gold font-bold -rotate-90 max-lg:text-4xl max-lg:right-[150px]  max-lg:top-[75px] max-sm:right-[72px] max-sm:text-xl max-sm:top-[40px] ">Thực đơn</h1></div>
                                        <div className="min-h-[440px] max-w-[340px] bg-custom-gradient flex flex-col justify-end p-4 gap-5 max-md:w-[100%] max-lg:max-w-[250px] max-sm:min-h-[250px] max-sm:p-2  max-sm:max-w-[135px]  max-sm:right-[80px] z-10">
                                            <h1 className="uppercase text-5xl delay-1000 text-right-to-left max-sm:text-xl" style={{ animationDelay: '0.1s' }} id='sliderEvent'>SET MENU</h1>
                                            <p className="text-base font-gilroy text-right-to-left max-sm:text-[10px] max-sm:leading-3" style={{ animationDelay: '0.3s' }}>Phép màu giúp chúng ta vượt ra khỏi những giới hạn về định nghĩa, tự do sáng tạo thế giới trải nghiệm, khi kết hợp cùng Flavors - Hương vị của niềm hân hoan, hạnh phúc và năng lượng tích cực. Món ăn là phép màu và hương vị là chìa khóa mở ra những trải nghiệm. Hãy cùng nhau khám phá!</p>
                                            <div className='flex items-center justify-between'>
                                                <div className='flex justify-center items-center rounded-full h-10 w-[130px] bg-yellow-400 hover:bg-gold text-right-to-left max-sm:text-xs' style={{ animationDelay: '0.6s' }}> <p>Khám phá</p><svg xmlns="http://www.w3.org/2000/svg" width="16" height="17" viewBox="0 0 16 17" fill="none">
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
                                        <Image src="/Alacarte-Menu-Thumbnail.png" alt="My Image" />
                                    </div>
                                </div>
                            </div>                          
                            <div>
                                <div className="flex justify-center items-end gap-10 mt-[80px] max-lg:gap-5">
                                    <div className="flex justify-center">
                                        <div className="absolute text-left-to-right"><h1 className="text-5xl relative right-[210px] top-[100px] uppercase text-gold font-bold -rotate-90 max-lg:text-4xl max-lg:right-[150px]  max-lg:top-[75px] max-sm:right-[72px] max-sm:text-xl max-sm:top-[40px] ">Thực đơn</h1></div>
                                        <div className="min-h-[440px] max-w-[340px] bg-custom-gradient flex flex-col justify-end p-4 gap-5 max-md:w-[100%] max-lg:max-w-[250px] max-sm:min-h-[250px] max-sm:p-2  max-sm:max-w-[135px]  max-sm:right-[80px] z-10">
                                            <h1 className="uppercase text-5xl delay-1000 text-right-to-left max-sm:text-xl" style={{ animationDelay: '0.1s' }} id='sliderEvent'>SET MENU</h1>
                                            <p className="text-base font-gilroy text-right-to-left max-sm:text-[10px] max-sm:leading-3" style={{ animationDelay: '0.3s' }}>Phép màu giúp chúng ta vượt ra khỏi những giới hạn về định nghĩa, tự do sáng tạo thế giới trải nghiệm, khi kết hợp cùng Flavors - Hương vị của niềm hân hoan, hạnh phúc và năng lượng tích cực. Món ăn là phép màu và hương vị là chìa khóa mở ra những trải nghiệm. Hãy cùng nhau khám phá!</p>
                                            <div className='flex items-center justify-between'>
                                                <div className='flex justify-center items-center rounded-full h-10 w-[130px] bg-yellow-400 hover:bg-gold text-right-to-left max-sm:text-xs' style={{ animationDelay: '0.6s' }}> <p>Khám phá</p><svg xmlns="http://www.w3.org/2000/svg" width="16" height="17" viewBox="0 0 16 17" fill="none">
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
                                        <Image src="/Alacarte-Menu-Thumbnail.png" alt="My Image" />
                                    </div>
                                </div>
                            </div>                          
                        </Slider>
                    </section>
                </div>


            </ScrollFullPage>
        </div>
    );
}

export default Event;
