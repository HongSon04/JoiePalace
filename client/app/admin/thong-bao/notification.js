"use client";

import { Box, Center, Flex, Spacer, Text } from "@chakra-ui/react";
import GearSelect from "./GearSelect";
import React, { useState } from "react";

const data = [
    {
        id: 1,
        notification: "yeu-cau",
        name: "Dơn đặt tiệc mới1",
        Description: "Có đơn đặt tiệc mới từ khách hàng. Vui lòng kiểm tra xử lý kịp thời.",
    },
    {
        id: 2,
        notification: "tiec-moi",
        name: "Dơn đặt tiệc mới2",
        Description: "Có đơn đặt tiệc mới từ khách hàng. Vui lòng kiểm tra xử lý kịp thời.",
    },
    {
        id: 3,
        notification: "cong-viec",
        name: "Dơn đặt tiệc mới3",
        Description: "Có đơn đặt tiệc mới từ khách hàng. Vui lòng kiểm tra xử lý kịp thời.",
    },
];

const Notification = () => {
    const [dataNotification, setDataNotification] = useState(data);

    const filterNotifications = (filter) => {
        if (filter) {
            const classThongbao = document.querySelectorAll('.thongbao');
            classThongbao.forEach(i => {
                i.classList.remove('bg-blackAlpha-300', 'border-white');
                i.children[1].classList.remove('bg-red-600', 'text-white');
                i.children[1].classList.add('bg-white', 'text-black');
            });

            const selectedElement = document.querySelector(`#notification-${filter}`);
            if (selectedElement) {
                selectedElement.classList.add("bg-blackAlpha-300", "border-white");

                const notificationNumber = selectedElement.children[1];
                if (notificationNumber) {
                    notificationNumber.classList.remove('bg-white');
                    notificationNumber.classList.add('bg-red-600', 'text-white');
                }
            }
        }

        if (filter === "yeu-cau") {
            setDataNotification(data);
        } else {
            const filteredData = data.filter((i) => i.notification === filter);
            setDataNotification(filteredData);
        }
    };

    return (
        <div className="mt-4">
            <Flex>
                <Flex>
                    <Flex
                        className="cursor-pointer min-w-[130px] h-[60px] hover:bg-blackAlpha-300 justify-center items-center rounded-t-md border-b-1 border-transparent hover:border-white thongbao focus:bg-blackAlpha-300 bg-blackAlpha-300 border-white"
                        id="notification-yeu-cau"
                        onClick={() => filterNotifications("yeu-cau")}
                    >
                        <Text>Yêu cầu</Text>
                        <Box className="bg-red-600 text-white px-1 mx-2 rounded text-center ">1</Box>
                    </Flex>
                    <Flex
                        className="cursor-pointer min-w-[130px] h-[60px] hover:bg-blackAlpha-300 justify-center items-center rounded-t-md border-b-1 border-transparent hover:border-white thongbao"
                        id="notification-tiec-moi"
                        onClick={() => filterNotifications("tiec-moi")}
                    >
                        <Text>Tiệc mới</Text>
                        <Box className="bg-white text-black px-1 mx-2 rounded text-center">1</Box>
                    </Flex>
                    <Flex
                        className="cursor-pointer min-w-[130px] h-[60px] hover:bg-blackAlpha-300 justify-center items-center rounded-t-md border-b-1 border-transparent hover:border-white thongbao"
                        id="notification-cong-viec"
                        onClick={() => filterNotifications("cong-viec")}
                    >
                        <Text>Công việc</Text>
                        <Box className="bg-white text-black px-1 mx-2 rounded text-center">1</Box>
                    </Flex>
                    <Flex
                        className="cursor-pointer min-w-[130px] h-[60px] hover:bg-blackAlpha-300 justify-center items-center rounded-t-md border-b-1 border-transparent hover:border-white thongbao"
                        id="notification-thanh-toan"
                        onClick={() => filterNotifications("thanh-toan")}
                    >
                        <Text>Thanh toán</Text>
                        <Box className="bg-white text-black px-1 mx-2 rounded text-center">1</Box>
                    </Flex>
                    <Flex
                        className="cursor-pointer min-w-[130px] h-[60px] hover:bg-blackAlpha-300 justify-center items-center rounded-t-md border-b-1 border-transparent hover:border-white thongbao"
                        id="notification-su-kien"
                        onClick={() => filterNotifications("su-kien")}
                    >
                        <Text>Sự kiện</Text>
                        <Box className="bg-white text-black px-1 mx-2 rounded text-center">1</Box>
                    </Flex>
                    <Flex
                        className="cursor-pointer min-w-[130px] h-[60px] hover:bg-blackAlpha-300 justify-center items-center rounded-t-md border-b-1 border-transparent hover:border-white thongbao"
                        id="notification-phan-hoi"
                        onClick={() => filterNotifications("phan-hoi")}
                    >
                        <Text>Phản hồi</Text>
                        <Box className="bg-white text-black px-1 mx-2 rounded text-center">1</Box>
                    </Flex>
                </Flex>
                <Spacer />
                <Center>
                    <GearSelect />
                </Center>
            </Flex>
            <Box className="h-[70vh] bg-blackAlpha-300 w-full overflow-hidden overflow-y-auto p-[20px]">
                {dataNotification.length > 0 ? (
                    dataNotification.map((i) => (
                        <Flex key={i.id} className="example">
                            <Flex className="flex-col justify-around">
                                <Text>{i.name}</Text>
                                <Text className="text-[10px] text-gray-500">2 giờ trước</Text>
                                <Text className="font-light">{i.Description}</Text>
                            </Flex>
                            <Spacer />
                            <Box>
                                <button>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                    >
                                        <path
                                            d="M12 10.8891L15.8891 7L17 8.11094L13.1109 12L17 15.8891L15.8891 17L12 13.1109L8.11094 17L7 15.8891L10.8891 12L7 8.11094L8.11094 7L12 10.8891Z"
                                            fill="#A0AEC0"
                                        />
                                    </svg>
                                </button>
                            </Box>
                        </Flex>
                    ))
                ) : (
                    <Center>
                        <Text className="text-whiteAlpha-400 uppercase">Hộp thư trống</Text>
                    </Center>
                )}
            </Box>
        </div>
    );
};

export default Notification;
