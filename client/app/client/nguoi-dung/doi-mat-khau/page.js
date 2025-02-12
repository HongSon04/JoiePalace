'use client';
import Image from 'next/image';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import arrow_forward from '@/public/arrow_forward.svg';
import { API_CONFIG } from "@/app/_utils/api.config";
import useApiServices from "@/app/_hooks/useApiServices";
import useCustomToast from "@/app/_hooks/useCustomToast";
import { useRouter } from 'next/navigation';
import Cookies from "js-cookie";

// Define Zod schema for validation
const formSchema = z.object({
  currentPassword: z.string().min(1, { message: 'Mật khẩu hiện tại là bắt buộc' }),
  newPassword: z.string().min(6, { message: 'Mật khẩu mới phải có ít nhất 6 ký tự' }),
  confirmPassword: z.string().min(6, { message: 'Xác nhận mật khẩu là bắt buộc' }),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Mật khẩu mới và xác nhận mật khẩu không khớp!',
  path: ['confirmPassword'],
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
  const toast = useCustomToast();
  const { makeAuthorizedRequest } = useApiServices();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState(null);


  // Initialize `useForm` with `zodResolver`
  const { register, handleSubmit, formState: { errors }, trigger } = useForm({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = (data) => {
    const newData = {
      oldPassword: data.currentPassword,
      newPassword: data.newPassword,
      confirmPassword: data.confirmPassword
    }
    setFormData(newData);
    setIsModalOpen(true);
  };

  const handleConfirm = async () => {
    setIsModalOpen(true);

    try {
      const response = await makeAuthorizedRequest(
        API_CONFIG.USER.CHANGE_PASSWORD,
        "PUT",
        formData,
        null,
        '/client/dang-nhap'
      );

      if (response?.success) {
        setIsModalOpen(false);
        toast({
          position: "top",
          type: "success",
          title: "Cập nhật thành công!",
          closable: true,
        });
        Cookies.remove("accessToken");
        localStorage.removeItem("user");
        setTimeout(() => {
          router.push('/client/dang-nhap');
        }, 1000)
      } else {
        toast({
          position: "top",
          type: "error",
          title: "Cập nhật thất bại!",
          description: response?.error?.message || "Vui lòng thử lại sau.",
          closable: true,
        });
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setIsModalOpen(false);
    }
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <div className='flex flex-col gap-[30px] p-4 max-sm:p-0'>
      <span className='text-2xl font-bold leading-[22px] text-white max-sm:text-center'>Đổi mật khẩu</span>
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

          <div className='flex gap-[20px] justify-end w-full max-sm:justify-between'>
            {/* <button
              type="button"
              className='flex items-center gap-[10px] px-4 py-[10px] bg-gray-200 text-black rounded-full text-sm hover:bg-gray-300 transition-all duration-300'
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" fill="#4B5563" />
              </svg>
              Hủy
            </button> */}
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
      {isModalOpen && (
        <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50'>
          <div className='bg-white rounded-lg p-6 w-1/3 max-md:w-[80%];'>
            <h2 className='text-lg font-bold mb-4 text-black'>Xác nhận đổi mật khẩu</h2>
            <p className='text-black'>Bạn có chắc chắn muốn đổi mật khẩu không?</p>
            <div className='flex justify-end mt-4'>
              <button
                onClick={handleCancel}
                className='mr-2 px-4 py-2 bg-gray-300 text-black rounded-md hover:bg-gray-400'
              >
                Hủy
              </button>
              <button
                onClick={handleConfirm}
                className='px-4 py-2 bg-gold text-white rounded-md hover:bg-gold/80'
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
