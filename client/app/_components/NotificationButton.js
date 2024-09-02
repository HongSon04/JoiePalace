"use client";

import Image from "next/image";

import Notification from "./Notification";

import notificationIcon from "@/public/thong-bao.svg";

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverCloseButton,
  Button,
} from "@chakra-ui/react";
import IconButton from "./IconButton";

function NotificationButton() {
  // notification types: newOrder, contact, eventSchedule, payment, partyUpdate, dailyRemind, feedback, other

  const notifications = [
    {
      type: "newOrder",
      title: "Tiệc mới",
      content: "Bạn có một tiệc mới cần xác nhận",
      dateTime: "2021-10-10T10:00:00",
    },
    {
      type: "contact",
      title: "Liên hệ",
      content: "Có một liên hệ mới từ khách hàng",
      dateTime: "2021-10-10T10:00:00",
    },
    {
      type: "eventSchedule",
      title: "Lịch trình sự kiện",
      content: "Sắp có một sự kiện cần chuẩn bị cho khách hàng",
      dateTime: "2021-10-10T10:00:00",
    },
    {
      type: "payment",
      title: "Khách hàng đã thanh toán",
      content: "Khách hàng đã thanh toán cho tiệc cưới",
      dateTime: "2021-10-10T10:00:00",
    },
    {
      type: "partyUpdate",
      title: "Cập nhật tiệc",
      content: "Khách hàng đã cập nhật thông tin tiệc",
      dateTime: "2021-10-10T10:00:00",
    },
    {
      type: "dailyRemind",
      title: "Nhắc nhở hàng ngày",
      content: "Nhắc nhở nhân viên vệ sinh cửa hàng",
      dateTime: "2021-10-10T10:00:00",
    },
    {
      type: "feedback",
      title: "Phản hồi",
      content: "Khách hàng đã phản hồi về dịch vụ",
      dateTime: "2021-10-10T10:00:00",
    },
    {
      type: "other",
      title: "Thông báo khác",
      content: "Thông báo khác",
      dateTime: "2021-10-10T10:00:00",
    },
  ];

  return (
    <Popover>
      <PopoverTrigger>
        <Button className="icon-button w-10 h-10">
          <Image
            src={notificationIcon}
            width={20}
            height={20}
            alt="icon notification"
          />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        autoFocus={true}
        className="bg-blackAlpha-500 glass rounded-2xl h-[400px] p-5"
      >
        <div className="flex w-full justify-between items-center">
          <PopoverHeader>
            <h1 className="text-base font-bold">Thông báo</h1>
          </PopoverHeader>
          <PopoverCloseButton className="!w-[14px]" />
        </div>
        <PopoverBody className="overflow-y-auto mt-3">
          {notifications.map((notification, index) => (
            <Notification key={index} notification={notification} />
          ))}
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
}

export default NotificationButton;
