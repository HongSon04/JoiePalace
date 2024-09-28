"use client";

import { useDisclosure } from "@nextui-org/react";
import { Col } from "antd";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { useDispatch } from "react-redux";
import { setSelectedDish } from "../_lib/features/dishes/dishesSlice";
import { formatPrice } from "../_utils/formaters";
import DishDetailModal from "../admin/mon-an/DishDetailModal";
import DishDetailSkeleton from "../admin/mon-an/DishDetailSkeleton";

function Dish({ dish }) {
  const { onOpen, isOpen, onClose, onOpenChange } = useDisclosure();

  const dispatch = useDispatch();

  const handleClick = () => {
    dispatch(setSelectedDish(dish));

    onOpen();
  };

  return (
    <Col
      span={8}
      md={{
        span: 6,
      }}
      onClick={handleClick}
    >
      <div className="bg-whiteAlpha-100 p-3 group rounded-lg shadow-md flex items-center hover:whiteAlpha-200 relative">
        <Link
          className={"absolute inset-0"}
          href={`/admin/mon-an?id=${dish.id}`}
        ></Link>
        <div className="w-14 h-14 mr-3 relative group-hover:scale-125 transition-transform">
          <Image
            sizes="80px"
            priority
            src={dish.image}
            alt={dish.name}
            fill
            className="rounded-full w-fit object-cover "
          />
        </div>
        <h3 className="text-white text-sm leading-5 font-semibold flex-1 text-left pr-4">
          {dish.name}
        </h3>
        <p className="text-white">{formatPrice(dish.price)}</p>
      </div>

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
    </Col>
  );
}

export default Dish;
