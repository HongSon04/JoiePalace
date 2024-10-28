"use client";
// export const metadata = {
//   title: "Bảng điều khiển",
// };
import Image from 'next/image';
import React, { useEffect, useState } from "react";
import { PiArrowSquareOutLight } from "react-icons/pi";
import { FiArrowUpRight, FiArrowDownRight } from "react-icons/fi";
import { BsThreeDots } from "react-icons/bs";
import { FaPlus } from "react-icons/fa6";
import "../../_styles/globals.css";
import Chart from "@/app/_components/Chart";
import AdminHeader from "@/app/_components/AdminHeader";
import {fetchInfoByMonth,fetchAllDashBoard,fetchUserById, fetchAllTotalRevenueMonth,fetchAllEachTime,fetchAllBooking } from "@/app/_services/apiServices";

const Page = () => {
  const [userId, setUserId] = useState(null);
  const [dataAdmin, setDataAdmin] = useState(null);
  const [totalRevenueData, setTotalRevenueData] = useState(null);
  const [dataAllEachTime, setDataAllEachTime] = useState(null);
  const [allBooking, setAllBooking] = useState([]);
  const [dataInfo, setDataInfo] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    const fetchAminData = async () => {
      try {
        const adminData = await fetchAllDashBoard();
        const revenueData = await fetchAllTotalRevenueMonth(); 
        const dataAllEachTime = await fetchAllEachTime();
        const allBooking = await fetchAllBooking();
        const dataInfo = await fetchInfoByMonth();
        // console.log(dataInfo);
        
        setDataInfo(dataInfo)
        setAllBooking(allBooking); 
        setDataAllEachTime(dataAllEachTime); 
        setDataAdmin(adminData);
        setTotalRevenueData(revenueData); 
      } catch (error) {
        console.error("Lỗi:", error);
      }
    };

    fetchAminData();
  }, []); 

    const total_revune_each_month = dataAllEachTime?.total_revune_each_month || []; 
    // console.log(total_revune_each_month);
    const total_revune_by_month = dataAllEachTime?.total_revune_by_month || []; 
    // console.log(total_revune_by_month);
  
    const dataByMonth = {
      labels: Object.keys(total_revune_by_month), 
      datasets: [
          {
              label: 'Doanh thu',
              data: Object.values(total_revune_by_month) 
          }
      ]
    };
    const dataEachMonth = {
      labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
      datasets: total_revune_each_month.map(branch => ({
        label: branch.name,
        data: branch.data, 
        
      }))
      
    };
    const branchCharts = total_revune_each_month.map((branch, index) => (
      <div key={index} className="p-2 bg-blackAlpha-100 rounded-xl">
        <Chart data={{
          labels: dataEachMonth.labels,
          datasets: [{ label: branch.name, data: branch.data }]
        }} chartType="bar" />
        <p className="text-center text-xs">{branch.name}</p>
      </div>
    ));
   
    
    
    
  return (
    <main className="grid gap-6  text-white ">
      <AdminHeader
        title="Chung"
        showBackButton = {false}
        showHomeButton = {false}  
      >

      </AdminHeader>
      <div className="container px-2 flex gap-[10px]  text-white">
        {dataAllEachTime ? (
          <>
            <div className="box-item p-3 rounded-xl bg-whiteAlpha-100 inline-flex flex-col gap-8 w-[251px]">
              <div className="flex justify-between items-center">
                <p className="text-red-400 text-2xl font-bold">{dataInfo.totalBooking}</p>
                {/* <p className="text-base font-normal">Xem</p> */}
              </div>
              <div className="flex justify-between items-center">
                <p className="text-red-400 text-base font-normal">Yêu cầu xử lí</p>
                <PiArrowSquareOutLight className="text-2xl" />
              </div>
            </div>
            <div className="box-item p-3 rounded-xl bg-whiteAlpha-100 inline-flex flex-col gap-8 w-[251px]">
              <div className="flex justify-between items-center">
                <p className="text-2xl font-bold">{dataInfo.totalUser}</p>
                {/* <p className="text-teal-300 text-base font-normal">+100</p> */}
              </div>
              <div className="flex justify-between items-center">
                <p className="text-white text-base font-normal">Khách hàng</p>
                {/* <div className="flex justify-between items-center gap-1 text-teal-300">
                  <FiArrowUpRight className="text-2xl" />
                  <p className="text-base">2%</p>
                </div> */}
                <PiArrowSquareOutLight className="text-2xl" />
              </div>
            </div>
            <div className="box-item p-3 rounded-xl bg-whiteAlpha-100 inline-flex flex-col gap-8 w-[251px]">
              <div className="flex justify-between items-center">
                <p className="text-2xl font-bold">{dataInfo.totalBooking}</p>
                {/* <p className="text-red-400 text-base font-normal">-100</p> */}
              </div>
              <div className="flex justify-between items-center">
                <p className="text-base font-normal">Tiệc trong tháng</p>
                {/* <div className="flex justify-between items-center gap-1 text-red-400">
                  <FiArrowDownRight className="text-2xl" />
                  <p className="text-base">2%</p>
                </div> */}
                <PiArrowSquareOutLight className="text-2xl" />
              </div>
            </div>
            <div className="box-item p-3 rounded-xl bg-whiteAlpha-100 inline-flex flex-col gap-8 w-[251px]">
              <div className="flex justify-between items-center">
                <p className="text-2xl font-bold">{dataInfo.totalFutureBooking}</p>
                {/* <p className="text-base font-normal">Xem</p> */}
              </div>
              <div className="flex justify-between items-center">
                <p className="text-red-400 text-base font-normal">Tiệc dự kiến</p>
                <PiArrowSquareOutLight className="text-2xl" />
              </div>
            </div>
            <div className="box-item p-3 rounded-xl bg-whiteAlpha-100 inline-flex flex-col gap-8 w-[251px]">
              <div className="flex justify-between items-center">
                <p className="text-2xl font-bold">{dataInfo.totalPendingBooking}</p>
                {/* <p className="text-base font-normal">Xem</p> */}
              </div>
              <div className="flex justify-between items-center">
                <p className="text-base font-normal">Tiệc đang diễn ra</p>
                <PiArrowSquareOutLight className="text-2xl" />
              </div>
            </div>
          </>
        ) : (
          <p>Đang tải dữ liệu...</p>
        )}
      </div>



      <div className="container  flex gap-8 w-full h-full  p-4">
        <div className="p-4 w-1/3 h-auto  bg-whiteAlpha-100  rounded-xl" >
              <div className="flex justify-between gap-[10px] items-center mb-[10px]">
                <p className="text-base font-semibold ">Khách hàng</p>
                <p className="text-teal-400 font-bold text-xs">Xem thêm</p>
              </div>
              <div className="flex flex-col gap-3 max-h-[500px] overflow-y-auto hide-scrollbar">
              <div className="booking-list">
                {allBooking.length > 0 ? (
                  allBooking.map((item, index) => (
                    <div key={index} className="flex gap-5 items-center rounded-xl p-3 bg-whiteAlpha-50 bg-cover bg-center">
                      <img className="rounded-full w-[48px]" src="/image/user.jpg" alt="User profile" />
                      <div className="w-full flex justify-between items-center">
                        <div>
                          <p className="text-sm mb-[10px] font-semibold">
                            {item.users ? item.users.username : "N/A"}
                          </p>
                          <div className="flex gap-3 items-center text-xs">
                            <img src="/image/Group.svg" alt="Membership Icon" />
                            <p>{item.users ? item.users.memberships_id : "N/A"}</p>
                          </div>
                        </div>
                        <BsThreeDots className="text-xl" />
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="loading-message">
                    <p className="text-center">Đang tải dữ liệu.</p>
                  </div>
                )}
              </div>

               
                
              
          
              </div>
        </div>
        <div className=" p-4 rounded-xl w-full bg-whiteAlpha-100">
          <div className="flex justify-between items-center mb-[10px]">
            <p className="text-base  font-semibold">Doanh thu tổng / tháng</p>
            <p className="text-teal-400 font-semibold text-base">Xem thêm</p>
          </div>
          <div className="grid grid-cols-2 gap-4 max-h-[500px] overflow-y-auto hide-scrollbar">
            {branchCharts}
          </div>
        </div>
      </div>
      <div className="flex justify-between gap-6 p-4">
          <div className="w-1/2">
            <div className="flex items-center justify-between mb-[10px]">
              <p className="text-base  font-semibold">Yêu cầu mới nhất</p>
              <p className="text-teal-400 text-xs font-bold">Xem thêm</p>
            </div>
          <div className="overflow-y-auto max-h-[335px]">
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
              {allBooking.length > 0 ? (
                allBooking.map((item, index) => (
                  <tr key={index}>
                    <td>{item.users ? item.users.username : "N/A"}</td>
                    <td>{item.branches ? item.branches.name : "N/A"}</td> 
                    <td>{item.phone || "N/A"}</td> 
                    <td><p className="text-teal-400 text-xs font-bold">Xem thêm</p></td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="text-center">Đang tải dữ liệu.</td>
                </tr>
              )}


                
              </tbody>
            </table>
          </div>

        </div>
        <div className=" w-1/2" >
          <div className="flex items-center justify-between mb-[10px]">
            <p className="text-base  font-semibold">Doanh thu tổng / tháng</p>
            <p className="text-teal-400 text-xs font-bold">Xem thêm</p>
          </div>
          
          <div className="p-4 bg-blackAlpha-100 rounded-xl ">
            <Chart data={dataByMonth} chartType="line" />
          </div>
       
         
         
        </div>
        
        
      </div>
      <div className="w-full p-4">
          <div className="flex items-center justify-between mb-[10px]">
            <p className="text-base  font-semibold">Doanh thu tổng / tháng</p>
            <p className="text-teal-400 text-xs font-bold">Xem thêm</p>
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
              <tr>
                <td>#1IF39FP</td>
                <td>Nguyễn Văn A</td>
                <td>Tiệc cưới</td>
                <td>Phạm Văn Đồng</td>
                <td>Hall A</td>
                <td>12/12/2024</td>
                <td>12/12/2024</td>
                <td>18:00</td>
                <td><li className="status da-dat-coc">Đã đặt cọc</li></td>
                <td>50 + 2</td>
                <td><p className="text-teal-400 text-xs font-bold">Xem thêm</p></td>
              </tr>
              <tr>
                <td>#1IF39FP</td>
                <td>Nguyễn Văn A</td>
                <td>Tiệc cưới</td>
                <td>Phạm Văn Đồng</td>
                <td>Hall A</td>
                <td>12/12/2024</td>
                <td>12/12/2024</td>
                <td>18:00</td>
                <td><li className="status da-thanh-toan">Đã thanh toán</li></td>
                <td>50 + 2</td>
                <td><p className="text-teal-400 text-xs font-bold">Xem thêm</p></td>
              </tr>
              <tr>
                <td>#1IF39FP</td>
                <td>Nguyễn Văn A</td>
                <td>Tiệc cưới</td>
                <td>Phạm Văn Đồng</td>
                <td>Hall A</td>
                <td>12/12/2024</td>
                <td>12/12/2024</td>
                <td>18:00</td>
                <td><li className="status chua-thanh-toan">Chưa thanh toán</li></td>
                <td>50 + 2</td>
                <td><p className="text-teal-400 text-xs font-bold">Xem thêm</p></td>
              </tr>
              <tr>
                <td>#1IF39FP</td>
                <td>Nguyễn Văn A</td>
                <td>Tiệc cưới</td>
                <td>Phạm Văn Đồng</td>
                <td>Hall A</td>
                <td>12/12/2024</td>
                <td>12/12/2024</td>
                <td>18:00</td>
                <td><li className="status da-hoan-tien">Đã hoàn tiền</li></td>
                <td>50 + 2</td>
                <td><p className="text-teal-400 text-xs font-bold">Xem thêm</p></td>
              </tr>
              <tr>
                <td>#1IF39FP</td>
                <td>Nguyễn Văn A</td>
                <td>Tiệc cưới</td>
                <td>Phạm Văn Đồng</td>
                <td>Hall A</td>
                <td>12/12/2024</td>
                <td>12/12/2024</td>
                <td>18:00</td>
                <td><li className="status da-huy">Đã hủy</li></td>
                <td>50 + 2</td>
                <td><p className="text-teal-400 text-xs font-bold">Xem thêm</p></td>
              </tr>
              
            </tbody>
          </table>
        </div>

        </div>
       
        
        
    </main>
  );
};

export default Page;