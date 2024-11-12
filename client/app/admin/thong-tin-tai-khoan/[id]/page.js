"use client";
import AdminHeader from '@/app/_components/AdminHeader';
import React, { useEffect, useState } from 'react';
import { IoIosLogOut } from "react-icons/io";
import { FaPhoneAlt } from "react-icons/fa";
import { z } from "zod";
import useCustomToast from "@/app/_hooks/useCustomToast";

import { makeAuthorizedRequest } from '@/app/_utils/api.config';
import { changePassWord } from '@/app/_services/apiServices';
import { useRouter } from 'next/navigation'; 
const formSchema = z.object({
    oldPassword: z.string().min(2, "Vui lòng nhập mật khẩu cũ!"),
    newPassword: z.string().min(8, "Mật khẩu mới phải có ít nhất 8 ký tự"),
    confirmPassword: z.string()
      .min(8, "Mật khẩu xác nhận phải có ít nhất 8 ký tự"),
  });
  
const Page = () => {
    const router = useRouter();
    const handleLogout = () => {
        const isConfirmed = window.confirm("Bạn có chắc chắn muốn đăng xuất không?");
    
        if (isConfirmed) {
            localStorage.removeItem('currentBranch');
            localStorage.removeItem('user');
            localStorage.removeItem('refreshToken');
            router.push("/auth/chon-chi-nhanh");
        } 
    };
    
    const [user, setUser] = useState(null);
    const toast = useCustomToast();
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    useEffect(() => {
        const userData = localStorage.getItem('user');
        // console.log(userData);
        
        if (userData) {
        setUser(JSON.parse(userData));
        }
    }, []);
    const handleChange = (e) => {
        const { name, value, type } = e.target;
        setFormData((prevData) => ({
          ...prevData,
          [name]: type === "number" ? Number(value) : value,
        }));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.newPassword !== formData.confirmPassword) {
            setErrors({ confirmPassword: "Mật khẩu xác nhận không khớp với mật khẩu mới" });
            return; 
        }
       
        const validationErrors = {};
        
        try {
          formSchema.parse(formData);  
          setErrors({});
      
          const response = await changePassWord({
            oldPassword: formData.oldPassword,
            newPassword: formData.newPassword,
            confirmPassword: formData.confirmPassword,
          });
          
        //   console.log(response);  
          
          toast({
            position: "top",
            type: "success",
            title: "Đổi mật khẩu thành công!",
            description: "Mật khẩu đã được cập nhật!",
            closable: true,
          });
          
          setFormData({
            oldPassword: "",
            newPassword: "",
            confirmPassword: "",
          });
        } catch (error) {
          console.error("Error:", error);  
          if (error.response) {
            toast({
              position: "top",
              type: "error",
              title: "Đổi mật khẩu thất bại!",
              description: error?.response?.data?.message || "Đã có lỗi xảy ra!",
              closable: true,
            });
          }
      
          if (error?.errors) {
            const validationErrors = {};
            error.errors.forEach((err) => {
              validationErrors[err.path[0]] = err.message;
            });
            setErrors(validationErrors);
          }
        }
      };
      
      
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
                    <button onClick={handleLogout} className='button rounded-full flex gap-[5px] items-center p-2 bg-red-400'>
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
                    <form onSubmit={handleSubmit} >
                        <div className="flex gap-4">
                            <div className='w-1/3'>
                                <p className='mb-3'>Mật khẩu cũ</p>
                                <input
                                    className='w-full p-3 rounded-lg bg-whiteAlpha-100'
                                    type="text"
                                    name="oldPassword" 
                                    placeholder="Mật khẩu cũ"
                                    value={formData.oldPassword}
                                    onChange={handleChange}
                                />
                                <span className="text-sm text-red-600">
                                    {errors.oldPassword && errors.oldPassword}
                                </span>
                            </div>
                            <div className='w-1/3'>
                                <p className='mb-3'>Mật khẩu mới</p>
                                <input
                                    className='w-full p-3 rounded-lg bg-whiteAlpha-100'
                                    type="text"
                                    name="newPassword"
                                    placeholder="Mật khẩu mới"
                                    value={formData.newPassword}
                                    onChange={handleChange}
                                />
                                <span className="text-sm text-red-600">
                                    {errors.newPassword && errors.newPassword}
                                </span>
                            </div>
                            <div className='w-1/3'>
                                <p className='mb-3'>Nhập lại mật khẩu mới</p>
                                <input
                                    className='w-full p-3 rounded-lg bg-whiteAlpha-100'
                                    type="text"
                                    name="confirmPassword"
                                    placeholder="Nhập lại mật khẩu mới"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                />
                                <span className="text-sm text-red-600">
                                    {errors.confirmPassword && errors.confirmPassword}
                                </span>
                            </div>
                        </div>
                        <div className='flex justify-end mt-3'>
                            <button type="submit" className='button rounded-full flex gap-[5px] items-center p-2 bg-teal-400'>
                                Đổi mật khẩu
                            </button>
                        </div>
                        
                    </form>
                </div>
                
            </div>
            <div className='flex justify-start items-center gap-2 text-base '>
                <p>Cấp lại mật khẩu</p>
            </div>
            <div className='w-full'>
                <div className='flex justify-start'>
                    <button   className='button rounded-full flex gap-[5px] items-center p-3 bg-whiteAlpha-100 '>
                        <FaPhoneAlt /> 
                        Liên hệ kỹ thuật viên
                    </button>
                </div>
            </div>
        </main>
    );
};

export default Page;