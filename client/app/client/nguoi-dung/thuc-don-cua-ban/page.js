'use client';
import MenuItems from '@/app/_components/MenuItems';
import React, { useEffect, useState } from 'react';
import { fetchAllMenu } from '@/app/_services/menuServices';
import { useRouter } from 'next/navigation';

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
                        const nameDish = (data) => {
                            return (data.map(item => ({
                                name: item.name,
                            }))).map(item => item.name)
                        };
                        
                        const menuData = [
                            {
                                title: "Món khai vị",
                                items: nameDish(appetizers)
                            },
                            {
                                title: "Món chính",
                                items: nameDish(mainDishes)
                            },
                        ];

                        return <MenuItems key={menu.id} data={menuData} imgMenu={menu.images} nameMenu={menu.name} />;
                    })
                ) : (
                    <p>Bạn chưa có thực đơn nào cho mình </p>
                )}

            </div>
        </div>
    );
};

export default Page;
