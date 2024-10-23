'use client';
import Image from 'next/image';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import goldCrown from '@/public/goldCrown.svg'

// Define Zod schema
export const formSchema = z.object({
    name: z.string().min(2, { message: 'Tên phải có ít nhất 2 ký tự' }),
    email: z.string().email({ message: 'Email không hợp lệ' }),
    phone: z.string().regex(/^[0-9]{10}$/, { message: 'Số điện thoại phải có 10 chữ số' }),
});

// InputField Component
const InputField = ({ label, type, placeholder, name, register, error, trigger }) => (
    <div className='flex flex-col gap-3'>
        <label className='text-base text-white'>{label}</label>
        <input
            type={type}
            placeholder={placeholder}
            className={`w-full px-3 py-4 rounded-md text-sm bg-whiteAlpha-100 placeholder:text-gray-400 focus:outline-none focus:border-gold focus:ring-gold focus:ring-1 transition-all ${error ? 'border-red-500' : ''}`}
            {...register(name)}
            onBlur={() => trigger(name)}
        />
        {error && <p className="text-red-500 text-sm">{error.message}</p>} {/* Display error messages */}
    </div>
);

const Page = () => {
    // Initialize `useForm` with `zodResolver`
    const { register, handleSubmit, formState: { errors }, trigger } = useForm({
        resolver: zodResolver(formSchema),
    });

    // Handle form submission
    const onSubmit = (data) => {
        console.log('Form data:', data);
        // Handle form submission logic here
    };

    return (
        <div className='flex flex-col gap-[30px]'>
            <div className='flex justify-between'>
                <span className='text-2xl font-bold leading-[22px] text-white'>Tài khoản</span>
                <div className='flex items-center gap-[30px]'>
                    <span className='text-base font-semibold'>Hạng thành viên:</span>
                    <div className='flex items-center gap-2'>
                        <div className="relative w-6 h-[14px]">
                            <Image
                                src={goldCrown}
                                layout="fill"
                                alt="rank-img"
                                objectFit="cover"
                                quality={100}
                            />
                        </div>
                        <span className='text-xs text-white'>Đồng</span>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
                <div className='flex flex-col gap-[30px] w-full'>
                    {/* Name field */}
                    <InputField
                        label="Tên đầy đủ"
                        type="text"
                        placeholder="Hồ Duy Hoàng Giang"
                        name="name"
                        register={register}
                        error={errors.name}
                        trigger={trigger}
                    />

                    {/* Email field */}
                    <InputField
                        label="Email"
                        type="email"
                        placeholder="hohoanggiang80@gmail.com"
                        name="email"
                        register={register}
                        error={errors.email}
                        trigger={trigger}
                    />

                    {/* Phone field */}
                    <InputField
                        label="Số điện thoại"
                        type="text"
                        placeholder="0337678852"
                        name="phone"
                        register={register}
                        error={errors.phone}
                        trigger={trigger}
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
