'use client';
import Image from 'next/image';
import React from 'react';
import iconExitLogout from '@/public/iconExitLogout.svg'
const Page = () => {
    return (
        <div className='w-full'>
            <div className='flex flex-col gap-[30px]'>
                <h1 className='text-2xl font-bold leading-6 text-white'>Đăng xuất</h1>
                <p className='mt-4 text-base text-red-400 leading-6'>
                    Lưu ý:
                    <br />
                    Quý khách vẫn đang còn 1 tiệc chờ (9h30 ngày 29/12/2024), quý khách sẽ không nhận được thông báo từ trang web nếu đăng xuất.
                </p>
                <p className='mt-2 text-base text-white leading-6'>
                    Chúng tôi vẫn sẽ thông báo thông qua email để đảm bảo quý khách không bỏ sót bất kỳ thông tin quan trọng nào. Hẹn gặp lại quý khách vào dịp gần nhất!
                </p>
                <button className='flex gap-1 items-center ml-auto flex-grow-0 w-fit mt-6 px-4 py-2 bg-red-500 text-white text-base leading-6 rounded-full hover:bg-red-600 transition duration-200'>
                    <Image src={iconExitLogout} alt='iconExitLogout'></Image>
                    Đăng xuất
                </button>
            </div>
        </div>
    );
};

export default Page;
