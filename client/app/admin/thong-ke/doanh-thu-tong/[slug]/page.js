"use client";

import React, { Suspense, useEffect, useState } from 'react';
import { IoFilter } from 'react-icons/io5';
import { DateRangePicker } from '@nextui-org/date-picker';
import { Input } from '@nextui-org/react';
import { RiMoneyDollarCircleLine } from 'react-icons/ri';
import { HiArrowDown, HiArrowUp } from 'react-icons/hi';
import AdminHeader from '@/app/_components/AdminHeader';
import Chart from '@/app/_components/Chart';
import "../../../../_styles/globals.css";
import TableGrab from '@/app/_components/TableGrab';
import TableSkeleton from '@/app/_components/skeletons/TableSkeleton';
import { fetchRevenueBranchByWeek, fetchRevenueBranchByMonth, fetchRevenueBranchByQuarter, fetchRevenueBranchByYear, fetchAllBranch} from "@/app/_services/apiServices";
const Page = () => {    
  const [idBranch, setIdBranch] = useState(null);
  const [totalWeek, setTotalWeek] = useState(null);
  const [totalMonth, setTotalMonth] = useState(null);
  const [totalQuarter, setTotalQuarter] = useState(null);
  const [totalYear, setTotalYear] = useState(null);
  const [allBranch, setAllBranch] = useState(null);
  const [nameBranch, setnNameBranch] = useState(null);
  useEffect(() => {
    const storedBranch = localStorage.getItem("currentBranch");
    const fetchData = async () => {
      try {
          const branchObject = JSON.parse(storedBranch);
          const branchId = branchObject[0].id ;
          const nameBranch = branchObject[0].name;
          // console.log(branchId);   
          setnNameBranch(nameBranch);
          setIdBranch(branchId); 

          const totalWeek = await fetchRevenueBranchByWeek(branchId);
          const totalMonth = await  fetchRevenueBranchByMonth(branchId);
          const totalQuarter = await  fetchRevenueBranchByQuarter(branchId);
          const totalYear = await  fetchRevenueBranchByYear(branchId);
          const allBranch = await fetchAllBranch();
          // console.log(allBranch.data);

          setTotalWeek(totalWeek);
          setTotalMonth(totalMonth);
          setTotalQuarter(totalQuarter);
          setTotalYear(totalYear);
          setAllBranch(allBranch);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);
  const total_revenue_by_week = totalWeek || [];
  const total_revenue_by_month = totalMonth|| [];
  const total_revenue_by_quarter = totalQuarter|| [];
  const total_revenue_by_year = totalYear|| [];

  const dataByWeek = {
      labels: Object.keys(total_revenue_by_week), 
      datasets: [
          {
              label: 'Doanh thu',
              data:Object.values(total_revenue_by_week) 
          }
      ]
  };
  const dataByMonth = {
      labels: Object.keys(total_revenue_by_month), 
      datasets: [
          {
              label: 'Doanh thu',
              data:Object.values(total_revenue_by_month) 
          }
      ]
  };
  const dataByQuarter = {
      labels: Object.keys(total_revenue_by_quarter), 
      datasets: [
          {
              label: 'Doanh thu',
              data:Object.values(total_revenue_by_quarter) 
          }
      ]
  };
  const dataByYear= {
      labels: Object.keys(total_revenue_by_year), 
      datasets: [
          {
              label: 'Doanh thu',
              data:Object.values(total_revenue_by_year) 
          }
      ]
  };
  const dataBarByWeek = {
    labels: [''],
    datasets: [
      {
        label: 'Doanh thu',
        data:Object.values(total_revenue_by_week) 

      },
    ],
  };
  const dataBarByMonth = {
    labels: [''],
    datasets: [
      {
        label: 'Doanh thu',
        data:Object.values(total_revenue_by_week) 

      },
    ],
  };
  const dataBarByQuarter = {
    labels: Object.keys(total_revenue_by_quarter),
    datasets: [
      {
        label: 'Doanh thu',
        data:Object.values(total_revenue_by_week) 

      },
    ],
  };
  const dataBarByYear = {
    labels: Object.keys(total_revenue_by_quarter),
    datasets: [
      {
        label: 'Doanh thu',
        data:Object.values(total_revenue_by_week) 

      },
    ],
  };
  const dataBranch = allBranch?.data || []; 
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const BranchName = (nameBranch === 'Hồ Chí Minh') ? 'tổng' : nameBranch;
  
  const content = idBranch === 2 ? (
    <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-whiteAlpha-100 rounded-xl">
            <div className="flex items-center justify-between gap-[10px] mb-[10px]">
                <p className="text-base">Doanh thu theo tuần</p>
            </div>
            <Chart data={dataByWeek} chartType="line" />
        </div>
        <div className="p-4 bg-whiteAlpha-100 rounded-xl">
            <div className="flex items-center justify-between gap-[10px] mb-[10px]">
                <p className="text-base">Doanh thu theo tháng</p>
            </div>
            <Chart data={dataByMonth} chartType="line" />
        </div>
        <div className="p-4 bg-whiteAlpha-100 rounded-xl">
            <div className="flex items-center justify-between gap-[10px] mb-[10px]">
                <p className="text-base">Doanh thu theo quý</p>
            </div>
            <Chart data={dataByQuarter} chartType="line" />
        </div>
        <div className="p-4 bg-whiteAlpha-100 rounded-xl">
            <div className="flex items-center justify-between gap-[10px] mb-[10px]">
                <p className="text-base">Doanh thu theo năm</p>
            </div>
            <Chart data={dataByYear} chartType="line" />
        </div>
    </div>
  ) : (
      <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-whiteAlpha-100 rounded-xl">
              <div className="flex items-center justify-between gap-[10px] mb-[10px]">
                  <p className="text-base">Doanh thu theo tuần</p>
              </div>
              <Chart data={dataBarByWeek} chartType="bar" />
          </div>
          <div className="p-4 bg-whiteAlpha-100 rounded-xl">
              <div className="flex items-center justify-between gap-[10px] mb-[10px]">
                  <p className="text-base">Doanh thu theo tháng</p>
              </div>
              <Chart data={dataBarByMonth} chartType="bar" />
          </div>
          <div className="p-4 bg-whiteAlpha-100 rounded-xl">
              <div className="flex items-center justify-between gap-[10px] mb-[10px]">
                  <p className="text-base">Doanh thu theo quý</p>
              </div>
              <Chart data={dataBarByQuarter} chartType="bar" />
          </div>
          <div className="p-4 bg-whiteAlpha-100 rounded-xl">
              <div className="flex items-center justify-between gap-[10px] mb-[10px]">
                  <p className="text-base">Doanh thu theo năm</p>
              </div>
              <Chart data={dataBarByYear} chartType="bar" />
          </div>
      </div>
  );


  const toggleFilter = () => {
    setIsFilterVisible(prevState => !prevState);
  };

  return (
    <main className="font-gilroy grid gap-6 p-4 text-white">
          <AdminHeader
            title="Thống kê doanh thu "
            showSearchForm = {false}
          ></AdminHeader>
      <div className="flex justify-start items-center gap-2 text-base text-gray-500 ">
        <p>Thống kê doanh thu {BranchName}</p>
      </div>
      <div>
        <div className="flex items-center justify-between gap-[10px] mb-[10px]">
          <p className="text-base font-semibold">Doanh thu {BranchName}</p>
            {idBranch === 2 ? (
              <select className='select w-[300px]'>
                  {dataBranch.map((item) => (
                      <option className='option' key={item.id} value={item.slug}>
                          {item.name}
                      </option>
                  ))}
              </select>
            ) : null}
        </div>
        {content}
       
        
      </div>
      <div className="relative">
        <div className="flex justify-between items-centern mb-4 ">
          <p className="text-sm font-bold">Danh sách tiệc {BranchName}</p>
          <div
            onClick={toggleFilter}
            className="bg-whiteAlpha-100 rounded-full py-2.5 px-4 cursor-pointer"
          >
            <IoFilter className="text-xl" />
          </div>
        </div>
        {isFilterVisible && (
          <div className="absolute mt-2 w-[300px]  rounded-xl right-0 top-[40px]  0 z-10 text-gray-500 bg-white">
            <DateRangePicker className="max-w-xs w-full " />
            <div className="flex justify-center items-center gap-2 ">
              <Input
                type="number"
                placeholder="0"
                labelPlacement="outside"
                
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
