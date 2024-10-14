'use client';
import Image from 'next/image';
import React, { useState } from 'react';
import arrow_forward from '@/public/arrow_forward.svg';

const InputField = ({ label, type, placeholder, name, value, onChange }) => (
    <div className='flex flex-col gap-3'>
        <label className='text-base text-white'>{label}<span className='text-red-400'> *</span></label>
        <input
            type={type}
            placeholder={placeholder}
            className='w-full px-3 py-4 rounded-md text-sm bg-whiteAlpha-100 placeholder:text-gray-400 focus:outline-none focus:border-gold focus:ring-gold focus:ring-1 transition-all'
            name={name}
            value={value}
            onChange={onChange}
            required
        />
    </div>
);

const Page = () => {
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    // Hàm xử lý thay đổi cho form
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Kiểm tra xem mật khẩu mới và xác nhận mật khẩu có khớp nhau không
        if (formData.newPassword !== formData.confirmPassword) {
            alert("Mật khẩu mới và xác nhận mật khẩu không khớp!");
            return;
        }
        // Xử lý submit form
        console.log('Form data:', formData);
    };

    return (
        <div className='flex flex-col gap-[30px] p-4'>
            <span className='text-2xl font-bold leading-[22px] text-white'>Đổi mật khẩu</span>
            <form onSubmit={handleSubmit}>
                <div className='flex flex-col gap-[30px] w-full'>
                    <InputField
                        label="Mật khẩu hiện tại"
                        type="password"
                        placeholder="Nhập mật khẩu hiện tại"
                        name="currentPassword"
                        value={formData.currentPassword}
                        onChange={handleInputChange}
                    />
                    <InputField
                        label="Mật khẩu mới"
                        type="password"
                        placeholder="Nhập mật khẩu mới"
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleInputChange}
                    />
                    <InputField
                        label="Nhập lại mật khẩu"
                        type="password"
                        placeholder="Xác nhận mật khẩu mới"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                    />

                    <div className='flex gap-[20px] justify-end w-full'>
                        <button
                            type="button"
                            className='flex items-center gap-[10px] px-4 py-[10px] bg-gray-200 text-black rounded-full text-sm hover:bg-gray-300 transition-all duration-300'
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" fill="#4B5563" />
                            </svg>
                            Hủy
                        </button>
                        <button
                            type="submit"
                            className='flex items-center gap-[10px] px-4 py-[10px] bg-gold text-white rounded-full text-sm hover:bg-gold/80 transition-all duration-300'
                        >
                            <Image src={arrow_forward} alt='iconArrow' />
                            Đổi mật khẩu
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default Page;
