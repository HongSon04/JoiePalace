"use client";

import { API_CONFIG, makeAuthorizedRequest } from "@/app/_utils/api.config";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import CustomPagination from "@/app/_components/CustomPagination";
import Error from "@/app/_components/Error";
import useCustomToast from "@/app/_hooks/useCustomToast";
import { CONFIG } from "@/app/_utils/config";
import { formatDateTime } from "@/app/_utils/formaters";
import { Button, Skeleton } from "@nextui-org/react";
import React from "react";

const categories = [
  {
    id: "all",
    name: "Tất cả",
  },
  {
    id: "booking_created",
    name: "Tiệc mới",
  },
  {
    id: "booking_confirmed",
    name: "Xác nhận đặt tiệc",
  },
  {
    id: "booking_success",
    name: "Booking đã hoàn thành",
  },
  {
    id: "booking_cancel",
    name: "Booking đã hủy",
  },
  {
    id: "booking_updated",
    name: "Booking đã được cập nhật",
  },
  {
    id: "đeposit_success",
    name: "Đặt cọc thành công",
  },
  {
    id: "đeposit_cancel",
    name: "Hủy cọc",
  },
  {
    id: "feedback",
    name: "Đánh giá từ khách hàng",
  },
];

function NotificationTabs({ branchSlug }) {
  const [user, setUser] = React.useState({});
  const [selectedCategory, setSelectedCategory] = React.useState("all");
  const [itemsPerPage, setItemsPerPage] = React.useState(10);
  const [page, setPage] = React.useState(1);
  const toast = useCustomToast();

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
    queryKey: ["notifications", user.id, itemsPerPage, page],
    queryFn: async () => {
      const response = await getNotifications();

      if (response.success) {
        return response;
      } else {
        throw new Error(response.error.message);
      }
    },
  });

  const mutation = useMutation({
    mutationFn: markIsRead,
    onSuccess: () => {
      queryClient.invalidateQueries([
        "notifications",
        user.id,
        itemsPerPage,
        page,
        notification_ids,
      ]);
    },
  });

  const getNotifications = React.useCallback(() => {
    return makeAuthorizedRequest(
      API_CONFIG.NOTIFICATIONS.GET_BY_ID(user.id, {
        itemsPerPage,
        page,
      }),
      "GET"
    );
  }, [user.id, itemsPerPage, page]);

  const filteredFeedbacks = notifications?.data?.filter((item) =>
    selectedCategory === "all" ? item : item.type === selectedCategory
  );
  const notification_ids = filteredFeedbacks?.map((item) => item.id);

  React.useEffect(() => {
    if (typeof window !== undefined) {
      const storedUser = JSON.parse(localStorage.getItem("user"));

      console.log(storedUser);

      if (!storedUser) return;

      setUser(storedUser);
    }
  }, []);

  return (
    <div>
      {/* Notifications */}
      <div className="w-full flex justify-between mt-8">
        <label htmlFor="itemsPerPage" className="text-gray-400">
          Thông báo trên trang:
          <select
            name="itemsPerPage"
            id="itemsPerPage"
            className="select ml-3"
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(e.target.value)}
          >
            {CONFIG.ITEMS_PER_PAGE.map((item, i) => (
              <option key={i} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
        <div className="flex gap-5">
          <select
            name="category"
            id="category"
            className="select"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map((c, i) => (
              <option key={i} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <Button
            className="bg-transparent text-gray-400"
            onClick={() => {
              if (notification_ids.length === 0) {
                toast({
                  title: "Thông báo",
                  description: "Không có thông báo nào được chọn",
                  status: "info",
                  duration: 5000,
                  isClosable: true,
                });
              } else {
                mutation.mutate({
                  notification_ids,
                });
              }
            }}
          >
            Đánh dấu đã đọc
          </Button>
        </div>
      </div>
      {
        <>
          <div className="grid grid-cols-1 gap-4 mt-6 overflow-y-auto max-h-[60vh]">
            {isLoading && <NotificationsSkeleton />}
            {isError && <Error message="Có lỗi xảy ra" />}

            {!isLoading && filteredFeedbacks?.length > 0 ? (
              filteredFeedbacks.map((n, i) => (
                <div
                  key={i}
                  className={`p-4 rounded-md flex items-center justify-between text-white ${
                    n?.is_read ? "bg-transparent" : "bg-whiteAlpha-100"
                  }`}
                  onClick={() =>
                    mutation.mutate({
                      notification_ids: [n.id],
                    })
                  }
                >
                  <div>
                    <p className="text-sm">{n?.title}</p>
                    <p className="text-base font-semibold">{n?.content}</p>
                  </div>
                  <div>
                    <p className="text-sm">{formatDateTime(n?.created_at)}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-lg text-gray-400">
                Không có thông báo nào
              </p>
            )}
          </div>
          {notifications && notifications?.paginationInfo && (
            <CustomPagination
              total={notifications?.paginationInfo?.lastPage}
              page={page}
              onChange={(page) => setPage(page)}
            />
          )}
        </>
      }
    </div>
  );
}

export default NotificationTabs;

function NotificationsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 mt-6 overflow-y-auto max-h-[60vh]">
      {[1, 2, 3, 4, 5].map((n, i) => (
        <div
          key={i}
          className="bg-whiteAlpha-100 p-4 rounded-md flex items-center justify-between text-white animate-pulse"
        >
          <div>
            <Skeleton height={20} width={100} className="rounded-full" />
            <Skeleton
              height={20}
              width={200}
              className="rounded-full mt-3
            "
            />
          </div>
          <div>
            <Skeleton height={20} width={100} className="rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}
