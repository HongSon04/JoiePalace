"use client";

import ButtonDiscover from "@/app/_components/ButtonDiscover";
import Footer from "@/app/_components/FooterClient";
import InputIndex from "@/app/_components/InputIndexClient";
import TextFade from "@/app/_components/TextFade";
import { Image } from "@chakra-ui/react";

const LienHe = () => {
  return (
    <div className="w-full min-h-screen flex flex-col" id="main-contact">
      <section className="w-full h-[60%] overflow-hidden">
        <Image
          src="/images-client/banners/banner-page-thankyou.jpg"
          w={"100%"}
          h={"auto"}
          className="object-cover"
          alt=""
        />
      </section>
      <section
        className="section w-screen h-screen flex px-8 lg:px-24 2xl:px-44 pt-24 pb-9 gap-10"
        id="section-information"
      >
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
          styles="w-screen flex flex-col items-center lg:flex-row gap-10"
          replayEffect={true}
        >
          <div className="w-full lg:w-1/2 h-1/2 lg:h-full flex flex-col gap-10">
            <h1 className="uppercase text-gold font-bold text-5xl leading-[100%]">
              thông tin liên hệ
            </h1>
            <form
              className="w-full h-auto flex flex-col gap-5 overflow-y-scroll pr-1"
              id="form-information"
            >
              <InputIndex type="text" placeholder="Họ và tên*" />
              <InputIndex type="number" placeholder="Số điện thoại*" />
              <InputIndex type="email" placeholder="Email*" />
              <InputIndex type="text" placeholder="Công ty*" />
              <div className="w-full py-3 flex items-center justify-between border border-b-white border-t-0 border-l-0 border-r-0">
                <span>Sự kiện*</span>
                <div className="h-full flex items-center gap-3">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="accountType"
                      value="business"
                      className="form-radio text-green-600 focus:ring-green-500 h-4 w-4"
                    />
                    <span className="ml-2 text-white">Doanh nghiệp</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="accountType"
                      value="business"
                      className="form-radio text-green-600 focus:ring-green-500 h-4 w-4"
                    />
                    <span className="ml-2 text-white">Cá nhân</span>
                  </label>
                </div>
              </div>
              <div className="w-full flex items-center justify-between">
                <span>Địa điểm*</span>
                <div className="w-[40%] h-full flex items-center gap-3">
                  <select
                    name=""
                    id=""
                    className="w-full border border-darkGreen-700 p-3 py-2 rounded-sm"
                  >
                    <option className="text-black" value="1">
                      Hoàng Văn Thụ
                    </option>
                    <option className="text-black" value="2">
                      Phạm Văn Đồng
                    </option>
                    <option className="text-black" value="3">
                      Võ Văn Kiệt
                    </option>
                  </select>
                </div>
              </div>
              <InputIndex type="number" min="0" placeholder="Số lượng khách*" />
              <InputIndex type="datetime-local" placeholder="Thời gian*" />
              <InputIndex
                type="text"
                placeholder="Ghi chú*"
                styles="overflow-hidden"
              />
              <div className="w-full flex justify-end">
                <ButtonDiscover name={"Gửi"} className={"w-auto px-6"} />
              </div>
            </form>
          </div>
          <div className="w-full lg:w-1/2 h-1/2 lg:h-[70%] rounded-sm overflow-hidden">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d7893.373649501081!2d106.68365245869786!3d10.804445099199677!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317528d0911a5c55%3A0xef4a80f1f2c1a13b!2zQuG7h25oIHZp4buHbiDEkGEgS2hvYSBIb8OgbiBN4bu5IFPDoGkgR8Oybg!5e1!3m2!1svi!2s!4v1726154120512!5m2!1svi!2s"
              width="100%"
              height="100%"
              allowfullscreen=""
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
            />
          </div>
        </TextFade>
      </section>
      <section>
        <Footer />
      </section>
    </div>
  );
};

export default LienHe;
