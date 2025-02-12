"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const SideBarUserClient = ({ unreadNotifications, offNav }) => {
    const pathName = usePathname();

    const links = [
        { title: 'Chung', links: ['/client/nguoi-dung'], color: "text-white" },
        { title: 'Tài khoản', links: '/client/nguoi-dung/tai-khoan', color: "text-white" },
        { title: 'Hạng thành viên', links: '/client/nguoi-dung/hang-thanh-vien', color: "text-white" },
        { title: 'Lịch sử tiệc', links: ['/client/nguoi-dung/lich-su-tiec'], color: "text-white" },
        { title: 'Thực đơn của bạn', links: ['/client/nguoi-dung/thuc-don-cua-ban'], color: "text-white" },
        { title: 'Combo của bạn', links: ['/client/nguoi-dung/combo-cua-ban'], color: "text-white" },
        { title: 'Thông báo', links: '/client/nguoi-dung/thong-bao', color: "text-white" },
        { title: 'Đổi mật khẩu', links: '/client/nguoi-dung/doi-mat-khau', color: "text-white" },
        { title: 'Đăng xuất', links: '/client/nguoi-dung/dang-xuat', color: "text-red-400" },
    ];

    const isActiveLink = (link) => {
        if (Array.isArray(link)) {
            return link.some((l) => {
                const baseLink = l.replace('/[id]', '');
                return new RegExp(`^${baseLink}(/\\w+)?$`).test(pathName);
            });
        }
        return pathName === link;
    };

    return (
        <div className='w-full max-md:w-[200px] h-full overflow-y-auto scrollbar-thin scrollbar-thumb-white scrollbar-track-gray-900 '>
            <ul className='flex flex-col gap-4 w-full max-md:w-[100%] border-l-0 rounded-l-none rounded-lg'>
                {links.map((item, index) => {
                    const isActive = isActiveLink(item.links);
                    return (
                        <li
                            key={index}
                            className={`rounded-lg ${isActive ? 'bg-gold' : ''} hover:bg-gold hover:shadow-lg transition-all duration-300 ease-in-out text-sm`}
                        >
                            <div className='relative'>
                                {item.title === 'Thông báo' && unreadNotifications > 0 && (
                                    <div className='h-3 w-3 rounded-full bg-red-500 absolute right-0'></div>
                                )}
                                <Link
                                    href={Array.isArray(item.links) ? item.links[0] : item.links}
                                    onClick={() => offNav(false)} 
                                    className={`font-Montserrat text-center max-md:text-start max-md:text-[13px] md:text-left block py-3 px-6  max-md:leading-[13px] leading-[22px] text-base ${isActive ? 'text-white font-bold' : item.color} hover:text-white`}
                                >
                                    {item.title}
                                </Link>
                            </div>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default SideBarUserClient;
