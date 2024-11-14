'use client'
import MenuItems from '@/app/_components/MenuItems';
import React, { useState } from 'react';

const Page = () => {

    const menuData = [
        {
            title: "Món khai vị",
            items: ["Gà rán KFC", "Gỏi củ hủ dừa tôm thịt"]
        },
        {
            title: "Món chính",
            items: ["Gỏi củ hủ dừa tôm thịt", "Bò bít tết", "Cá hồi nướng"]
        },
    ];

    return (
        <div className='flex flex-col gap-8 '>
        <h1 className='text-2xl font-bold  leading-6'>Thực đơn của bạn</h1>
        <div className='flex gap-8'>
                    <MenuItems data={menuData}></MenuItems>
                    <MenuItems data={menuData}></MenuItems>
                </div>
        </div>
       
    );
};

export default Page;