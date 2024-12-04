'use client';
import { Image } from "@chakra-ui/react";
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import arrow_forward from '@/public/arrow_forward.svg';
import ButtonDiscover from './ButtonDiscover';

// Define your validation schema using Zod
const schema = z.object({
    numberPeoples: z.string().nonempty("This field is required"),
    eventType: z.string().nonempty("This field is required"),
    budget: z.string().nonempty("This field is required"),
});

const ToolCreactCombo = () => {
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(schema),
    });

    const onSubmit = (data) => {
        console.log(data);
    };

    const InputField = ({ label, type, placeholder, error, name }) => (
        <div className='flex flex-col gap-3'>
            <label htmlFor={name} className='text-base text-white'>{label}</label>
            <input
                type={type}
                placeholder={placeholder}
                {...register(name)}
                className={`w-full px-3 py-4 rounded-xl text-sm bg-whiteAlpha-100 placeholder:text-gray-400 focus:outline-none focus:border-gold focus:ring-gold focus:ring-1 transition-all ${error ? 'border-red-500' : ''}`}
            />
            {error && <span className='text-red-500 text-sm'>{error.message}</span>}
        </div>
    );

    const InputSelect = ({ label, options, error, name }) => (
        <div className='flex flex-col gap-3'>
            <label htmlFor={name} className='text-base text-white'>{label}</label>
            <select
                {...register(name)}
                className={`w-full px-3 py-4 rounded-xl text-sm bg-whiteAlpha-100 focus:outline-none focus:border-gold focus:ring-gold focus:ring-1 transition-all ${error ? 'border-red-500' : ''}`}
            >
                <option value="" disabled>Select an option</option>
                {options.map((option, index) => (
                    <option key={index} value={option.value} className='text-black'>
                        {option.label}
                    </option>
                ))}
            </select>
            {error && <span className='text-red-500 text-sm'>{error.message}</span>}
        </div>
    );

    return (
        <div className="select-none flex h-screen max-lg:h-fit max-lg:py-10 justify-between items-center px-[200px] max-xl:px-[100px] max-lg:px-[50px]">
            {/* Left Section */}
            <div className="text-left max-w-[380px]  max-lg:max-w-[55%] max-sm:max-w-[100%]">
                <h2 className="text-[48px] max-lg:text-[24px]  font-bold text-gold mb-4 uppercase font-gilroy">TẠO GÓI TIỆC</h2>
                <p className="text-white mb-6  max-lg:text-[13px]">
                    Nắm bắt được tâm lý khách hàng, với tiêu chí “Tiện lợi- Nhanh gọn - Rõ ràng”, Joie Palace giới thiệu bộ công cụ tạo tiệc và dự chi hoàn toàn mới. Với mục tiêu mang đến cái nhìn tổng quát về những chi tiết, những thành phần cần thiết để tạo nên một bữa tiệc đang nhớ và thành công, chúng tôi ở đây để giúp bạn lựa chọn được những dịch vụ phù hợp với nhu cầu, cũng như đưa ra được con số hoàn hảo nhất, vừa vặn với tầm dự chi của bạn.
                </p>
                <ButtonDiscover name={'Tạo ngay'} link={'/client/tao-combo'}></ButtonDiscover>
            </div>
            <div className="relative bottom-10 right-24  max-lg:right-4 max-sm:hidden">
                <div className="max-xl:w-48 max-lg:w-32 w-64 h-auto shadow-lg right-10">
                    <Image
                        src="/combo.png"
                        alt=""
                    />
                </div>
                <div className="max-xl:w-48 max-lg:w-32 absolute top-10 -right-44  w-64 h-auto shadow-lg  ">
                    <Image
                        src="/combo.png"
                        alt=""
                    />
                </div>
                <div className="max-xl:w-48 max-lg:w-32 absolute top-10 max-lg:top-20  right-44 w-64 h-auto shadow-lg ">
                    <Image
                        src="/combo.png"
                        alt=""
                    />
                </div>
            </div>
        </div>

    );
};

export default ToolCreactCombo;

