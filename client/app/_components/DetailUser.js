import React from 'react';

const DetailUser = ({nameUser, phoneUser, emailUser, partyBooked, waitingParty, totalMoney  }) => {
    return (
        <div className="flex flex-col w-full">
        <div className="flex items-center mb-3 gap-[22px]">
            <span className="text-xl font-medium text-white">{nameUser}</span>
            <span className="mt-auto underline text-xs font-normal text-gold cursor-pointer">Xem thêm</span>
        </div>

        <div className="flex justify-between text-base">
            <span className="text-white">Số điện thoại: <span className="text-gray-400">{phoneUser}</span></span>
            <span className="text-white">Email: <span className="text-gray-400">{emailUser}</span></span>
        </div>

        {/* Divider */}
        <div className="w-full h-[1px] bg-whiteAlpha-300 my-6"></div>

        {/* Stats */}
        <div className="flex justify-between text-center">
            <div>
                <span className="text-xl font-bold text-white">{partyBooked}</span>
                <p className="text-sm text-gray-400">Tiệc đã đặt</p>
            </div>
            <div>
                <span className="text-xl font-bold text-white">{waitingParty}</span>
                <p className="text-sm text-gray-400">Tiệc chờ</p>
            </div>
            <div>
                <span className="text-xl font-bold text-white">{totalMoney}</span>
                <p className="text-sm text-gray-400">Tổng chi</p>
            </div>
        </div>
    </div>
    );
};

export default DetailUser;