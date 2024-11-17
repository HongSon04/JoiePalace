"use client";
import React, { useEffect, useCallback, useState } from "react"; // Import React
import { useDispatch } from "react-redux"; // Import useDispatch
import ScrollFullPage from "@/app/_components/ScrollFullPage";
import mouseIcon from "../../../public/mouse.svg";
import { motion } from "framer-motion";
import { Image } from "@chakra-ui/react";
import Footer from "@/app/_components/FooterClient";
import CustomSliderMenu from "@/app/_components/CustomSliderMenu";
import ButtonDiscover from "@/app/_components/ButtonDiscover";
import Link from "next/link";




function Event() {

  return (
    <div className="m-auto h-full" id="fullpage">
      <ScrollFullPage>
        <div className="section ">
          <section className="select-none flex max-h-screen justify-between items-start max-lg:pt-20 lg:px-[25px] xl:max-w-screen-xl m-auto">
            <div className="flex flex-col justify-center lg:h-screen z-10 max-lg:w-[75%] max-md:hidden">
              <Image
                className="w-full h-full object-cover"
                src="/menu1.png"
                alt=""
              />
            </div>
            <div className="flex flex-col mx-5 z-30 w-[400px] md:h-screen lg:justify-center max-sm:mx-2 ">
              <h1 className="text-gold mb-10 font-bold text-fade-in font-gilroy text-7xl max-xl:text-5xl max-sm:text-xl max-sm:mb-2 uppercase">
                Thực đơn
              </h1>
              <p className="flex-wrap text-white text-fade-in text-base font-gilroy max-sm:text-[13px] max-sm:leading-6">
                Với giá trị thẩm mỹ kiến trúc và chất lượng dịch vụ độc đáo, White Palace là không gian lý tưởng cho mọi kế hoạch tiệc cưới của bạn. Từ các buổi tiệc cá nhân như thôi nôi, sinh nhật, tiệc cưới đến các chương trình nghệ thuật sáng tạo và tiệc trọng thể của doanh nghiệp như ra mắt sản phẩm, tri ân khách hàng, tiệc tất niên và triển lãm thương mại.
              </p>
            </div>
            <div className="bgYellow lg:before:h-screen w-[350px] mb:w-[250px] relative flex flex-col md:justify-center lg:h-full max-lg:pb-[100px]">
              <div className="max-lg:mt-[80px]">
                <div className="bg-gray-500 max-w-[55%] relative top-[20px] left-[20px] z-10">
                  <Image
                    className="w-full h-full object-cover"
                    src="/menu2.png"
                    alt=""
                  />
                </div>
                <div className="bg-gray-400 max-w-[55%] relative top-[-30px] left-[35%] z-20">
                  <Image
                    className="w-full h-full object-cover"
                    src="/menu3.png"
                    alt=""
                  />
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
          <CustomSliderMenu/>
        </div>
        <div className="section">
          <div className="select-none flex h-screen max-lg:h-fit max-lg:py-10 justify-between items-center px-[200px] max-xl:px-[100px] max-lg:px-[50px]">
            {/* Left Section */}
            <div className="text-left max-w-[380px]  max-lg:max-w-[55%] max-sm:max-w-[100%]">
              <h2 className="text-[48px] max-lg:text-[24px]  font-bold text-gold mb-4 uppercase font-gilroy">TẠO THỰC ĐƠN</h2>
              <p className="text-white mb-6  max-lg:text-[13px]">
                Nhầm gia tăng trải nghiệm của quý khách và thích ứng với thị trường hiện tại, Joie Palace ra mắt tính năng <Link href={''} className="font-bold" >“Tạo thực đơn”</Link>, thực đơn được tạo riêng sẽ mang lại nét đặc trưng, sự thoải mái và tính phù hợp với từng mục đích của buổi tiệc.
              </p>
              <ButtonDiscover name={'Tạo ngay'} link={'/client/tao-thuc-don'}></ButtonDiscover>
            </div>
            <div className="relative bottom-10 right-24  max-lg:right-4 max-sm:hidden">
              <div className="max-xl:w-48 max-lg:w-32 w-64 h-auto shadow-lg p-2 bg-white right-10">
                <Image
                  src="/Alacarte-Menu-Thumbnail.png"
                  alt=""
                />
              </div>
              <div className="max-xl:w-48 max-lg:w-32 absolute top-28 left-24 max-lg:left-14 max-lg:top-10 w-64 h-auto shadow-lg max-sm:left-0  p-2 bg-white">
                <Image
                  src="/Alacarte-Menu-Thumbnail.png"
                  alt=""
                />
              </div>
              <div className="max-xl:w-48 max-lg:w-32 absolute top-44 max-lg:top-20  right-32 max-lg:right-14 max-sm:right-0 w-64 h-auto shadow-lg  p-2 bg-white">
                <Image
                  src="/Alacarte-Menu-Thumbnail.png"
                  alt=""
                />
              </div>
            </div>
          </div>
        </div>
        <section className="section">
          <Footer />
        </section>
      </ScrollFullPage>
    </div>
  );
}

export default Event;
