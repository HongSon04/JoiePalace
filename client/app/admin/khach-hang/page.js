"use client";

import AdminHeader from "@/app/_components/AdminHeader";
import React, { Suspense, useEffect, useState } from "react";
import "../../_styles/globals.css";
import { PiShootingStarDuotone } from "react-icons/pi";
import Image from "next/image";
import { fetchAllCustomers, fetchTopUsers } from "@/app/_lib/features/customer/customerSlice";
import CustomPagination from "@/app/_components/CustomPagination";
import { useSelector, useDispatch } from "react-redux";
import Link from "next/link";
import { PlusIcon } from "@heroicons/react/24/outline";
import { formatPrice } from "@/app/_utils/formaters";
import { useSearchParams } from "next/navigation";
import SearchForm from "@/app/_components/SearchForm";
import TableSkeleton from "@/app/_components/skeletons/TableSkeleton";

const Page = ({ params }) => {
  const { slug } = params;
  const dispatch = useDispatch();
  const searchParams = useSearchParams();

  const [sortOrder, setSortOrder] = useState("ASC");
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get("page")) || 1);
  const [sortField, setSortField] = useState("totalAmount");

  const {
    customers,
    pagination,
    isFetchingCustomer,
    isFetchingCustomerError,
  } = useSelector((state) => state.customers);

  const filteredDataUser = [...customers]
  .filter((item) => {
    const lowerSearchQuery = searchQuery.toLowerCase();
    return (
      (item.id.toString().includes(lowerSearchQuery) ||
        item.username?.toLowerCase().includes(lowerSearchQuery) ||
        item.phone?.toString().includes(lowerSearchQuery))
    );
  })
  .sort((a, b) => {
    const dateA = new Date(a.created_at);
    const dateB = new Date(b.created_at);
    if (sortOrder === "ASC") {
      return dateB - dateA;  
    } else {
      return dateA - dateB;  
    }
  });



  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;
    const params = {
      search: searchQuery,
      itemsPerPage: 12,
      page: currentPage,
      sortOrder,
      sortField,
    };
    dispatch(fetchAllCustomers({ params, signal }));

    return () => {
      controller.abort(); 
    };
  }, [dispatch, searchQuery, currentPage, sortOrder, sortField]);

  const onPageChange = (page) => {
    setCurrentPage(page);
  };

  const toggleSortOrder = (field) => {
    setSortField(field);
    setSortOrder((prevOrder) => (prevOrder === "ASC" ? "DESC" : "ASC"));
  };

  const onSearchChange = React.useCallback((e) => {
    const query = e.target.value;
    setSearchQuery(query);
    setCurrentPage(1); // Reset trang khi thay đổi tìm kiếm
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
        <div className="w-full">
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

          <div className="w-full mt-2 mb-2">
            <Suspense fallback={<TableSkeleton />}>
              <table className="table w-full rounded-lg  mt-[10px]">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Tên</th>
                    <th>Số điện thoại</th>
                    <th>Tiệc đã hoàn thành</th>
                    <th onClick={() => toggleSortOrder("totalAmount")} style={{ cursor: "pointer" }}>
                      Tổng chi {sortOrder === "ASC" ? "↑" : "↓"}
                    </th>
                    <th></th>
                  </tr>
                </thead>
                <tbody className="text-center">
                  {filteredDataUser.length > 0 ? (
                    filteredDataUser.map((item) => (
                      <tr key={item.id}>
                        <td>{item.id}</td>
                        <td>{item.username || "--"}</td>
                        <td>{item.phone ?? "--"}</td>
                        <td>{item.totalBookingSuccess}</td>
                        <td>{formatPrice(item.totalAmount)}</td>
                        <td>
                          {item.id && (
                            <Link
                              href={`/admin/khach-hang/${item.id}`}
                              className="text-teal-400 text-xs font-bold"
                            >
                              Chi tiết
                            </Link>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="text-center h-[404px]">Không có dữ liệu.</td>
                    </tr>
                  )}

                </tbody>
              </table>
            </Suspense>
            
          </div>

          <CustomPagination
            page={currentPage}
            total={pagination.lastPage}
            onChange={onPageChange}
            classNames={{
              base: "flex justify-center",
            }}
          />
        </div>
          {/* <div className="w-[25%] p-2 bg-whiteAlpha-100 h-full rounded-xl">
              <div className="flex p-3 gap-[10px] items-center">
                <PiShootingStarDuotone className="text-3xl text-yellow-500" />
                <p className="text-base font-semibold">Top 10 khách hàng</p>
              </div>
              <div className="flex flex-col p-3 gap-3 max-h-[500px] overflow-y-auto hide-scrollbar">
                {topUsers.length > 0 ? (
                  topUsers.map((item, index) => (
                    <Link
                      key={index}
                      href={/admin/khach-hang/${item.id}}
                      className="flex gap-3 items-center rounded-xl p-2 bg-whiteAlpha-50"
                    >
                      <span className="mr-1 text-bold">{index + 1}.</span>
                      <Image
                        className="rounded-full w-[48px]"
                        src={item.avatar || "/image/user.jpg"}
                        alt={${item.username}'s profile}
                        width={48}
                        height={48}
                      />
                      <div className="w-full flex justify-between items-center">
                        <div>
                          <p className="text-sm font-semibold">{item.username || "--"}</p>
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
            </div> */}
      </div>
    </main>
  );
};

export default Page;
