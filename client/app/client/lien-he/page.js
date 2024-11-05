"use client";

import ButtonDiscover from "@/app/_components/ButtonDiscover";
import Contact from "@/app/_components/Contact";
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
        className="section w-full h-screen flex px-8 lg:px-24 2xl:px-44 pt-24 pb-9 gap-10"
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
            <Contact></Contact>
          </div>
          <div className="w-full lg:w-1/2 h-1/2 lg:h-[70%] rounded-sm overflow-hidden">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d7893.373649501081!2d106.68365245869786!3d10.804445099199677!3m2 !1i1024!2i768!4f13.1!3m3!1m2!1s0x317528d0911a5c55%3A0xef4a80f1f2c1a13b!2zQuG7h25oIHZp4buHbiDEkGEgS2hvYSBIb8OgbiBN4bu5IFPDoGkgR8Oybg!5e1!3m2!1svi!2s!4v1726154120512!5m2!1svi!2s"
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
