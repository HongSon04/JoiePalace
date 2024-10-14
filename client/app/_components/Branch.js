"use client";

import Image from "next/image";
import Link from "next/link";

function Branch({ branch, nameLink, buttonText = "Chi tiết", to }) {
  return (
    <div className="branch group min-w-[310px] h-[200px] relative rounded-xl overflow-hidden flex justify-center items-end">
      <Image
        src={branch.images[0].split(",")[0]}
        fill
        alt={branch.name}
        objectFit="cover"
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
