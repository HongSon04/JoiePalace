'use client';
import React, { useState } from 'react';
import gear from '@/public/gear.svg';
import checked from '@/public/Checked.svg';
import Image from "next/image";

const weddingPacks = [
    {
        title: "GÓI TIỆC CƯỚI NGỌT NGÀO",
        price: "50 - 100 Triệu VND",
        details: "Thường dành cho tiệc khoảng 100 khách.",
        categories: [
            {
                title: "Trang trí",
                items: [
                    "Màu sắc tự chọn theo chủ đề",
                    "Hoa tươi tự chọn",
                    "Backdrop đơn giản, có thể tự thiết kế"
                ]
            },
            {
                title: "Âm thanh",
                items: [
                    "Dàn âm thanh chất lượng cao",
                    "Nhân viên kỹ thuật âm thanh",
                    "DJ chuyên nghiệp"
                ]
            },
        ]
    },
    // Thêm các gói khác nếu cần
];

const WeddingSection = () => {
    const [openPackIndex, setOpenPackIndex] = useState(null);
    const [openDropdownIndex, setOpenDropdownIndex] = useState(null);

    const togglePack = (index) => {
        setOpenPackIndex(openPackIndex === index ? null : index);
        setOpenDropdownIndex(null);
    };

    const toggleDropdown = (index) => {
        setOpenDropdownIndex(openDropdownIndex === index ? null : index);
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {weddingPacks.map((pack, packIndex) => (
                <div key={packIndex} className="relative group rounded-lg shadow-lg bg-gradient-to-r from-gold to-whiteAlpha-400 p-6 text-white cursor-pointer overflow-hidden transition-all duration-500 ease-in-out transform hover:scale-105 hover:shadow-xl">
                    <div className={`transition-transform duration-500 ease-in-out ${openPackIndex === packIndex ? 'translate-y-[-8px]' : ''}`}>
                        <div className='flex justify-between items-center'>
                            <h2 className="text-lg font-bold uppercase">{pack.title}</h2>
                            <div className="flex items-center bg-gray-800 p-2 rounded-full">
                                <Image src={gear} alt='gear-icon' className='w-5 h-5 object-cover' />
                            </div>
                        </div>
                        <p className="text-3xl font-semibold mt-2">{pack.price}</p>
                        <button
                            onClick={() => togglePack(packIndex)}
                            className="mt-4 bg-white text-sm font-semibold text-black py-2 px-4 rounded-md transition duration-300 hover:bg-gray-200 shadow-lg"
                        >
                            {openPackIndex === packIndex ? 'Ẩn Chi Tiết' : 'Xem Chi Tiết →'}
                        </button>
                    </div>

                    {/* Expanded Details with Dropdown Effect */}
                    <div className={`overflow-hidden transition-all duration-500 ease-in-out ${openPackIndex === packIndex ? 'max-h-[500px]' : 'max-h-0'}`}>
                        <div className="mt-4 bg-whiteAlpha-500 text-black p-4 rounded-lg shadow-lg transition-opacity duration-500 ease-in-out">
                            <p className="mb-2 text-gray-800 text-base leading-5">{pack.details}</p>

                            {pack.categories.map((category, index) => (
                                <div key={index}>
                                    <div 
                                        className="flex items-center justify-between cursor-pointer py-2 border-b border-gray-300"
                                        onClick={() => toggleDropdown(index)}
                                    >
                                        <div className="flex gap-2 items-center">
                                            <Image src={checked} alt='checked-icon' className='w-5 h-5' />
                                            <h4 className="font-semibold text-gray-900">{category.title}</h4>
                                        </div>
                                        <button>
                                            {openDropdownIndex === index ? (
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="black" viewBox="0 0 24 24">
                                                    <path d="M12 15.75l-5-5h10l-5 5z" />
                                                </svg>
                                            ) : (
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="black" viewBox="0 0 24 24">
                                                    <path d="M12 8.25l5 5H7l5-5z" />
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                    {/* Dropdown content */}
                                    <div className={`transition-all duration-500 ease-in-out ${openDropdownIndex === index ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
                                        <ul className="mt-2 list-disc ml-6 text-gray-700">
                                            {category.items.map((item, itemIndex) => (
                                                <li key={itemIndex}>{item}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            ))}

                            <button className="mt-6 flex items-center gap-2 justify-center w-full bg-gold text-white text-base py-2 leading-5 rounded-md font-semibold transition duration-300">
                                LIÊN HỆ NGAY <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <g id="arrow_forward">
                                        <path id="Vector" d="M12 4L10.59 5.41L16.17 11H4V13H16.17L10.59 18.59L12 20L20 12L12 4Z" fill="white" />
                                    </g>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default WeddingSection;