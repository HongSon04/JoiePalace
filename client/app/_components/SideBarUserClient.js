'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const SideBarUserClient = () => {
    const pathName = usePathname();

    const linkUser = [
        { title: 'Chung', link: ['/client/nguoi-dung/chung', '/client/nguoi-dung'], color: "text-white" },
        { title: 'Tài khoản', link: '/client/nguoi-dung/tai-khoan', color: "text-white" },
        { title: 'Hạng thành viên', link: '/client/nguoi-dung/hang-thanh-vien', color: "text-white" },
        { title: 'Lịch sử tiệc', link: ['/client/nguoi-dung/lich-su-tiec', '/client/nguoi-dung/lich-su-tiec/[id]'], color: "text-white" },
        { title: 'Thông báo', link: '/client/nguoi-dung/thong-bao', color: "text-white" },
        { title: 'Đổi mật khẩu', link: '/client/nguoi-dung/doi-mat-khau', color: "text-white" },
        { title: 'Đăng xuất', link: '/client/nguoi-dung/dang-xuat', color: "text-red-400" },
    ];

    const isActiveLink = (link) => {
        if (Array.isArray(link)) {
            return link.some(l => {
                const baseLink = l.replace('/[id]', '');
                const regex = new RegExp(`^${baseLink}(/\\w+)?$`);
                return regex.test(pathName); 
            });
        }
        return pathName === link;
    };

    return (
        <div className='w-full h-full overflow-y-auto scrollbar-thin scrollbar-thumb-white scrollbar-track-gray-900'>
            <ul className='flex flex-col gap-4 w-full'>
                {linkUser.map((item, index) => (
                    <li
                        key={index}
                        className={`rounded-lg ${isActiveLink(item.link) ? 'bg-gold' : ''} hover:bg-gold hover:shadow-lg transition-all duration-300 ease-in-out`}
                    >
                        <Link
                            href={Array.isArray(item.link) ? item.link[0] : item.link}
                            className={`text-center md:text-left block py-3 px-6 font-bold leading-[22px] text-base ${isActiveLink(item.link) ? 'text-white' : item.color} hover:text-white`}
                        >
                            {item.title}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SideBarUserClient;
