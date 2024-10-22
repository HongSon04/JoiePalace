"use client";
// export const metadata = {
//     title: "Bảng điều khiển",
// };
  import React, { useEffect, useState } from "react";
  import { PiArrowSquareOutLight } from "react-icons/pi";
  import { FiArrowUpRight, FiArrowDownRight } from "react-icons/fi";
  import { BsThreeDots } from "react-icons/bs";
  import { FaPlus } from "react-icons/fa6";
  import "../../../_styles/globals.css";
  import Chart from "@/app/_components/Chart";
  import AdminHeader from "@/app/_components/AdminHeader";
  import { fetchBranchDataById } from "@/app/_services/branchesServices";
  const Page = ({ params }) => {
    const [userId, setUserId] = useState(null);
    const [dataBranch, setData] = useState(null);
    const [error, setError] = useState(null); 
    useEffect(() => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          const userObject = JSON.parse(storedUser);
          setUserId(userObject.id); 
          const branchId = userObject.id;
          // console.log("Branch ID:", branchId); 
          const fetchBranchData = async () => {
            try {
              const fetchedData = await fetchBranchDataById(branchId); 
              setData(fetchedData);
              console.log(fetchedData); // In ra dữ liệu fetchedData để kiểm tra
            } catch (error) {
              console.error("Error fetching branch data:", error);
              setError(error); 
            }
          };
  
          fetchBranchData(); // Gọi hàm fetchBranchData
        } catch (error) {
          console.error("Error parsing user data:", error);
        }
      }
    }, []);  // Thêm [] để useEffect chỉ chạy một lần khi component mount
    const data = {
      labels: ['Phạm Văn Đồng', 'Hoàng Văn Thụ', 'Võ Văn Kiệt'],
      datasets: [
        {
          label: 'Doanh thu',
          data: [300000000, 500000000, 700000000]

        },
      ],
    };
    const data1 = {
        labels: [
          ' 1', ' 2', ' 3', ' 4', ' 5', ' 6',
          ' 7', ' 8', ' 9', ' 10', ' 11', ' 12'
        ],
        datasets: [
          {
            label: 'Doanh thu', // Nhãn cho dataset
            data: [
              50000000, // Doanh thu Tháng 1
              60000000, // Doanh thu Tháng 2
              55000000, // Doanh thu Tháng 3
              70000000, // Doanh thu Tháng 4
              80000000, // Doanh thu Tháng 5
              65000000, // Doanh thu Tháng 6
              75000000, // Doanh thu Tháng 7
              85000000, // Doanh thu Tháng 8
              90000000, // Doanh thu Tháng 9
              95000000, // Doanh thu Tháng 10
              100000000, // Doanh thu Tháng 11
              105000000 // Doanh thu Tháng 12
            ],
          
          }
        ]
    };
    return (
      <main className="grid gap-6  text-white ">
        <AdminHeader
          title="Chung"
          showBackButton = {false}
          showHomeButton = {false}  
        >
  
        </AdminHeader>
        <div className="container px-2 flex gap-[10px] w-full overflow-x-auto max-w-[1200px] text-white">
          <div className="box-item p-3 rounded-xl bg-whiteAlpha-100 inline-flex flex-col  gap-8  w-[251px]">
              <div className="flex justify-between items-center">
                  <p className="text-red-400 text-2xl font-bold">111</p>
                  <p className="text-base font-normal  ">Xem</p>
              </div>
              <div className="flex justify-between items-center">
                  <p className="text-red-400 text-base font-normal">Yêu cầu xử lí</p>
                  <PiArrowSquareOutLight className="text-2xl " />
              </div>
          </div>  
          <div className="box-item p-3 rounded-xl bg-whiteAlpha-100  inline-flex  flex-col gap-8  w-[251px]">
              <div className="flex justify-between items-center">
                  <p className=" text-2xl font-bold">1111</p>
                  <p className="text-teal-300 text-base font-normal">+100</p>
              </div>
              <div className="flex justify-between items-center">
                  <p className="text-red-white text-base font-normal ">Yêu cầu xử lí</p>
                  <div className="flex justify-between items-center gap-1 text-teal-300">
                      <FiArrowUpRight className="text-2xl" />
                      <p className="text-base">2%</p>
                  </div>
              </div>
          </div>
          <div className="box-item p-3 rounded-xl bg-whiteAlpha-100  inline-flex  flex-col gap-8  w-[251px]">
              <div className="flex justify-between items-center">
                  <p className=" text-2xl font-bold">1111</p>
                  <p className="text-red-400 text-base font-normal">-100</p>
              </div>
              <div className="flex justify-between items-center">
                  <p className=" text-base font-normal">Tiệc trong tháng</p>
                  <div className="flex justify-between items-center gap-1 text-red-400">
                      <FiArrowDownRight className="text-2xl" />
                      <p className="text-base">2%</p>
                  </div>
              </div>
          </div>
          {dataBranch ? (
            <div className="box-item p-3 rounded-xl bg-whiteAlpha-100  inline-flex  flex-col gap-8  w-[251px]">
              <div className="flex justify-between items-center">
                  <p className=" text-2xl font-bold">{dataBranch.data.pending}</p>
                  <p className="text-base font-normal ">Xem</p>
              </div>
              <div className="flex justify-between items-center">
                  <p className="text-red-400 text-base font-normal">Tiệc dự kiến</p>
                  <PiArrowSquareOutLight className="text-2xl " />
              </div>
            </div>
          ) : (
            <p>Đang tải dữ liệu...</p>
          )}

      
          {dataBranch ? (
            <div className="box-item p-3 rounded-xl bg-whiteAlpha-100 inline-flex flex-col gap-8 w-[251px]">
              <div className="flex justify-between items-center">
                <p className="text-2xl font-bold">{dataBranch.data?.processing}</p> {/* Sử dụng optional chaining */}
                <p className="text-base font-normal">Xem</p>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-base font-normal">Tiệc đang diễn ra</p>
                <PiArrowSquareOutLight className="text-2xl" />
              </div>
            </div>
          ) : (
            <p>Đang tải dữ liệu...</p>
          )}

        
          
        </div>
  
  
        <div className="container  flex gap-8 w-full h-full">
        <div className="p-4 w-1/3 h-auto  bg-whiteAlpha-100  rounded-xl" >
              <div className="flex justify-between gap-[10px] items-center mb-[10px]">
                <p className="text-base font-semibold ">Khách hàng</p>
                <p className="text-teal-400 font-bold text-xs">Xem thêm</p>
              </div>
              <div className="flex flex-col gap-3 max-h-[500px] overflow-y-auto hide-scrollbar">
                <div className="flex gap-5 items-center rounded-xl p-3 bg-whiteAlpha-50  bg-cover bg-center">
                  <img className="rounded-full w-[48px]" src="/image/user.jpg" />
                  <div className="w-full flex justify-between items-center">
                    <div>
                      <p className="text-sm mb-[10px] font-semibold">
                        Tên khách hàng
                      </p>
                      <div className="flex gap-3 items-center text-xs ">
                        <img  src="/image/Group.svg" />
                        <p>Đồng</p>
                      </div>
                    </div>
                    <BsThreeDots className="text-xl" />
                  </div>
                </div>
                <div className="flex gap-5 items-center rounded-xl p-3 bg-whiteAlpha-50  bg-cover bg-center">
                  <img className="rounded-full w-[48px]" src="/image/user.jpg" />
                  <div className="w-full flex justify-between items-center">
                    <div>
                      <p className="text-sm mb-[10px] font-semibold">
                        Tên khách hàng
                      </p>
                      <div className="flex gap-3 items-center text-xs ">
                        <img  src="/image/Group.svg" />
                        <p>Đồng</p>
                      </div>
                    </div>
                    <BsThreeDots className="text-xl" />
                  </div>
                </div>
                <div className="flex gap-5 items-center rounded-xl p-3 bg-whiteAlpha-50  bg-cover bg-center">
                  <img className="rounded-full w-[48px]" src="/image/user.jpg" />
                  <div className="w-full flex justify-between items-center">
                    <div>
                      <p className="text-sm mb-[10px] font-semibold">
                        Tên khách hàng
                      </p>
                      <div className="flex gap-3 items-center text-xs ">
                        <img  src="/image/Group.svg" />
                        <p>Đồng</p>
                      </div>
                    </div>
                    <BsThreeDots className="text-xl" />
                  </div>
                </div>
                <div className="flex gap-5 items-center rounded-xl p-3 bg-whiteAlpha-50  bg-cover bg-center">
                  <img className="rounded-full w-[48px]" src="/image/user.jpg" />
                  <div className="w-full flex justify-between items-center">
                    <div>
                      <p className="text-sm mb-[10px] font-semibold">
                        Tên khách hàng
                      </p>
                      <div className="flex gap-3 items-center text-xs ">
                        <img  src="/image/Group.svg" />
                        <p>Đồng</p>
                      </div>
                    </div>
                    <BsThreeDots className="text-xl" />
                  </div>
                </div>
                <div className="flex gap-5 items-center rounded-xl p-3 bg-whiteAlpha-50  bg-cover bg-center">
                  <img className="rounded-full w-[48px]" src="/image/user.jpg" />
                  <div className="w-full flex justify-between items-center">
                    <div>
                      <p className="text-sm mb-[10px] font-semibold">
                        Tên khách hàng
                      </p>
                      <div className="flex gap-3 items-center text-xs ">
                        <img  src="/image/Group.svg" />
                        <p>Đồng</p>
                      </div>
                    </div>
                    <BsThreeDots className="text-xl" />
                  </div>
                </div>
                <div className="flex gap-5 items-center rounded-xl p-3 bg-whiteAlpha-50  bg-cover bg-center">
                  <img className="rounded-full w-[48px]" src="/image/user.jpg" />
                  <div className="w-full flex justify-between items-center">
                    <div>
                      <p className="text-sm mb-[10px] font-semibold">
                        Tên khách hàng
                      </p>
                      <div className="flex gap-3 items-center text-xs ">
                        <img  src="/image/Group.svg" />
                        <p>Đồng</p>
                      </div>
                    </div>
                    <BsThreeDots className="text-xl" />
                  </div>
                </div>
              
           
              </div>
            </div>
          <div className=" p-4 rounded-xl w-full bg-whiteAlpha-100">
            <div className="flex justify-between items-center mb-[10px]">
              <p className="text-base  font-semibold">Doanh thu tổng / tháng</p>
              <p className="text-teal-400 font-semibold text-base">Xem thêm</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4  bg-blackAlpha-100  rounded-xl">
                  <Chart data={data1} chartType="bar"/>
                  <p className="text-center  text-xs">Võ Văn Kiệt</p>
              </div>
              <div className="p-4 bg-blackAlpha-100  rounded-xl">
                  <Chart data={data1} chartType="bar" />
                  <p className="text-center  text-xs">Phạm Văn Đồng</p>
              </div>  
              <div className="p-4 bg-blackAlpha-100  rounded-xl">
                  <Chart data={data1} chartType="bar" />
                  <p className="text-center  text-xs">Hoàng Văn Thụ</p>
              </div>
              <div className="p-4 rounded-xl bg-blackAlpha-100 relative flex justify-center items-center">
                <div className="h-16 w-16 rounded-sm  bg-whiteAlpha-200  flex justify-center items-center">
                  <FaPlus className=""/>
                </div>
            </div>
  
              
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
                <tr>
                  <td>Võ Văn Kiệt</td>
                  <td>Chi Nhánh 1</td>
                  <td>0987654321</td>
                  <td><p className="text-teal-400 text-xs font-bold">Xem thêm</p></td>
                </tr>
                <tr>
                  <td>Võ Văn Kiệt</td>
                  <td>Chi Nhánh 1</td>
                  <td>0987654321</td>
                  <td><p className="text-teal-400 text-xs font-bold">Xem thêm</p></td>
                </tr>
                <tr>
                  <td>Võ Văn Kiệt</td>
                  <td>Chi Nhánh 1</td>
                  <td>0987654321</td>
                  <td><p className="text-teal-400 text-xs font-bold">Xem thêm</p></td>
                </tr>
                <tr>
                  <td>Võ Văn Kiệt</td>
                  <td>Chi Nhánh 1</td>
                  <td>0987654321</td>
                  <td><p className="text-teal-400 text-xs font-bold">Xem thêm</p></td>
                </tr>
                <tr>
                  <td>Võ Văn Kiệt</td>
                  <td>Chi Nhánh 1</td>
                  <td>0987654321</td>
                  <td><p className="text-teal-400 text-xs font-bold">Xem thêm</p></td>
                </tr>
                <tr>
                  <td>Võ Văn Kiệt</td>
                  <td>Chi Nhánh 1</td>
                  <td>0987654321</td>
                  <td><p className="text-teal-400 text-xs font-bold">Xem thêm</p></td>
                </tr>
                <tr>
                  <td>Võ Văn Kiệt</td>
                  <td>Chi Nhánh 1</td>
                  <td>0987654321</td>
                  <td><p className="text-teal-400 text-xs font-bold">Xem thêm</p></td>
                </tr>
                <tr>
                  <td>Võ Văn Kiệt</td>
                  <td>Chi Nhánh 1</td>
                  <td>0987654321</td>
                  <td><p className="text-teal-400 text-xs font-bold">Xem thêm</p></td>
                </tr>
              </tbody>
            </table>
          </div>
  
          </div>
          <div className=" w-1/2">
            <div className="flex items-center justify-between mb-[10px]">
              <p className="text-base  font-semibold">Doanh thu tổng / tháng</p>
              <p className="text-teal-400 text-xs font-bold">Xem thêm</p>
            </div>
            <div className="p-4  bg-blackAlpha-100  rounded-xl">
              <Chart  data={data} chartType="line" />
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