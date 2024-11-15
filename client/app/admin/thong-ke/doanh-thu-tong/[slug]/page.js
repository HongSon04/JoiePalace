"use client"
import React, { useEffect, useState } from 'react';
import { fetchAllBranch, fetchAllByBranch } from "@/app/_services/apiServices";
import { fetchBranchBySlug } from '@/app/_services/branchesServices';
import AdminHeader from '@/app/_components/AdminHeader';
import Chart from '@/app/_components/Chart';
import "../../../../_styles/globals.css";
import BookingsTable from './BookingsTable';

const Page = ({ params }) => {
  const { slug } = params;
  const [dataSlug, setDataSlug] = useState(null);
  const [branchId, setBranchId] = useState(null);
  const [nameBranch, setNameBranch] = useState(null);
  const [allBranch, setAllBranch] = useState(null);
  const [dataTotalBranch, setDataTotalBranch] = useState(null);
  const [selectedBranchId, setSelectedBranchId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const currentBranch = JSON.parse(localStorage.getItem("currentBranch"));
        const branchId = currentBranch.id;
        const nameBranch = currentBranch.name;

        const [dataTotalBranch, allBranch] = await Promise.all([
          fetchAllByBranch(branchId),
          fetchAllBranch()
        ]);

        setDataSlug(dataSlug);
        setBranchId(branchId);
        setNameBranch(nameBranch);
        setDataTotalBranch(dataTotalBranch);
        setAllBranch(allBranch);
        setSelectedBranchId(branchId);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [slug]);

  const dataBranch = allBranch?.data || [];

  const fetchDataForBranch = async (branchId) => {
    try {
      const dataTotalBranch = await fetchAllByBranch(branchId);
      setDataTotalBranch(dataTotalBranch);
      setSelectedBranchId(branchId);
    } catch (error) {
      console.error("Error fetching data for branch:", error);
    }
  };

  const handleBranchChange = (event) => {
    const newBranchId = event.target.value;
    setBranchId(newBranchId);
    setSelectedBranchId(newBranchId);
    fetchDataForBranch(newBranchId);
  };

  const dataBranchChart = dataTotalBranch || [];
  const weeklyRevenues = Object.values(dataBranchChart.total_revune_by_week || []);
  const monthlyRevenues = Object.values(dataBranchChart.total_revune_by_month || []);
  const yearlyRevenues = Object.values(dataBranchChart.total_revune_by_year || []);

  const dataChart = {
    labels: ['Tuần', 'Tháng', 'Năm'],
    datasets: [{
      label: 'Doanh thu',
      data: [
        ...weeklyRevenues,
        ...monthlyRevenues,
        ...yearlyRevenues
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

  return (
    <main className="font-gilroy grid gap-6 p-4 text-white">
      <AdminHeader title="Thống kê doanh thu" showSearchForm={false} />
      <div className="flex justify-start items-center gap-2 text-base text-gray-500">
        <p>Thống kê doanh thu</p>
      </div>
      <div className='w-full'>
        <div className="flex items-center justify-between gap-[10px] mb-[10px]">
          <p className="text-base font-semibold">Doanh thu</p>
          {slug === 'ho-chi-minh' && (
            <select className='select w-[300px]' onChange={handleBranchChange} value={selectedBranchId}>
              {dataBranch.map((item) => (
                <option className='option' key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          )}
        </div>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="p-4 bg-blackAlpha-100 rounded-xl">
            <Chart data={dataChart} chartType="bar" />
          </div>
          <div className="p-4 bg-blackAlpha-100 rounded-xl">
            <Chart data={dataEachMonthChart} chartType="bar" />
          </div>
        </div>
        <div className="relative">
          <div className="flex justify-between items-center">
            <p className="text-base font-semibold">Danh sách tiệc</p>
          </div>
          <div className='overflow-x-auto max-w-[1531px] scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 mt-6'>
            {/* Truyền selectedBranchId vào BookingsTable */}
            <BookingsTable branchId={selectedBranchId} />
          </div>
        </div>
      </div>
    </main>
  );
};

export default Page;
