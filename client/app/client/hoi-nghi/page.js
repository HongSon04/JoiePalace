"use client";
import { useEffect } from "react";
import dynamic from "next/dynamic";
import mouseIcon from "../../../public/mouse.svg";
import { motion } from "framer-motion";
import { Image } from "@chakra-ui/react";
import Footer from "@/app/_components/FooterClient";

const CustomSliderMenu = dynamic(() => import("@/app/_components/CustomSliderMenu"), {
  ssr: false,
});

const ScrollFullPage = dynamic(() => import("@/app/_components/ScrollFullPage"), {
  ssr: false,
});

const isBrowser = typeof window !== "undefined";

function Conference() {
  useEffect(() => {
    if (isBrowser) {
      console.log("Client-side logic here");
    }
  }, []);

  return (
    <div className="m-auto h-full" id="fullpage">
      <ScrollFullPage>
        <div className="section ">
          <section className="select-none flex max-h-screen justify-between items-start max-lg:pt-20 lg:px-[25px] xl:max-w-screen-xl m-auto">
            <div className="flex flex-col justify-center max-sm:w-full lg:h-screen z-10 max-lg:w-[65%] max-sm:hidden">
              <Image
                className="w-full h-full object-cover"
                src="/Meeting-1-1.jpg"
                alt=""
              />
            </div>
            <div className="flex flex-col mx-5 z-30 w-[400px] md:h-screen lg:justify-center max-sm:mx-2 ">
              <h1 className="text-gold mb-10 font-bold text-fade-in font-gilroy text-7xl max-lg:text-5xl max-sm:text-xl max-sm:mb-2 ">
                Hội nghị
              </h1>
              <p className="flex-wrap text-white text-fade-in text-base font-gilroy max-sm:text-[13px] ">
                Trung tâm Sự kiện White Palace là địa điểm hoàn hảo để bạn có
                thể tổ chức cùng lúc hội nghị hàng ngàn khách mời, hội thảo
                chuyên đề và các buổi họp cấp cao. Tất cả đều có thể diễn ra
                cùng với dịch vụ hội nghị chuyên nghiệp, được phục vụ bởi hàng
                trăm nhân sự tại đây. Tùy vào mục đích và loại hình hội nghị mà
                bạn có thể lựa chọn cho mình hình thức bố trí và dịch vụ phù
                hợp.
              </p>
            </div>
            <div className="bgYellow md:before:h-screen w-[350px] mb:w-[250px] relative flex flex-col md:justify-center lg:h-full max-lg:bottom-[100px] max-lg:pb-[80px] max-sm:pb-[100px]">
              <div className="max-lg:mt-[150px] max-sm:pb-[50px]">
                <div className="bg-gray-500 max-w-[60%] relative top-[20px] left-[20px] z-10">
                  <Image
                    className="w-full h-full object-cover"
                    src="/Meeting-2-scaled-e1719419350353.jpg"
                    alt=""
                  />
                </div>
                <div className="bg-gray-400 max-w-[60%] relative top-[-20px] left-[35%] z-20">
                  <Image
                    className="w-full h-full object-cover"
                    src="/Meeting-3.jpg"
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
          <section className="select-none max-h-[89vh] mt-[80px] max-md:mt-0 overflow-y-scroll sectionEvent affterSS2 max-sm:after:w-[48px] max-sm:after:h-[20%] ">
            <div className="ml-[180px] mt-[100px] max-lg:mt-0 max-lg:ml-10">
              <h1 className="uppercase text-5xl wrap text-gold font-bold font-gilroy text-fade-in max-lg:text-5xl max-sm:text-xl">
                Dịch vụ <br /> Hội nghị
              </h1>
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
                <div className="relative right-[135px] max-lg:right-[40px] max-lg:bottom-[90px] max-sm:right-[25px] max-sm:bottom-[160px]">
                  <div className="max-w-[641px] max-h-[430px] ">
                    <Image src="/meeting-6.png" alt="" />
                  </div>
                  <p className="max-w-[641px] text-base relative left-[70px] top-[25px] text-fade-in max-lg:left-0 max-lg:top-0 max-sm:text-[10px] max-sm:leading-4">
                    Tại White Palace, chúng tôi cung cấp các gói họp hội nghị
                    tiêu chuẩn nửa ngày và nguyên ngày với mức giá linh hoạt cho
                    doanh nghiệp. Dựa trên quy mô và tính chất của hội nghị, các
                    chuyên gia của chúng tôi sẽ thiết kế và sắp xếp phương án
                    tối ưu nhất. Đặc biệt, White Palace sẽ luôn đồng hành, hỗ
                    trợ khách hàng và đối tác trong suốt quá trình tổ chức, đảm
                    bảo sự kiện diễn ra suôn sẻ, chỉn chu trong từng chi tiết.
                    <ul>
                      <li>
                        {" "}
                        - Dịch vụ hội nghị trọn gói nửa ngày, không có ăn trưa
                      </li>
                      <li>
                        {" "}
                        - Dịch vụ hội nghị trọn gói cả ngày, không có ăn trưa
                      </li>
                      <li> - Dịch vụ hội nghị trọn gói nửa ngày, có ăn trưa</li>
                      <li> - Dịch vụ hội nghị trọn gói cả ngày, có ăn trưa</li>
                    </ul>
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
        <div className="section">
          <CustomSliderMenu />
        </div>
        <section className="section">
          <Footer />
        </section>
      </ScrollFullPage>
    </div>
  );
}

export default Conference;
