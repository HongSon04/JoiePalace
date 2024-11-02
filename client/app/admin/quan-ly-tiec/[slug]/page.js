// ChiTietTiecPage.js

'use client';

import { Suspense, useState, useEffect, useCallback } from 'react';
import HeaderSelect from './HeaderSelect';
import RequestBreadcrumbs from '@/app/_components/RequestBreadcrumbs';
import TableSkeleton from '@/app/_components/skeletons/TableSkeleton';
import TableGrab from '@/app/_components/TableGrab';
import { fetchAllPartyBookings } from '@/app/_services/bookingServices';
import { fetchBranchDataById } from '@/app/_services/branchesServices';
import useApiServices from '@/app/_hooks/useApiServices';
import { API_CONFIG } from '@/app/_utils/api.config';
import useCustomToast from '@/app/_hooks/useCustomToast';

const ChiTietTiecPage = ({ params }) => {
    const { slug } = params;
    const [bookings, setBookings] = useState([]);
    const [filteredBookings, setFilteredBookings] = useState([]);
    const [filterOption, setFilterOption] = useState(1); 
    const [filterStatus, setFilterStatus] = useState(1); 
    const { makeAuthorizedRequest } = useApiServices();
    const [branch, setBranch] = useState('');
    const toast = useCustomToast();

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user && user.branch_id) {
            fetchBranchData(user.branch_id);
        }
    }, []);

    const fetchBranchData = useCallback(async (id) => {
        try {
            const response = await fetchBranchDataById(id);
            setBranch(response.name); 
        } catch (err) {
            console.error("Error fetching branch: " + err);
        }
    }, []);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const response = await fetchAllPartyBookings();
                setBookings(response);
                setFilteredBookings(response); 
            } catch (error) {
                console.error("Error fetching bookings: " + error);
            }
        };

        fetchBookings();

    }, []);

    const options = [
        { id: 1, value: 1, name: "Theo tuần" },
        { id: 2, value: 2, name: "Theo tháng" },
        { id: 3, value: 3, name: "Theo năm" },
    ];

    const status = [
        { id: 1, value: 1, name: "Đã đặt cọc" },
        { id: 2, value: 2, name: "Đã thanh toán" },
        { id: 3, value: 3, name: "Chưa thanh toán" },
        { id: 4, value: 4, name: "Đã hoàn tiền" },
        { id: 5, value: 5, name: "Đã hủy" },
    ];

    const handleFilterChange = (e) => {
        const selectedValue = parseInt(e.target.value);
        setFilterOption(selectedValue);
        filterBookings(selectedValue);
    };

    const handleStatusChange = (e) => {
        const selectedValue = parseInt(e.target.value);
        setFilterStatus(selectedValue);

        toast({
            title: "Cập nhật trạng thái thành công",
            description: "Phản hồi đã được duyệt. Đang lấy dữ liệu mới",
        });
    };

    const filterBookings = (option) => {
        const now = new Date();
        let filteredData = bookings;

        if (option === 1) {
            const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
            filteredData = bookings.filter(item => new Date(item.created_at) >= startOfWeek);
        } else if (option === 2) {
            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            filteredData = bookings.filter(item => new Date(item.created_at) >= startOfMonth);
        } else if (option === 3) { 
            const startOfYear = new Date(now.getFullYear(), 0, 1);
            filteredData = bookings.filter(item => new Date(item.created_at) >= startOfYear);
        }

        setFilteredBookings(filteredData);
    };

    const updatePaymentStatus = async (itemId, newStatus) => {
        console.log(itemId, newStatus)
        try {
            const response = await makeAuthorizedRequest(API_CONFIG.BOOKINGS.UPDATE_STATUS(itemId), "PATCH", {
                status: newStatus
            });
            console.log(response)
            if (response.success) {
                const updatedBookings = await fetchAllPartyBookings();
                setBookings(updatedBookings);
                setFilteredBookings(updatedBookings);
            }
        } catch (err) {
            console.error("Error updating payment status:", err);
        }
    };

    return (
        <div>
            <HeaderSelect title={'Quản lý tiệc'} slugOrID={branch} />
            <RequestBreadcrumbs requestId={slug} nameLink={'quan-ly-tiec'} pathLink={slug} namepath={branch} />
            <div className='flex justify-between items-center w-full mt-8'>
                <h1 className='text-lg font-bold leading-8 flex-1 text-left text-white'>Danh sách tiệc</h1>
                <div className='flex gap-5'>
                    <select
                        value={filterOption}
                        onChange={handleFilterChange}
                        className="block border w-[200px] bg-whiteAlpha-200 border-gray-300 rounded-md p-2 font-medium text-white leading-6"
                    >
                        {options.map(option => (
                            <option className='text-black' key={option.id} value={option.value}>
                                {option.name}
                            </option>
                        ))}
                    </select>
                    <select
                        value={filterStatus}
                        onChange={handleStatusChange}
                        className="block border w-[200px] bg-whiteAlpha-200 border-gray-300 rounded-md p-2 font-medium text-white leading-6"
                    >
                        {status.map(status => (
                            <option className='text-black' key={status.id} value={status.value}>
                                {status.name}
                            </option>
                        ))}
                    </select>
                    <button className='p-2 bg-teal-400 text-white font-medium rounded'>Cập nhật</button>
                </div>
            </div>
            <div>
                <Suspense fallback={<TableSkeleton />}>
                    <TableGrab data={filteredBookings} pathLink={slug} onStatusChange={updatePaymentStatus} />
                </Suspense>
            </div>
        </div>
    );
};

export default ChiTietTiecPage;
