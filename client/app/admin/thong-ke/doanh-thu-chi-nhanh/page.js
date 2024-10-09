"use client";

import React, { useState } from 'react';
import { IoFilter } from 'react-icons/io5';
import { DateRangePicker } from '@nextui-org/date-picker';
import { Input } from '@nextui-org/react';
import { RiMoneyDollarCircleLine } from 'react-icons/ri';
import { HiArrowDown, HiArrowUp } from 'react-icons/hi';
import CustomSelect from '@/app/_components/CustomSelect';
import AdminHeader from '@/app/_components/AdminHeader';
import Chart from '@/app/_components/Chart';
import { MdOutlineHome, MdOutlineNotificationsNone } from 'react-icons/md';
import "../../../_styles/globals.css";
import CustomPagination from '@/app/_components/CustomPagination';
const Page = () => {
  const [isFilterVisible, setIsFilterVisible] = useState(false);

  const data = {
    labels: ['Phạm Văn Đồng', 'Hoàng Văn Thụ', 'Võ Văn Kiệt'],
    datasets: [
      {
        label: 'Doanh thu',
        data: [300000000, 500000000, 700000000]

      },
    ],
  };

  const options = [
    { id: 1, name: 'Option 1', value: 'option1' },
    { id: 2, name: 'Option 2', value: 'option2' },
    { id: 3, name: 'Option 3', value: 'option3' },
  ];

  const toggleFilter = () => {
    setIsFilterVisible(prevState => !prevState);
  };

  return (
    <main className="font-gilroy grid gap-6 p-4">
          <AdminHeader
            title="Doanh thu chi nhánh"
            showSearchForm = {false}
          ></AdminHeader>
      <div className="flex justify-start items-center gap-2 text-base text-gray-500 ">
        <p>Thống kê</p>
        <p>/</p>
        <p>Doanh thu chi nhánh</p>
       
      </div>
      <div>
        <div className="flex items-center justify-between gap-[10px] mb-[10px]">
          <p className="text-base font-semibold">Doanh thu chi nhánh</p>
          <select className='select w-[300px]'>
              <option className='option' value="option1">Option 1</option>
              <option className='option' value="option2">Option 2</option>
              <option className='option' value="option3">Option 3</option>
          </select>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 bg-whiteAlpha-100 rounded-xl">
            <div className="flex items-center justify-between gap-[10px] mb-[10px]">
              <p className="text-base">Doanh thu theo tuần</p>
              <p className="text-teal-400 text-xs">Xem thêm</p>
            </div>
            <Chart data={data} chartType="line" />
          </div>
          <div className="p-4 bg-whiteAlpha-100 rounded-xl">
            <div className="flex items-center justify-between gap-[10px] mb-[10px]">
              <p className="text-base">Doanh thu theo tháng</p>
              <p className="text-teal-400 text-xs">Xem thêm</p>
            </div>
            <Chart data={data} chartType="line" />
          </div>
          <div className="p-4 bg-whiteAlpha-100 rounded-xl">
            <div className="flex items-center justify-between gap-[10px] mb-[10px]">
              <p className="text-base">Doanh thu theo quý</p>
              <p className="text-teal-400 text-xs">Xem thêm</p>
            </div>
            <Chart data={data} chartType="line" />
          </div>
          <div className="p-4 bg-whiteAlpha-100 rounded-xl">
            <div className="flex items-center justify-between gap-[10px] mb-[10px]">
              <p className="text-base">Doanh thu theo năm</p>
              <p className="text-teal-400 text-xs">Xem thêm</p>
            </div>
            <Chart data={data} chartType="line" />
          </div>
        </div>
      </div>
      <div className="relative">
        <div className="flex justify-between items-centern mb-4 ">
          <p className="text-sm font-bold">Danh sách tiệc chi nhánh Phạm Văn Đồng</p>
          <div
            onClick={toggleFilter}
            className="bg-whiteAlpha-100 rounded-full py-2.5 px-4 cursor-pointer"
          >
            <IoFilter className="text-xl" />
          </div>
        </div>
        {isFilterVisible && (
          <div className="absolute mt-2 w-[300px]  rounded-xl right-0 top-[40px]  0 z-10 bg-[#27272A]">
            <DateRangePicker className="max-w-xs w-full dark" />
            <div className="flex justify-center items-center gap-2 ">
              <Input
                type="number"
                placeholder="0"
                labelPlacement="outside"
                className=' dark'
                startContent={
                  <div className="pointer-events-none flex items-center ">
                    <RiMoneyDollarCircleLine className="text-default-400 w-[24px] h-[24px]" />
                  </div>
                }
                
              />
              <Input
                type="number"
                placeholder="0"
                labelPlacement="outside"
                className=' dark'
                startContent={
                  <div className="pointer-events-none flex items-center">
                    <RiMoneyDollarCircleLine className="text-default-400 w-[24px] h-[24px]" />
                  </div>
                }
                
              />
            </div>
            <div className="flex justify-start items-center gap-2 p-3 rounded-mediumcursor-pointer">  
              <HiArrowDown />
              <p>Giá giảm dần</p>
            </div>
            <div className="flex justify-start items-center gap-2 p-3 rounded-mediumcursor-pointer">
              <HiArrowUp />
              <p>Giá tăng dần</p>
            </div>
          </div>
        )}
       <div className='w-full'>
            <div className="overflow-x-auto  max-w-[1150px]">
                <table className="table table-chinhanh rounded-lg">
                    <thead>
                        <tr>
                            <th>Mã tiệc</th>
                            <th>Chủ tiệc</th>
                            <th>Loại tiệc</th>
                            <th>Ngày đặt</th>
                            <th>Tổng giá trị</th>
                            <th>Tiền cọc</th>
                            <th>Ngày đặt cọc</th>
                            <th>Còn lại phải thanh toán</th>
                            <th>Ngày tổ chức</th>
                            <th>Giờ tổ chức</th>
                            <th>Ngày thanh toán</th>
                            <th>Tình trạng thanh toán</th>
                            <th>Số lượng khách dự kiến</th>
                            <th>Số lượng bàn (chính thức + dự phòng)</th>
                            <th>Chi nhánh</th>
                            <th>Sảnh</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>#12DKAF</td>
                            <td>Nguyễn Văn A</td>
                            <td>Tiệc cưới</td>
                            <td>22/12/2024</td>
                            <td>200.000.000VND</td>
                            <td>60.000.000 VND</td>
                            <td>24/12/2024</td>
                            <td>140.000.000 VND</td>
                            <td>1/1/2025</td>
                            <td>18:00</td>
                            <td>1/1/2025</td>
                            <td><li className="status da-dat-coc">Đã đặt cọc</li></td>
                            <td>300</td>
                            <td>50 + 2</td>
                            <td>Phạm Văn Đồng</td>
                            <td>Hall A</td>
                            <td><p className="text-teal-400 text-xs font-bold">Chi tiết</p></td>
                        </tr>
                        <tr>
                            <td>#12DKAF</td>
                            <td>Nguyễn Văn A</td>
                            <td>Tiệc cưới</td>
                            <td>22/12/2024</td>
                            <td>200.000.000VND</td>
                            <td>60.000.000 VND</td>
                            <td>24/12/2024</td>
                            <td>140.000.000 VND</td>
                            <td>1/1/2025</td>
                            <td>18:00</td>
                            <td>1/1/2025</td>
                            <td><li className="status da-dat-coc">Đã đặt cọc</li></td>
                            <td>300</td>
                            <td>50 + 2</td>
                            <td>Phạm Văn Đồng</td>
                            <td>Hall A</td>
                            <td><p className="text-teal-400 text-xs font-bold">Chi tiết</p></td>
                        </tr>
                        <tr>
                            <td>#12DKAF</td>
                            <td>Nguyễn Văn A</td>
                            <td>Tiệc cưới</td>
                            <td>22/12/2024</td>
                            <td>200.000.000VND</td>
                            <td>60.000.000 VND</td>
                            <td>24/12/2024</td>
                            <td>140.000.000 VND</td>
                            <td>1/1/2025</td>
                            <td>18:00</td>
                            <td>1/1/2025</td>
                            <td><li className="status da-dat-coc">Đã đặt cọc</li></td>
                            <td>300</td>
                            <td>50 + 2</td>
                            <td>Phạm Văn Đồng</td>
                            <td>Hall A</td>
                            <td><p className="text-teal-400 text-xs font-bold">Chi tiết</p></td>
                        </tr>
                        <tr>
                            <td>#12DKAF</td>
                            <td>Nguyễn Văn A</td>
                            <td>Tiệc cưới</td>
                            <td>22/12/2024</td>
                            <td>200.000.000VND</td>
                            <td>60.000.000 VND</td>
                            <td>24/12/2024</td>
                            <td>140.000.000 VND</td>
                            <td>1/1/2025</td>
                            <td>18:00</td>
                            <td>1/1/2025</td>
                            <td><li className="status da-dat-coc">Đã đặt cọc</li></td>
                            <td>300</td>
                            <td>50 + 2</td>
                            <td>Phạm Văn Đồng</td>
                            <td>Hall A</td>
                            <td><p className="text-teal-400 text-xs font-bold">Chi tiết</p></td>
                        </tr>
                        <tr>
                            <td>#12DKAF</td>
                            <td>Nguyễn Văn A</td>
                            <td>Tiệc cưới</td>
                            <td>22/12/2024</td>
                            <td>200.000.000VND</td>
                            <td>60.000.000 VND</td>
                            <td>24/12/2024</td>
                            <td>140.000.000 VND</td>
                            <td>1/1/2025</td>
                            <td>18:00</td>
                            <td>1/1/2025</td>
                            <td><li className="status da-dat-coc">Đã đặt cọc</li></td>
                            <td>300</td>
                            <td>50 + 2</td>
                            <td>Phạm Văn Đồng</td>
                            <td>Hall A</td>
                            <td><p className="text-teal-400 text-xs font-bold">Chi tiết</p></td>
                        </tr>
                        <tr>
                            <td>#12DKAF</td>
                            <td>Nguyễn Văn A</td>
                            <td>Tiệc cưới</td>
                            <td>22/12/2024</td>
                            <td>200.000.000VND</td>
                            <td>60.000.000 VND</td>
                            <td>24/12/2024</td>
                            <td>140.000.000 VND</td>
                            <td>1/1/2025</td>
                            <td>18:00</td>
                            <td>1/1/2025</td>
                            <td><li className="status da-dat-coc">Đã đặt cọc</li></td>
                            <td>300</td>
                            <td>50 + 2</td>
                            <td>Phạm Văn Đồng</td>
                            <td>Hall A</td>
                            <td><p className="text-teal-400 text-xs font-bold">Chi tiết</p></td>
                        </tr>
                        <tr>
                            <td>#12DKAF</td>
                            <td>Nguyễn Văn A</td>
                            <td>Tiệc cưới</td>
                            <td>22/12/2024</td>
                            <td>200.000.000VND</td>
                            <td>60.000.000 VND</td>
                            <td>24/12/2024</td>
                            <td>140.000.000 VND</td>
                            <td>1/1/2025</td>
                            <td>18:00</td>
                            <td>1/1/2025</td>
                            <td><li className="status da-dat-coc">Đã đặt cọc</li></td>
                            <td>300</td>
                            <td>50 + 2</td>
                            <td>Phạm Văn Đồng</td>
                            <td>Hall A</td>
                            <td><p className="text-teal-400 text-xs font-bold">Chi tiết</p></td>
                        </tr>
                        <tr>
                            <td>#12DKAF</td>
                            <td>Nguyễn Văn A</td>
                            <td>Tiệc cưới</td>
                            <td>22/12/2024</td>
                            <td>200.000.000VND</td>
                            <td>60.000.000 VND</td>
                            <td>24/12/2024</td>
                            <td>140.000.000 VND</td>
                            <td>1/1/2025</td>
                            <td>18:00</td>
                            <td>1/1/2025</td>
                            <td><li className="status da-dat-coc">Đã đặt cọc</li></td>
                            <td>300</td>
                            <td>50 + 2</td>
                            <td>Phạm Văn Đồng</td>
                            <td>Hall A</td>
                            <td><p className="text-teal-400 text-xs font-bold">Chi tiết</p></td>
                        </tr>

                    
                    </tbody>
                </table>
            </div>
            <CustomPagination></CustomPagination>
       </div>
      </div>
    
    </main>
  );    
};

export default Page;
