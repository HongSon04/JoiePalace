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
import Footer from '@/app/_components/FooterClient';
import CustomSliderMenu from '@/app/_components/CustomSliderMenu';
import { Descriptions } from 'antd';

const dataslider = [
    {
        id:1,
        name: 'set menu',
        img:'Alacarte-Menu-Thumbnail.png',
        descriptions:'Phép màu giúp chúng ta vượt ra khỏi những giới hạn về định nghĩa, tự do sáng tạo thế giới trải nghiệm, khi kết hợp cùng Flavors - Hương vị của niềm hân hoan, hạnh phúc và năng lượng tích cực. Món ăn là phép màu và hương vị là chìa khóa mở ra những trải nghiệm. Hãy cùng nhau khám phá!'
    },
    {
        id:2,
        name: 'set menu 2',
        img:'Alacarte-Menu-Thumbnail.png',
        descriptions:'Phép màu giúp chúng ta vượt ra khỏi những giới hạn về định nghĩa, tự do sáng tạo thế giới trải nghiệm, khi kết hợp cùng Flavors - Hương vị của niềm hân hoan, hạnh phúc và năng lượng tích cực. Món ăn là phép màu và hương vị là chìa khóa mở ra những trải nghiệm. Hãy cùng nhau khám phá!'
    }
];

function Event() {

    return (
        <div className="m-auto h-full" id="fullpage">
            <ScrollFullPage>
                <div className="section ">
                    <section className='select-none flex max-h-screen justify-between items-start max-lg:pt-20 lg:px-[25px] xl:max-w-screen-xl m-auto'>
                        <div className="flex flex-col justify-center lg:h-screen z-10">
                            <img className="w-full h-full object-cover" src="/event-1.png" alt="" />
                        </div>
                        <div className="flex flex-col mx-5 z-30 w-[400px] md:h-screen lg:justify-center max-sm:mx-2 ">
                            <h1 className="text-gold mb-10 font-bold text-fade-in font-gilroy text-7xl max-lg:text-5xl max-sm:text-xl max-sm:mb-2 ">Sự kiện</h1>
                            <p className="flex-wrap text-white text-fade-in text-base font-gilroy max-sm:text-[10px] max-sm:leading-3">
                                Với những giá trị riêng biệt trong thẩm mỹ kiến trúc và chất lượng dịch vụ, White Palace là không gian hoàn hảo để triển khai bất kì kế hoạch sự kiện nào mà bạn đang ấp ủ, từ các buổi yến tiệc mang dấu ấn cá nhân như tiệc thôi nôi, sinh nhật, tiệc cưới đến các chương trình nghệ thuật giải trí sáng tạo, các sự kiện trọng thể của doanh nghiệp như tiệc ra mắt sản phẩm, tiệc tri ân khách hàng, tiệc tất niên, triển lãm thương mại.
                            </p>
                        </div>
                        <div className="bgYellow lg:before:h-screen w-[350px] mb:w-[250px] relative flex flex-col md:justify-center lg:h-full max-lg:bottom-[100px] max-lg:pb-[80px] max-sm:pb-[50px]">
                            <div className="max-lg:mt-[80px]">
                                <div className="bg-gray-500 max-w-[60%] relative top-[20px] left-[20px] z-10">
                                    <img className="w-full h-full object-cover" src="/event-2.png" alt="" />
                                </div>
                                <div className="bg-gray-400 max-w-[60%] relative top-[-20px] left-[35%] z-20">
                                    <img className="w-full h-full object-cover" src="/event-3.png" alt="" />
                                </div>
                            </div>
                        </div>
                    </section>
                    <div className="w-full h-auto absolute bottom-[10%] flex justify-center items-center max-lg:hidden">
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
                    <section className="select-none max-h-[89vh] mt-[80px] overflow-y-scroll sectionEvent affterSS2 max-sm:after:w-[48px] max-sm:after:h-[20%] ">
                        <div className="ml-[180px] mt-[100px] max-lg:mt-0 max-lg:ml-10">
                            <h1 className="uppercase text-5xl wrap text-gold font-bold font-gilroy text-fade-in max-lg:text-5xl max-sm:text-xl">Dịch vụ <br /> Sự kiện</h1>
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
                   <CustomSliderMenu dataSlider={dataslider}/>
                </div>
                <section className="section">
                    <Footer />
                </section>
            </ScrollFullPage>
        </div>
    );
}

export default Event;
