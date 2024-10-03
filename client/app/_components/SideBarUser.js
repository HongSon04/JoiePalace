'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const SideBarUser = () => {
    const pathName = usePathname();

    const linkUser = [
        {
            title: 'Chung',
            link: ['/client/nguoi-dung/chung', '/client/nguoi-dung'],
            color: "text-white"
        },
        {
            title: 'Tài khoản',
            link: '/client/nguoi-dung/tai-khoan',
            color: "text-white"
        },
        {
            title: 'Thành viên',
            link: '/client/nguoi-dung/thanh-vien',
            color: "text-white"
        },
        {
            title: 'Lịch sử tiệc',
            link: '/client/nguoi-dung/lich-su-tiec',
            color: "text-white"
        },
        {
            title: 'Thông báo',
            link: '/client/nguoi-dung/thong-bao',
            color: "text-white"
        },
        {
            title: 'Đổi mật khẩu',
            link: '/client/nguoi-dung/doi-mat-khau',
            color: "text-white"
        },
        {
            title: 'Đăng xuất',
            link: '/dang-xuat',
            color: "text-red-400"
        }
    ];

    const isActiveLink = (link) => {
        if (Array.isArray(link)) {
            return link.includes(pathName);
        }
        return pathName === link;   
    };

    return (
        <div className='w-full'>
            <ul className='flex flex-col gap-4 w-full'>
                {linkUser && linkUser.map((item, index) => (
                    <li 
                        key={index} 
                        className={`rounded-lg ${isActiveLink(item.link) ? 'bg-gold' : ''} hover:bg-gold  hover:shadow-lg transition-all duration-300 ease-in-out`}
                    >
                        <Link href={Array.isArray(item.link) ? item.link[0] : item.link} className={`block py-3 px-6 font-bold leading-[22px] text-base ${item.color || 'text-gray-700'} hover:text-white`}>
                            {item.title}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SideBarUser;
