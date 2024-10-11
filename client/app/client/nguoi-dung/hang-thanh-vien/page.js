'use client';

import Image from 'next/image';
import React, { useState } from 'react';

const membershipTiers = [
    {
        name: 'Đồng',
        info: 'Giảm 5% tổng chi phí thức ăn\nGiảm 5% chi phí thuê sảnh\nMiễn phí 2 thùng nước suối Aquafina cho tiệc.',
        imageSrc: '/bronzeCrown.png',
        range: '0 → 149 triệu VND'
    },
    {
        name: 'Bạc',
        info: 'Giảm 10% tổng chi phí thức ăn\nMiễn phí 1 thùng nước suối Aquafina cho tiệc.',
        imageSrc: '/silverCrown.png',
        range: '150 triệu → 299 triệu VND'
    },
    {
        name: 'Vàng',
        info: 'Giảm 15% tổng chi phí thức ăn\nMiễn phí 3 thùng nước suối Aquafina cho tiệc.',
        imageSrc: '/goldCrown.png',
        range: '300 triệu → 499 triệu VND'
    },
    {
        name: 'Bạch kim',
        info: 'Giảm 20% tổng chi phí thức ăn\nMiễn phí 5 thùng nước suối Aquafina cho tiệc.',
        imageSrc: '/platinumCrown.png',
        range: '500 triệu → hơn'
    },
];

const Page = () => {
    const [hoveredTier, setHoveredTier] = useState(null);

    return (
        <div className='flex flex-col gap-[30px] text-white relative p-6'>
            <h2 className='text-2xl font-bold'>Thành viên</h2>

            {/* Tiers Display Section */}
            <div className='relative flex justify-between items-center'>
                {membershipTiers.map((tier, index) => (
                    <div
                        key={index}
                        className='flex flex-col items-center text-center cursor-pointer relative group'
                        onMouseEnter={() => setHoveredTier(tier)}
                        onMouseLeave={() => setHoveredTier(null)}
                    >
                        {/* Tier Icon */}
                        <div className='flex gap-2 items-center'>
                            <div className="relative w-6 h-[14px]">
                                <Image
                                    src={tier.imageSrc}
                                    alt={`${tier.name} Crown`}
                                    layout="fill"
                                    objectFit="contain"
                                />
                            </div>
                            <span className='text-sm font-medium'>{tier.name}</span>
                        </div>

                        {/* Hover Tooltip */}
                        {hoveredTier?.name === tier.name && (
                            <div className='absolute top-20 left-0 bg-whiteAlpha-100 p-3 rounded-md text-sm w-[262px] text-left z-10 shadow-lg'>
                                <p className='font-semibold text-base mb-2 text-gold text-center'>{tier.name}</p>
                                <p className='text-sm text-gray-400 text-center mb-8'>Tổng chi từ {tier.range}</p>
                                <ul className='mt-2'>
                                    {tier.info.split('\n').map((line, idx) => (
                                        <li key={idx} className='flex gap-3 mb-1 '>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none">
                                                <path d="M12 4L10.59 5.41L16.17 11H4V13H16.17L10.59 18.59L12 20L20 12L12 4Z" fill="#B5905B" />
                                            </svg>
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
                    style={{ width: `${(hoveredTier ? membershipTiers.indexOf(hoveredTier) + 1 : 1) / membershipTiers.length * 100}%` }}>
                </div>

                <div className='flex justify-between absolute -top-1 left-0 right-0'>
                    {membershipTiers.map((tier, index) => (
                        <div
                            key={index}
                            className={`w-6 h-[14px] rounded-full ${hoveredTier?.name === tier.name ? 'bg-gold' : ''} ${hoveredTier && membershipTiers.indexOf(hoveredTier) >= index
                                    ? 'bg-gold'
                                    : 'bg-gray-600'
                                }`}
                        ></div>
                    ))}
                </div>
            </div>

        </div>
    );
};

export default Page;
