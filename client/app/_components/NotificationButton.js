"use client";

import Image from "next/image";
import Notification from "./Notification";
import notificationIcon from "@/public/admin-sidebar/thong-bao.svg";
import { Popover, PopoverContent, PopoverTrigger } from "@nextui-org/popover";
import { Button } from "@nextui-org/react";
import React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

function NotificationButton() {
  const [user, setUser] = React.useState({});

  const markIsRead = React.useCallback(async (notification_ids = []) => {
    const result = await makeAuthorizedRequest(
      API_CONFIG.NOTIFICATIONS.IS_READ,
      "PATCH",
      notification_ids
    );

    if (result.success) {
      toast({
        title: "Thành công",
        description: "Đánh dấu đã đọc thành công",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } else {
      throw new Error(result.error.message);
    }
  }, []);

  const queryClient = useQueryClient();

  const {
    data: notifications,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["notifications_box", user.id],
    queryFn: async () => {
      const response = await getNotifications();

      // console.log("response -> ", response);

      if (response.success) {
        return response;
      } else {
        throw new Error(response.error.message);
      }
    },
  });

  const notification_ids = React.useMemo(
    () => (notifications ? notifications?.map((item) => item.id) : []),
    [notifications]
  );

  // console.log("notifications -> ", notifications);

  const mutation = useMutation({
    mutationFn: markIsRead,
    onSuccess: () => {
      queryClient.invalidateQueries([
        "notifications_box",
        user.id,
        notification_ids,
      ]);
    },
  });

  const getNotifications = React.useCallback(() => {
    return makeAuthorizedRequest(
      API_CONFIG.NOTIFICATIONS.GET_BY_ID(user.id),
      "GET"
    );
  }, [user.id]);

  React.useEffect(() => {
    if (typeof window !== undefined) {
      const storedUser = JSON.parse(localStorage.getItem("user"));

      if (!storedUser) return;

      setUser(storedUser);
    }
  }, []);

  return (
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
      <PopoverContent className="h-full">
        <div className="flex items-center justify-between w-full">
          <h1 className="text-base font-bold text-gray-600">Thông báo</h1>
          <Button
            className="!bg-transparent"
            onClick={() =>
              mutation.mutate({
                notification_ids: [notification_ids],
              })
            }
          >
            Đánh dấu đã đọc
          </Button>
        </div>

        <div className="flex flex-col mt-3 flex-1 h-full min-h-max">
          {notifications && notifications?.length > 0 ? (
            notifications?.map((notification, index) => (
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
