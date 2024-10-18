'use client';
import Image from 'next/image';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import arrow_forward from '@/public/arrow_forward.svg';

// Define Zod schema for validation
const formSchema = z.object({
  currentPassword: z.string().min(1, { message: 'Mật khẩu hiện tại là bắt buộc' }),
  newPassword: z.string().min(6, { message: 'Mật khẩu mới phải có ít nhất 6 ký tự' }),
  confirmPassword: z.string().min(6, { message: 'Xác nhận mật khẩu là bắt buộc' }),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Mật khẩu mới và xác nhận mật khẩu không khớp!',
  path: ['confirmPassword'], // Set the error on confirmPassword field
});

// InputField Component with error handling
const InputField = ({ label, type, placeholder, name, register, error, trigger }) => (
  <div className='flex flex-col gap-3'>
    <label className='text-base text-white'>{label}<span className='text-red-400'> *</span></label>
    <input
      type={type}
      placeholder={placeholder}
      className={`w-full px-3 py-4 rounded-md text-sm bg-whiteAlpha-100 placeholder:text-gray-400 focus:outline-none focus:border-gold focus:ring-gold focus:ring-1 transition-all ${error ? 'border-red-500' : ''}`}
      {...register(name, { onBlur: () => trigger(name) })}
    />
    {error && <p className="text-red-500 text-sm">{error.message}</p>} {/* Show error message */}
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
    // Handle form submit logic
  };

  return (
    <div className='flex flex-col gap-[30px] p-4'>
      <span className='text-2xl font-bold leading-[22px] text-white'>Đổi mật khẩu</span>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='flex flex-col gap-[30px] w-full'>
          {/* Current Password Field */}
          <InputField
            label="Mật khẩu hiện tại"
            type="password"
            placeholder="Nhập mật khẩu hiện tại"
            name="currentPassword"
            register={register}
            error={errors.currentPassword}
            trigger={trigger}
          />
          
          {/* New Password Field */}
          <InputField
            label="Mật khẩu mới"
            type="password"
            placeholder="Nhập mật khẩu mới"
            name="newPassword"
            register={register}
            error={errors.newPassword}
            trigger={trigger}
          />

          {/* Confirm Password Field */}
          <InputField
            label="Nhập lại mật khẩu"
            type="password"
            placeholder="Xác nhận mật khẩu mới"
            name="confirmPassword"
            register={register}
            error={errors.confirmPassword}
            trigger={trigger}
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
