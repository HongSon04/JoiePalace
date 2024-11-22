'use client';
import React, { useEffect, useState } from 'react';
import gear from '@/public/gear.svg';
import checked from '@/public/Checked.svg';
import { Image } from '@nextui-org/react';
import { fetchAllPackages } from '@/app/_services/packagesServices';
import { getProductById } from '@/app/_services/productsServices';
import Link from 'next/link';

const WeddingSection = () => {
    const [openPackIndex, setOpenPackIndex] = useState(null);
    const [openDropdownIndex, setOpenDropdownIndex] = useState(null);
    const [weddingPacks, setWeddingPacks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const getUser = JSON.parse(localStorage.getItem("user"));
        if (!getUser) {
            router.push('/');
            return;
        }

        const fetchData = async () => {
            try {
                const data = await fetchAllPackages();
                const packagesByUser = data.filter(item => item.user_id === getUser.id);
                // console.log('packagesByUser',packagesByUser);
                
                // Fetch all products for each package
                const enrichedPackages = await Promise.all(
                    packagesByUser.map(async (item) => {
                        const otherService = JSON.parse(item.other_service);
                        const products = await Promise.all(
                            otherService.map(service => getProductById(service.id))
                        );

                        return {
                            title: item.name,
                            price: `${Math.ceil(item.price / 1000000).toLocaleString()} Triệu VND`,
                            details: `Thường dành cho tiệc khoảng ${item.number_of_guests || 0} khách.`,
                            categories: [
                                {
                                    title: "Trang trí",
                                    items: [item.decors?.name || "N/A"],
                                },
                                {
                                    title: "Sảnh",
                                    items: ['Tùy chọn theo trang trí tiệc'],
                                },
                                {
                                    title: "Menu",
                                    items: [item.menus?.name || "N/A"],
                                },
                                {
                                    title: "Dịch vụ gói",
                                    items: products.flat().map(product => product.name),
                                },
                            ],
                        };
                    })
                );

                setWeddingPacks(enrichedPackages);
            } catch (error) {
                console.error('Error fetching package data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const togglePack = (index) => {
        setOpenPackIndex(openPackIndex === index ? null : index);
        setOpenDropdownIndex(null);
    };

    const toggleDropdown = (index) => {
        setOpenDropdownIndex(openDropdownIndex === index ? null : index);
    };

    if (isLoading) {
        return <div className='flex flex-col items-center justify-center w-full h-[50vh]'>
        <div className='w-[200px] opacity-50'>
            <Image
                src='/notebook.png'
                alt="Notebook image"
                className="object-cover"
            />
        </div>
        <div className='flex mt-4 text-lg'>
            <p>Bạn có muốn tạo gói cho riêng mình?</p>
            <Link href='/client/tao-combo' className='ml-2 text-gold hover:text-gold hover:underline'>
                Tạo gói
            </Link>
        </div>
    </div>
    }

    if (weddingPacks.length === 0) {
        return (
            <div className='flex flex-col items-center justify-center w-full h-[50vh]'>
                <div className='w-[200px] opacity-50'>
                    <Image
                        src='/notebook.png'
                        alt="Notebook image"
                        className="object-cover"
                    />
                </div>
                <div className='flex mt-4 text-lg'>
                    <p>Bạn có muốn tạo gói cho riêng mình?</p>
                    <Link href='/client/tao-combo' className='ml-2 text-gold hover:text-gold hover:underline'>
                        Tạo gói
                    </Link>
                </div>
            </div>
        );
    }
    const detailCombo = () => {
        router.push('')
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {weddingPacks.map((pack, packIndex) => (
                <div key={packIndex} className="relative group rounded-lg text-white cursor-pointer overflow-hidden transition-all duration-500 ease-in-out transform hover:scale-105">
                    <div className={`bg-gradient-to-r from-gold to-whiteAlpha-400 p-6 transition-transform duration-500 hover:shadow-xl ease-in-out ${openPackIndex === packIndex ? 'translate-y-[-8px]' : ''}`}>
                        <div className='flex justify-between items-center'>
                            <h2 className="text-lg font-bold uppercase">{pack.title}</h2>
                        </div>
                        <p className="text-3xl font-semibold mt-2">{pack.price}</p>
                        <button
                            onClick={() => togglePack(packIndex)}
                            className="mt-4 bg-white text-sm font-semibold text-black py-2 px-4 rounded-md transition duration-300 hover:bg-gray-200 shadow-lg"
                        >
                            {openPackIndex === packIndex ? 'Ẩn Chi Tiết' : 'Xem Chi Tiết →'}
                        </button>
                    </div>

                    {/* Expanded Details */}
                    <div className={`overflow-hidden transition-all duration-500 ease-in-out ${openPackIndex === packIndex ? 'max-h-[500px]' : 'max-h-0'}`}>
                        <div className="mt-4 bg-whiteAlpha-500 text-black p-4 rounded-lg shadow-lg transition-opacity duration-500 ease-in-out">
                            <p className="mb-2 text-gray-800 text-base leading-5">{pack.details}</p>

                            {pack.categories.map((category, index) => (
                                <div key={index}>
                                    <div
                                        className="flex items-center justify-between cursor-pointer py-2 border-b border-gray-300"
                                        onClick={() => toggleDropdown(index)}
                                    >
                                        <h4 className="font-semibold text-gray-900">{category.title}</h4>
                                        <button>{openDropdownIndex === index ? <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M12 8.295L6 14.295L7.41 15.705L12 11.125L16.59 15.705L18 14.295L12 8.295Z" fill="black" />
                                        </svg>
                                            : <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M16.59 8.295L12 12.875L7.41 8.295L6 9.705L12 15.705L18 9.705L16.59 8.295Z" fill="black" />
                                            </svg>
                                        }</button>
                                    </div>
                                    <div className={`transition-all duration-500 ease-in-out ${openDropdownIndex === index ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
                                        <ul className="mt-2 list-disc ml-6 text-white">
                                            {category.items.map((item, itemIndex) => (
                                                <li key={itemIndex} className='my-3 hover:underline hover:text-yellow-400' onClick={detailCombo}>{item}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default WeddingSection;
