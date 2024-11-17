'use client';
import MenuItems from '@/app/_components/MenuItems';
import React, { useEffect, useState } from 'react';
import { fetchAllMenu } from '@/app/_services/menuServices';
import { useRouter } from 'next/navigation';
import { Image } from '@nextui-org/react';
import Link from 'next/link';

const Page = () => {
    const [menuDataByIDUser, setMenuDataByIDUser] = useState([]);
    const router = useRouter();

    useEffect(() => {
        const getUser = JSON.parse(localStorage.getItem("user"));
        if (!getUser) {
            router.push('/');
            return;
        }

        const fetchData = async () => {
            try {
                const data = await fetchAllMenu();
                const filteredMenuData = data.filter(menu => menu.user_id === getUser.id);
                console.log(filteredMenuData);

                setMenuDataByIDUser(filteredMenuData);
            } catch (error) {
                console.error('Error fetching menu data:', error);
            }
        };

        fetchData();
    }, []);



    return (
        <div className='flex flex-col gap-8'>
            <h1 className='text-2xl font-bold leading-6'>Thực đơn của bạn</h1>
            <div className='flex gap-8'>
                {menuDataByIDUser.length > 0 ? (
                    menuDataByIDUser.map(menu => {
                        // Extract items for each category
                        const appetizers = menu.products['mon-khai-vi'] || [];
                        const mainDishes = menu.products['mon-chinh'] || [];
                        const mainDessert = menu.products['mon-trang-mieng'] || [];

                        // Extract names and prices once
                        const extractDishData = (data) => data.map(item => ({
                            price: item.price,
                            name: item.name,
                        }));

                        const menuData = [
                            {
                                title: "Món khai vị",
                                items: extractDishData(appetizers).map(item => item.name),
                                price: extractDishData(appetizers).map(item => item.price),
                            },
                            {
                                title: "Món chính",
                                items: extractDishData(mainDishes).map(item => item.name),
                                price: extractDishData(mainDishes).map(item => item.price),
                            },
                            {
                                title: "Món tráng miệng",
                                items: extractDishData(mainDessert).map(item => item.name),
                                price: extractDishData(mainDessert).map(item => item.price),
                            },
                        ];

                        return (
                            <MenuItems
                                key={menu.id}
                                data={menuData}
                                imgMenu={menu.images}
                                nameMenu={menu.name}
                                priceTotal={menu.price}
                            />
                        );
                    })
                ) : (
                    <div className='flex flex-col items-center justify-center w-full h-[50vh]'>
                        <div className='w-[200px] opacity-50'>
                            <Image
                                src='/cloche.png'
                                alt="Notebook image"
                                className="object-cover "
                            />
                        </div>
                        <div className='flex mt-4 text-lg '>
                            <p>Bạn có muốn tạo menu cho riêng mình?</p>
                            <Link href='/client/tao-thuc-don' className='ml-2 text-gold hover:text-gold hover:underline'>
                                Tạo menu
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>

    );
};

export default Page;
