"use client";

import { useDisclosure } from "@nextui-org/react";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { useDispatch } from "react-redux";
import { setSelectedDish } from "../_lib/features/dishes/dishesSlice";
import { formatPrice } from "../_utils/formaters";
import DishDetailModal from "../admin/mon-an/DishDetailModal";
import DishDetailSkeleton from "../admin/mon-an/DishDetailSkeleton";

function Dish(props) {
  const { dish, className, mode, navigate = true, onClick } = props;

  const { onOpen, isOpen, onClose, onOpenChange } = useDisclosure();

  const dispatch = useDispatch();

  const handleClick = () => {
    dispatch(setSelectedDish(dish));

    onOpen();
  };

  return (
    <>
      <Link href={navigate ? props.link || `/admin/mon-an?id=${dish.id}` : "#"}>
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
              src={dish.image}
              alt={dish.name}
              fill
              className="rounded-full w-fit object-cover shrink-0"
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

      {isOpen && (
        <Suspense fallback={<DishDetailSkeleton />}>
          <DishDetailModal
            isOpen={isOpen}
            onOpen={onOpen}
            onClose={onClose}
            onOpenChange={onOpenChange}
          />
        </Suspense>
      )}
    </>
  );
}

export default Dish;
