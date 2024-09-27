"use client";

import { dishCategories } from "@/app/_utils/config";
import { ListBulletIcon } from "@heroicons/react/24/outline";
import { Checkbox } from "@nextui-org/checkbox";
import { Tooltip } from "@nextui-org/react";
import Image from "next/image";
import { useEffect, useState } from "react";

function Menu({ menu, onCheckboxChange }) {
  return (
    <div
      className={`h-[440px] relative group rounded-lg overflow-hidden ${
        menu.checked ? "border-4 border-blue-500" : ""
      }`}
    >
      <Image
        src={menu.background}
        alt={menu.name}
        fill
        className={`object-cover ${menu.checked ? "brightness-50" : ""}`}
      />
      <div
        onClick={() => onCheckboxChange(menu.id)}
        className="overlay cursor-pointer overflow-y-auto absolute inset-0 p-5 bg-blackAlpha-700 backdrop-blur-md !text-white rounded-lg translate-y-full group-hover:translate-y-0 ease-in duration-200"
      >
        <div className="pb-4">
          <Tooltip
            content="Chọn thực đơn"
            placement="top"
            offset={12}
            delay={3}
          >
            <Checkbox
              defaultChecked={false}
              isSelected={menu.checked}
              onChange={() => onCheckboxChange(menu.id)}
              value={menu.id}
            ></Checkbox>
          </Tooltip>
        </div>
        <div className="overlay-inner">
          {dishCategories.map((category, index) => {
            return (
              <div key={index} className="mb-4">
                <h3 className="p-2 bg-whiteAlpha-200 text-base font-semibold rounded-md">
                  <ListBulletIcon className="w-6 h-6 inline-block mr-2" />
                  {category}
                </h3>
                <div className="flex flex-col gap-3 mt-3">
                  {menu.dishes.map((dish, index) => {
                    return (
                      dish.category === category && (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 rounded-md hover:bg-whiteAlpha-100"
                        >
                          <p className="text-sm font-normal">{dish.name}</p>
                        </div>
                      )
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Menu;
