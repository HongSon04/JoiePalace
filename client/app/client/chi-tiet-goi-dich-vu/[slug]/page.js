"use client";
import ButtonDiscover from "@/app/_components/ButtonDiscover";
import Footer from "@/app/_components/FooterClient";
import IconButton from "@/app/_components/IconButton";
import { API_CONFIG } from "@/app/_utils/api.config";
import { Image } from "@chakra-ui/react";
import axios from "axios";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const listSpaces = [
  {
    id: 0,
    name: "Space 1",
    url: "https://i.pinimg.com/736x/42/d8/ea/42d8eaa1d9228f748c61c7d0db2c5c62.jpg",
  },
  {
    id: 1,
    name: "Space 1",
    url: "https://i.pinimg.com/736x/42/d8/ea/42d8eaa1d9228f748c61c7d0db2c5c62.jpg",
  },
  {
    id: 2,
    name: "Space 1",
    url: "https://i.pinimg.com/736x/42/d8/ea/42d8eaa1d9228f748c61c7d0db2c5c62.jpg",
  },
  {
    id: 3,
    name: "Space 1",
    url: "https://i.pinimg.com/736x/42/d8/ea/42d8eaa1d9228f748c61c7d0db2c5c62.jpg",
  },
  {
    id: 4,
    name: "Space 1",
    url: "https://i.pinimg.com/736x/42/d8/ea/42d8eaa1d9228f748c61c7d0db2c5c62.jpg",
  },
];

