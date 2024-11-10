'use client';
import Image from 'next/image';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import arrow_forward from '@/public/arrow_forward.svg';

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
        <div className="min-h-fit flex flex-col lg:flex-row gap-10 lg:gap-40 w-11/12 lg:w-8/12 mx-auto items-center justify-between py-8">
            <div className="w-full lg:w-1/2 text-center lg:text-left">
                <div className="font-bold text-2xl lg:text-4xl leading-[32px] lg:leading-[64px] font-inter text-gold uppercase mb-4 lg:mb-8">
                    CÔNG CỤ <br />
                    TẠO COMBO <br />
                    VÀ DỰ CHI
                </div>
                <div className="font-normal text-sm lg:text-base leading-[20px] lg:leading-[24px] font-inter">
                    Nắm bắt được tâm lý khách hàng, với tiêu chí “Tiện lợi - Nhanh gọn - Rõ ràng”, Joie Palace giới thiệu bộ công cụ tạo tiệc và dự chi hoàn toàn mới. Với mục tiêu mang đến cái nhìn tổng quát về những chi tiết, những thành phần cần thiết để tạo nên một bữa tiệc đáng nhớ và thành công, chúng tôi ở đây để giúp bạn lựa chọn được những dịch vụ phù hợp với nhu cầu, cũng như đưa ra được con số hoàn hảo nhất, vừa vặn với tầm dự chi của bạn.
                </div>
            </div>
            <div className="w-full lg:w-1/2">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="flex flex-col gap-6 lg:gap-[30px]">
                        <InputSelect
                            label="Với số lượng khách khoảng..."
                            options={[
                                { value: 'option1', label: 'Option 1' },
                                { value: 'option2', label: 'Option 2' },
                                { value: 'option3', label: 'Option 3' }
                            ]}
                            error={errors.numberPeoples}
                            name="numberPeoples"
                        />
                        <InputField
                            label="Quý khách dự định tổ chức tiệc..."
                            type="text"
                            placeholder="Quý khách dự định tổ chức tiệc..."
                            error={errors.eventType}
                            name="eventType"
                        />
                        <InputSelect
                            label="Số tiền quý khách dự kiến chi khoảng..."
                            options={[
                                { value: 'option1', label: 'Option 1' },
                                { value: 'option2', label: 'Option 2' },
                                { value: 'option3', label: 'Option 3' }
                            ]}
                            error={errors.budget}
                            name="budget"
                        />
                        <div className="flex gap-4 lg:gap-[20px] justify-center lg:justify-end w-full">
                            <button
                                type="submit"
                                className="flex items-center justify-center gap-2 lg:gap-[10px] px-4 py-2 lg:py-[10px] bg-gold text-white rounded-full text-xs lg:text-sm hover:bg-gold/80 transition-all duration-300 w-full"
                            >
                                <Image src={arrow_forward} alt="iconArrow" />
                                Tạo ngay
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>

    );
};

export default ToolCreactCombo;

