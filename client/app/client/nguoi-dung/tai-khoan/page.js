'use client'
import Image from 'next/image';
import React, { useState } from 'react';

const InputField = ({ label, type, placeholder, name, value, onChange }) => (
    <div className='flex flex-col gap-3'>
        <label className='text-base text-white'>{label}</label>
        <input
            type={type}
            placeholder={placeholder}
            className='w-full px-3 py-4 rounded-md text-sm border-gray-300 bg-whiteAlpha-100 placeholder:text-gray-400'
            name={name}
            value={value}
            onChange={onChange}
            required
        />
    </div>
);

const Page = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: ''
    });

    // Hàm xử lý thay đổi cho form
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'phone') {
            const phoneValue = value.replace(/[^0-9]/g, ''); // Loại bỏ các ký tự không phải số
            if (phoneValue.length <= 10) {
                setFormData({
                    ...formData,
                    [name]: phoneValue
                });
            }
        } else {
            setFormData({
                ...formData,
                [name]: value
            });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Xử lý submit form
        console.log('Form data:', formData);
    };

    return (
        <div className='flex flex-col gap-[30px]'>
            <div className='flex justify-between'>
                <span className='text-2xl font-bold leading-[22px] text-white'>Tài khoản</span>
                <div className='flex items-center gap-[30px]'>
                    <span className='text-base font-semibold'>Hạng thành viên:</span>
                    <div className='flex gap-2'>
                        <div className="relative w-6 h-3">
                            <Image
                                src={'/rankUser.png'}
                                alt="rank-img"
                                layout="fill"
                                objectFit="contain"
                            />
                        </div>
                        <span className='text-xs text-white'>Đồng</span>
                    </div>
                </div>
            </div>
            <form onSubmit={handleSubmit}>
                <div className='flex flex-col gap-[30px] w-full'>
                    <InputField
                        label="Tên đầy đủ"
                        type="text"
                        placeholder="Hồ Duy Hoàng Giang"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                    />
                    <InputField
                        label="Email"
                        type="email"
                        placeholder="hohoanggiang80@gmail.com"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                    />
                    <InputField
                        label="Số điện thoại"
                        type="text"
                        placeholder="0337678852"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                    />

                    <div className='flex gap-[20px] justify-end w-full'>
                        <button
                            type="button"
                            className='flex items-center gap-[10px] px-4 py-[10px] bg-white text-black rounded-full text-sm'
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" fill="#4B5563" />
                            </svg>
                            Hủy
                        </button>
                        <button
                            type="submit"
                            className='flex items-center gap-[10px] px-4 py-[10px] bg-gold text-white rounded-full text-sm'
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path d="M17 3H5C3.89 3 3 3.9 3 5V19C3 20.1 3.89 21 5 21H19C20.1 21 21 20.1 21 19V7L17 3ZM19 19H5V5H16.17L19 7.83V19ZM12 12C10.34 12 9 13.34 9 15C9 16.66 10.34 18 12 18C13.66 18 15 16.66 15 15C15 13.34 13.66 12 12 12ZM6 6H15V10H6V6Z" fill="white" />
                            </svg>
                            Cập nhật
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default Page;
