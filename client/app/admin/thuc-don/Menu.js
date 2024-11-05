"use client";

import { dishCategories } from "@/app/_utils/config";
import { ListBulletIcon } from "@heroicons/react/24/outline";
import { Checkbox } from "@nextui-org/checkbox";
import { Button, Tooltip } from "@nextui-org/react";
import Image from "next/image";
import Link from "next/link";

function Menu({ menu }) {
  return (
    <div className={`h-[440px] relative group rounded-lg overflow-hidden`}>
      <Link href={`/admin/thuc-don/${menu.id}`} className="abs-full">
        <Image
          src={menu.background}
          alt={menu.name}
          fill
          className={`object-cover ${menu.checked ? "brightness-50" : ""}`}
        />
        {/* Tag */}
        <div className="absolute top-5 left-5">
          <Button variant="flat" color={menu.active ? "success" : "warning"}>
            {menu.active ? "Active" : "Inactive"}
          </Button>
        </div>
        <div className="overlay cursor-pointer overflow-y-auto absolute inset-0 p-5 bg-blackAlpha-700 backdrop-blur-md !text-white rounded-lg translate-y-full group-hover:translate-y-0 ease-in duration-200">
          <div className="overlay-inner">
            {dishCategories.map((category, index) => {
              return (
                <div key={index} className="mb-4">
                  <h3 className="p-2 bg-whiteAlpha-200 text-base font-semibold rounded-md">
                    <ListBulletIcon className="w-6 h-6 inline-block mr-2" />
                    {category.label}
                  </h3>
                  <div className="flex flex-col gap-3 mt-3">
                    {menu.dishes.map((dish, index) => {
                      return (
                        dish.category === category.key && (
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
        <div className="p-3 rounded-lg bg-whiteAlpha-200 text-white text-base">
          <h3 className="font-semibold">{menu.name}</h3>
        </div>
      </Link>
    </div>
  );
}

export default Menu;
