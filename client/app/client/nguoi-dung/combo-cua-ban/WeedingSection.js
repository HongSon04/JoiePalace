'use client';
import React, { useEffect, useState } from 'react';
import gear from '@/public/gear.svg';
import checked from '@/public/Checked.svg';
import Image from "next/image";
import { fetchAllPackages } from '@/app/_services/packagesServices';
import { getProductById } from '@/app/_services/productsServices';


const WeddingSection = () => {
    const [openPackIndex, setOpenPackIndex] = useState(null);
    const [openDropdownIndex, setOpenDropdownIndex] = useState(null);
    const [dataPackage, setDataPackage] = useState([]);
    const [dataproduct, setDataproduct] = useState();

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
                // console.log('packagesByUser', packagesByUser);
                setDataPackage(packagesByUser);
            } catch (error) {
                console.error('Error fetching menu data:', error);
            }
        };

        fetchData();
    }, []);

    const weddingPacks = dataPackage.map(item => {
        const other_service = JSON.parse(item.other_service);
        // dataPackage.map(async (item) => {
        //     const productPromises = other_service.map(service => getProductById(service.id));
        //     const data = await Promise.all(productPromises);            
        //     setDataproduct(data);
        // })
        const totalPackages = 0;        
        
        return {
            title: item.name,
            price: `${item.price.toLocaleString().slice(0, 2)} Triệu VND`,
            details: "Thường dành cho tiệc khoảng 100 khách.",
            categories: [
                {
                    title: "Trang trí",
                    items: [
                        'Tùy chọn theo trang trí tiệc'
                    ]
                },
                {
                    title: "Bàn tiệc",
                    items: [
                        'Tùy chọn theo trang trí tiệc'
                    ]
                },
                {
                    title: "Menu",
                    items: [
                        "Dàn âm thanh chất lượng cao",
                        "Nhân viên kỹ thuật âm thanh",
                        "DJ chuyên nghiệp"
                    ]
                },
                {
                    title: "Nước uống",
                    items: [
                        "Nước ngọt",
                        "Nước khoáng",
                        "Rượu vang"
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
                {
                    title: "MC",
                    items: [
                        'MC chuyên nghiệp'
                    ]
                },
                {
                    title: "Bánh cưới",
                    items: [
                        "Bánh cưới 3 tầng",
                        "Bánh cưới theo yêu cầu"
                    ]
                },
            ]
        };
    });



    // const weddingPacks = [
    //     {
    //         title: "GÓI TIỆC CƯỚI NGỌT NGÀO",
    //         price: "50 - 100 Triệu VND",
    //         details: "Thường dành cho tiệc khoảng 100 khách.",
    //         categories: [
    //             {
    //                 title: "Trang trí",
    //                 items: [
    //                     "Màu sắc tự chọn theo chủ đề",
    //                     "Hoa tươi tự chọn",
    //                     "Backdrop đơn giản, có thể tự thiết kế"
    //                 ]
    //             },
    //             {
    //                 title: "Âm thanh",
    //                 items: [
    //                     "Dàn âm thanh chất lượng cao",
    //                     "Nhân viên kỹ thuật âm thanh",
    //                     "DJ chuyên nghiệp"
    //                 ]
    //             },
    //         ]
    //     },
    //     // Thêm các gói khác nếu cần
    // ];

    const togglePack = (index) => {
        setOpenPackIndex(openPackIndex === index ? null : index);
        setOpenDropdownIndex(null);
    };

    const toggleDropdown = (index) => {
        setOpenDropdownIndex(openDropdownIndex === index ? null : index);
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {weddingPacks.length > 0 ? weddingPacks.map((pack, packIndex) => (
                <div key={packIndex} className="relative group rounded-lg  text-white cursor-pointer overflow-hidden transition-all duration-500 ease-in-out transform hover:scale-105 ">

                    <div className={`bg-gradient-to-r from-gold to-whiteAlpha-400 p-6 transition-transform duration-500 hover:shadow-xl ease-in-out ${openPackIndex === packIndex ? 'translate-y-[-8px]' : ''}`}>
                        <div className='flex justify-between items-center'>
                            <h2 className="text-lg font-bold uppercase">{pack.title}</h2>
                            <div className="flex items-center bg-gray-800 p-2 rounded-full">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M5.05063 8.73418C4.20573 7.60763 5.00954 6 6.41772 6H17.5823C18.9905 6 19.7943 7.60763 18.9494 8.73418V8.73418C18.3331 9.55584 18 10.5552 18 11.5823V18C18 20.2091 16.2091 22 14 22H10C7.79086 22 6 20.2091 6 18V11.5823C6 10.5552 5.66688 9.55584 5.05063 8.73418V8.73418Z" stroke="white" stroke-width="1.5" />
                                    <path d="M14 17L14 11" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                    <path d="M10 17L10 11" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                    <path d="M16 6L15.4558 4.36754C15.1836 3.55086 14.4193 3 13.5585 3H10.4415C9.58066 3 8.81638 3.55086 8.54415 4.36754L8 6" stroke="white" stroke-width="1.5" stroke-linecap="round" />
                                </svg>

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
                                        <ul className="mt-2 list-disc ml-6 text-white">
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
            )) : <div
                className='absolute'
            >
                <div className='relative left-[400px] top-[200px]  w-[100px] h-[100px]'>
                    <div>  <Image
                        src='/notebook.png'
                        alt="user-img"
                        fill
                        className="w-[200px] opacity-50"
                    /></div>
                </div>

            </div>}
        </div>
    );
};

export default WeddingSection;