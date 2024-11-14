"use client";

import AdminHeader from "@/app/_components/AdminHeader";
import React, { useEffect, useState } from "react";
import "../../_styles/globals.css";
import Chart from "@/app/_components/Chart";
import { BsThreeDots } from "react-icons/bs";
import { PiShootingStarDuotone } from "react-icons/pi";
import Image from "next/image";
import { fetchUserByBranchId, getUserData } from "@/app/_services/apiServices";
import { fetchBranchBySlug } from "@/app/_services/branchesServices";
import CustomPagination from "@/app/_components/CustomPagination";
import { API_CONFIG, makeAuthorizedRequest } from "@/app/_utils/api.config";
import Link from "next/link";
import { Button } from "antd";
import { PlusIcon } from "@heroicons/react/24/outline";
import { formatPrice } from "@/app/_utils/formaters";
import { formatDate } from "date-fns";
import SearchForm from "@/app/_components/SearchForm";

const Page = ({ params }) => {
  const { slug } = params;
  const [dataUser, setDataUser] = useState([]);
  const [dataTopUser, setDataTopUser] = useState([]);
  const [branchId, setBranchId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [sortOrder, setSortOrder] = useState('ASC');
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = API_CONFIG.USER.GET_ALL({ itemsPerPage: 1000, search: searchQuery });
        const userData = await makeAuthorizedRequest(url, "GET", null);

        const topUserData = await makeAuthorizedRequest(
          API_CONFIG.USER.GET_ALL({ totalAmount: 'DESC', itemsPerPage: 10 }),
          "GET",
          null
        );

        setDataTopUser(topUserData.data);
        setDataUser(userData.data || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [searchQuery]);

  const totalItems = dataUser.length;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const sortedDataUser = [...dataUser].sort((a, b) => {
    return sortOrder === 'ASC' ? a.totalAmount - b.totalAmount : b.totalAmount - a.totalAmount;
  });

  const filteredDataUser = sortedDataUser.filter(item => {
    const lowerSearchQuery = searchQuery.toLowerCase();
    return (
      item.id.toString().includes(lowerSearchQuery) ||
      item.username?.toLowerCase().includes(lowerSearchQuery)
    );
  });

  const currentItems = filteredDataUser.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const toggleSortOrder = () => {
    setSortOrder(prevOrder => (prevOrder === 'ASC' ? 'DESC' : 'ASC'));
  };

  const onSearchChange = React.useCallback((e) => {
    const query = e.target.value;
    setSearchQuery(query);
  }, []);

  return (
    <main className="grid gap-6 p-4 text-white">
      <div className="flex items-center gap-5">
        <AdminHeader title="Khách hàng" showBackButton={false} showSearchForm={false} />
        <Link
          href={`/admin/khach-hang/them-tai-khoan`}
          className="px-3 py-1 h-full bg-whiteAlpha-100 flex flex-center gap-3 rounded-full text-white shrink-0 hover:whiteAlpha-200"
        >
          <PlusIcon className="h-6 w-6 cursor-pointer text-white" />
          Thêm tài khoản khách hàng
        </Link>
      </div>

      <div className="flex justify-start items-center gap-2 text-base text-gray-500">
        <p>Khách hàng</p>
      </div>

      <div className="flex justify-between gap-[16px] items-start">
        <div className="w-[75%]">
          <div className="flex items-center justify-between w-full">
            <div className="mb-[10px]">
              <p className="text-base font-semibold">Danh sách khách hàng</p>
            </div>
            <SearchForm
              placeholder="Tìm kiếm"
              classNames={{
                input: "text-white",
              }}
              value={searchQuery}
              onChange={onSearchChange}
            />
          </div>

          <div className="w-full mt-2">
            <table className="table w-full rounded-lg max-h-[460px]">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Tên</th>
                  <th>Cấp độ</th>
                  <th>Số điện thoại</th>
                  <th>Số tiệc</th>
                  <th onClick={toggleSortOrder} style={{ cursor: 'pointer' }}>
                    Tổng chi {sortOrder === 'ASC' ? '↑' : '↓'}
                  </th>
                  <th></th>
                </tr>
              </thead>
              <tbody className="text-center">
                {currentItems.map((item) => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{item.username || "N/A"}</td>
                    <td>{item.memberships || "N/A"}</td>
                    <td>{item.phone || "N/A"}</td>
                    <td>{item.totalBookingSuccess}</td>
                    <td>{formatPrice(item.totalAmount)}</td>
                    <td>
                      {item.id && (
                        <Link href={`/admin/khach-hang/${item.id}`} className="text-teal-400 text-xs font-bold">
                          Chi tiết
                        </Link>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <CustomPagination
            total={Math.ceil(filteredDataUser.length / itemsPerPage)}
            page={currentPage}
            onChange={handlePageChange}
          />
        </div>

        <div className="w-[25%] p-2 bg-whiteAlpha-100 h-full rounded-xl">
          <div className="flex p-3 gap-[10px] items-center">
            <PiShootingStarDuotone className="text-3xl text-yellow-500" />
            <p className="text-base font-semibold">Top khách hàng</p>
          </div>
          <div className="flex flex-col p-3 gap-3 max-h-[500px] overflow-y-auto hide-scrollbar">
            {dataTopUser.length > 0 ? (
              dataTopUser.map((item, index) => (
                <Link key={index} href={`/admin/khach-hang/${item.id}`} className="flex gap-3 items-center rounded-xl p-2 bg-whiteAlpha-50">
                  <span className="mr-1 text-bold">{index + 1}.</span>
                  <Image
                    className="rounded-full w-[48px]"
                    src={item.avatar || "/image/user.jpg"}
                    alt={`${item.username}'s profile`}
                    width={48}
                    height={48}
                  />
                  <div className="w-full flex justify-between items-center">
                    <div>
                      <p className="text-sm font-semibold">{item.username || "N/A"}</p>
                      <p className="text-sm mb-[10px] font-semibold">{formatPrice(item.totalAmount)}</p>
                    </div>
                  </div>
                </Link>
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
