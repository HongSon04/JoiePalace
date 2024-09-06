// components/ChiTietTiecPage.js
'use client';

import AdminHeader from '@/app/_components/AdminHeader';
import { Heading, Stack } from '@chakra-ui/react';
import Link from 'next/link';
import { useRef } from 'react';

const ChiTietTiecPage = () => {
    const overflowContainer = useRef(null);
    let isDragging = false;
    let startX;
    let scrollLeft;

    const handleMouseDown = (e) => {
        isDragging = true;
        startX = e.pageX - overflowContainer.current.offsetLeft;
        scrollLeft = overflowContainer.current.scrollLeft;
    };

    const handleMouseLeave = () => {
        isDragging = false;
    };

    const handleMouseUp = () => {
        isDragging = false;
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - overflowContainer.current.offsetLeft;
        const walk = (x - startX) * 2;
        overflowContainer.current.scrollLeft = scrollLeft - walk;
    };

    return (
        <div className="p-4">
            <AdminHeader showBackButton={false} title={'Quản lý tiệc - Phạm Văn Thụ'} />
            <Stack alignItems="start" spacing="8" direction={'row'} className='mt-5'>
                <Heading as='h1' size='lg'>Quản lý tiệc / </Heading>
            </Stack>
            <div className="text-right mb-4">
                <button className="bg-blue-600 text-white px-4 py-[10px] rounded hover:bg-blue-700">Theo tuần</button>
            </div>
            <div
                ref={overflowContainer}
                className="overflow-hidden w-[960px] bg-gray-700 rounded-lg"
                onMouseDown={handleMouseDown}
                onMouseLeave={handleMouseLeave}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove}
                style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
            >
                <table className=" text-left text-sm text-gray-300 ">
                    <thead className="bg-gray-600 ">
                        <tr className='border'>
                            <th className="px-3 py-[10px] border">Mã tiệc</th>
                            <th className="px-3 py-[10px]">Chủ tiệc</th>
                            <th className="px-3 py-[10px]">Loại tiệc</th>
                            <th className="px-3 py-[10px]">Ngày đặt</th>
                            <th className="px-3 py-[10px]">Tổng giá trị</th>
                            <th className="px-3 py-[10px]">Tiền cọc</th>
                            <th className="px-3 py-[10px]">Ngày đặt cọc</th>
                            <th className="px-3 py-[10px]">Còn lại phải thanh toán</th>
                            <th className="px-3 py-[10px]">Ngày tổ chức</th>
                            <th className="px-3 py-[10px]">Giờ tổ chức</th>
                            <th className="px-3 py-[10px]">Ngày thanh toán</th>
                            <th className="px-3 py-[10px]">Tình trạng thanh toán</th>
                            <th className="px-3 py-[10px]">Số lượng khách dự kiến</th>
                            <th className="px-3 py-[10px]">Số bàn (chính thức + dự phòng)</th>
                            <th className="px-3 py-[10px]">Chi nhánh</th>
                            <th className="px-3 py-[10px]">Sảnh</th>
                            <th className="px-3 py-[10px]"></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="hover:bg-gray-600">
                            <td className="px-3 py-[10px]">#12DKAF</td>
                            <td className="px-3 py-[10px]">Nguyễn Văn A</td>
                            <td className="px-3 py-[10px]">Tiệc cưới</td>
                            <td className="px-3 py-[10px]">22/12/2024</td>
                            <td className="px-3 py-[10px]">200.000.000 VND</td>
                            <td className="px-3 py-[10px]">60.000.000 VND</td>
                            <td className="px-3 py-[10px]">24/12/2024</td>
                            <td className="px-3 py-[10px]">140.000.000 VND</td>
                            <td className="px-3 py-[10px]">1/1/2025</td>
                            <td className="px-3 py-[10px]">18:00</td>
                            <td className="px-3 py-[10px]">1/1/2025</td>
                            <td className="px-3 py-[10px]">Đã đặt cọc</td>
                            <td className="px-3 py-[10px]">300</td>
                            <td className="px-3 py-[10px]">300 + 2</td>
                            <td className="px-3 py-[10px]">Phạm Văn Đồng</td>
                            <td className="px-3 py-[10px]">Hall A</td>
                            <td className="px-3 py-[10px]"><Link href=''>Chi tiết</Link></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ChiTietTiecPage;