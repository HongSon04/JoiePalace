'use client';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { API_CONFIG } from "@/app/_utils/api.config";
import useApiServices from "@/app/_hooks/useApiServices";
import useCustomToast from "@/app/_hooks/useCustomToast";
import { decodeJwt } from "@/app/_utils/helpers";
import Cookies from "js-cookie";
import axios from "axios";
import { fetchAllBookingByUserId, fetchBookingById } from '@/app/_services/bookingServices';
import rankMemberships from '@/app/_components/RankMemberships';


// Define Zod schema
export const formSchema = z.object({
    name: z.string().min(2, { message: 'Tên phải có ít nhất 2 ký tự' }),
    email: z.string().email({ message: 'Email không hợp lệ' }),
    phone: z.string().regex(/^[0-9]{10}$/, { message: 'Số điện thoại phải có 10 chữ số' }),
});

// InputField Component
const InputField = ({ label, type, placeholder, name, register, error, trigger, readOnly }) => (
    <div className='flex flex-col gap-3'>
        <label className='text-base text-white'>{label}</label>
        <input
            type={type}
            placeholder={placeholder}
            className={`w-full px-3 py-4 rounded-md text-sm bg-whiteAlpha-100 placeholder:text-gray-400 focus:outline-none focus:border-gold focus:ring-gold focus:ring-1 transition-all ${error ? 'border-red-500' : ''}`}
            {...register(name)}
            readOnly={readOnly}
            onBlur={() => trigger(name)}
        />
        {error && <p className="text-red-500 text-sm">{error.message}</p>}
    </div>
);

const Page = () => {

    const [membershipId, setMembershipId] = useState();
    const [user, setUser] = useState();
    const toast = useCustomToast();
    const { makeAuthorizedRequest } = useApiServices();
    const [rank, setRank] = useState([])

    const { register, handleSubmit, formState: { errors }, trigger, setValue } = useForm({
        resolver: zodResolver(formSchema),
    });

    const onSubmit = async (data) => {
        const Newdata = {
            username: data.name,
            phone: data.phone,
            role: 'admin',
        };

        try {
            const response = await makeAuthorizedRequest(
                API_CONFIG.USER.CHANGE_PROFILE,
                "PATCH",
                Newdata,
                null,
                '/client/dang-nhap'
            );

            if (response?.success) {
                toast({
                    position: "top",
                    type: "success",
                    title: "Cập nhật thành công!",
                    description: 'Tài khoản của bạn đã được cập nhật',
                    closable: true,
                });
                const accessToken = Cookies.get("accessToken");
                const response = await axios.get(API_CONFIG.USER.PROFILE, {
                    headers: { Authorization: `Bearer ${accessToken}` }
                });
                const user = (response.data.data)[0];
                localStorage.setItem(
                    "user",
                    JSON.stringify({ id: user.id, name: user.username, email: user.email, memberships: user.memberships, phone: user.phone, role: user.role })
                );
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
        }
    };

    useEffect(() => {
        const getData = async () => {
            try {
                const getUser = JSON.parse(localStorage.getItem("user"));

                // Check if user data exists
                if (!getUser) {
                    router.push('/');
                    return;
                }

                // Handle phone value when it's 'null'
                const phone = getUser.phone === 'null' ? '' : getUser.phone;

                // Set user data and form values
                setUser(getUser);
                setValue("name", getUser.name);
                setValue("email", getUser.email);
                setValue("phone", phone);

                // Fetch bookings associated with the user
                const fetchedAllBookings = await fetchAllBookingByUserId(getUser.id);
                const fetchedAllBookingsSuccess = fetchedAllBookings.filter((i) => i.status === 'success');

                // Calculate total amount from successful bookings
                const total_amountUser = fetchedAllBookingsSuccess.reduce((total, item) => {
                    return total + item.booking_details[0].total_amount;
                }, 0);

                // Rank user based on total amount
                rankuser(total_amountUser);

            } catch (error) {
                console.error('Chưa lấy được dữ liệu người dùng', error);
            }
        };

        getData();
    }, []);

    const rankuser = (total_amount) => {
        if (total_amount !== undefined && total_amount !== null) {
            // Tìm hạng thành viên dựa trên total_amount
            const foundRank = rankMemberships
                .slice()
                .sort((a, b) => b.condition - a.condition)
                .find(member => total_amount >= member.condition);

            // Nếu tìm thấy hạng, cập nhật trạng thái rank
            if (foundRank) {
                setRank(foundRank);
            } else {
                setRank(rankMemberships[0]);
            }
        } else {
            setRank(null);
        }
    };
    const Setcancel = () => {
        setValue("name", user.name);
        setValue("email", user.email);
        setValue("phone", user.phone);
    }

    return (
        <div className='flex flex-col gap-[30px]'>
            <div className='flex justify-between'>
                <span className='text-2xl font-bold leading-[22px] text-white'>Tài khoản</span>
                <div className='flex items-center gap-[30px]'>
                    <span className='text-base font-semibold'>Hạng thành viên:</span>
                    <div className='flex items-center gap-2'>
                        <div className="relative w-6 h-[14px]">
                            <Image
                                src={rank?.imageRank}
                                layout="fill"
                                alt="rank-img"
                                objectFit="cover"
                                quality={100}
                            />
                        </div>
                        <span className='text-xs text-white'>{rank?.title}</span>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
                <div className='flex flex-col gap-[30px] w-full'>
                    {/* Name field */}
                    <InputField
                        label="Tên đầy đủ"
                        type="text"
                        name="name"
                        register={register}
                        error={errors.name}
                        trigger={trigger}
                    />

                    {/* Email field */}
                    <InputField
                        label="Email"
                        type="email"
                        name="email"
                        register={register}
                        error={errors.email}
                        trigger={trigger}
                        readOnly={true}
                    />

                    {/* Phone field */}
                    <InputField
                        label="Số điện thoại"
                        type="text"
                        name="phone"
                        register={register}
                        error={errors.phone}
                        trigger={trigger}
                    />

                    <div className='flex gap-[20px] justify-end w-full'>
                        <button
                            type="button"
                            className='flex items-center gap-[10px] px-4 py-[10px] bg-white text-black rounded-full text-sm'
                            onClick={Setcancel}
                        >
                            <svg xmlns="<http://www.w3.org/2000/svg>" width="24" height="24" viewBox="0 0 24 24" fill="none">
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