const Page = () => {
  const { slug } = useParams();
  console.log(API_CONFIG.PACKAGES.GET_ALL);

  useEffect(() => {
    const fecthData = async () => {
      const data = await axios.get(API_CONFIG.PACKAGES.GET_ALL);
      console.log(data.data);
    };
    fecthData();
  }, []);

  const [optionIndex, setOptionIndex] = useState(0);
  const [spaceIndex, setSpaceIndex] = useState(0);
  return (
    <div className="w-full px-48">
      <section className="w-full h-screen pt-[150px] pb-[60px] flex justify-between items-center relative">
        <div className="w-2/5 h-auto flex flex-col gap-8">
          <small className="text-gold text-base font-normal leading-6">
            Được lựa chọn nhiều nhất
          </small>
          <h1 className="uppercase text-gold text-5xl font-semibold leading-[68px]">
            gói tiệc cưới lãng mạn
          </h1>
          <p className="text-base font-normal leading-6">
            Một trong những gói dịch vụ tiệc cưới với chất lượng hàng đầu và là
            sự lựa chọn của rất nhiều cặp đôi. Gói dịch vụ mang lại trải nghiệm
            trọn vẹn, ấm cúng và bắt mắt với phong cách trang trí lãng mạn,
            không quá cầu kỳ nhưng lại mang tới không khí thân mật, gần gũi và
            đặt biệt, tiết kiệm ngân sách tối đa cho các cặp đôi. Cùng khám phá
            xem, “GÓI TIỆC CƯỚI LÃNG MẠN” có những gì mà lại gây chú ý đến vậy
            nhé.
          </p>
          <div className="w-full h-auto flex gap-3">
            <ButtonDiscover className="px-10" name={"LIÊN HỆ NGAY"} />
            <IconButton className="w-fit px-4">TẠO NGAY</IconButton>
          </div>
        </div>
        <div className="w-2/5 h-full overflow-hidden">
          <Image
            src="https://wallpapers.com/images/hd/wedding-aesthetic-reception-iie309969jsfu8zp.jpg"
            className="w-full h-full object-cover"
            alt=""
          />
        </div>
        <div className="overflow-hidden absolute left-[-13%]">
          <Image
            src="/image21.png"
            className="w-full h-full object-cover"
            alt=""
          />
        </div>
      </section>
      <section className="w-full py-[60px] h-screen flex flex-col items-center gap-8">
        <div className="flex w-fit justify-center gap-4 py-2 px-4 items-center rounded-full bg-whiteAlpha-50">
          <span
            onClick={() => setOptionIndex(0)}
            className={`text-base font-semibold leading-8 ${
              optionIndex === 0 ? "bg-gold" : "opacity-50"
            } flex py-2 px-6 justify-center items-center rounded-full cursor-pointer transition duration-300`}
          >
            SẢNH TIỆC
          </span>
          <span
            onClick={() => setOptionIndex(1)}
            className={`text-base font-semibold leading-8 ${
              optionIndex === 1 ? "bg-gold" : "opacity-50"
            } flex py-2 px-6 justify-center items-center rounded-full cursor-pointer transition duration-300`}
          >
            TRANG TRÍ
          </span>
          <span
            onClick={() => setOptionIndex(2)}
            className={`text-base font-semibold leading-8 ${
              optionIndex === 2 ? "bg-gold" : "opacity-50"
            }  flex py-2 px-6 justify-center items-center rounded-full cursor-pointer transition duration-300`}
          >
            SÂN KHẤU
          </span>
          <span
            onClick={() => setOptionIndex(3)}
            className={`text-base font-semibold leading-8 ${
              optionIndex === 3 ? "bg-gold" : "opacity-50"
            } flex py-2 px-6 justify-center items-center rounded-full cursor-pointer transition duration-300`}
          >
            BÁNH CƯỚI
          </span>
          <span
            onClick={() => setOptionIndex(4)}
            className={`text-base font-semibold leading-8 ${
              optionIndex === 4 ? "bg-gold" : "opacity-50"
            } flex py-2 px-6 justify-center items-center rounded-full cursor-pointer transition duration-300`}
          >
            THỰC ĐƠN
          </span>
          <span
            onClick={() => setOptionIndex(5)}
            className={`text-base font-semibold leading-8 ${
              optionIndex === 5 ? "bg-gold" : "opacity-50"
            } flex py-2 px-6 justify-center items-center rounded-full cursor-pointer transition duration-300`}
          >
            NƯỚC UỐNG
          </span>
          <button className="bg-gold w-12 h-12 rounded-full flex justify-center items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="21"
              height="20"
              viewBox="0 0 21 20"
              fill="none"
            >
              <path d="M18 2.5H3V4.16667H18V2.5Z" fill="white" />
              <path d="M18 15.8333H3V17.5H18V15.8333Z" fill="white" />
              <path d="M18 9.16667H3V10.8333H18V9.16667Z" fill="white" />
            </svg>
          </button>
        </div>
        <div className="w-full flex gap-5">
          <div className="bg-whiteAlpha-50 flex flex-col gap-4 p-5 rounded-2xl w-1/3 h-[70vh]">
            <span className="text-sm font-semibold leading-5">Ghi chú</span>
            <textarea
              name=""
              id=""
              className="rounded-2xl border border-1-white resize-none w-full h-full p-2"
            ></textarea>
          </div>
          <div className="w-2/3 h-full  flex flex-col gap-3 relative">
            <div className="flex gap-3 items-center">
              <span className="inline-flex bg-gold w-1 h-full"></span>
              <span className="text-3xl font-bold">Sảnh tiệc</span>
            </div>
            <span className="text-sm font-normal">
              Sảnh tiệc có sức chứa cho khoảng 100 khách
            </span>
            <div className="w-full flex flex-wrap gap-4">
              {listSpaces.map((space, index) => (
                <div
                  onClick={() => setSpaceIndex(index)}
                  key={space.id}
                  className={`w-[calc(25%-16px)] aspect-w-1 aspect-h-1 ${
                    spaceIndex === index ? "bg-whiteAlpha-400" : ""
                  } p-2 gap-3 flex flex-col rounded-lg cursor-pointer`}
                >
                  <div className="overflow-hidden">
                    <Image
                      src="https://i.pinimg.com/736x/42/d8/ea/42d8eaa1d9228f748c61c7d0db2c5c62.jpg"
                      className="w-full h-full object-cover"
                      alt=""
                    />
                  </div>
                  <span className="text-sm font-normal">Sảnh Diamon</span>
                </div>
              ))}
            </div>
            <div className="w-full absolute bottom-0 flex justify-end">
              <ButtonDiscover name={"Liên hệ ngay"} className="px-4" />
            </div>
          </div>
        </div>
      </section>
      <section>
        <Footer />
      </section>
      c
    </div>
  );
};

export default Page;
