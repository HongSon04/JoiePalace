"use client";

import Image from "next/image";

import Notification from "./Notification";

import notificationIcon from "@/public/admin-sidebar/thong-bao.svg";

import { Popover, PopoverContent, PopoverTrigger } from "@nextui-org/popover";
import { Button } from "@nextui-org/react";

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
  // const notifications = [];

  return (
    /*
    <Popover>
      <PopoverTrigger>
        <Button className="icon-button w-10 h-10 bg-white hover:bg-white hover:brightness-95">
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
        className="bg-white rounded-2xl h-[400px] p-5 flex flex-col gap-5"
      >
        <div className="flex w-full justify-between items-center">
          <PopoverHeader>
            <h1 className="text-base font-bold text-gray-600">Thông báo</h1>
          </PopoverHeader>
          <PopoverCloseButton className="!w-[14px]" />
        </div>
        <PopoverBody className="overflow-y-auto mt-3 w-[350px] flex-1">
          {notifications.length > 0 ? (
            notifications.map((notification, index) => (
              <Notification key={index} notification={notification} />
            ))
          ) : (
            <p className="text-center text-base">Không có thông báo</p>
          )}
        </PopoverBody>
        <PopoverFooter>
          <div className="flex mt-3 gap-5 items-center justify-end">
            <TextButton>Đánh dấu đã đọc</TextButton>
            <TextButton type="danger">Xóa hết</TextButton>
          </div>
        </PopoverFooter>
      </PopoverContent>
    </Popover>
    */
    <Popover
      placement="bottom-end"
      offset={10}
      classNames={{
        base: "w-[400px] !h-[500px] !bg-gray-100 overflow-y-auto rounded-xl",
        // content: "w-[400px] h-[500px] !bg-gray-100",
      }}
    >
      <PopoverTrigger>
        <Button
          radius="full"
          isIconOnly
          className="w-10 h-10 bg-whiteAlpha-100 hover:bg-whiteAlpha-200"
        >
          <Image
            src={notificationIcon}
            width={20}
            height={20}
            alt="icon notification"
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="flex items-center justify-between w-full">
          <h1 className="text-base font-bold text-gray-600">Thông báo</h1>
          <Button className="!bg-transparent">Đánh dấu đã đọc</Button>
        </div>

        <div className="flex flex-col mt-3">
          {notifications.length > 0 ? (
            notifications.map((notification, index) => (
              <Notification key={index} notification={notification} />
            ))
          ) : (
            <p className="text-center text-base">Không có thông báo</p>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default NotificationButton;
