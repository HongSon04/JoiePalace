"use client";
import Image from "next/image";

const Footer = () => {
  const images = [
    "/Zalo.png",
    "/Facebook.svg",
    "/Instagram.svg",
    "/TwitterX.png",
  ];
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
      <div className="w-4/6 flex flex-col text-[80px] font-normal leading-[150%] uppercase">
        <span className="">nơi của sự thanh lịch</span>
        <span className="text-[#B5905B]">
          lòng hiếu khách và tinh thần duy mỹ
        </span>
      </div>
      <div className="flex justify-center gap-20">
        <div className="flex flex-col gap-8 text-sm font-normal leading-5">
          <span>Copyright: 2023 White Palace All rights reserved</span>
          <span>
            Managed by <span className="font-bold">@NangTamFixBug Co. Ltd</span>
          </span>
        </div>
        <div className="flex flex-col gap-8">
          <span className="uppercase text-2xl font-normal text-[#B5905B]">
            địa điểm
          </span>
          {locations.map((location) => (
            <div
              key={location.id}
              className="flex flex-col gap-7 text-base font-normal leading-6 uppercase"
            >
              {location.name}
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-8">
          <span className="uppercase text-2xl font-normal text-[#B5905B]">
            địa điểm
          </span>
          {services.map((service) => (
            <div
              key={service.id}
              className="flex flex-col gap-7 text-base font-normal leading-6 uppercase"
            >
              {service.name}
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-8">
          {other.map((item) => (
            <span
              key={item.id}
              className="uppercase text-2xl font-normal text-[#B5905B]"
            >
              {item.name}
            </span>
          ))}
          <div className="flex items-center justify-between">
            {images.map((image, index) => (
              <Image
                key={index}
                src={image}
                alt={`Image ${index}`}
                width={24}
                height={24}
              />
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
