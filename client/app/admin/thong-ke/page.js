export const metadata = {
    title: "Doanh thu tổng",
};
import React from 'react';
import "../../_styles/globals.css";
import Chart from "@/app/_components/Chart";
import CustomSelect from '@/app/_components/CustomSelect';
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
    const options = [
        { id: 1, name: "Option 1", value: "option1" },
        { id: 2, name: "Option 2", value: "option2" },
        { id: 3, name: "Option 3", value: "option3" },
    ];
    return (
        <main className="font-gilroy grid gap-6 p-4 text-white" >
            <AdminHeader
                title="Thống kê"
                showBackButton = {false}
                showSearchForm = {false}
            ></AdminHeader>
            <div className='flex justify-start items-center gap-2 text-base '>
                <p>Thống kê</p>
                <p>/</p>
            </div>
            <div>
                <div className="flex items-center justify-between gap-[10px] mb-[10px]">
                    <p className="text-base font-semibold ">Doanh thu tổng </p>
                    <p className="text-teal-400 text-xs">Chi tiết</p>
                </div>
                <div className="grid grid-cols-3 gap-4">
                    <div className="p-4 bg-whiteAlpha-100 rounded-xl">
                        <div className="flex items-center justify-between gap-[10px] mb-[10px]">
                            <p className="text-base ">Doanh thu theo tuần </p>
                            <p className="text-teal-400 text-xs">Xem thêm</p>
                        </div>
                        <Chart data={data} chartType="line"/>
                    </div>
                    <div className="p-4 bg-whiteAlpha-100 rounded-xl">
                        <div className="flex items-center justify-between gap-[10px] mb-[10px]">
                            <p className="text-base ">Doanh thu theo tháng </p>
                            <p className="text-teal-400 text-xs">Xem thêm</p>
                        </div>
                        <Chart data={data} chartType="line"/>
                    </div>
                    <div className="p-4 bg-whiteAlpha-100 rounded-xl">
                        <div className="flex items-center justify-between gap-[10px] mb-[10px]">
                            <p className="text-base ">Doanh thu theo quý </p>
                            <p className="text-teal-400 text-xs">Xem thêm</p>
                        </div>
                        <Chart data={data} chartType="line"/>
                    </div>
                    <div className="p-4 bg-whiteAlpha-100 rounded-xl">
                        <div className="flex items-center justify-between gap-[10px] mb-[10px]">
                            <p className="text-base ">Doanh thu theo năm </p>
                            <p className="text-teal-400 text-xs">Xem thêm</p>
                        </div>
                        <Chart data={data} chartType="line"/>
                    </div>
                
                </div>
            </div>
            <div>
                <div className="flex items-center justify-between gap-[10px] mb-[10px]">
                    <p className="text-base font-semibold ">Doanh thu chi nhánh </p>
                    <div className='flex items-center justify-between gap-[10px] '>
                       
                        <select className='select w-[300px]'>
                            <option className='option' value="option1">Option 1</option>
                            <option className='option' value="option2">Option 2</option>
                            <option className='option' value="option3">Option 3</option>
                        </select>
                       
                        <p className="text-teal-400 text-xs">Chi tiết</p>
                    </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                    <div className="p-4 bg-whiteAlpha-100 rounded-xl">
                        <div className="flex items-center justify-between gap-[10px] mb-[10px]">
                            <p className="text-base ">Doanh thu theo tuần </p>
                            <p className="text-teal-400 text-xs">Xem thêm</p>
                        </div>
                        <Chart data={data} chartType="line"/>
                    </div>
                    <div className="p-4 bg-whiteAlpha-100 rounded-xl">
                        <div className="flex items-center justify-between gap-[10px] mb-[10px]">
                            <p className="text-base ">Doanh thu theo tháng </p>
                            <p className="text-teal-400 text-xs">Xem thêm</p>
                        </div>
                        <Chart data={data} chartType="line"/>
                    </div>
                    <div className="p-4 bg-whiteAlpha-100 rounded-xl">
                        <div className="flex items-center justify-between gap-[10px] mb-[10px]">
                            <p className="text-base ">Doanh thu theo quý </p>
                            <p className="text-teal-400 text-xs">Xem thêm</p>
                        </div>
                        <Chart data={data} chartType="line"/>
                    </div>
                    <div className="p-4 bg-whiteAlpha-100 rounded-xl">
                        <div className="flex items-center justify-between gap-[10px] mb-[10px]">
                            <p className="text-base ">Doanh thu theo năm </p>
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