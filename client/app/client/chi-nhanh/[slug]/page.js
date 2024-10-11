"use client";

import Footer from "@/app/_components/FooterClient";
import ScrollFullPage from "@/app/_components/ScrollFullPage";
import { motion } from "framer-motion";
import { Image } from "@chakra-ui/react";
import TextFade from "@/app/_components/TextFade";
import IconButton from "@/app/_components/IconButton";
import ButtonDiscover from "@/app/_components/ButtonDiscover";
import Loading from "@/app/loading";
import { useParams } from "next/navigation";
import { title } from "process";

const textContainerVariants = {
  hidden: { opacity: 0, y: 150, x: 0 },
  visible: {
    opacity: 1,
    y: 130,
    transition: {
      duration: 1.5,
      ease: "easeIn",
    },
  },
};

const PageLocation = () => {
  const { slug } = useParams();
  console.log(slug);
  

  // const { slug } = router.query;
  return (
    <ScrollFullPage>
      {/* banner */}
      {/* <section className="section banner w-full h-screen relative top-0 left-0">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          <Image
            src="/images-client/banners/banner-2.png"
            w={"100%"}
            h={"100%"}
            className="object-cover"
            alt=""
          />
        </div>
        <motion.div
          variants={textContainerVariants}
          initial="hidden"
          animate="visible"
          className="absolute h-full flex flex-col gap-8 items-center w-full top-0 left-0"
        >
          <span className="text-[64px] font-medium leading-[80px] text-center w-4/6">
            KHÔNG GIAN
          </span>
          <span className="text-[84px] font-medium leading-[80px] text-center w-4/6">
            TINH TẾ
          </span>
          <span className="text-[64px] font-medium leading-[80px] text-center w-4/6">
            GỢI MỞ
          </span>
          <span className="text-[84px] font-medium leading-[80px] text-center w-4/6">
            SỰ SÁNG TẠO
          </span>
        </motion.div>
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
      </section>
      <section className="section">
        <div className="w-screen h-screen grid grid-cols-12 grid-rows-12 gap-y-5">
          <div className="grid col-start-1 col-end-3 row-start-1 row-end-7 pt-5 overflow-hidden">
            <Image
              src="https://whitepalace.com.vn/wp-content/uploads/2024/01/venue-1.png"
              w={"100%"}
              h={"100%"}
              className="object-cover"
              alt=""
            />
          </div>
          <div className="grid col-start-2 col-end-4 row-start-6 row-end-13 pb-5 overflow-hidden">
            <Image
              src="https://whitepalace.com.vn/wp-content/uploads/2024/01/venue-2.png"
              w={"100%"}
              h={"100%"}
              className="object-cover"
              alt=""
            />
          </div>
          <div className="grid col-start-5 col-end-9 row-start-1 row-end-13">
            <TextFade
              settings={{
                hidden: { opacity: 0, x: 0, y: 70 },
                visible: {
                  opacity: 1,
                  x: 0,
                  y: 0,
                  transition: {
                    duration: 2,
                    delay: 0.25,
                    ease: "easeOut",
                  },
                },
              }}
              replayEffect={true}
            >
              <span className="w-full h-full flex text-center justify-center items-center text-base font-normal leading-7">
                Tọa lạc tại số 194 Hoàng Văn Thụ – Quận Phú Nhuận, tuyến giao
                thông huyết mạch kết nối sân bay Tân Sơn Nhất và trung tâm thành
                phố, Trung tâm Sự kiện White Palace là một trong những địa điểm
                tổ chức sự kiện có thẩm mỹ kiến trúc và chất lượng dịch vụ hàng
                đầu tại Thành Phố Hồ Chí Minh. Trải qua hành trình hơn 17 năm
                hình thành và phát triển, với mong muốn mang đến cho khách hàng
                những trải nghiệm tối ưu nhất, Trung tâm Sự kiện White Palace đã
                chuyển mình đầy ngoạn mục với diện mạo hoàn toàn mới, khẳng định
                vị thế hàng đầu của một thương hiệu tiên phong trong lĩnh vực
                công nghệ hiếu khách tại Việt Nam.
              </span>
            </TextFade>
          </div>
          <div className="grid col-start-10 col-end-13 row-start-1 row-end-13 overflow-hidden">
            <Image
              src="https://whitepalace.com.vn/wp-content/uploads/2024/01/venue-3.png"
              w={"100%"}
              h={"100%"}
              className="object-cover"
              alt=""
            />
          </div>
        </div>
      </section> */}
      <section className="section w-screen h-screen">
        <div className="w-screen h-screen relative top-0 left-0">
          <div className="w-screen h-screen absolute top-0 left-0 overflow-hidden">
            <Image
              src="https://whitepalace.com.vn/wp-content/uploads/2024/06/Hall-A-Background_page-0001.jpg"
              w={"100%"}
              h={"100%"}
              className="object-cover"
              alt=""
            />
            <div className="w-full h-full absolute top-0 left-0 bg-whiteAlpha-50"></div>
          </div>
          <div className="w-screen h-screen flex flex-col justify-center items-center gap-9 absolute top-0 left-0 px-44">
            <div className="w-full h-auto flex justify-end">
              <div className="flex items-center gap-4">
                <IconButton
                  background="none"
                  type={"button"}
                  //   onClick={() => carouselRef.current.previous()}
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
                  //   onClick={() => carouselRef.current.next()}
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
            <div className="w-full h-auto flex gap-6">
              <div className="w-1/2 h-auto flex flex-col gap-8">
                <span className="uppercase text-5xl font-semibold">diwa</span>
                <span className="text-base font-normal leading-7">
                  Lấy cảm hứng từ lễ hội đèn trời nổi tiếng, các kiến trúc sư đã
                  kiến tạo nên không gian lãng mạn, huyền ảo tại Diwa. Sở hữu
                  công năng linh hoạt với sức chứa từ 300 đến 1.200 khách, sảnh
                  Diwa có thể đáp ứng đa dạng các loại hình sự kiện, từ tiệc
                  sinh nhật, sự kiện cưới đến các buổi hội nghị, hội thảo, tiệc
                  tất niên, gala dinner,…
                </span>
                <div className="mt-9">
                  <ButtonDiscover className="px-4" />
                </div>
              </div>
              <span className="w-[1px] h-full bg-white"></span>
              <div className="w-1/2 h-full bg-black"></div>
            </div>
          </div>
        </div>
      </section>
      <section className="section w-screen h-screen ">
        <div className="w-full h-full flex justify-center items-center gap-14 px-44">
          <div className="w-1/2 h-full flex flex-col gap-16">
            <span className="uppercase text-5xl font-bold text-gold">
              thông tin liên hệ
            </span>
            <div className="w-full h-auto flex flex-col gap-11">
              <span className="uppercase text-2xl font-normal">
                joice palace phạm văn đồng
              </span>
              <div className="w-full h-auto flex flex-col gap-6">
                <div className="w-full flex gap-6">
                  <Image src="/room.svg" alt="" />
                  <span className="text-base font-normal">
                    194 Hoàng Văn Thụ, Quận Phú Nhuận, Thành phố Hồ Chí Minh
                  </span>
                </div>
                <div className="w-full flex gap-6">
                  <Image src="/mail.svg" alt="" />
                  <span className="text-base font-normal">
                    info@joicepalace.com.vn
                  </span>
                </div>
                <div className="w-full flex gap-6">
                  <Image src="/phone.svg" alt="" />
                  <span className="text-base font-normal">035 243 1477</span>
                </div>
              </div>
            </div>
          </div>
          <div className="w-1/2 h-full rounded-sm overflow-hidden">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.9101447446287!2d106.71386767480566!3d10.825879989325873!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317529b446117cb9%3A0x7549cfeabc04d7d0!2zV2hpdGUgUGFsYWNlIFBo4bqhbSBWxINuIMSQ4buTbmc!5e1!3m2!1svi!2s!4v1726236625632!5m2!1svi!2s"
              width="100%"
              height="100%"
              loading="lazy"
            ></iframe>
          </div>
        </div>
      </section>
      <section className="section w-screen h-screen">
        <Footer />
      </section>
    </ScrollFullPage>
  );
};
export default PageLocation;
