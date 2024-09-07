'use client';
import Link from 'next/link';
import React, { useRef, useState } from 'react';
import CustomPagination from './CustomPagination';

const TableGrab = () => {
    const requests = [
        {
            id: 1,
            eventCode: '#12DKAF',
            eventType: 'Tiệc cưới',
            host: 'Nguyễn Văn A',
            bookingDate: '22/12/2024',
            totalValue: '200.000.000 VND',
            deposit: '60.000.000 VND',
            depositDate: '24/12/2024',
            remaining: '140.000.000 VND',
            eventDate: '1/1/2025',
            eventTime: '18:00',
            paymentDate: '1/1/2025',
            paymentStatus: 'Đã đặt cọc',
            expectedGuests: '300',
            tables: '300 + 2',
            branch: 'Phạm Văn Đồng',
            hall: 'Hall A'
        },
    ];

    const overflowContainer = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

    const handleMouseDown = (e) => {
        setIsDragging(true);
        setStartX(e.pageX - overflowContainer.current.getBoundingClientRect().left);
        setScrollLeft(overflowContainer.current.scrollLeft);
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - overflowContainer.current.getBoundingClientRect().left;
        const walk = (x - startX) * 2;
        overflowContainer.current.scrollLeft = scrollLeft - walk;
    };

    const handleMouseLeaveOrUp = () => {
        setIsDragging(false);
    };

    return (
        <>
            <div className='w-full relative'>
                <div
                    ref={overflowContainer}
                    className="overflow-hidden max-w-full rounded-lg mt-6 absolute w-full" 
                    onMouseDown={handleMouseDown}
                    onMouseLeave={handleMouseLeaveOrUp}
                    onMouseUp={handleMouseLeaveOrUp}
                    onMouseMove={handleMouseMove}
                    style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
                >
                    <table className="table min-w-[2000px] text-left text-sm">
                        <thead>
                            <tr>
                                <th className='w-fit'>Mã tiệc</th>
                                <th className='w-fit'>Loại tiệc</th>
                                <th className='w-fit'>Chủ tiệc</th>
                                <th className='w-fit'>Ngày đặt</th>
                                <th className='w-fit'>Tổng giá trị</th>
                                <th className='w-fit'>Tiền cọc</th>
                                <th className='w-fit'>Ngày đặt cọc</th>
                                <th className='w-fit'>Còn lại phải thanh toán</th>
                                <th className='w-fit'>Ngày tổ chức</th>
                                <th className='w-fit'>Giờ tổ chức</th>
                                <th className='w-fit'>Ngày thanh toán</th>
                                <th className='w-fit'>Tình trạng thanh toán</th>
                                <th className='w-fit'>Số lượng khách dự kiến</th>
                                <th className='w-fit'>Số bàn (chính thức + dự phòng)</th>
                                <th className='w-fit'>Chi nhánh</th>
                                <th className='w-fit'>Sảnh</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {requests.map((item) => (
                                <tr key={item.id}>
                                    <td>{item.eventCode}</td>
                                    <td>{item.eventType}</td>
                                    <td>{item.host}</td>
                                    <td>{item.bookingDate}</td>
                                    <td>{item.totalValue}</td>
                                    <td>{item.deposit}</td>
                                    <td>{item.depositDate}</td>
                                    <td>{item.remaining}</td>
                                    <td>{item.eventDate}</td>
                                    <td>{item.eventTime}</td>
                                    <td>{item.paymentDate}</td>
                                    <td>{item.paymentStatus}</td>
                                    <td>{item.expectedGuests}</td>
                                    <td>{item.tables}</td>
                                    <td>{item.branch}</td>
                                    <td>{item.hall}</td>
                                    <td className='w-fit'>
                                        <Link href='' className="text-cyan-400 hover:text-cyan-400 font-bold">Chi tiết</Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {/* <div className='mt-4'>
                    <CustomPagination total={requests.length} />
                </div> */}
            </div>
        </>
    );
};

export default TableGrab;
