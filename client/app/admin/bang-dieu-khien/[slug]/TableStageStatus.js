"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import CustomPagination from '@/app/_components/CustomPagination';
import { API_CONFIG } from '@/app/_utils/api.config';
import useApiServices from '@/app/_hooks/useApiServices';
import { formatDateTime } from '@/app/_utils/formaters';
import { format, parseISO, setHours } from 'date-fns';

const formatDate = (dateInput) => {
  const date = new Date(dateInput);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

function getCurrentMonthAndWeekDates() {
  const currentDate = new Date();
  const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  const month = currentDate.getMonth() + 1;

  const dayOfWeek = currentDate.getDay();

  const startOfWeek = new Date(currentDate);
  startOfWeek.setDate(currentDate.getDate() - dayOfWeek + 1);

  const endOfWeek = new Date(currentDate);
  endOfWeek.setDate(currentDate.getDate() - dayOfWeek + 6);

  const formattedStartDate = formatDate(startDate);
  const formattedEndDate = formatDate(endDate);
  const formattedStartOfWeek = formatDate(startOfWeek);
  const formattedEndOfWeek = formatDate(endOfWeek);

  // Trả về currentDate cùng với các ngày tháng khác
  return {
    currentDate: formatDate(currentDate), // Thêm currentDate vào đây
    startDate: formattedStartDate,
    endDate: formattedEndDate,
    month: month,
    startOfWeek: formattedStartOfWeek,
    endOfWeek: formattedEndOfWeek,
  };
}

const TableStageStatus = () => {
  const { makeAuthorizedRequest } = useApiServices();

  // States để lưu trữ dữ liệu và trạng thái
  const [dataBookingByBranch, setDataBookingByBranch] = useState([]);
  const [start_Date, setStartDate] = useState(null);
  const [end_Date, setEndDate] = useState(null);
  const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
  const [itemsPerPage, setItemsPerPage] = useState(4); // Số lượng mỗi trang
  const [dataStage, setDataStage] = useState(null);
  const [slug, setSlug] = useState(null);
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

  // Hàm để lấy dữ liệu cần thiết khi component mount hoặc khi lọc thay đổi
  const fetchBookingData = async () => {
    try {
      const currentBranch = JSON.parse(localStorage.getItem('currentBranch'));
      const branchId = currentBranch.id;
      const slug = currentBranch.slug;
      const startOfWeek = getDefaultDateRange().start_Date;
      const endOfWeek = getDefaultDateRange().end_Date;
      // console.log(startOfWeek);
      console.log(branchId);
      
      const bookingByBranchData = await makeAuthorizedRequest(
        API_CONFIG.BOOKINGS.GET_ALL({
          branch_id: branchId,
          startDate : startOfWeek,
          endDate : endOfWeek,
          itemsPerPage: 100
        }),
        'GET',
        null
      );      
      console.log(bookingByBranchData);
      
      const stageByBranchData = await makeAuthorizedRequest(
        API_CONFIG.STAGES.GET_ALL({
          branch_id: branchId
        }),
        'GET',
        null
      );
      console.log(stageByBranchData);
      setSlug(slug);
      setDataStage(stageByBranchData);
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

  const { currentDate, startDate, endDate, month, startOfWeek, endOfWeek } = getCurrentMonthAndWeekDates();
  const stageData = dataStage?.data || [];
  const bookingData = dataBookingByBranch?.data || [];
  // console.log(stage);
  // console.log(bookingData);
  // Duyệt qua các sảnh và kiểm tra booking
  const result = stageData.map(stage => {
    // Tìm booking tương ứng với stage_id của sảnh
    const booking = bookingData.find(b => b.stage_id === stage.id);  // Đảm bảo tiệc chưa hết
      return {
        ...stage,
        bookings: booking
      };
  });
  // console.log(result);
  
  const formatDateWithFixedHours = (dateString) => {
    const date = parseISO(dateString);  // Chuyển đổi chuỗi ISO thành đối tượng Date
    return format(date, 'HH:mm');  // Định dạng lại ngày giờ, giữ nguyên giá trị giờ
  };
  const getCurrentShift = () => {
    const now = new Date();
    const hour = now.getHours();
    const minute = now.getMinutes();
  
    // Ca Sáng: 9h - 15h30
    const morningStart = 9;   // 9h
    const morningEnd = 15 + 30 / 60;  // 15h30 = 15.5
  
    // Ca Chiều: 17h - 21h30
    const afternoonStart = 17;  // 17h
    const afternoonEnd = 21 + 30 / 60; // 21h30 = 21.5
  
    // Tính thời gian hiện tại (đơn vị giờ)
    const currentTime = hour + minute / 60;
  
    // Kiểm tra và phân loại ca
    if (currentTime >= morningStart && currentTime <= morningEnd) {
      return 'Ca sáng';
    } else if (currentTime >= afternoonStart && currentTime <= afternoonEnd) {
      return 'Ca chiều';
    } else {
      // Nếu không trong ca Sáng hay Chiều, kiểm tra xem ca tiếp theo là gì
      if (currentTime < morningStart) {
        return 'Sắp đến ca Sáng';
      } else if (currentTime < afternoonStart) {
        return 'Sắp đến ca Chiều';
      } else {
        return 'Sắp đến ca Sáng';
      }
    }
  };
  
  // Sử dụng hàm và in ra kết quả
  const currentShift = getCurrentShift();
  return (
    <div className="w-full">
      <div className="flex items-center  justify-between mb-[10px]">
        <p className="text-base  font-semibold">Trạng thái các sảnh</p>
        <p className="text-base  font-semibold">{currentShift} - {currentDate}</p>
      </div>
      <div className='overflow-y-auto max-h-[380px]'>
        <table className="table w-full">
          <thead>
            <tr>
              <th>Tên</th>
              <th>Sức chứa</th>
              <th>Trạng thái</th>
              <th>Tiệc kế tiếp (7 ngày tới)</th>
              <th>Ca tổ chức</th>
              <th>Ngày đặt</th>
              <th>Giờ tổ chức</th>
              <th>Sl bàn (chính thức + dự phòng)</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {result.length > 0 ? (
              result.map((item, index) => (
                <tr key={index}>
                  <td>{item.name || "Trống"}</td>
                  <td>{item.capacity_max || "Trống"}</td>
                  <td>
                    <li className={`status ${
                      item.bookings && item.bookings.status 
                        ? (item.bookings.status === 'pending' ? 'chua-thanh-toan' : 
                            item.bookings.status === 'processing' ? 'da-huy' : '') 
                        : ''}`}
                    >
                      {item.bookings && item.bookings.status
                        ? (item.bookings.status === 'pending' ? 'Sắp tổ chức' :
                            item.bookings.status === 'processing' ? 'Đang tổ chức' : '')
                        : 'Trống'}
                    </li>
                  </td>
                  <td>{item.bookings?.organization_date ? formatDate(item.bookings.organization_date) : "--"}</td>
                  <td>{item.bookings?.organization_date ? item.bookings.shift : "--"}</td>
                  <td>{item.bookings?.created_at ? formatDate(item.bookings.created_at) : "--"}</td>
                  <td>{item.bookings?.organization_date ? formatDateWithFixedHours(item.bookings.organization_date) : "--"}</td>
                  <td>
                    {item.bookings?.booking_details && item.bookings.booking_details.length > 0
                      ? item.bookings.booking_details[0].table_count + "+" + item.bookings.booking_details[0].spare_table_count
                      : "--"}
                  </td>
                  <td>
                    <Link href={`/admin/quan-ly-tiec/${slug}/${item.bookings?.id}`} className="text-teal-400 text-xs font-bold">
                      Xem thêm
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr className="h-72">
                <td colSpan="11" className="text-center">Không có dữ liệu.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableStageStatus;
