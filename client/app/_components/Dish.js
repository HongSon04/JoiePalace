"use client";

import { useDisclosure } from "@nextui-org/react";
import Image from "next/image";
import Link from "next/link";
import React, { Suspense } from "react";
import { useDispatch } from "react-redux";
import { setSelectedDish } from "../_lib/features/dishes/dishesSlice";
import { formatPrice } from "../_utils/formaters";
import DishDetailModal from "../admin/mon-an/DishDetailModal";
import DishDetailSkeleton from "../admin/mon-an/DishDetailSkeleton";
import { CONFIG } from "../_utils/config";

function Dish(props) {
  const { dish, className, mode, navigate = true, onClick } = props;

  const [image, setImage] = React.useState(
    dish.images[0] || CONFIG.DISH_IMAGE_PLACEHOLDER
  );

  const { onOpen, isOpen, onClose, onOpenChange } = useDisclosure();

  const dispatch = useDispatch();

  const handleClick = () => {
    dispatch(setSelectedDish(dish));

    onOpen();
  };

  const href = navigate ? props.link || `/admin/mon-an?id=${dish.id}` : "#";

  return (
    <>
      <Link href={href}>
        <div
          className={`${
            mode === "dark" ? "bg-zinc-100" : "bg-whiteAlpha-100"
          } p-3 group rounded-lg shadow-md flex items-center hover:whiteAlpha-200 cursor-pointer flex-center h-full ${className}`}
          onClick={onClick || handleClick}
        >
          <div className="w-14 h-14 mr-3 relative group-hover:scale-125 transition-transform">
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
          <h3
            className={`${
              mode === "dark" ? "text-gray-600" : "text-white"
            } text-sm leading-5 font-semibold flex-1 text-left pr-4`}
          >
            {dish.name}
          </h3>
          <p className={`${mode === "dark" ? "text-gray-600" : "text-white"}`}>
            {formatPrice(dish.price)}
          </p>
        </div>
      </Link>

      {/* {isOpen && (
        <Suspense fallback={<DishDetailSkeleton />}>
          <DishDetailModal
            isOpen={isOpen}
            onOpen={onOpen}
            onClose={onClose}
            onOpenChange={onOpenChange}
          />
        </Suspense>
      )} */}
    </>
  );
}

export default Dish;
