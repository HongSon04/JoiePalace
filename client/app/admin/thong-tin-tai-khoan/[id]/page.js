"use client";
import AdminHeader from '@/app/_components/AdminHeader';
import React, { useEffect, useState } from 'react';
import { IoIosLogOut } from "react-icons/io";
import { FaPhoneAlt } from "react-icons/fa";

const Page = () => {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [user, setUser] = useState(null);

    useEffect(() => {
        const userData = localStorage.getItem('user');
        console.log(userData);
        
        if (userData) {
        setUser(JSON.parse(userData));
        }
    }, []);
    return (
        <main className="grid gap-6 p-4 text-white">
            <AdminHeader
                title="Thông tin tài khoản"
                showSearchForm = {false}
            ></AdminHeader>
            <div className='flex justify-start items-center gap-2 text-base '>
                <p>Tài khoản</p>
            </div>
            <div>
                <div>
                   <form className='w-full flex gap-6 items-center mb-3'>
                        <div className='w-1/2'>
                            <p className='mb-3'>Tên tài khoản</p>
                            <input
                            className='w-full p-3 rounded-lg bg-whiteAlpha-100'
                            type="text"
                            value={user ? user.username : "N/A"}
                            readOnly
                            />
                        </div>
                        <div className='w-1/2'>
                            <p className='mb-3'>Email</p>
                            <input
                            className='w-full p-3 rounded-lg bg-whiteAlpha-100'
                            type="text"
                            value={user ? user.email : "N/A"}
                            readOnly
                            />
                        </div>
                   </form>
                </div>
                <div className='flex justify-end'>
                    <button className='button rounded-full flex gap-[5px] items-center p-2 bg-red-400'>
                        <IoIosLogOut className='text-base' />
                        Đăng xuất
                    </button>
                </div>
            </div>
            <div className='flex justify-start items-center gap-2 text-base '>
                <p>Đổi mật khẩu</p>
            </div>
            <div className='w-full'>
                <div>
                    <form className='w-full flex gap-6 items-center mb-3'>
                        <div className='w-1/3'>
                            <p className='mb-3'>Mật khẩu cũ</p>
                            <input
                            className='w-full p-3 rounded-lg bg-whiteAlpha-100'
                            type="text"
                            placeholder="Mật khẩu cũ"
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                            />
                        </div>
                        <div className='w-1/3'>
                            <p className='mb-3'>Mật khẩu mới</p>
                            <input
                            className='w-full p-3 rounded-lg bg-whiteAlpha-100'
                            type="text"
                            placeholder="Mật khẩu mới"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            />
                        </div>
                        <div className='w-1/3'>
                            <p className='mb-3'>Nhập lại mật khẩu mới</p>
                            <input
                            className='w-full p-3 rounded-lg bg-whiteAlpha-100'
                            type="text"
                            placeholder="Nhập lại mật khẩu mới"
                            value={confirmNewPassword}
                            onChange={(e) => setConfirmNewPassword(e.target.value)}
                            />
                        </div>
                    </form>
                </div>
                <div className='flex justify-end'>
                    <button className='button rounded-full flex gap-[5px] items-center p-2 bg-teal-400'>
                        Đổi mật khẩu
                    </button>
                </div>
            </div>
            <div className='flex justify-start items-center gap-2 text-base '>
                <p>Cấp lại mật khẩu</p>
            </div>
            <div className='w-full'>
                <div className='flex justify-start'>
                    <button className='button rounded-full flex gap-[5px] items-center p-3 bg-whiteAlpha-100 '>
                        <FaPhoneAlt /> 
                        Liên hệ kỹ thuật viên
                    </button>
                </div>
            </div>
        </main>
    );
};

export default Page;