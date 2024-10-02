import React from 'react';

const SideBarUser = () => {
    const linkUser = [
        {
            title: 'Chung',
            link: '/Chung',
            color: "text-white"
        },
        {
            title: 'Tài khoản',
            link: '/tai-khoan',
        },
        {
            title: 'Thành viên',
            link: '/thanh-vien',
            color: "text-white"
        },
        {
            title: 'Lịch sử tiệc',
            link: '/lich-su-tiec',
            color: "text-white"
        },
        {
            title: 'Thông báo',
            link: '/thong-bao',
            color: "text-white"
        },
        {
            title: 'Đổi mật khẩu',
            link: '/doi-mat-khau',
            color: "text-white"
        },
        {
            title: 'Đăng xuất',
            link: '/dang-xuat',
            color: "text-red-400"
        }
    ];

    return (
        <div className='w-full p-4'>
            <ul className='flex flex-col gap-4 w-full'>
                {linkUser && linkUser.map((item, index) => (
                    <li key={index} className='rounded-lg bg-gold hover:bg-gold shadow-md hover:shadow-lg transition-all duration-300 ease-in-out'>
                        <a href={item.link} className={`block py-3 px-6 font-bold leading-[22px] text-base ${item.color}`}>
                            {item.title}
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SideBarUser;
