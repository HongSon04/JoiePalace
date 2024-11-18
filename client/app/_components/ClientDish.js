"use client";

import dishPattern from "@/public/client-dish-pattern.svg";
import { CheckIcon, MinusIcon, PlusIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { CONFIG } from "../_utils/config";
import Link from "next/link";
import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Skeleton,
  Tooltip,
} from "@nextui-org/react";
import { formatPrice } from "../_utils/formaters";
import React from "react";
import { formatDate } from "../_utils/format";
import {
  getMenuListByUserId,
  updateMenu,
} from "../_lib/features/menu/menuSlice";
import { useDispatch, useSelector } from "react-redux";
import { useToast } from "@chakra-ui/react";

function ClientDish({
  userMenuList,
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
  usePopover = false,
}) {
  const dispatch = useDispatch();
  const toast = useToast();
  const [isLogedin, setIsLogedIn] = React.useState(false);

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

  const { isUpdatingMenu, isUpdatingMenuError } = useSelector(
    (store) => store.menu
  );

  const handleUpdateMenu = async (menu, dish) => {
    const menuProducts = Object.keys(menu.products).reduce(
      (acc, cur) => {
        return [...acc, ...menu.products[cur]];
      },
      [dish]
    );

    const price = menuProducts.reduce((acc, cur) => {
      return (acc += cur.price);
    }, 0);

    const data = {
      name: menu.name,
      products: JSON.stringify([
        ...new Set([...menuProducts.map((p) => p.id), dish.id]),
      ]),
      price,
    };

    delete data?.images;

    try {
      const result = await dispatch(updateMenu({ data, id: menu.id })).unwrap();

      if (result.success) {
        toast({
          title: "Thành công",
          description: `Món ăn đã được thêm vào thực đơn ${menu.name}`,
          status: "success",
        });

        fetchMenuList();
      } else {
        toast({
          title: "Lỗi",
          description: "Có lỗi xảy ra, vui lòng thử lại sau",
          status: "error",
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchMenuList = React.useCallback(async () => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      try {
        const result = await dispatch(
          getMenuListByUserId({
            params: {
              user_id: storedUser.id,
              itemsPerPage: 9999,
              is_show: false,
            },
          })
        ).unwrap();

        if (result.success) {
          console.log("success result -> ", result);
        } else {
          console.log("failure result -> ", result);
        }
      } catch (error) {
        console.error(error);
      }
    }
  }, []);

  React.useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) setIsLogedIn(true);
  }, []);

  return (
    <div
      className={`flex gap-6 shrink-0 items-center mr-16 ml-5 ${sizeClassName.wrapper} ${className}`}
    >
      {/* IMAGE */}
      <div className={`${sizeClassName.banner} relative shrink-0`}>
        {/* DISH PATTERN */}
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
      <div className="flex flex-col gap-6 relative min-w-0 text-left w-full">
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
          {!hideActions && removable && (
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
          {!hideActions &&
            addable &&
            (isAdded && !usePopover ? (
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
              <Popover placement="bottom">
                <PopoverTrigger>
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
                </PopoverTrigger>
                <PopoverContent>
                  <div className="max-h-[400px] overflow-y-auto py-2">
                    {isUpdatingMenu ? (
                      <MenuListSkeleton />
                    ) : isLogedin ? (
                      userMenuList && userMenuList.length > 0 ? (
                        userMenuList.map((item, index) => {
                          const menuProducts = Object.keys(
                            item.products
                          ).reduce((acc, cur) => {
                            return [...acc, ...item.products[cur]];
                          }, []);

                          const isAdded = menuProducts
                            .map((p) => p.id)
                            .includes(dish.id);
                          // const isAdded = false;

                          return (
                            <div
                              key={index}
                              className={`flex gap-2 items-center bg-white rounded-lg p-2 mb-2 hover:brightness-90 transition ${
                                isAdded && "opacity-80"
                              }`}
                            >
                              <div className="flex flex-center h-full">
                                <Button
                                  onClick={() => handleUpdateMenu(item, dish)}
                                  isIconOnly
                                  className="bg-transparent w-fit h-fit min-w-0"
                                  isDisabled={isAdded}
                                >
                                  {isAdded ? (
                                    <CheckIcon className="w-5 h-5 text-gray-600" />
                                  ) : (
                                    <PlusIcon className="w-5 h-5 text-gray-600" />
                                  )}
                                </Button>
                              </div>
                              <div className="relative w-[60px] h-[88px] rounded-lg overflow-hidden bg-blackAlpha-200 flex-center">
                                <Image
                                  src={item.images.at(0)}
                                  alt={item.name}
                                  sizes="100px"
                                  className="object-cover rounded-lg"
                                  fill
                                />
                              </div>
                              <div className="flex flex-col gap-3 justify-start h-full">
                                <p className="text-base font-semibold text-gray-600">
                                  {item.name}
                                </p>
                                <p className="text-gray-600">
                                  Tạo ngày {formatDate(item.created_at)}
                                </p>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div className="flex-center">
                          <p className="text-md text-gold">
                            Bạn chưa có thực đơn nào
                          </p>
                          <Link
                            href={"/client/tao-thuc-don"}
                            className="text-gold underline"
                          >
                            Tạo ngay
                          </Link>
                        </div>
                      )
                    ) : (
                      <div className="flex-center">
                        <p className="text-md text-gold">
                          Bạn cần phải đăng nhập để thực hiện thao tác trên
                        </p>
                      </div>
                    )}
                  </div>
                </PopoverContent>
              </Popover>
            ))}
        </div>
      </div>
    </div>
  );
}

export default ClientDish;

function MenuListSkeleton() {
  return Array(6)
    .fill()
    .map((_, index) => {
      return (
        <div
          key={index}
          className={`flex gap-2 items-center bg-white rounded-lg p-2 mb-2 transition min-w-[300px]`}
        >
          <div className="flex flex-center h-full">
            <Skeleton className="w-5 h-5 rounded-full bg-gray-400"></Skeleton>
          </div>
          <Skeleton className="relative w-[60px] h-[88px] rounded-lg overflow-hidden bg-gray-400 flex-center shrink-0"></Skeleton>
          <div className="flex flex-col gap-3 justify-start h-full w-full">
            <Skeleton className="w-full h-5 rounded-lg bg-gray-400"></Skeleton>
            <Skeleton className="w-1/2 h-5 rounded-lg bg-gray-400"></Skeleton>
          </div>
        </div>
      );
    });
}
