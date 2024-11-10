"use client";

import { useDisclosure } from "@nextui-org/react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useDispatch } from "react-redux";
import { setSelectedDish } from "../_lib/features/dishes/dishesSlice";
import { CONFIG } from "../_utils/config";
import { formatPrice } from "../_utils/formaters";
import { API_CONFIG } from "../_utils/api.config";

function Dish(props) {
  const {
    dish,
    className = "",
    mode,
    navigate = true,
    onClick,
    onContextMenu,
    children,
  } = props;

  // console.log(dish);

  const [image, setImage] = React.useState(dish.images[0]);

  const dispatch = useDispatch();

  const handleClick = () => {
    dispatch(setSelectedDish(dish));
  };

  const href = navigate
    ? props.link || `/admin/thuc-pham?id=${dish.id}`
    : "#";

  return (
    <>
      <Link href={href} className="block min-w-0 w-full">
        <div
          className={`${
            mode === "dark" ? "bg-zinc-100" : "bg-whiteAlpha-100"
          } w-full p-3 group rounded-lg shadow-md flex items-center hover:whiteAlpha-200 cursor-pointer flex-center h-full ${className}`}
          onClick={onClick || handleClick}
          onContextMenu={onContextMenu}
        >
          {children}
          <div className="w-14 h-14 mr-3 relative group-hover:scale-125 transition-transform shrink-0">
            <Image
              sizes="80px"
              priority
              src={image}
              alt={dish.name}
              fill
              className="rounded-full w-fit object-cover shrink-0"
              onError={() => setImage(CONFIG.DISH_IMAGE_PLACEHOLDER)}
            />
          </div>
          <div className="flex flex-col flex-1 min-w-0">
            <div className="flex items-center justify-between gap-5 flex-1">
              <h3
                className={`${
                  mode === "dark" ? "text-gray-600" : "text-white"
                } text-sm leading-5 font-semibold flex-1 text-left pr-4 truncate`}
              >
                {dish.name}
              </h3>
              <p
                className={`${
                  mode === "dark" ? "text-gray-600" : "text-white"
                }`}
              >
                {formatPrice(dish.price)}
              </p>
            </div>
            <div className="text-md truncate flex-1 text-gray-400 mt-3">
              {dish.description}
            </div>
          </div>
        </div>
      </Link>
    </>
  );
}

export default Dish;
