'use client';

import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import bronzeCrown from '@/public/bronzeCrown.svg';
import silverCrown from '@/public/silverCrown.svg';
import goldCrown from '@/public/goldCrown.svg';
import platinum from '@/public/platinum.svg';
import { fetchAllBookingByUserId, fetchBookingById } from '@/app/_services/bookingServices';

const membershipTiers = [
    {
        name: 'Đồng',
        info: 'Giảm 5% tổng chi phí thức ăn\nGiảm 5% chi phí thuê sảnh\nMiễn phí 2 thùng nước suối Aquafina cho tiệc.',
        imageSrc: bronzeCrown,
        range: '0 → 149 triệu VND',
        condition: 100000000,
    },
    {
        name: 'Bạc',
        info: 'Giảm 10% tổng chi phí thức ăn\nMiễn phí 1 thùng nước suối Aquafina cho tiệc.',
        imageSrc: silverCrown,
        range: '150 triệu → 299 triệu VND',
        condition: 500000000,
    },
    {
        name: 'Vàng',
        info: 'Giảm 15% tổng chi phí thức ăn\nMiễn phí 3 thùng nước suối Aquafina cho tiệc.',
        imageSrc: goldCrown,
        range: '300 triệu → 499 triệu VND',
        condition: 700000000,
    },
    {
        name: 'Bạch kim',
        info: 'Giảm 20% tổng chi phí thức ăn\nMiễn phí 5 thùng nước suối Aquafina cho tiệc.',
        imageSrc: platinum,
        range: '500 triệu → hơn',
        condition: 1000000000,
    },
];

const Page = () => {
    const [total_amountUser, setTotalAmountUser] = useState(0);
    const [activeTier, setActiveTier] = useState(membershipTiers[0]);

    useEffect(() => {
        const getData = async () => {
            const getUser = JSON.parse(localStorage.getItem("user"));
            if (!getUser) {
                router.push('/');
            }
            try {
                // Fetch all bookings for the user
                const fetchedAllBookingsMembershipId = await fetchAllBookingByUserId(getUser?.id);

                const fetchedAllBookingsSuccess = fetchedAllBookingsMembershipId.filter((i) => i.status === 'success');
                const total_amountUser = fetchedAllBookingsSuccess.reduce((total, item) => {
                    return total + item.booking_details[0].total_amount;
                }, 0);
                setTotalAmountUser(total_amountUser)

            } catch (error) {
                console.error('Chưa lấy được dữ liệu người dùng', error);
            }
        };

        getData();
    }, []);

    useEffect(() => {
        // Xác định hạng thành viên dựa trên total_amountUser
        const currentTier = membershipTiers.slice().reverse().find(tier => total_amountUser >= tier.condition);
        if (currentTier) {
            setActiveTier(currentTier);
        }
    }, [total_amountUser]);

    // Tính toán phần trăm dựa trên total_amountUser so với 1 tỷ
    const calculateProgress = () => {
        const maxAmount = 1000000000;
        if (total_amountUser >= maxAmount) {
            return 100;
        }
        return (total_amountUser / maxAmount) * 100;
    };

    return (
        <div className='flex flex-col gap-[30px] text-white '>
            <h2 className='text-2xl font-bold'>Thành viên</h2>

            {/* Tiers Display Section */}
            <div className='relative flex justify-between items-center'>
                {membershipTiers.map((tier, index) => (
                    <div
                        key={index}
                        className='flex flex-col items-center text-center cursor-pointer relative'
                        onClick={() => setActiveTier(tier)}
                    >
                        {/* Tier Icon */}
                        <div className='flex gap-2 items-center'>
                            <div className="relative w-6 h-[14px]">
                                <Image
                                    src={tier.imageSrc}
                                    alt={`${tier.name} Crown`}
                                    layout="fill"
                                    objectFit="cover"
                                    quality={100}
                                />
                            </div>
                            <span className='text-sm font-medium'>{tier.name}</span>
                        </div>

                        {/* Display Tooltip for active tier only */}
                        {activeTier.name === tier.name && (
                            <div className='absolute top-20 left-0 bg-whiteAlpha-100 p-3 rounded-md text-sm w-[262px] text-left z-10 shadow-lg'>
                                <p className='text-sm text-gray-400 text-center mb-8'>Tổng chi từ {tier.range}</p>
                                <ul className='mt-2'>
                                    {tier.info.split('\n').map((line, idx) => (
                                        <li key={idx} className='flex gap-3 mb-1'>
                                            <div className='flex-grow-0'>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none">
                                                    <path d="M12 4L10.59 5.41L16.17 11H4V13H16.17L10.59 18.59L12 20L20 12L12 4Z" fill="#B5905B" />
                                                </svg>
                                            </div>
                                            <span className='text-white leading-5 w-fit text-sm'>{line}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Progress Bar */}
            <div className='relative w-full'>
                <div className='h-1 bg-white bg-opacity-20 rounded-full w-full'></div>
                <div className='h-1 bg-gold rounded-full absolute top-0 transition-all duration-300'
                    style={{ width: `${calculateProgress()}%` }}
                ></div>

                <div className='flex justify-between absolute -top-1 left-0 right-0'>
                    {membershipTiers.map((tier, index) => (
                        <div
                            key={index}
                            className={`w-6 h-[14px] rounded-full ${total_amountUser >= tier.condition ? 'bg-gold' : 'bg-gray-600'} transition-all duration-300`}
                        ></div>
                    ))}
                </div>

            </div>
        </div>
    );
};

export default Page;