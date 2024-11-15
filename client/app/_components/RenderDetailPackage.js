"use client";
import { Image } from "@nextui-org/react";
import React from "react";

const arrayMenus = [
  { id: 1, name: "Món chính", slug: "mon-chinh" },
  { id: 2, name: "Món khai vị", slug: "mon-khai-vi" },
  { id: 3, name: "Món tráng miệng", slug: "mon-trang-mieng" },
  { id: 4, name: "Đồ uống", slug: "nuoc-uong" },
];

const RenderDetailPackage = ({
  optionIndex,
  dataToShow,
  setSpaceIndex,
  spaceIndex,
}) => {
  if (!dataToShow || !dataToShow?.products) return null;
  console.log(optionIndex);
  console.log("dataToShowsdfsds", dataToShow);

  const renderProductItem = (item, index) => (
    <div
      onClick={() => setSpaceIndex(index)}
      key={item.id}
      className={`w-[calc(25%-16px)] aspect-w-1 aspect-h-1 ${
        spaceIndex === index ? "bg-whiteAlpha-400" : ""
      } p-2 gap-3 flex flex-col rounded-lg cursor-pointer`}
    >
      <div className="overflow-hidden">
        <Image
          src={item.images[0]}
          className="w-full h-full object-cover"
          alt={item.name || ""}
        />
      </div>
      <span className="text-sm font-normal">{item.name}</span>
    </div>
  );

  // Render cho optionIndex === 3
  if (optionIndex == 3) {
    return (
      <div className="w-[calc(25%-16px)] aspect-w-1 aspect-h-1 bg-whiteAlpha-400 p-2 gap-3 flex flex-col rounded-lg cursor-pointer">
        <div className="overflow-hidden">
          <Image
            src={dataToShow?.images[0]}
            className="w-full h-full object-cover"
            alt={dataToShow.name || ""}
          />
        </div>
        <span className="text-sm font-normal">{dataToShow.name}</span>
      </div>
    );
  }

  // Render cho optionIndex === 4
  else if (optionIndex === 4) {
    return (
      <div className="flex flex-col gap-6">
        {arrayMenus.map((menu) => (
          <div key={menu.id} className="flex flex-col gap-4">
            <h2 className="text-lg">{menu.name}</h2>
            <div className="flex gap-4 flex-wrap">
              {dataToShow?.products[menu.slug]?.map(renderProductItem)}
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Render mặc định
  return (
    <div className="flex gap-4 flex-wrap">
      {dataToShow?.products?.map(renderProductItem)}
    </div>
  );
};

export default RenderDetailPackage;
