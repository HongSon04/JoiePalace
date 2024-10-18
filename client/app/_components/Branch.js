"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";

function Branch({ branch, nameLink, buttonText = "Chi tiết", to }) {
  const [imgSrc, setImageSrc] = React.useState(branch.images[0].split(",")[0]);

  return (
    <div className="branch group min-w-[310px] h-[200px] relative rounded-xl overflow-hidden flex justify-center items-end">
      <Image
        src={imgSrc}
        fill
        alt={branch.name}
        objectFit="cover"
        onError={() =>
          setImageSrc(
            "https://whitepalace.com.vn/wp-content/uploads/2024/01/banner-2.png"
          )
        }
      />

      <div className="flex-col flex-center gap-5 relative z-10 translate-y-12 group-hover:-translate-y-5 transition-all">
        <div className="bg-blackAlpha-600 backdrop-blur-lg px-[8px] py-[10px] flex-center rounded-lg text-white">
          {branch.name}
        </div>
        <Link
          href={to || `/admin/${nameLink}/${branch.slug}`}
          className="p-3 w-full flex-center bg-white hover:bg-gold text-black hover:text-white font-bold rounded-full transition"
        >
          {buttonText}
        </Link>
      </div>
    </div>
  );
}

export default Branch;
