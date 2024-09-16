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
        }
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
        <div className="">
            <div
                ref={overflowContainer}
                className="overflow-x-auto mt-6 w-[90%]"
                onMouseDown={handleMouseDown}
                onMouseLeave={handleMouseLeaveOrUp}
                onMouseUp={handleMouseLeaveOrUp}
                onMouseMove={handleMouseMove}
            >
                <table className="text-sm text-left table min-w-full overflow-hidden">
                    <thead>
                        <tr>
                            {['Mã tiệc', 'Loại tiệc', 'Chủ tiệc', 'Ngày đặt', 'Tổng giá trị', 'Tiền cọc', 'Ngày đặt cọc', 'Còn lại phải thanh toán', 'Ngày tổ chức', 'Giờ tổ chức', 'Ngày thanh toán', 'Tình trạng thanh toán', 'Số lượng khách dự kiến', 'Số bàn', 'Chi nhánh', 'Sảnh', ''].map((header) => (
                                <th key={header}>
                                    {header}
                                </th>
                            ))}
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
                                <td className="w-fit">
                                    <Link href="#" className="text-cyan-500 hover:text-cyan-700 font-bold">
                                        Chi tiết
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="mt-4">
                <CustomPagination total={requests.length} />
            </div>
        </div>
    );
};

export default TableGrab;
