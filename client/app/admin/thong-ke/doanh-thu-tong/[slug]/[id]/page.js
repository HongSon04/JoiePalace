"use client";

import React, { Suspense, useState } from 'react';
import { IoFilter } from 'react-icons/io5';
import { DateRangePicker } from '@nextui-org/date-picker';
import { Input } from '@nextui-org/react';
import { RiMoneyDollarCircleLine } from 'react-icons/ri';
import { HiArrowDown, HiArrowUp } from 'react-icons/hi';
import CustomSelect from '@/app/_components/CustomSelect';
import AdminHeader from '@/app/_components/AdminHeader';
import Chart from '@/app/_components/Chart';
import { MdOutlineHome, MdOutlineNotificationsNone } from 'react-icons/md';
import "../../../../../_styles/globals.css";
import CustomPagination from '@/app/_components/CustomPagination';
import TableSkeleton from '@/app/_components/skeletons/TableSkeleton';
import TableGrab from '@/app/_components/TableGrab';
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
    <main className="font-gilroy grid gap-6 p-4 text-white">
          <AdminHeader
            title="Doanh thu tuần"
            showSearchForm = {false}
          ></AdminHeader>
      <div className="flex justify-start items-center gap-2 text-base text-gray-500">
        <p>Thống kê</p>
        <p>/</p>
        <p>Doanh thu chi nhánh</p>
        <p>/</p>
        <p>Doanh thu chi tiết</p>
      </div>
      <div className="w-full ">
          <div className="p-4   bg-whiteAlpha-100 rounded-xl">
            <div className="flex items-center justify-between gap-[10px] mb-[10px]">
              <p className="text-base">Doanh thu theo tuần</p>
            </div>

           <div className=' w-full'>
              <Chart  data={data} chartType="line" />
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
          <Suspense fallback={<TableSkeleton/>}>
            <TableGrab></TableGrab>
          </Suspense>
       </div>
      </div>
    
    </main>
  );    
};

export default Page;
