"use client";

import notificationIcon from "@/public/admin-sidebar/thong-bao.svg";
import { Popover, PopoverContent, PopoverTrigger } from "@nextui-org/popover";
import { Button, Spinner } from "@nextui-org/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import React from "react";
import { API_CONFIG, makeAuthorizedRequest } from "../_utils/api.config";
import { formatDateTime } from "../_utils/formaters";

function NotificationButton() {
  const [page, setPage] = React.useState(1);
  const [itemsPerPage, setItemsPerPage] = React.useState(10);

  const markIsRead = React.useCallback(async (notification_ids = []) => {
    const result = await makeAuthorizedRequest(
      API_CONFIG.NOTIFICATIONS.IS_READ,
      "PATCH",
      { notification_ids }
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
    queryKey: ["notifications_box", page, itemsPerPage],
    queryFn: async () => {
      let user = {};
      try {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        user = storedUser;
      } catch {
        user = {};
      }

      const response = await makeAuthorizedRequest(
        API_CONFIG.NOTIFICATIONS.GET_BY_ID(user?.id, {
          page,
          itemsPerPage,
        }),
        "GET"
      );

      if (response.success) {
        return response;
      } else {
        throw new Error(response.error.message);
      }
    },
    refetchOnWindowFocus: false,
    keepPreviousData: true,
  });

  const notification_ids = React.useMemo(() => {
    if (!notifications || !Array.isArray(notifications?.data)) return [];

    return notifications ? notifications?.data?.map((item) => item?.id) : [];
  }, [notifications]);

  const {
    mutate: handleMarkIsRead,
    isPending: isMarkIsReadPending,
    isSuccess: isMarkIsReadSuccess,
  } = useMutation({
    mutationKey: ["markIsRead"],
    mutationFn: () => markIsRead(notification_ids),
    onSuccess: () => {
      queryClient.invalidateQueries(["notifications_box"]);
    },
  });

  const handleSeeMore = () => {
    setItemsPerPage((prev) => (prev += 10));
  };

  return (
    <Popover
      placement="bottom-end"
      offset={10}
      classNames={{
        base: "w-[400px] !h-[500px] !bg-gray-100 overflow-y-auto rounded-xl",
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

        <div className="flex flex-col gap-3 mt-3 flex-1 h-full min-h-max overflow-y-auto py-4">
          {!isLoading && notifications && notifications?.data?.length > 0
            ? notifications?.data?.map((notification, index) => (
                <div
                  key={notification?.title + index}
                  className={`p-4 rounded-lg hover:cursor-pointer relative ${
                    notification?.is_read
                      ? "bg-transparent"
                      : "bg-blackAlpha-100"
                  }`}
                  onClick={() => {
                    if (notification?.is_read) return;
                    handleMarkIsRead({
                      notification_ids: [notification.id],
                    });
                  }}
                >
                  <h4 className="font-semibold text-gray-800 ">
                    {notification?.title}
                  </h4>
                  <p className="text-sm text-gray-400 mt-3">
                    {notification?.content}
                  </p>
                  <p className="text-sm text-gray-400 mt-3">
                    {formatDateTime(notification?.created_at)}
                  </p>
                </div>
              ))
            : !isLoading && (
                <div className="flex-1 flex-center">
                  <p className="text-center text-base">Không có thông báo</p>
                </div>
              )}
        </div>
        {/* See More Button */}
        {notifications && notifications.data.length > 0 && (
          <Button
            variant="ghost"
            color="default"
            radius="full"
            onClick={handleSeeMore}
            disabled={isLoading} // Disable while loading
          >
            {isLoading ? <Spinner size="sm" /> : "Xem thêm"}
          </Button>
        )}
      </PopoverContent>
    </Popover>
  );
}

export default NotificationButton;
