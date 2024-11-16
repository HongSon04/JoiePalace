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
} from "@/app/_services/apiServices";
import Link from "next/link";
import {
  fetchBranchBySlug
} from "@/app/_services/branchesServices";
import useApiServices from "@/app/_hooks/useApiServices";
import { API_CONFIG } from "@/app/_utils/api.config";
const Page = ({ params }) => {
  const { slug } = params;
  const [dataUser, setDataUser] = useState(null);
  const [allBooking, setAllBooking] = useState([]);
  const [dataInfo, setDataInfo] = useState(null);
  const [dataSlug, setDataSlug] = useState(null);
  const [branchId, setBranchId] = useState(null);
  const [idBranch, setIdBranch] = useState(null);
  const [dataTotalAdminByWeek, setdataTotalAdminByWeek] = useState(null);
  const [dataTotalAdminByMonth, setDataTotalAllByMonth] = useState(null);
  const [dataTotalAdminByYear, setdataTotalAdminByYear] = useState(null);
  const [dataTotalAdminByQuarter, setdataTotalAdminByQuarter] = useState(null);
  const [dataTotalBranch, setdataTotalBranch] = useState(null);
  const { makeAuthorizedRequest } = useApiServices();
  const [dataBookingByMonth, setDataBookingByMonth] = useState([]);
  function getCurrentMonthStartAndEnd() {
    const currentDate = new Date();
    const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    
    return {
        startDate: formatDate(startDate),
        endDate: formatDate(endDate)
        
    };
    
    
  }
  useEffect(() => {
    const fetchAminData = async () => {
      try {
        const currentBranch = JSON.parse(localStorage.getItem("currentBranch"));
        const branchId = currentBranch.id;
        // console.log(idBranch);
        // console.log(branchId);
        
        const { startDate, endDate } = getCurrentMonthStartAndEnd();
        const dataBooking = await makeAuthorizedRequest(
          API_CONFIG.BOOKINGS.GET_ALL({
            idBranch : branchId,
            is_confirm: false,
            is_deposit: false,
            start_date: startDate,
            end_date: endDate,
            status : "pending"
            
          }),
          "GET",
          null
        );
        const dataBookingByMonth = await makeAuthorizedRequest(
          API_CONFIG.BOOKINGS.GET_ALL({
            start_date: startDate,
            end_date: endDate,
            branch_id: branchId
          }),
          "GET",
          null
        );
        const dataUser = await makeAuthorizedRequest(
          API_CONFIG.USER.GET_ALL({
            start_date: startDate,
            end_date: endDate,
          }),
          "GET",
          null
        );
        // console.log(startDate);
        // console.log(endDate);
        
        
        const [
            dataInfo,
            dataTotalAdminByMonth,
            dataTotalAdminByWeek,
            dataTotalAdminByYear,
            dataTotalAdminByQuarter,
            dataTotalBranch,
        ] = await Promise.all([
            fetchInfoByMonth(branchId),
            fetchRevenueBranchByMonth(0),
            fetchRevenueBranchByWeek(0),
            fetchRevenueBranchByYear(0),
            fetchRevenueBranchByQuarter(0),
            fetchAllByBranch(2),
            
        ]);
        // console.log(dataUser);
        setIdBranch(idBranch);
        setDataBookingByMonth(dataBookingByMonth.data);
        setDataUser(dataUser);
        setdataTotalAdminByWeek(dataTotalAdminByWeek);
        setDataTotalAllByMonth(dataTotalAdminByMonth);
        setdataTotalAdminByQuarter(dataTotalAdminByQuarter);
        setdataTotalAdminByYear(dataTotalAdminByYear);
        setdataTotalBranch(dataTotalBranch);
        setDataSlug(dataSlug);
        setBranchId(branchId);
        setDataInfo(dataInfo);
        setAllBooking(dataBooking);
    } catch (error) {
        console.error("Error fetching data:", error);
    }
    
    };

    fetchAminData();
  }, []);
  // console.log(dataUser);
  
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

  // Tính tổng doanh thu của các quý, tháng, tuần
  const totalQuarterRevenue = quarterlyRevenues.reduce((acc, curr) => acc + curr, 0);
  const totalMonthRevenue = monthlyRevenues.reduce((acc, curr) => acc + curr, 0);
  const totalWeekRevenue = weeklyRevenues.reduce((acc, curr) => acc + curr, 0);

  // Tổng doanh thu
  const yearlyRevenues = totalQuarterRevenue + totalMonthRevenue + totalWeekRevenue;

  // console.log(yearlyRevenues);  // In ra tổng doanh thu



  const dataBranch = {
    labels: ['Tuần', 'Tháng', 'Năm'],  
    datasets: [{
      label: 'Doanh thu',
      data: [
        ...weeklyRevenues,  
        ...monthlyRevenues, 
        yearlyRevenues  
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
  // console.log(dataBookingByMonth);
  
  return (
    <main className="grid gap-6  text-white ">
      <AdminHeader
        title="Chung"
        showBackButton={false}
        showHomeButton={false}
      ></AdminHeader>
      <div className="container px-2 flex gap-[16px]  text-white">
        {dataInfo ? (
          <>
            <div className="box-item p-3 rounded-xl bg-whiteAlpha-100 inline-flex flex-col gap-8 w-[251px]">
              <div className="flex justify-between items-center">
                <p className="text-red-400 text-2xl font-bold">
                  {dataInfo.totalBooking}
                </p>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-red-400 text-base font-normal">
                  Yêu cầu xử lí
                </p>
                <Link href={`/admin/yeu-cau/${slug}`}>
                  <PiArrowSquareOutLight className="text-2xl" />
                </Link>
              </div>
            </div>
            <div className="box-item p-3 rounded-xl bg-whiteAlpha-100 inline-flex flex-col gap-8 w-[251px]">
              <div className="flex justify-between items-center">
                <p className="text-2xl font-bold">{dataInfo.totalUser}</p>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-white text-base font-normal">Khách hàng trong tháng</p>

              </div>
            </div>
            <div className="box-item p-3 rounded-xl bg-whiteAlpha-100 inline-flex flex-col gap-8 w-[251px]">
              <div className="flex justify-between items-center">
                <p className="text-2xl font-bold">{dataInfo.totalBooking}</p>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-base font-normal">Tiệc trong tháng</p>
               
                <Link href={`/admin/quan-ly-tiec/${slug}`}>
                  <PiArrowSquareOutLight className="text-2xl" />
                </Link>
              </div>
            </div>
            <div className="box-item p-3 rounded-xl bg-whiteAlpha-100 inline-flex flex-col gap-8 w-[251px]">
              <div className="flex justify-between items-center">
                <p className="text-2xl font-bold">
                  {dataInfo.totalFutureBooking}
                </p>
               
              </div>
              <div className="flex justify-between items-center">
                <p className="text-red-400 text-base font-normal">
                  Tiệc dự kiến
                </p>
                <Link href={`/admin/quan-ly-tiec/${slug}`}>
                  <PiArrowSquareOutLight className="text-2xl" />
                </Link>
              </div>
            </div>
            <div className="box-item p-3 rounded-xl bg-whiteAlpha-100 inline-flex flex-col gap-8 w-[251px]">
              <div className="flex justify-between items-center">
                <p className="text-2xl font-bold">
                  {dataInfo.totalPendingBooking}
                </p>
                
              </div>
              <div className="flex justify-between items-center">
                <p className="text-base font-normal">Tiệc đang diễn ra</p>
                <Link href={`/admin/quan-ly-tiec/${slug}`}>
                  <PiArrowSquareOutLight className="text-2xl" />
                </Link>
              </div>
            </div>
          </>
        ) : (
          <p>Đang tải dữ liệu...</p>
        )}
      </div>
      
      <div className="container  flex gap-4 w-full h-full  p-4">
        <div className="p-4 w-1/3 h-auto  bg-whiteAlpha-100  rounded-xl">
          <div className="flex justify-between gap-[10px] items-center mb-[10px]">
            <p className="text-base font-semibold ">Khách hàng trong tháng</p>
            
          </div>
          <div className="flex flex-col gap-3 h-[580px] px-[10px] overflow-y-auto hide-scrollbar">
            {dataUser && dataUser.data.length > 0 ? (
              dataUser.data.map((item) => (
                <Link key={item.id} href={``} className="flex gap-5 items-center w-full">
                  <div className="flex gap-5 items-center rounded-xl p-3 bg-whiteAlpha-50 bg-cover  w-full bg-center">
                    {item.avatar ? (
                      <Image
                        className="rounded-full w-[48px]"
                        src={item.avatar}
                        alt="User profile"
                        width={48}
                        height={48}
                      />
                    ) : (
                      <Image
                        className="rounded-full w-[48px]"
                        src="/image/user.jpg"
                        alt="Default User"
                        width={48}
                        height={48}
                      />
                    )}

                    <div className="w-full flex justify-between items-center">
                      <div>
                        <p className="text-sm mb-[10px] font-semibold">
                          {item.username || "N/A"}
                        </p>
                        <div className="flex gap-3 items-center text-xs">
                          {item.membership_id ? (
                            <>
                              <Image src="/image/Group.svg" alt="Membership Icon" />
                              <p>{item.memberships}</p>
                            </>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="loading-message">
                <p className="text-center">Đang tải dữ liệu.</p>
              </div>
            )}

          </div>
        </div>
        <div className=" p-4 rounded-xl w-full bg-whiteAlpha-100">
          <div className="flex justify-between items-center mb-[10px]">
            <p className="text-base  font-semibold">Doanh thu tổng / năm</p>
          </div>

          <div className="grid grid-cols-1 gap-4 h-[580px] overflow-y-auto hide-scrollbar items-start">
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
      <div className="flex justify-between gap-6 p-4">
        <div className="w-1/2 ">
          <div className="flex items-center justify-between mb-[10px]">
            <p className="text-base  font-semibold">Yêu cầu mới nhất</p>
            <Link href={`/admin/yeu-cau/${slug}`}>
              <p className="text-teal-400 font-bold text-xs">Xem thêm</p>
            </Link>
          </div>
          <div className="overflow-y-auto h-[377px]">
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
             
            </div>

            <div className="p-4 bg-blackAlpha-100 rounded-xl ">
              <Chart data={dataBranch} chartType="bar" />
            </div>
          </div>
        }
      </div>
      <div className="w-full p-4">
        <div className="flex items-center justify-between mb-[10px]">
          <p className="text-base  font-semibold">Danh sách tiệc mới nhất</p>
          {/* <Link href={`/admin/thong-ke/doanh-thu-tong/`}>
            <p className="text-teal-400 font-bold text-xs">Xem thêm</p>
          </Link> */}
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
              {dataBookingByMonth.length > 0 ? (
                dataBookingByMonth.map((item, index) => (
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
    </main>
  );
};

export default Page;
