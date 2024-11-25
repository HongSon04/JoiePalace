"use client";
// export const metadata = {
//   title: "Bảng điều khiển",
// };
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { PiArrowSquareOutLight } from "react-icons/pi";

import { BsThreeDots } from "react-icons/bs";
import "../../../_styles/globals.css";
import Chart from "@/app/_components/Chart";
import AdminHeader from "@/app/_components/AdminHeader";
import {
  fetchInfoByMonth,
  fetchRevenueBranchByQuarter,
  fetchAllByBranch,
  fetchRevenueBranchByMonth,
  fetchRevenueBranchByWeek,
  fetchRevenueBranchByYear,
  fetchUserByBranchId,
  fetchAllDashBoard,
} from "@/app/_services/apiServices";
import Link from "next/link";
import { FiPhone } from "react-icons/fi";
import useApiServices from "@/app/_hooks/useApiServices";
import { API_CONFIG } from "@/app/_utils/api.config";
import { IoCalendarOutline } from "react-icons/io5";
import { RiMoneyDollarCircleLine } from "react-icons/ri";
import CustomCalendar from "@/app/_components/Calendar";
import { formatPrice } from "@/app/_utils/formaters";
import { FaRegCalendarCheck } from "react-icons/fa6";
import CustomPagination from "@/app/_components/CustomPagination";
import { formatDate } from "@/app/_utils/format"; 
const Page = ({ params }) => {
  const { slug } = params;
  const [allInfo, setallInfo] = useState(null);
  const [allBooking, setAllBooking] = useState(null);
  const [totalBookingWeek, settotalBookingWeek] = useState([]);
  const [totalBookingWeekBranch, settotalBookingWeekBranch] = useState([]);
  const [dataInfo, setDataInfo] = useState(null);
  const [dataSlug, setDataSlug] = useState(null);
  const [idBranch, setIdBranch] = useState(null);
  const [dataTotalAdminByWeek, setdataTotalAdminByWeek] = useState(null);
  const [dataTotalAdminByMonth, setDataTotalAllByMonth] = useState(null);
  const [dataTotalAdminByYear, setdataTotalAdminByYear] = useState(null);
  const [dataTotalAdminByQuarter, setdataTotalAdminByQuarter] = useState(null);
  const [dataTotalBranch, setdataTotalBranch] = useState(null);
  const { makeAuthorizedRequest } = useApiServices();
  const [dataBookingByBranch, setDataBookingByBranch] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); 
  const [itemsPerPage, setItemsPerPage] = useState(4); 
  const [start_Date, setStartDate] = useState(null);
  const [end_Date, setEndDate] = useState(null);
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
  
    return {
      startDate: formattedStartDate,
      endDate: formattedEndDate,
      month: month,
      startOfWeek: formattedStartOfWeek,
      endOfWeek: formattedEndOfWeek,
    };
  }
  
  
  // Hàm tính toán ngày bắt đầu và kết thúc cho 7 ngày tới
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
  const handleDateFilterChange = (value) => {
    const today = new Date();
    let newStartDate = null;
    let newEndDate = null;
  
    switch (value) {
      case "7 ngày tới":
        newStartDate = today;
        newEndDate = new Date(today);
        newEndDate.setDate(today.getDate() + 7);
        break;
      case "14 ngày tới":
        newStartDate = today;
        newEndDate = new Date(today);
        newEndDate.setDate(today.getDate() + 14);
        break;
      case "1 tháng tới":
        newStartDate = today;
        newEndDate = new Date(today);
        newEndDate.setMonth(today.getMonth() + 1);
        break;
      case "3 tháng tới":
        newStartDate = today;
        newEndDate = new Date(today);
        newEndDate.setMonth(today.getMonth() + 3);
        break;
      case "6 tháng tới":
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
  
  
  useEffect(() => {
    const fetchAminData = async () => {
      try {
        const currentBranch = JSON.parse(localStorage.getItem("currentBranch"));
        const branchId = currentBranch.id;
        let idBranch = currentBranch.id;
        if (currentBranch.slug === "ho-chi-minh") {
          idBranch = 0;
        }
        // console.log(idBranch);
        // console.log(branchId);
        
        const { startDate, endDate, currentDate, month,startOfWeek,endOfWeek } = getCurrentMonthAndWeekDates();
        const totalBookingWeek = await makeAuthorizedRequest(
          API_CONFIG.BOOKINGS.GET_ALL({
            startDate: startOfWeek,
            endDate: endOfWeek,
            status : "pending"
          }),
          "GET",
          null
        );
        console.log(start_Date);
        console.log(end_Date);
        const allBooking = await makeAuthorizedRequest(
          API_CONFIG.BOOKINGS.GET_ALL({
            branch_id: idBranch,
            status : "pending",
            itemsPerPage: 4,
            startDate: start_Date || getDefaultDateRange().start_Date, 
            endDate: end_Date || getDefaultDateRange().end_Date, 
          }),
          "GET",
          null
        );
        // console.log(dataBooking);
        
        const dataBookingByBranch = await makeAuthorizedRequest(
          API_CONFIG.BOOKINGS.GET_ALL({
            branch_id: branchId,
            startDate: startOfWeek,
            endDate: endOfWeek,
            status : "pending"
          }),
          "GET",
          null
        );
       
        // console.log(currentDate);
        // console.log(dataUser);
        
        
        const [
            allInfo,
            dataInfo,
            dataTotalAdminByMonth,
            dataTotalAdminByWeek,
            dataTotalAdminByYear,
            dataTotalAdminByQuarter,
            dataTotalBranch,
        ] = await Promise.all([
            fetchAllDashBoard(),
            fetchInfoByMonth(branchId),
            fetchRevenueBranchByMonth(0),
            fetchRevenueBranchByWeek(0),
            fetchRevenueBranchByYear(0),
            fetchRevenueBranchByQuarter(0),
            fetchAllByBranch(branchId),
            
        ]);
        // console.log(dataUser);
        setIdBranch(idBranch);
        setDataBookingByBranch(dataBookingByBranch);
        setallInfo(allInfo);
        setdataTotalAdminByWeek(dataTotalAdminByWeek);
        setDataTotalAllByMonth(dataTotalAdminByMonth);
        setdataTotalAdminByQuarter(dataTotalAdminByQuarter);
        setdataTotalAdminByYear(dataTotalAdminByYear);
        setdataTotalBranch(dataTotalBranch);
        setDataSlug(dataSlug);
        setDataInfo(dataInfo);
        settotalBookingWeek(totalBookingWeek);
        settotalBookingWeekBranch(totalBookingWeekBranch);
        setAllBooking(allBooking);
    } catch (error) {
        console.error("Error fetching data:", error);
    }
    
    };

    fetchAminData();
  },[start_Date, end_Date, currentPage]);
  
 
  const createChartData = (data, label) => {
    let chartData = {
      labels: [],
      datasets: [
        {
          label: label,
          data: [],
        },
      ],
    };
  
    if (data) {
      const totalRevune = data["Hồ Chí Minh"] || {}; 
      const branches = totalRevune.branches || {}; 
  
      chartData.labels = ["Hồ Chí Minh", ...Object.keys(branches)];
  
      chartData.datasets[0].data = [totalRevune.value, ...Object.values(branches)];
    }
  
    return chartData;
  };
  
  let dataByWeek = createChartData(dataTotalAdminByWeek, "Doanh thu theo tuần");
  let dataByMonth = createChartData(
    dataTotalAdminByMonth,
    "Doanh thu theo tháng"
  );
  let dataByYear = createChartData(dataTotalAdminByYear, "Doanh thu theo năm");
  // console.log(dataTotalAdminByYear);
  const dataBranchChart = dataTotalBranch || [];
  // Kiểm tra nếu các đối tượng không phải là null hoặc undefined, nếu không thì sử dụng mảng rỗng
  const quarterlyRevenues = Object.values(dataBranchChart.total_revune_by_quarter || {}).flat();
  const monthlyRevenues = Object.values(dataBranchChart.total_revune_by_month || []);
  const weeklyRevenues = Object.values(dataBranchChart.total_revune_by_week || []);
  const yearlyRevenues = Object.values(dataBranchChart.total_revune_by_year || []);
  // Tính tổng doanh thu của các quý, tháng, tuần
  const totalQuarterRevenue = quarterlyRevenues.reduce((acc, curr) => acc + curr, 0);
  const totalMonthRevenue = monthlyRevenues.reduce((acc, curr) => acc + curr, 0);
  const totalWeekRevenue = weeklyRevenues.reduce((acc, curr) => acc + curr, 0);

  // Tổng doanh thu
  // const yearlyRevenues = totalQuarterRevenue + totalMonthRevenue + totalWeekRevenue;

  // console.log(yearlyRevenues);  // In ra tổng doanh thu



  const dataBranch = {
    labels: ['Tuần', 'Tháng', 'Năm'],  
    datasets: [{
      label: 'Doanh thu',
      data: [
        ...weeklyRevenues,  
        ...monthlyRevenues, 
        ...yearlyRevenues  
      ]
    }]
  };

  const dataEachMonth = dataBranchChart.total_revune_each_month;
  const eachMonthChartData = dataEachMonth?.data || [];
  const dataEachMonthChart = {
    labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
    datasets: [{
      data: eachMonthChartData
    }]
  };
 
  const dataBooking = allBooking?.data || [];
  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN");
  }
  function formatDateTime(dateString) {
    const date = new Date(dateString);
    const formattedTime = date.toLocaleTimeString("vi-VN", { hour: '2-digit', minute: '2-digit' });
    return `${formattedTime}`;
  }
  const { month  } = getCurrentMonthAndWeekDates();
  const bookingsOffWeek = totalBookingWeek?.pagination?.total || 0;
  const bookingsOffWeekBranch = totalBookingWeekBranch?.pagination?.total || 0;
  const totalInfoBranch = dataTotalBranch?.count_booking_status[0]?.data;
  // console.log(allBooking);
  useEffect(() => {
    if (allBooking && allBooking.pagination) {
      setCurrentPage(allBooking.pagination.currentPage);
      setItemsPerPage(allBooking.pagination.itemsPerPage);
    }
  }, [allBooking]);
  // Hàm xử lý thay đổi trang
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };
  // console.log(allBooking.data);
  return (
    <main className="grid gap-6  text-white ">
      <AdminHeader
        title="Chung"
        showBackButton={false}
        showHomeButton={false}
      ></AdminHeader>
      <div className="px-4 w-full flex gap-[16px] justify-between text-white">
        {slug === "ho-chi-minh" ? (
          allInfo ? (
            <>
              <div className="box-item p-3 rounded-xl bg-whiteAlpha-100 inline-flex flex-col gap-6 w-[251px] flex-1">
                <FiPhone className="text-4xl" />
                <div className="flex justify-between items-center">
                  <p className="text-white text-base font-normal">Yêu cầu cần được xử lý</p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-4xl font-bold">{allInfo.count_booking_status.pending}</p>
                </div>
              </div>

              <div className="box-item p-3 rounded-xl bg-whiteAlpha-100 inline-flex flex-col gap-6 w-[251px] flex-1">
                <IoCalendarOutline className="text-4xl" />
                <div className="flex justify-between items-center">
                  <p className="text-white text-base font-normal">Tiệc sắp diễn ra trong tuần</p>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-end gap-1">
                    <p className="text-4xl font-bold">{bookingsOffWeek}</p>
                    <p>tiệc</p>
                  </div>
                </div>
              </div>

              <div className="box-item p-3 rounded-xl bg-whiteAlpha-100 inline-flex flex-col gap-6 w-[251px] flex-1">
                <RiMoneyDollarCircleLine className="text-4xl" />
                <div className="flex justify-between items-center">
                  <p className="text-white text-base font-normal">Doanh thu tổng tháng {month}</p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-4xl font-bold">{formatPrice(allInfo.total_revune_by_month || 0)}</p>
                </div>
              </div>

              <div className="box-item p-3 rounded-xl bg-whiteAlpha-100 inline-flex flex-col gap-6 w-[251px] flex-1">
                <RiMoneyDollarCircleLine className="text-4xl" />
                <div className="flex justify-between items-center">
                  <p className="text-white text-base font-normal">Doanh thu tổng năm</p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-4xl font-bold">{formatPrice(allInfo.total_revune_by_year || 0)}</p>
                </div>
              </div>
            </>
          ) : (
            <p>Đang tải dữ liệu...</p>
          )
        ) : (
          
          dataTotalBranch ? (
            <>
              <div className="box-item p-3 rounded-xl bg-whiteAlpha-100 inline-flex flex-col gap-6 w-[251px] flex-1">
                <FiPhone className="text-4xl" />
                <div className="flex justify-between items-center">
                  <p className="text-white text-base font-normal">Yêu cầu cần được xử lý</p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-4xl font-bold">{totalInfoBranch.pending}</p>
                </div>
              </div>

              <div className="box-item p-3 rounded-xl bg-whiteAlpha-100 inline-flex flex-col gap-6 w-[251px] flex-1">
                <IoCalendarOutline className="text-4xl" />
                <div className="flex justify-between items-center">
                  <p className="text-white text-base font-normal">Tiệc sắp diễn ra trong tuần</p>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-end gap-1">
                    <p className="text-4xl font-bold">{bookingsOffWeekBranch}</p>
                    <p>tiệc</p>
                  </div>
                </div>
              </div>

              <div className="box-item p-3 rounded-xl bg-whiteAlpha-100 inline-flex flex-col gap-6 w-[251px] flex-1">
                <RiMoneyDollarCircleLine className="text-4xl" />
                <div className="flex justify-between items-center">
                  <p className="text-white text-base font-normal">Doanh thu tổng tháng {month}</p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-4xl font-bold">{formatPrice(Number(dataTotalBranch.total_revune_by_month) || 0)}</p>
                </div>
              </div>

              <div className="box-item p-3 rounded-xl bg-whiteAlpha-100 inline-flex flex-col gap-6 w-[251px] flex-1">
                <FaRegCalendarCheck className="text-4xl"/>
                <div className="flex justify-between items-center">
                  <p className="text-white text-base font-normal">Tiệc đã hoàn thành trong tháng</p>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-end gap-1">
                    <p className="text-4xl font-bold">{totalInfoBranch.success}</p>
                    <p>tiệc</p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <p>Đang tải dữ liệu...</p>
          )
        )}
      </div>

      <div className="w-full  flex gap-4   p-4">
        <div className="p-4   bg-whiteAlpha-100  rounded-xl">
          <div className="flex justify-between gap-[10px] items-center mb-[10px]">
            <p className="text-base font-semibold ">Lịch tổ chức tháng 11</p>
          </div>
          <div className="flex justify-center">
            <CustomCalendar />
          </div>
        </div>
        <div className=" p-4 rounded-xl w-full bg-whiteAlpha-100">
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
                <th>Ngày tổ chức</th>
                <th>Ca tổ chức</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {allBooking && Array.isArray(allBooking.data) && allBooking.data.length > 0 ? (
                allBooking.data.map((item, index) => (
                  <tr key={index}>
                    <td>{item.booking_details?.[0]?.stage_detail?.name || "N/A"}</td>
                    <td>{item.expired_at ? formatDate(item.expired_at) : "N/A"}</td>
                    <td>{item.shift || "N/A"}</td>
                    <td>
                      <Link href={`/admin/yeu-cau/${slug}/${item.id}`}>
                        <p className="text-teal-400 font-bold text-xs">Xem thêm</p>
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="text-center">Không có dữ liệu.</td>
                </tr>
              )}
            </tbody>


          </table>
          {allBooking && allBooking.pagination && allBooking.pagination.lastPage && (
            <div className="flex justify-center mt-4">
              <CustomPagination
                page={currentPage} 
                total={allBooking.pagination.lastPage} 
                onChange={handlePageChange} 
                classNames={{
                  base: "flex justify-center",
                }}
              />
            </div>
          )}
          
        </div>
      </div>
       <div className="w-full p-4">
        <div className="flex items-center justify-between mb-[10px]">
          <p className="text-base  font-semibold">Trạng thái các sảnh</p>
          <p className="text-base  font-semibold">Ca sáng - 20/12/2024</p>
        </div>
        <div className="overflow-y-auto max-h-72">
          <table className="table w-full table-auto rounded-lg">
            <thead>
              <tr>
                <th>ID</th>
                <th>Tên chủ tiệc</th>
                <th>Kiểu tiệc</th>
                <th>Chi nhánh</th>
                <th>Sảnh</th>
                <th>Ngày đặt</th>
                <th>Ngày tổ chức</th>
                <th>Giờ tổ chức</th>
                <th>Trạng thái</th>
                <th>Sl bàn(chính thức + dự phòng)</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {dataBookingByBranch.length > 0 ? (
                dataBookingByBranch.map((item, index) => (
                  <tr key={index}>
                    <td>{item.id || "N/A"}</td>
                    <td>{item.users ? item.users.username : "N/A"}</td>
                    <td>{item.name || "N/A"}</td>
                    <td>{item.branches ? item.branches.name : "N/A"}</td>
                    <td>{item.stages ? item.stages.name : "N/A"}</td>
                    <td>{item.created_at ? formatDate(item.created_at) : "N/A"}</td>
                    <td>{item.expired_at ? formatDate(item.expired_at) : "N/A"}</td>
                    <td>{item.expired_at ? formatDateTime(item.expired_at) : "N/A"}</td>
                    <td>
                      <li className={`status ${
                            item.is_deposit 
                                ? item.status === 'pending' ? 'chua-thanh-toan' :
                                  item.status === 'processing' ? 'da-hoan-tien' :
                                  item.status === 'success' ? 'da-thanh-toan ' :
                                  item.status === 'cancel' ? 'da-huy' :
                                  ''
                                : 'da-dat-coc' 
                        }`}>
                            {item.is_deposit 
                                ? item.status === 'pending' ? 'Đang chờ' :
                                  item.status === 'processing' ? 'Đang xử lý' :
                                  item.status === 'success' ? 'Thành công' :
                                  item.status === 'cancel' ? 'Đã hủy' :
                                  ''
                                : 'Chưa đặt cọc'
                            }
                      </li>
                    </td>

                    <td>
                      {item.booking_details && item.booking_details.length > 0 ? 
                        `${item.booking_details[0].table_count != null ? item.booking_details[0].table_count : 'N/A'} + ${item.booking_details[0].spare_table_count != null ? item.booking_details[0].spare_table_count : 'N/A'}` 
                        : 'N/A'}
                    </td>


                    <td>
                      <Link href={`/admin/quan-ly-tiec/${slug}/${item.id}`} className="text-teal-400 text-xs font-bold">
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
      <div className="flex  gap-6 p-4">
        <div className="w-1/2 ">
          <div className="flex items-center justify-between mb-[10px]">
            <p className="text-base  font-semibold">Yêu cầu mới nhất</p>
            <Link href={`/admin/yeu-cau/${slug}`}>
              <p className="text-teal-400 font-bold text-xs">Xem thêm</p>
            </Link>
          </div>
          <div className="overflow-y-auto h-[430px]">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>Tên</th>
                  <th>Chi Nhánh</th>
                  <th>Số điện thoại</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {dataBooking.length > 0 ? (
                  dataBooking.map((item, index) => (
                    <tr key={index}>
                      <td>{item.users ? item.users.username : "N/A"}</td>
                      <td>{item.branches ? item.branches.name : "N/A"}</td> 
                      <td>{item.phone || "N/A"}</td> 
                      <td>
                        <Link href={`/admin/yeu-cau/${slug}/${item.id}`}>
                          <p className="text-teal-400 font-bold text-xs">Xem thêm</p>
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="text-center  h-[357px]">Không có dữ liệu.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        {slug === "ho-chi-minh" &&
          <div className=" w-1/2">
            <div className="flex items-center justify-between mb-[10px]">
              <p className="text-base  font-semibold">Doanh thu tổng / năm</p>
              <select className="w-[300px] select">
                <option className="option" value="">7 ngay toi</option>
              </select>
            </div>

            <div className="p-4 bg-blackAlpha-100 rounded-xl ">
              <div className="grid grid-cols-1 gap-4 h-[387px] overflow-y-auto hide-scrollbar items-start">
                {slug === "ho-chi-minh" ? (
                  <>
                    <div className="p-2 bg-blackAlpha-100 rounded-xl">
                      <div className="flex items-center justify-between gap-[10px] mb-[10px]">
                        <p className=" text-base">Doanh thu theo tuần</p>
                      </div>
                      <Chart data={dataByWeek} chartType="line" />
                    </div>
                    <div className="p-2 bg-blackAlpha-100 rounded-xl">
                      <div className="flex items-center justify-between gap-[10px] mb-[10px]">
                        <p className=" text-base">Doanh thu theo tháng</p>
                      </div>
                      <Chart data={dataByMonth} chartType="line" />
                    </div>
                    <div className="p-2 bg-blackAlpha-100 rounded-xl">
                      <div className="flex items-center justify-between gap-[10px] mb-[10px]">
                        <p className=" text-base">Doanh thu theo năm</p>
                      </div>
                      <Chart data={dataByYear} chartType="line" />
                    </div>
                  </>
                ) : (
                  <Chart data={dataBranch} chartType="bar" />
                )}
              </div>
            </div>
          </div>
        }
      </div>
     
    </main>
  );
};

export default Page;
