"use client";

import { Image } from "@chakra-ui/react";

const Footer = () => {
  const images = ["Zalo.png", "Facebook.svg", "Instagram.svg", "TwitterX.png"];
  const locations = [
    { id: 1, name: "hoàng văn thụ" },
    { id: 2, name: "phạm văn đồng" },
    { id: 3, name: "võ văn kiệt" },
  ];
  const services = [
    { id: 1, name: "sự kiện" },
    { id: 2, name: "hội nghị" },
    { id: 3, name: "tiệc cưới" },
  ];
  const other = [
    { id: 1, name: "tin tức" },
    { id: 2, name: "ưu đãi" },
    { id: 3, name: "mạng xã hội" },
  ];
  return (
    <footer className="flex flex-col gap-16 py-16 px-3 items-center justify-center">
      <div className="w-4/6 flex flex-col text-[80px] font-normal leading-[150%] uppercase max-xl:w-full max-lg:w-5/6 max-lg:text-[40px]">
        <span className="">nơi của sự thanh lịch</span>
        <span className="text-[#B5905B]">
          lòng hiếu khách và tinh thần duy mỹ
        </span>
      </div>
      <div className="flex justify-center gap-20 max-lg:w-5/6 max-lg:gap-10 max-sm:gap-1">
        <div className="flex flex-col gap-8 text-sm font-normal leading-5 max-sm:gap-4 max-sm:text-xs">
          <span>Copyright: 2023 White Palace All rights reserved</span>
          <span>
            Managed by <span className="font-bold">@NangTamFixBug Co. Ltd</span>
          </span>
        </div>
        <div className="flex flex-col gap-8 max-lg:gap-4">
          <span className="uppercase text-2xl font-normal text-[#B5905B] text-nowrap max-lg:text-xl max-sm:text-xs">
            địa điểm
          </span>
          {locations.map((location) => (
            <div
              key={location.id}
              className="flex flex-col gap-7 text-base font-normal leading-6 uppercase max-lg:text-base text-nowrap max-sm:text-xs"
            >
              {location.name}
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-8 max-lg:gap-4">
          <span className="uppercase text-2xl font-normal text-[#B5905B] text-nowrap max-lg:text-xl max-sm:text-xs">
            Dịch vụ
          </span>
          {services.map((service) => (
            <div
              key={service.id}
              className="flex flex-col gap-7 text-base font-normal leading-6 uppercase max-lg:text-base text-nowrap max-sm:text-xs"
            >
              {service.name}
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-8 max-lg:gap-4 ">
          {other.map((item) => (
            <span
              key={item.id}
              className="uppercase text-2xl font-normal text-[#B5905B] text-nowrap max-lg:text-xl max-sm:text-xs"
            >
              {item.name}
            </span>
          ))}
          <div className="flex items-center justify-between">
            {images.map((image, index) => (
              <div key={index} className="h-[24px] w-[24px]">
                <Image src={`/${image}`} alt="" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
