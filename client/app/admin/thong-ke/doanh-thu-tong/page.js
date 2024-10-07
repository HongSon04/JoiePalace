export const metadata = {
    title: "Thống kê",
};
import React from 'react';
import "../../../_styles/globals.css";
import Chart from "@/app/_components/Chart";
import AdminHeader from '@/app/_components/AdminHeader';
const page = () => {
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
        <main className="grid gap-6 p-4">
            <AdminHeader
                title="Doanh thu tổng"
                
                showSearchForm = {false}
            ></AdminHeader>
            <div className='flex justify-start items-center gap-2 text-base '>
                <p>Thống kê</p>
                <p>/</p>
                <p>Doanh thu tổng</p>
            </div>
            <div>
                <div className=" mb-[10px]">
                    <p className="text-base font-semibold">Doanh thu tổng </p>
                    
                </div>
                <div className="grid grid-cols-3 gap-4">
                    <div className="p-4 bg-whiteAlpha-100 rounded-xl">
                        <div className="flex items-center justify-between gap-[10px] mb-[10px]">
                            <p className="text-base">Doanh thu theo tuần </p>
                            <p className="text-teal-400 text-xs">Xem thêm</p>
                        </div>
                        <Chart data={data} chartType="line"/>
                    </div>
                    <div className="p-4 bg-whiteAlpha-100 rounded-xl">
                        <div className="flex items-center justify-between gap-[10px] mb-[10px]">
                            <p className="text-base">Doanh thu theo tháng </p>
                            <p className="text-teal-400 text-xs">Xem thêm</p>
                        </div>
                        <Chart data={data} chartType="line"/>
                    </div>
                    <div className="p-4 bg-whiteAlpha-100 rounded-xl">
                        <div className="flex items-center justify-between gap-[10px] mb-[10px]">
                            <p className="text-base">Doanh thu theo quý </p>
                            <p className="text-teal-400 text-xs">Xem thêm</p>
                        </div>
                        <Chart data={data} chartType="line"/>
                    </div>
                    <div className="p-4 bg-whiteAlpha-100 rounded-xl">
                        <div className="flex items-center justify-between gap-[10px] mb-[10px]">
                            <p className="text-base">Doanh thu theo năm </p>
                            <p className="text-teal-400 text-xs">Xem thêm</p>
                        </div>
                        <Chart data={data} chartType="line"/>
                    </div>
                
                </div>
            </div>

            
          
        </main>
    );
};

export default page;