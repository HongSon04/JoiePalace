"use client";

import AdminHeader from "@/app/_components/AdminHeader";
import React, { useEffect, useState } from "react";
import "../../../_styles/globals.css";
import Chart from "@/app/_components/Chart";
import { BsThreeDots } from "react-icons/bs";
import { PiShootingStarDuotone } from "react-icons/pi";
import Image from "next/image";
import { fetchUserByBranchId } from "@/app/_services/apiServices";
import { fetchBranchBySlug } from "@/app/_services/branchesServices";
import CustomPagination from "@/app/_components/CustomPagination";

const Page = ({params}) => {    
  const {slug} = params;
  const [dataSlug, setDataSlug] = useState(null);
  const [branchId, setBranchId] = useState(null);
  const [dataUser, setDataUser] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dataSlug = await fetchBranchBySlug(slug);
        const branchId = dataSlug[0].id;
        const [userData] = await Promise.all([fetchUserByBranchId(branchId)]);
        
        setDataUser(userData.data || []); 
        setDataSlug(dataSlug);
        setBranchId(branchId);
      } catch (error) {
        console.error("Error fetching data:", error);
      }    
    };
    fetchData();
  }, [slug]);
  console.log(dataUser);
  
  const totalItems = dataUser.length;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = dataUser.slice(indexOfFirstItem, indexOfLastItem); 

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <main className="grid gap-6 p-4 text-white">
      <AdminHeader
        title="Khách hàng"
        showBackButton={false}
        showSearchForm={false}
      />
      <div className="flex justify-start items-center gap-2 text-base text-gray-500">
        <p>Khách hàng</p>
      </div>
      <div className="flex justify-between gap-[30px] items-start">
        <div className="w-[70%]">
          <div className="mb-[10px]">
            <p className="text-base font-semibold">Danh sách khách hàng</p>
          </div>
          <div className="w-full mt-2">
            <div className="overflow-y-auto max-h-72">
              <table className="table w-full rounded-lg">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Tên</th>
                    <th>Cấp độ</th>
                    <th>Số điện thoại</th>
                    <th>Số tiệc</th>
                    <th>Tổng chi</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody className="text-center">
                  {currentItems.map((item, index) => (
                    <tr key={index}>
                      <td>{item.id}</td>
                      <td>{item.name}</td>
                      {/* <td>{item.level}</td>
                      <td>{item.phone}</td>
                      <td>{item.partyCount}</td>
                      <td>{item.totalSpent} VND</td> */}
                      <td>
                        <p className="text-teal-400 text-xs font-bold">Chi tiết</p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <CustomPagination
              total={Math.ceil(totalItems / itemsPerPage)}
              page={currentPage}
              onChange={handlePageChange}
            />
          </div>
        </div>
        <div className="w-[30%] p-4 bg-whiteAlpha-100 h-full rounded-xl">
          <div className="flex p-3 gap-[10px] items-center">
            <PiShootingStarDuotone className="text-3xl text-yellow-500" />
            <p className="text-base font-semibold">Top khách hàng</p>
          </div>
          <div className="flex flex-col p-3 gap-3 max-h-[500px] overflow-y-auto hide-scrollbar">
            {dataUser.length > 0 ? (
              dataUser.map((item, index) => (
                <div key={index} className="flex gap-5 items-center rounded-xl p-3 bg-whiteAlpha-50">
                  {item.avatar ? (
                    <Image className="rounded-full w-[48px]" src={item.avatar} alt="User profile" width={48} height={48} />
                  ) : (
                    <Image className="rounded-full w-[48px]" src="/image/user.jpg" alt="Default User" width={48} height={48} />
                  )}
                  <div className="w-full flex justify-between items-center">
                    <div>
                      <p className="text-sm mb-[10px] font-semibold">{item.username || "N/A"}</p>
                      <div className="flex gap-3 items-center text-xs">
                        {item.membership_id && (
                          <>
                            <Image src="/image/Group.svg" alt="Membership Icon" />
                            <p>{item.memberships}</p>
                          </>
                        )}
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
    </main>
  );
};

export default Page;
