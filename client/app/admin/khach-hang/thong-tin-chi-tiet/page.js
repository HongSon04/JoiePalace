import AdminHeader from '@/app/_components/AdminHeader';
import TableSkeleton from '@/app/_components/skeletons/TableSkeleton';
import TableGrab from '@/app/_components/TableGrab';
import React, { Suspense } from 'react';
import { PiMedalLight } from "react-icons/pi";
const page = () => {
    return (
        <main className='grid gap-6 p-4 text-white'>
            <AdminHeader
                title="Khách hàng"
                showSearchForm = {false}
            ></AdminHeader>
            <div className="flex justify-start items-center gap-2 text-base ">
                <p>Khách hàng</p>
                <p>/</p>
                <p>Thông tin chi tiết</p>
            </div>
            <div className='p-5 bg-whiteAlpha-100 rounded-lg grid gap-[22px]'>
                <div className='flex gap-3 items-center'>
                    <img className="rounded-full w-[90px]" src="/image/user.jpg" />
                    <div>
                        <p className='text-xs mb-3'>Hạng thành viên</p>
                        <div className="flex gap-3 items-center text-xs ">
                            <img  src="/image/Group.svg" />
                            <p>Đồng</p>
                        </div>
                    </div>
                </div>
                <div className='grid gap-[10px] w-full'>
                   <div className='flex gap-6 items-center'>
                        <div className='p-3 bg-whiteAlpha-50 rounded-lg w-1/3'>
                            <p>Tên</p>
                        </div>
                        <div className='p-3  bg-whiteAlpha-50 rounded-lg w-1/3'>
                            <p>Email</p>
                        </div>
                        <div className='p-3  bg-whiteAlpha-50 rounded-lg w-1/3'>
                            <p>Số điện thoại</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className='w-full'>
                <p className="text-sm font-bold">Tiệc đã hoàn thành</p>
                <Suspense fallback={<TableSkeleton/>}>
                    <TableGrab></TableGrab>
                </Suspense>
                
            </div>
            <div className='w-full'>
                <p className="text-sm font-bold">Tiệc dự kiến diễn ra</p>
                <Suspense fallback={<TableSkeleton/>}>
                    <TableGrab></TableGrab>
                </Suspense>
                
            </div>
                
        </main>
    );
};

export default page;