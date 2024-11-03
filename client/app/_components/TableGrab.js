'use client';

import Link from 'next/link';
import React, { useRef, useState } from 'react';
import CustomPagination from './CustomPagination';

const TableGrab = ({ data, pathLink, onStatusChange }) => {
    const overflowContainer = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [isSelectAllChecked, setIsSelectAllChecked] = useState(false);
    const [selectedItems, setSelectedItems] = useState({});
    const itemsPerPage = 10;

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

    const formatDate = (isoString) => {
        if (!isoString) return '';
        const date = new Date(isoString);
        return `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${date.getFullYear()}`;
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleSelectAllChange = () => {
        setIsSelectAllChecked(!isSelectAllChecked);
        const newSelectedItems = {};
        if (!isSelectAllChecked) {
            data.forEach((item) => {
                newSelectedItems[item.id] = true;
            });
        }
        setSelectedItems(newSelectedItems);
    };

    const handleItemCheckboxChange = (itemId) => {
        setSelectedItems((prevSelectedItems) => ({
            ...prevSelectedItems,
            [itemId]: !prevSelectedItems[itemId],
        }));
    };

    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentData = data ? data.slice(startIndex, startIndex + itemsPerPage) : [];

    const handleStatusChange = (itemId, event) => {
        const newStatus = event.target.value;
        onStatusChange(itemId, newStatus); 
    };

    return (
        <div>
            <div
                ref={overflowContainer}
                className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 mt-6"
                onMouseDown={handleMouseDown}
                onMouseLeave={handleMouseLeaveOrUp}
                onMouseUp={handleMouseLeaveOrUp}
                onMouseMove={handleMouseMove}
            >
                <table className="min-w-full text-sm text-left table table-auto">
                    <thead>
                        <tr>
                            <th className='!px-8 !py-6 whitespace-nowrap'>
                                <div className='flex justify-center items-center h-full'>
                                    <input 
                                        type="checkbox" 
                                        className='w-4 h-4' 
                                        checked={isSelectAllChecked} 
                                        onChange={handleSelectAllChange}
                                    />
                                </div>
                            </th>
                            {['Mã tiệc', 'Chủ tiệc', 'Tên tiệc', 'Ngày đặt', 'Tổng giá trị', 'Tiền cọc', 'Ngày đặt cọc', 'Còn lại phải thanh toán', 'Ngày tổ chức', 'Giờ tổ chức', 'Ngày thanh toán', 'Tình trạng thanh toán', 'Số lượng khách dự kiến', 'Số lượng bàn (chính thức + dự phòng)', 'Chi nhánh',].map((header) => (
                                <th key={header} className="!px-8 !py-6  whitespace-nowrap">
                                    {header}
                                </th>
                            ))}
                            <th className="!px-8 !py-6 w-fit">Chi tiết</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentData.map((item) => (
                            <tr key={item.id} className="">
                                <td className="!px-8 !py-6 whitespace-nowrap">
                                    <input 
                                        type="checkbox" 
                                        className='w-4 h-4' 
                                        checked={selectedItems[item.id] || false} 
                                        onChange={() => handleItemCheckboxChange(item.id)}
                                    />
                                </td>
                                <td className="!px-8 !py-6 whitespace-nowrap">
                                    <Link href={`/admin/quan-ly-tiec/${pathLink}/${item.id}`}>#{item.id}</Link>
                                </td>
                                <td className="!px-8 !py-6 whitespace-nowrap">{item?.users?.username}</td>
                                <td className="!px-8 !py-6 whitespace-nowrap">{item.name}</td>
                                <td className="!px-8 !py-6 whitespace-nowrap">{formatDate(item.created_at)}</td>
                                <td className="!px-8 !py-6 whitespace-nowrap">
                                    {item.booking_details?.reduce((total, detail) => total + detail.total_amount, 0).toLocaleString('vi-VN')} VNĐ
                                </td>
                                <td className="!px-8 !py-6 whitespace-nowrap">
                                    {item.booking_details?.map((detail, index) => (
                                        <span key={index}>
                                            {detail.deposits?.amount ? `${detail.deposits.amount.toLocaleString('vi-VN')} VNĐ` : "Chưa có tiền cọc"}
                                        </span>
                                    ))}
                                </td>
                                <td className="!px-8 !py-6 whitespace-nowrap">
                                    {item.booking_details?.[0]?.deposits?.created_at ? formatDate(item.booking_details[0].deposits.created_at) : "Chưa có ngày đặt"}
                                </td>
                                <td className="!px-8 !py-6 whitespace-nowrap">
                                    {item.booking_details?.[0] ? (item.booking_details[0].total_amount - (item.booking_details[0].deposits?.amount || 0)).toLocaleString('vi-VN') : '0'} VNĐ
                                </td>
                                <td className="!px-8 !py-6 whitespace-nowrap">{formatDate(item.organization_date)}</td>
                                <td className="!px-8 !py-6 whitespace-nowrap">{item.shift}</td>
                                <td className="!px-8 !py-6 whitespace-nowrap">{item.paymentDate || "Chưa thanh toán"}</td>
                                <td className="!px-8 !py-6 whitespace-nowrap text-center">
                                    <select
                                        value={item.status || "Chưa thanh toán"}
                                       onChange={(e) => handleStatusChange(item.id, e)}
                                        className="bg-gray-100 border border-gray-300 rounded px-2 py-1"
                                    >
                                        <option value="pending">Đang chờ thanh toán</option>
                                        <option value="processing">Đang xử lý</option>
                                        <option value="success ">Đã thanh toán</option>
                                        <option value="cancel">Hủy</option>
                                    </select>
                                </td>
                                <td className="!px-8 !py-6 whitespace-nowrap text-center">{item.number_of_guests}</td>
                                <td className="!px-8 !py-6 whitespace-nowrap text-center">{item.booking_details.map((item, index) => (
                                    <span key={index}>{item.table_count} +{item.chair_count}</span>
                                ))}</td>
                                <td className="!px-8 !py-6 whitespace-nowrap text-center">{item.branches.name}</td>
                                <td className="!px-8 !py-6 whitespace-nowrap">
                                    <Link href={`${item.id}`} className="text-cyan-500 hover:text-cyan-700 font-bold">Chi tiết</Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="mt-4">
                <CustomPagination 
                    total={data ? data.length : 0} 
                    onPageChange={handlePageChange} 
                    itemsPerPage={itemsPerPage}
                />
            </div>
        </div>
    );
};

export default TableGrab;
    