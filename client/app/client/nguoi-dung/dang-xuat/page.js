'use client';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';

import iconExitLogout from '@/public/iconExitLogout.svg'
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import Cookies from "js-cookie";
import { fetchAllBookingByUserId, fetchBookingById } from '@/app/_services/bookingServices';

const Page = () => {
    const [party, setParty] = useState([]);
    const router = useRouter();
    useEffect(() => {
        const getData = async () => {
            const getUser = JSON.parse(localStorage.getItem("user"));
            if (!getUser) {
                router.push('/');
                return;
            }
            try {
                const fetchedAllBookingsMembershipId = await fetchAllBookingByUserId(getUser?.id);
                const fetchedAllBookingsPending = fetchedAllBookingsMembershipId.filter((i) => i.status === 'pending' || i.status === 'processing');

                setParty(fetchedAllBookingsPending)

                const formatDate = (dateString) => {
                    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
                    return new Date(dateString).toLocaleDateString('en-GB', options).replace(/\//g, '/');
                };

            } catch (error) {
                console.error('Chưa lấy được dữ liệu người dùng', error);
            }
        };
        getData();
    }, []);


    const logout = async () => {
        try {
            localStorage.removeItem('user');
            Cookies.remove("accessToken");
            await signOut(); 
            window.location.href = "/";
        } catch (error) {
            console.error("Error during logout", error);
        }
    };

    function formatDateTime(dateTimeString) {
        const date = new Date(dateTimeString);

        // Extracting date components
        const day = String(date.getUTCDate()).padStart(2, '0');
        const month = String(date.getUTCMonth() + 1).padStart(2, '0');
        const year = date.getUTCFullYear();

        // Extracting time components
        const hours = String(date.getUTCHours()).padStart(2, '0');
        const minutes = String(date.getUTCMinutes()).padStart(2, '0');

        // Formatting the final string
        return `${day}/${month}/${year} ${hours}:${minutes}`;
    }

    return (
        <div className='w-full'>
            <div className='flex flex-col gap-[30px]'>
                <h1 className='text-2xl font-bold leading-6 text-white'>Đăng xuất</h1>
                {
                    party?.length > 0 ? <p className='mt-4 text-base text-red-400 leading-6'>
                        Lưu ý:
                        <br />
                        Quý khách vẫn đang còn {party?.length} tiệc chờ, Tiệc gần nhất {formatDateTime(party[0]?.organization_date)}, quý khách sẽ không nhận được thông báo từ trang web nếu đăng xuất.
                    </p> : ''
                }

                <p className='mt-2 text-base text-white leading-6'>
                    Chúng tôi vẫn sẽ thông báo thông qua email để đảm bảo quý khách không bỏ sót bất kỳ thông tin quan trọng nào. Hẹn gặp lại quý khách vào dịp gần nhất!
                </p>
                <button className='flex gap-1 items-center ml-auto flex-grow-0 w-fit mt-6 px-4 py-2 bg-red-500 text-white text-base leading-6 rounded-full hover:bg-red-600 transition duration-200'
                    onClick={logout}
                >
                    <Image src={iconExitLogout} alt='iconExitLogout'></Image>
                    Đăng xuất
                </button>
            </div>
        </div>
    );
};

export default Page;
