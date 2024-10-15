import Image from 'next/image';
import React from 'react';

const NotificationsPage = () => {
    const notifications = [
        {
            message: 'Chúc mừng quý đã đặt tiệc thành công. Mã tiệc FKAO-E23-FEAO. Mong quý sẽ có được trải nghiệm tốt nhất tại Joie Palace!',
            time: '1 tiếng trước',
            status: 'Đặt tiệc',
            avatar: '/userImage.png',
        },
        {
            message: 'Thanh toán thành công mã tiệc FAPD-39J-KWEF, số tiền 150.000.000 VND. Cảm ơn quý khách đã tin tưởng sử dụng dịch vụ của Joie Palace.',
            time: '1 tiếng trước',
            status: 'Thanh toán',
            avatar: '/userImage.png',
        },
        {
            message: 'Mã tiệc FKFD-93K-KFPI đã được đặt thành công, quý khách vui lòng thanh toán số tiền đặt cọc theo thông tin trong email.',
            time: '1 tiếng trước',
            status: 'Thanh toán cọc',
            avatar: '/userImage.png',
        },
        {
            message: 'Mã tiệc FKAO-E23-FEAO đã hủy thành công. Hẹn gặp lại quý khách trong dịp gần nhất.',
            time: '1 tiếng trước',
            status: 'Hủy tiệc',
            avatar: '/userImage.png',
        },
        {
            message: 'Mã tiệc KFAS-392-AEPC sẽ diễn ra vào ngày 29/12/2025. Kính mời quý khách đến vào lúc 9:30 sáng để hoàn tất giai đoạn chuẩn bị và bàn giao. Nhân viên hỗ trợ của chúng tôi sẽ sớm liên hệ. Trân trọng.',
            time: '1 tiếng trước',
            status: 'Tiệc sắp diễn ra',
            avatar: '/userImage.png',
        },
    ];

    // Hàm xác định màu sắc chữ theo trạng thái
    const getStatusColor = (status) => {
        switch (status) {
            case 'Đặt tiệc':
                return 'text-green-500';
            case 'Thanh toán':
                return 'text-sky-300';
            case 'Thanh toán cọc':
                return 'text-red-300';
            case 'Hủy tiệc':
                return 'text-yellow-300';
            case 'Tiệc sắp diễn ra':
                return 'text-cyan-300';
            default:
                return 'text-gray-500';
        }
    };

    return (
        <div className="flex flex-col gap-8 p-5 min-h-screen ">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold text-white">Thông báo</h1>
                <button className="text-xs text-gold">Đánh dấu đã đọc</button>
            </div>

            {/* Notifications */}
            <div className="flex flex-col gap-5">
                {notifications.map((notification, index) => (
                    <div key={index} className='flex flex-col gap-3'>
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
                                <span className='text-gray-400 text-sm'>{notification.time}</span>
                                <span className={`${getStatusColor(notification.status)} text-sm`}>• {notification.status}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default NotificationsPage;
