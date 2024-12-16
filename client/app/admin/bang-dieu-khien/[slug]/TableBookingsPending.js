"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import CustomPagination from '@/app/_components/CustomPagination';
import { API_CONFIG } from '@/app/_utils/api.config';
import useApiServices from '@/app/_hooks/useApiServices';

const formatDate = (dateInput) => {
  const date = new Date(dateInput);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

const TableBookingsPending = () => {
  const { makeAuthorizedRequest } = useApiServices();

  // States để lưu trữ dữ liệu và trạng thái
  const [dataBookingByBranch, setDataBookingByBranch] = useState([]);
  const [start_Date, setStartDate] = useState(null);
  const [end_Date, setEndDate] = useState(null);
  const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
  const [itemsPerPage, setItemsPerPage] = useState(4); // Số lượng mỗi trang
  const [slug , setSlug] = useState(null);
  // Hàm để lấy ngày mặc định (7 ngày tới)
  const getDefaultDateRange = () => {
    const today = new Date();
    const startDate = today;
    const endDate = new Date(today);
    endDate.setDate(today.getDate() + 7);

    return {
      start_Date: formatDate(startDate),
      end_Date: formatDate(endDate),
    };
  };

  // Hàm để thay đổi bộ lọc ngày (dùng trong <select>)
  const handleDateFilterChange = (value) => {
    const today = new Date();
    let newStartDate = null;
    let newEndDate = null;

    switch (value) {
      case '7 ngày tới':
        newStartDate = today;
        newEndDate = new Date(today);
        newEndDate.setDate(today.getDate() + 7);
        break;
      case '14 ngày tới':
        newStartDate = today;
        newEndDate = new Date(today);
        newEndDate.setDate(today.getDate() + 14);
        break;
      case '1 tháng tới':
        newStartDate = today;
        newEndDate = new Date(today);
        newEndDate.setMonth(today.getMonth() + 1);
        break;
      case '3 tháng tới':
        newStartDate = today;
        newEndDate = new Date(today);
        newEndDate.setMonth(today.getMonth() + 3);
        break;
      case '6 tháng tới':
        newStartDate = today;
        newEndDate = new Date(today);
        newEndDate.setMonth(today.getMonth() + 6);
        break;
      default:
        break;
    }

    setStartDate(newStartDate ? formatDate(newStartDate) : null);
    setEndDate(newEndDate ? formatDate(newEndDate) : null);
  };

  // Hàm để lấy dữ liệu cần thiết khi component mount hoặc khi lọc thay đổi
  const fetchBookingData = async () => {
    try {
      const currentBranch = JSON.parse(localStorage.getItem('currentBranch'));
      let branchId = currentBranch.id;
      const slug = currentBranch.slug;
      if (currentBranch.slug === "ho-chi-minh") {
        branchId = 0;
      }
      // Sử dụng ngày đã chọn (start_Date và end_Date) khi gọi API
      const startDate = start_Date || getDefaultDateRange().start_Date;
      const endDate = end_Date || getDefaultDateRange().end_Date;
      
      // console.log(startDate);
      // console.log(endDate);
      // Gọi API để lấy booking theo chi nhánh (sử dụng start_Date và end_Date đã chọn)
      const bookingByBranchData = await makeAuthorizedRequest(
        API_CONFIG.BOOKINGS.GET_ALL({
          branch_id: branchId,
          status: "processing",
          startDate: startDate,
          endDate: endDate,
          itemsPerPage: 5
        }),
        "GET",
        null
      );
      // console.log(bookingByBranchData);
      setSlug(slug);
      setDataBookingByBranch(bookingByBranchData);
    } catch (error) {
      console.error('Error fetching data', error);
    }
  };

  // Gọi API khi component được mount hoặc khi các filter thay đổi
  useEffect(() => {
    fetchBookingData();
  }, [start_Date, end_Date, currentPage, itemsPerPage]);

  // Hàm xử lý phân trang
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  // console.log(dataBookingByBranch);   
  return (
    <div className="w-full">
      <div className="flex justify-between items-start mb-[10px]">
        <p className="text-base  font-semibold">Tiệc sắp diễn ra</p>
        <select className="w-[300px] select" onChange={(e) => handleDateFilterChange(e.target.value)}>
          <option className="option" value="7 ngày tới">7 ngày tới</option>
          <option className="option" value="14 ngày tới">14 ngày tới</option>
          <option className="option" value="1 tháng tới">1 tháng tới</option>
          <option className="option" value="3 tháng tới">3 tháng tới</option>
          <option className="option" value="6 tháng tới">6 tháng tới</option>
        </select>
      </div>
      <table className="table w-full">
        <thead>
          <tr>
            <th>Sảnh</th>
            <th>Chi nhánh</th>
            <th>Ngày tổ chức</th>
            <th>Ca tổ chức</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {dataBookingByBranch && Array.isArray(dataBookingByBranch.data) && dataBookingByBranch.data.length > 0 ? (
            dataBookingByBranch.data.map((item, index) => (
              <tr key={index}>
                <td className="text-center">{item.booking_details?.[0]?.stage_detail?.name || 'N/A'}</td>
                <td className="text-center">{item.branches ? item.branches.name : 'N/A'}</td>
                <td className="text-center">{item.expired_at ? formatDate(item.expired_at) : 'N/A'}</td>
                <td className="text-center">{item.shift || 'N/A'}</td>
                <td>
                  <Link href={`/admin/yeu-cau/${slug}/${item.id}`}>
                    <p className="text-teal-400 font-bold text-xs">Xem thêm</p>
                  </Link>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} className="text-center h-[204px]">Không có dữ liệu.</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Phân trang (ẩn nếu không có dữ liệu hoặc không có trang nào) */}
      {dataBookingByBranch && dataBookingByBranch.pagination && dataBookingByBranch.pagination.lastPage > 0 && dataBookingByBranch.data.length > 0 && (
        <div className="flex justify-center mt-4">
          <CustomPagination
            page={currentPage}
            total={dataBookingByBranch.pagination.lastPage}
            onChange={handlePageChange}
            classNames={{ base: 'flex justify-center' }}
          />
        </div>
      )}
    </div>
  );
};

export default TableBookingsPending;
