import Link from 'next/link';
import React from 'react';

const DetailUserClient = ({ 
    nameUser, 
    phoneUser, 
    emailUser, 
    partyBooked, 
    waitingParty, 
    totalMoney, 
    isLoading 
}) => {
    return (
        <div className="flex flex-col w-full">
            {isLoading ? (
                // Show loading placeholders
                <>
                    <div className="flex justify-between items-center mb-3 gap-[22px]">
                        <div className="h-6 w-[100px] bg-gray-300 animate-pulse rounded"></div>
                        <Link className="mt-auto underline text-xs sm:text-sm lg:text-base font-normal hover:text-gold text-gold cursor-pointer" 
                        href={'/client/nguoi-dung/tai-khoan'}
                        >Xem thêm</Link>
                    </div>

                    <div className="flex flex-col gap-4 sm:flex-row justify-between text-base">
                        <div className="h-4 w-[200px] bg-gray-300 animate-pulse rounded"></div>
                        <div className="h-4 w-[100px] bg-gray-300 animate-pulse rounded"></div>
                    </div>

                    {/* Divider */}
                    <div className="w-full h-[1px] bg-whiteAlpha-300 my-4 sm:my-6"></div>

                    {/* Stats */}
                    <div className="flex justify-between text-center">
                        <div>
                            <span className="text-base font-bold text-white">0</span>
                            <p className="text-sm sm:text-base text-gray-400">Tiệc đã đặt</p>
                        </div>
                        <div>
                            <span className="text-base font-bold text-white">0</span>
                            <p className="text-sm sm:text-base text-gray-400">Tiệc chờ</p>
                        </div>
                        <div>
                            <span className="text-base font-bold text-white">0 VND</span>
                            <p className="text-sm sm:text-base text-gray-400">Tổng chi</p>
                        </div>
                    </div>
                </>
            ) : (
                <>
                    <div className="flex justify-between items-center mb-3 gap-[22px]">
                        <span className="text-lg sm:text-xl font-medium text-white">{nameUser}</span>
                        <Link className="mt-auto underline text-xs sm:text-sm lg:text-base font-normal hover:text-gold text-gold cursor-pointer" 
                        href={'/client/nguoi-dung/tai-khoan'}
                        >Xem thêm</Link>
                    </div>

                    <div className="flex flex-col sm:flex-row justify-between text-base">
                        <span className="text-white">Số điện thoại: <span className="text-gray-400">{phoneUser}</span></span>
                        <span className="text-white">Email: <span className="text-gray-400">{emailUser}</span></span>
                    </div>

                    {/* Divider */}
                    <div className="w-full h-[1px] bg-whiteAlpha-300 my-4 sm:my-6"></div>

                    {/* Stats */}
                    <div className="flex justify-between text-center">
                        <div>
                            <span className="text-base font-bold text-white">{partyBooked}</span>
                            <p className="text-sm sm:text-base text-gray-400">Tiệc đã đặt</p>
                        </div>
                        <div>
                            <span className="text-base font-bold text-white">{waitingParty}</span>
                            <p className="text-sm sm:text-base text-gray-400">Tiệc chờ</p>
                        </div>
                        <div>
                            <span className="text-base font-bold text-white">{totalMoney}</span>
                            <p className="text-sm sm:text-base text-gray-400">Tổng chi</p>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default DetailUserClient;
