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
import {fetchAllBranch, fetchAllByBranch} from "@/app/_services/apiServices";
import { fetchBranchBySlug } from '@/app/_services/branchesServices';
import BookingsTable from './BookingsTable';
const Page = ({params}) => {    
  const {slug} = params;
  const [dataSlug, setDataSlug] = useState(null);
  const [branchId, setBranchId] = useState(null);
  const [nameBranch, setnNameBranch] = useState(null);
  const [allBranch, setAllBranch] = useState(null);
  const [dataTotalBranch, setdataTotalBranch] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const dataSlug = await fetchBranchBySlug(slug);
        const branchId = dataSlug[0].id;
        const nameBranch = dataSlug[0].name;
    
        const [dataTotalBranch, allBranch] = await Promise.all([
            fetchAllByBranch(branchId),
            fetchAllBranch()
        ]);
    
        setDataSlug(dataSlug);
        setBranchId(branchId);
        setnNameBranch(nameBranch);
        setdataTotalBranch(dataTotalBranch);
        setAllBranch(allBranch);
    } catch (error) {
        console.error("Error fetching data:", error);
    }    
    };
    fetchData();
  }, []);

  const dataBranch = allBranch?.data || []; 
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const BranchName = (nameBranch === 'Hồ Chí Minh') ? 'tổng' : nameBranch;
  const dataBranchChart = dataTotalBranch?.data || []; 
  const dataChart = {
    labels: ['Tuần', 'Tháng', 'Năm'], 
    datasets: [{
        label: 'Doanh thu',
        data: [
          dataBranchChart.total_revune_by_week, 
          dataBranchChart.total_revune_by_month, 
          dataBranchChart.total_revune_by_year
        ]
    }]
  };
  const dataEachMonth = dataBranchChart.total_revune_each_month;
  const eachMonthChartData = dataEachMonth?.data || []; 
  const dataEachMonthChart = {
    labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'], 
    datasets: [{
        data: [
          eachMonthChartData
        ]
    }]
  }

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
      <div className='w-full'>
        <div className="flex items-center justify-between gap-[10px] mb-[10px]">
          <p className="text-base font-semibold">Doanh thu {BranchName}</p>
            {branchId === 2 ? (
              <select className='select w-[300px]'>
                  {dataBranch.map((item) => (
                      <option className='option' key={item.id} value={item.slug}>
                          {item.name}
                      </option>
                  ))}
              </select>
            ) : null}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-blackAlpha-100 rounded-xl">
              <div className="flex items-center justify-between gap-[10px] mb-[10px]">
                  {/* <p className="font-bold text-base">Doanh thu theo năm</p> */}
              </div>
              <Chart data={dataChart} chartType="bar" />
          </div>
          <div className="p-4 bg-blackAlpha-100 rounded-xl">
              <div className="flex items-center justify-between gap-[10px] mb-[10px]">
                  {/* <p className="font-bold text-base">Doanh thu theo năm</p> */}
              </div>
              <Chart data={dataEachMonthChart} chartType="bar" />
          </div>
        </div>
        
       
        
      </div>
      <div className="relative">
        <div className="flex justify-between items-centern">
          <p className="text-sm font-bold">Danh sách tiệc {BranchName}</p>
        </div>
        
        <div className='overflow-x-auto max-w-[1531px] scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 mt-6'>
          <Suspense fallback={<TableSkeleton />}>
            <BookingsTable branchId={1} />
          </Suspense>
        </div>

      </div>
    
    </main>
  );    
};

export default Page;
