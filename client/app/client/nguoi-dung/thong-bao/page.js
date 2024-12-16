'use client'
import { Image } from '@nextui-org/react';
import React, { useEffect, useState } from 'react';
import { API_CONFIG } from "@/app/_utils/api.config";
import useApiServices from "@/app/_hooks/useApiServices";
import useCustomToast from "@/app/_hooks/useCustomToast";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { setNotificationCount } from '@/app/_lib/decors/decorsSlice';

const NotificationsPage = () => {
    const { makeAuthorizedRequest } = useApiServices();
    const [user, setUser] = useState();
    const [listIdNotification, setListIdNotification] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const toast = useCustomToast();
    const router = useRouter();
    const dispatch = useDispatch();

    useEffect(() => {
        const getFeedbacks = async () => {
            const getUser = JSON.parse(localStorage.getItem("user"));
            if (getUser) {
                setUser(getUser);
                const data = await makeAuthorizedRequest(
                    API_CONFIG.NOTIFICATIONS.GET_BY_ID(getUser.id),
                    'GET',
                    '',
                    null,
                    '/client/dang-nhap'
                );

                if (data.success) {
                    // setNotifications(data.data);
                    const datanotifications = data.data;
                    const notifications = datanotifications.map(notification => {
                        const data = {
                            message: notification.content,
                            time: calculateTimeAgo(notification.created_at),
                            status: getStatusFromType(notification.type),
                            avatar: '/userImage.png',
                        };
                        return data;
                    });

                    const notificationIs_read = datanotifications
                        .filter(notification => notification.is_read == false)
                        .map(notification => notification.id);
                    setListIdNotification(notificationIs_read);
                    setNotifications(notifications);
                    dispatch(setNotificationCount(notificationIs_read.length));
                } else {
                    console.error("Error fetching feedbacks:", data);
                    return [];
                }
            } else {
                router.push('/');
            }
        };
        getFeedbacks();
    }, []);

    const is_read = async () => {
        try {
            const response = await makeAuthorizedRequest(
                API_CONFIG.NOTIFICATIONS.IS_READ,
                'PATCH',
                {
                    "notification_ids": listIdNotification,
                },
                null,
                '/client/dang-nhap'
            );
            // console.log(response);

            if (response?.success) {
                toast({
                    position: "top",
                    type: "success",
                    title: "Cập nhật thành công!",
                    description: 'Đã đánh dấu đọc thành công',
                    closable: true,
                });
                dispatch(setNotificationCount(0));
            } else {
                toast({
                    position: "top",
                    type: "error",
                    title: "Cập nhật thất bại!",
                    description: response?.error?.message || "Vui lòng thử lại sau.",
                    closable: true,
                });
            }
        } catch (error) {
            console.error("Error updating notification status:", error);
        }
    };



    const calculateTimeAgo = (date) => {
        const seconds = Math.floor((new Date() - new Date(date)) / 1000);
        let interval = Math.floor(seconds / 31536000);

        if (interval > 1) return `${interval} năm trước`;
        interval = Math.floor(seconds / 2592000);
        if (interval > 1) return `${interval} tháng trước`;
        interval = Math.floor(seconds / 86400);
        if (interval > 1) return `${interval} ngày trước`;
        interval = Math.floor(seconds / 3600);
        if (interval > 1) return `${interval} giờ trước`;
        interval = Math.floor(seconds / 60);
        if (interval > 1) return `${interval} phút trước`;
        return `${seconds} giây trước`;
    };
    // Hàm xác định màu sắc chữ theo trạng thái
    const getStatusColor = (status) => {
        switch (status) {
            case 'Tạo đặt tiệc':
                return 'text-green-500'; 
            case 'Đặt tiệc':
                return 'text-green-500';
            case 'Đặt tiệc thành công':
                return 'text-blue-500'; 
            case 'Hủy đặt tiệc':
                return 'text-yellow-300';
            case 'Cập nhật':
                return 'text-sky-300';
            case 'Thanh toán':
                return 'text-green-600'; 
            case 'Thanh toán cọc':
                return 'text-red-300';
            case 'Thanh toán cọc thành công':
                return 'text-blue-400';
            case 'Hủy cọc':
                return 'text-yellow-400';
            case 'Tiệc sắp diễn ra':
                return 'text-cyan-300';
            case 'Phản hồi':
                return 'text-gray-500'; 
            default:
                return 'text-gray-500';
        }
    };

    const getStatusFromType = (type) => {
        switch (type) {
            case 'booking_created':
                return 'Tạo đặt tiệc';
            case 'booking_confirm':
                return 'Đặt tiệc';
            case 'booking_success':
                return 'Đặt tiệc thành công';
            case 'booking_cancel':
                return 'Hủy đặt tiệc';
            case 'booking_updated':
                return 'Cập nhật';
            case 'payment_confirmed':
                return 'Thanh toán';
            case 'deposit_payment':
                return 'Thanh toán cọc';
            case 'deposit_success':
                return 'Thanh toán cọc thành công';
            case 'deposit_cancel':
                return 'Hủy cọc';
            case 'event_upcoming':
                return 'Tiệc sắp diễn ra';
            case 'feedback':
                return 'Phản hồi';
            default:
                return 'Không xác định';
        }
    };

    return (
        <div className="flex flex-col gap-8 p-5 max-sm:p-0 min-h-screen ">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold text-white">Thông báo</h1>
                <button className={`text-xs text-gold ${notifications.length == 0 ? 'hidden' : ''}`} onClick={is_read} >Đánh dấu đã đọc</button>
            </div>

            {/* Notifications */}
            <div className="flex flex-col gap-5">
                {notifications.length > 0 ? (
                    notifications.map((notification, index) => (
                        <div key={index} className="flex flex-col gap-3">
                            <div className="w-full h-[1px] bg-gray-500"></div>
                            <div className="flex flex-col gap-3 p-4 sm:p-5">
                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 flex-shrink-0">
                                        <Image
                                            src={notification.avatar}
                                            alt="User Avatar"
                                            width={40}
                                            height={40}
                                            className="rounded-full object-cover"
                                        />
                                    </div>
                                    <p className="text-sm text-white flex-1">{notification.message}</p>
                                </div>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-gray-400 text-sm">{notification.time}</span>
                                    <span className={`${getStatusColor(notification.status)} text-sm`}>• {notification.status}</span>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className='flex flex-col items-center justify-center w-full h-[50vh]'>
                        <div className='w-[200px] opacity-50'>
                            <Image
                                src='/post-office.png'
                                alt="Notebook image"
                                className="object-cover "
                            />
                        </div>
                        <div className='flex mt-4 text-lg '>
                            <p>Bạn chưa có thông báo nào !</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NotificationsPage;
