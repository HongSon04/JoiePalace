"use client";

import IconButton from "./IconButton";
import Image from "next/image";

import notificationIcon from "@/public/thong-bao.svg";

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  PopoverCloseButton,
  PopoverAnchor,
  useDisclosure,
  Portal,
} from "@chakra-ui/react";

function NotificationButton() {
  return (
    <Popover placement="bottom-end">
      <PopoverTrigger>
        <IconButton>
          <Image
            src={notificationIcon}
            width={20}
            height={20}
            alt="icon notification"
          />
        </IconButton>
      </PopoverTrigger>
      <Portal>
        <PopoverContent
          className="rounded-3xl bg-blackAlpha-500"
          backdropBlur={15}
        >
          <PopoverArrow />
          <PopoverCloseButton />
          <PopoverHeader>Confirmation!</PopoverHeader>
          <PopoverBody>
            Are you sure you want to have that milkshake?
          </PopoverBody>
        </PopoverContent>
      </Portal>
    </Popover>
  );
}

export default NotificationButton;
