"use client";
// export const metadata = {
//     title: "Thống kê",
// };
import React, { useEffect, useState } from 'react';
import "../../../_styles/globals.css";
import Chart from "@/app/_components/Chart";
import AdminHeader from '@/app/_components/AdminHeader';
import { fetchRevenueBranchByWeek, fetchRevenueBranchByMonth, fetchRevenueBranchByQuarter, fetchRevenueBranchByYear, fetchAllBranch} from "@/app/_services/apiServices";
const Page = () => {    
    const [totalWeek, setTotalWeek] = useState(null);
    const [totalMonth, setTotalMonth] = useState(null);
    const [totalQuarter, setTotalQuarter] = useState(null);
    const [totalYear, setTotalYear] = useState(null);
    const [allBranch, setAllBranch] = useState(null);
    useEffect(() => {
      const fetchData = async () => {
        try {
            const totalWeek = await fetchRevenueBranchByWeek();
            const totalMonth = await  fetchRevenueBranchByMonth();
            const totalQuarter = await  fetchRevenueBranchByQuarter();
            const totalYear = await  fetchRevenueBranchByYear();
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
    // console.log( total_revenue_by_week);
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
    const data = {
        labels: ['Phạm Văn Đồng', 'Hoàng Văn Thụ', 'Võ Văn Kiệt'],
        datasets: [
          {
            label: 'Doanh thu',
            data: [300000000, 500000000, 700000000]
  
          },
        ],
    };
    return (
        <main className="grid gap-6 p-4 text-white">
            <AdminHeader
                title="Doanh thu tổng"
                
                showSearchForm = {false}
            ></AdminHeader>
            <div className='flex justify-start items-center gap-2 text-base text-gray-500 '>
                <p>Thống kê</p>
                <p>/</p>
                <p>Doanh thu tổng</p>
            </div>
            <div>
                <div className=" mb-[10px]">
                    <p className="text-base font-semibold">Doanh thu tổng </p>
                    
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-whiteAlpha-100 rounded-xl">
                        <div className="flex items-center justify-between gap-[10px] mb-[10px]">
                            <p className="text-base ">Doanh thu theo tuần </p>
                            <p className="text-teal-400 text-xs">Xem thêm</p>
                        </div>
                        <Chart data={dataByWeek} chartType="line"/>
                    </div>
                    <div className="p-4 bg-whiteAlpha-100 rounded-xl">
                        <div className="flex items-center justify-between gap-[10px] mb-[10px]">
                            <p className="text-base ">Doanh thu theo tháng </p>
                            <p className="text-teal-400 text-xs">Xem thêm</p>
                        </div>
                        <Chart data={dataByMonth} chartType="line"/>
                    </div>
                    <div className="p-4 bg-whiteAlpha-100 rounded-xl">
                        <div className="flex items-center justify-between gap-[10px] mb-[10px]">
                            <p className="text-base ">Doanh thu theo quý </p>
                            <p className="text-teal-400 text-xs">Xem thêm</p>
                        </div>
                        <Chart data={dataByQuarter} chartType="line"/>
                    </div>
                    <div className="p-4 bg-whiteAlpha-100 rounded-xl">
                        <div className="flex items-center justify-between gap-[10px] mb-[10px]">
                            <p className="text-base ">Doanh thu theo năm </p>
                            <p className="text-teal-400 text-xs">Xem thêm</p>
                        </div>
                        <Chart data={dataByYear} chartType="line"/>
                    </div>
                
                </div>
            </div>

            
          
        </main>
    );
};

export default Page;