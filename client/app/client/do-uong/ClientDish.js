"use client";

import dishPattern from "@/public/client-dish-pattern.svg";
import { CheckIcon, MinusIcon, PlusIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { CONFIG } from "../../_utils/config";
import Link from "next/link";
import { Button, Tooltip } from "@nextui-org/react";
import { formatPrice } from "../../_utils/formaters";
import React from "react";

function ClientDish({
  dish,
  size = "md",
  addAction,
  removeAction,
  addable = false,
  removable = true,
  hideActions = false,
  className = "",
  tooltipClassName = "",
  isAdded = false,
}) {
  // console.log(dish);

  const [dishImage, setDishImage] = React.useState(dish.images[0]);

  const sizeClassName = {
    sm: {
      wrapper: `max-w-[550px] min-w-[300px]`,
      banner: ` w-[130px] h-[130px]`,
      name: `text-base leading-auto`,
      price: `text-base leading-auto`,
      description: `text-base leading-auto`,
      buttonText: `text-base`,
    },
    md: {
      wrapper: `min-w-[500px] max-w-[600px]`,
      banner: ` w-[130px] h-[130px]`,
      name: `text-2xl leading-10`,
      price: `text-xl leading-10`,
      description: `text-base leading-6`,
      buttonText: `text-xl`,
    },
  }[size];

  return (
    <div
      className={`flex gap-6 shrink-0 items-center mr-16 ml-5 ${sizeClassName.wrapper} ${className}`}
    >
      {/* IMAGE */}
      <div className={`${sizeClassName.banner} relative shrink-0`}>
        <>
          <div className="absolute -inset-2 bg-transparent rounded-full border border-gold"></div>
          <div className="absolute -inset-4 bg-transparent rounded-full border border-gold"></div>
        </>
        <Image
          fill
          src={dishImage}
          onError={() => setDishImage(CONFIG.CLIENT_DISH_IMAGE_PLACEHOLDER)}
          alt="dish image"
          sizes="200px"
          className="object-cover rounded-full w-full h-full"
        ></Image>
      </div>
      <div className="flex flex-col gap-6 relative min-w-0">
        {/* ABSOLUTE PATTERN */}
        <Image
          src={dishPattern}
          alt="absolut dish pattern"
          className="absolute right-0 top-1/2 -translate-y-1/2"
        />

        <h2
          className={`${sizeClassName.name} font-semibold uppercase truncate`}
        >
          {dish.name}
        </h2>
        <p className={`${sizeClassName.price} font-normal`}>
          {formatPrice(dish.price)} / 10 người
        </p>
        <p className={`${sizeClassName.description} truncate w-full`}>
          {dish.description}
        </p>
        <div className="flex justify-between w-full">
          <Link
            className={`text-gold underline hover:brightness-90 transition font-normal hover:text-gold hover:underline ${sizeClassName.buttonText}`}
            href={`/chi-tiet-mon-an/${dish.slug}`}
          >
            Khám phá
          </Link>
          {removable && (
            <Tooltip
              content="Xóa món ăn"
              className={`backdrop-blur-sm text-white ${tooltipClassName}`}
            >
              <Button
                isIconOnly
                className="bg-gold rounded-full"
                size="md"
                onClick={removeAction}
              >
                <MinusIcon className="w-5 h-5 text-white" />
              </Button>
            </Tooltip>
          )}
          {addable &&
            (isAdded ? (
              <Tooltip
                content="Xóa món ăn"
                className={`backdrop-blur-sm text-white ${tooltipClassName}`}
              >
                <Button
                  isIconOnly
                  className="bg-gold rounded-full"
                  size="md"
                  onClick={removeAction}
                >
                  <MinusIcon className="w-5 h-5 text-white" />
                </Button>
              </Tooltip>
            ) : (
              <Tooltip
                content="Thêm món ăn"
                className="bg-whiteAlpha-100 backdrop-blur-sm text-white"
              >
                <Button
                  isIconOnly
                  className="bg-gold rounded-full"
                  size="md"
                  onClick={() => {
                    addAction();
                  }}
                >
                  {isAdded ? (
                    <CheckIcon className="w-5 h-5 text-white" />
                  ) : (
                    <PlusIcon className="w-5 h-5 text-white" />
                  )}
                </Button>
              </Tooltip>
            ))}
        </div>
      </div>
    </div>
  );
}

export default ClientDish;
