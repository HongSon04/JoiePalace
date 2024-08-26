"use client";
import Image from "next/image";
import imageBanner from "../../../public/images-client/banners/banner.png";
import mouseIcon from "../../../public/mouse.svg";
import { motion, useAnimation } from "framer-motion";

function Home() {
  return (
    <main className="w-full h-screen relative">
      <div className="banner">
        <div className="w-full h-full">
          <Image
            className="object-cover"
            src={imageBanner}
            layout="fill"
            objectFit="cover"
            alt="My Image"
          />
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/3 flex flex-col gap-8 items-center">
          <h1 className="text-6xl font-medium leading-[80px] text-center">
            NƠI CỦA SỰ THANH LỊCH, LÒNG HIẾU KHÁCH VÀ TINH THẦN DUY MỸ
          </h1>
          <span className="text-base font-normal leading-6 text-center w-4/5">
            Được xây dựng và phát triển bởi IN Hospitality vào năm 2007, White
            Palace là thương hiệu đầu tiên tại Việt Nam mở ra mô hình trung tâm
            hội nghị và sự kiện. Với sự đầu tư bài bản và chuyên biệt cho các
            hội nghị và sự kiện cao cấp, White Palace luôn được chọn là địa điểm
            tổ chức của những hội nghị kinh tế lớn, những sự kiện văn hóa giải
            trí có tầm ảnh hưởng và yến tiệc đẳng cấp.
          </span>
          <Image className="" src={mouseIcon} layout="" alt="My Image" />
        </div>
      </div>
    </main>
  );
}

export default Home;
