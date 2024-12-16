"use client";
// export const metadata = {
//   title: "Bảng điều khiển",
// };
import { useEffect, useState } from "react";

import AdminHeader from "@/app/_components/AdminHeader";
import CustomCalendar from "@/app/_components/Calendar";
import Chart from "@/app/_components/Chart";
import useApiServices from "@/app/_hooks/useApiServices";
import {
  fetchAllByBranch,
  fetchAllDashBoard,
  fetchInfoByMonth,
  fetchRevenueBranchByMonth,
  fetchRevenueBranchByQuarter,
  fetchRevenueBranchByWeek,
  fetchRevenueBranchByYear,
} from "@/app/_services/apiServices";
import { API_CONFIG } from "@/app/_utils/api.config";
import { formatPrice } from "@/app/_utils/formaters";
import Link from "next/link";
import { FaRegCalendarCheck } from "react-icons/fa6";
import { FiPhone } from "react-icons/fi";
import { IoCalendarOutline } from "react-icons/io5";
import { RiMoneyDollarCircleLine } from "react-icons/ri";
import TableBookingsPending from "./TableBookingsPending";
import TableStageStatus from "./TableStageStatus";
import { Skeleton } from "@nextui-org/react";


const Page = ({ params }) => {
  const { slug } = params;
  const [allInfo, setallInfo] = useState(null);
  const [allBooking, setAllBooking] = useState(null);
  const [totalBookingWeek, settotalBookingWeek] = useState([]);
  const [totalBookingWeekBranch, settotalBookingWeekBranch] = useState([]);
  const [dataInfo, setDataInfo] = useState(null);
  const [dataSlug, setDataSlug] = useState(null);
  const [idBranch, setIdBranch] = useState(null);
  const [dataTotalAdminByWeek, setdataTotalAdminByWeek] = useState(null);
  const [dataTotalAdminByMonth, setDataTotalAllByMonth] = useState(null);
  const [dataTotalAdminByYear, setdataTotalAdminByYear] = useState(null);
  const [dataTotalAdminByQuarter, setdataTotalAdminByQuarter] = useState(null);
  const [dataTotalBranch, setdataTotalBranch] = useState(null);
  const { makeAuthorizedRequest } = useApiServices();
  const [dataBookingByBranch, setDataBookingByBranch] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [start_Date, setStartDate] = useState(null);
  const [end_Date, setEndDate] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState("week");
  const [totalBookingMonth, setTotalBookingMonth] = useState("month");
  const [itemPerPage, setItemsPerPage ] = useState(null);
  const formatDate = (dateInput) => {
    const date = new Date(dateInput);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };
  function getCurrentMonthAndWeekDates() {
    const currentDate = new Date();
    const startDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    );
    const endDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0
    );
    const month = currentDate.getMonth() + 1;

    const dayOfWeek = currentDate.getDay();

    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - dayOfWeek + 1);

    const endOfWeek = new Date(currentDate);
    endOfWeek.setDate(currentDate.getDate() - dayOfWeek + 6);

    const formattedStartDate = formatDate(startDate);
    const formattedEndDate = formatDate(endDate);
    const formattedStartOfWeek = formatDate(startOfWeek);
    const formattedEndOfWeek = formatDate(endOfWeek);

    return {
      startDate: formattedStartDate,
      endDate: formattedEndDate,
      month: month,
      startOfWeek: formattedStartOfWeek,
      endOfWeek: formattedEndOfWeek,
    };
  }

  useEffect(() => {
    const fetchAminData = async () => {
      try {
        const currentBranch = JSON.parse(localStorage.getItem("currentBranch"));
        const branchId = currentBranch.id;
        let idBranch = currentBranch.id;
        if (currentBranch.slug === "ho-chi-minh") {
          idBranch = 0;
        }
        const {
          startDate,
          endDate,
          startOfWeek,
          endOfWeek,
        } = getCurrentMonthAndWeekDates();
        // console.log(startDate);
        // console.log(endDate);
        const totalBookingWeek = await makeAuthorizedRequest(
          API_CONFIG.BOOKINGS.GET_ALL({
            branch_id: idBranch,
            status: "processing",
            startOrganizationDate: startOfWeek,
            endOrganizationDate: endOfWeek
          }),
          "GET",
          null
        );
        const totalBookingMonth = await makeAuthorizedRequest(
          API_CONFIG.BOOKINGS.GET_ALL({
            branch_id: idBranch,
            status: "success",
            startOrganizationDate: startDate,
            endOrganizationDate: endDate
          }),
          "GET",
          null
        );
        // console.log(totalBookingMonth);
        const allBooking = await makeAuthorizedRequest(
          API_CONFIG.BOOKINGS.GET_ALL({
            branch_id: idBranch,
            status: "pending",
            itemsPerPage: 4,
            startDate: startOfWeek,
            endDate: endOfWeek,
          }),
          "GET",
          null
        );
        // console.log(getDefaultDateRange().start_Date);

        const dataBookingByBranch = await makeAuthorizedRequest(
          API_CONFIG.BOOKINGS.GET_ALL({
            branch_id: idBranch,
            status: "pending",
            is_deposit: false,
          }),
          "GET",
          null
        );

        const [
          allInfo,
          dataInfo,
          dataTotalAdminByMonth,
          dataTotalAdminByWeek,
          dataTotalAdminByYear,
          dataTotalAdminByQuarter,
          dataTotalBranch,
        ] = await Promise.all([
          fetchAllDashBoard(),
          fetchInfoByMonth(branchId),
          fetchRevenueBranchByMonth(0),
          fetchRevenueBranchByWeek(0),
          fetchRevenueBranchByYear(0),
          fetchRevenueBranchByQuarter(0),
          fetchAllByBranch(branchId),
        ]);
        // console.log(dataUser);
        setTotalBookingMonth(totalBookingMonth);
        setIdBranch(idBranch);
        setDataBookingByBranch(dataBookingByBranch);
        setallInfo(allInfo);
        setdataTotalAdminByWeek(dataTotalAdminByWeek);
        setDataTotalAllByMonth(dataTotalAdminByMonth);
        setdataTotalAdminByQuarter(dataTotalAdminByQuarter);
        setdataTotalAdminByYear(dataTotalAdminByYear);
        setdataTotalBranch(dataTotalBranch);
        setDataSlug(dataSlug);
        setDataInfo(dataInfo);
        settotalBookingWeek(totalBookingWeek);
        settotalBookingWeekBranch(totalBookingWeekBranch);
        setAllBooking(allBooking);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchAminData();
  }, [start_Date, end_Date, currentPage]);

  const createChartData = (data, label) => {
    let chartData = {
      labels: [],
      datasets: [
        {
          label: label,
          data: [],
        },
      ],
    };

    if (data) {
      const totalRevune = data["Hồ Chí Minh"] || {};
      const branches = totalRevune.branches || {};

      chartData.labels = ["Hồ Chí Minh", ...Object.keys(branches)];

      chartData.datasets[0].data = [
        totalRevune.value,
        ...Object.values(branches),
      ];
    }

    return chartData;
  };

  let dataByWeek = createChartData(dataTotalAdminByWeek, "Doanh thu theo tuần");
  let dataByMonth = createChartData(
    dataTotalAdminByMonth,
    "Doanh thu theo tháng"
  );
  let dataByYear = createChartData(dataTotalAdminByYear, "Doanh thu theo năm");
  // console.log(dataTotalAdminByYear);
  const dataBranchChart = dataTotalBranch || [];
  // Kiểm tra nếu các đối tượng không phải là null hoặc undefined, nếu không thì sử dụng mảng rỗng
  const monthlyRevenues = Object.values(
    dataBranchChart.total_revune_by_month || []
  );
  const weeklyRevenues = Object.values(
    dataBranchChart.total_revune_by_week || []
  );
  const yearlyRevenues = Object.values(
    dataBranchChart.total_revune_by_year || []
  );
 

  const dataBranch = {
    labels: ["Tuần", "Tháng", "Năm"],
    datasets: [
      {
        label: "Doanh thu",
        data: [...weeklyRevenues, ...monthlyRevenues, ...yearlyRevenues],
      },
    ],
  };

  const dataEachMonth = dataBranchChart.total_revune_each_month;
  const eachMonthChartData = dataEachMonth?.data || [];
  const dataEachMonthChart = {
    labels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
    datasets: [
      {
        data: eachMonthChartData,
      },
    ],
  };

  const dataBooking = allBooking?.data || [];

  const { month } = getCurrentMonthAndWeekDates();
  const bookingsOffWeek = totalBookingWeek?.pagination?.total || 0;
  const bookingsOffWeekBranch = totalBookingWeekBranch?.pagination?.total || 0;
  const bookingsOffMonth = totalBookingMonth?.pagination?.total || 0;
  const totalInfoBranch = dataTotalBranch?.count_booking_status[0]?.data;
  // console.log(bookingsOffMonth);
  useEffect(() => {
    if (allBooking && allBooking.pagination) {
      setCurrentPage(allBooking.pagination.currentPage);
      setItemsPerPage(allBooking.pagination.itemsPerPage);
    }
  }, [allBooking]);
  const requestData = dataBookingByBranch.data;
  // console.log(totalInfoBranch);
  const handlePeriodChange = (event) => {
    setSelectedPeriod(event.target.value);
  };

  return (
    <main className="grid gap-6  text-white ">
      <AdminHeader
        title="Chung"
        showBackButton={false}
        showHomeButton={false}
        showSearchForm = {false}
      ></AdminHeader>
        {slug === "ho-chi-minh" ? (
          allInfo ? (
            <>
              <div className="px-4 w-full flex gap-[16px] justify-between text-white">
                <div className="box-item p-3 rounded-xl bg-whiteAlpha-100 inline-flex flex-col gap-6 w-[251px] flex-1">
                  <FiPhone className="text-4xl" />
                  <div className="flex justify-between items-center">
                    <p className="text-white text-base font-normal">
                      Yêu cầu cần được xử lý
                    </p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-4xl font-bold">
                      {allInfo?.count_booking_status?.pending}
                    </p>
                  </div>
                </div>

                <div className="box-item p-3 rounded-xl bg-whiteAlpha-100 inline-flex flex-col gap-6 w-[251px] flex-1">
                  <IoCalendarOutline className="text-4xl" />
                  <div className="flex justify-between items-center">
                    <p className="text-white text-base font-normal">
                      Tiệc sắp diễn ra trong tuần
                    </p>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-end gap-1">
                      <p className="text-4xl font-bold">{bookingsOffWeek}</p>
                      <p>tiệc</p>
                    </div>
                  </div>
                </div>

                <div className="box-item p-3 rounded-xl bg-whiteAlpha-100 inline-flex flex-col gap-6 w-[251px] flex-1">
                  <RiMoneyDollarCircleLine className="text-4xl" />
                  <div className="flex justify-between items-center">
                    <p className="text-white text-base font-normal">
                      Doanh thu tổng tháng {month}
                    </p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-4xl font-bold">
                      {formatPrice(allInfo.total_revune_by_month || 0)}
                    </p>
                  </div>
                </div>

                <div className="box-item p-3 rounded-xl bg-whiteAlpha-100 inline-flex flex-col gap-6 w-[251px] flex-1">
                  <RiMoneyDollarCircleLine className="text-4xl" />
                  <div className="flex justify-between items-center">
                    <p className="text-white text-base font-normal">
                      Doanh thu tổng năm
                    </p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-4xl font-bold">
                      {formatPrice(allInfo.total_revune_by_year || 0)}
                    </p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="px-4 w-full flex gap-[16px] justify-between text-white">
              {
                [0, 1, 2, 3].map(n => {
                  return (
                    <Skeleton className="w-[251px] flex-1 h-[172px] rounded-xl bg-whiteAlpha-200" key={n}></Skeleton>
                  )
                })
              }
            </div>
          )
        ) : dataTotalBranch ? (
          <>
            <div className="px-4 w-full flex gap-[16px] justify-between text-white">
              <div className="box-item p-3 rounded-xl bg-whiteAlpha-100 inline-flex flex-col gap-6 w-[251px] flex-1">
                <FiPhone className="text-4xl" />
                <div className="flex justify-between items-center">
                  <p className="text-white text-base font-normal">
                    Yêu cầu cần được xử lý
                  </p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-4xl font-bold">{totalInfoBranch.pending}</p>
                </div>
              </div>

              <div className="box-item p-3 rounded-xl bg-whiteAlpha-100 inline-flex flex-col gap-6 w-[251px] flex-1">
                <IoCalendarOutline className="text-4xl" />
                <div className="flex justify-between items-center">
                  <p className="text-white text-base font-normal">
                    Tiệc sắp diễn ra trong tuần
                  </p>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-end gap-1">
                    <p className="text-4xl font-bold">{bookingsOffWeekBranch}</p>
                    <p>tiệc</p>
                  </div>
                </div>
              </div>

              <div className="box-item p-3 rounded-xl bg-whiteAlpha-100 inline-flex flex-col gap-6 w-[251px] flex-1">
                <RiMoneyDollarCircleLine className="text-4xl" />
                <div className="flex justify-between items-center">
                  <p className="text-white text-base font-normal">
                    Doanh thu tổng tháng {month}
                  </p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-4xl font-bold">
                    {formatPrice(
                      Number(dataTotalBranch.total_revune_by_month) || 0
                    )}
                  </p>
                </div>
              </div>

              <div className="box-item p-3 rounded-xl bg-whiteAlpha-100 inline-flex flex-col gap-6 w-[251px] flex-1">
                <FaRegCalendarCheck className="text-4xl" />
                <div className="flex justify-between items-center">
                  <p className="text-white text-base font-normal">
                    Tiệc đã hoàn thành trong tháng
                  </p>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-end gap-1">
                    <p className="text-4xl font-bold">
                      {bookingsOffMonth}
                    </p>
                    <p>tiệc</p>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="px-4 w-full flex gap-[16px] justify-between text-white">
            {
              [0, 1, 2, 3].map(n => {
                return (
                  <Skeleton className="w-[251px] flex-1 h-[172px] rounded-xl bg-whiteAlpha-200" key={n}></Skeleton>
                )
              })
            }
          </div>
        )}
      

      <div className="w-full  flex gap-4   p-4">
        <div className="p-4 bg-whiteAlpha-100  rounded-xl">
          <div className="flex justify-between gap-[10px] items-center mb-[20px]">
            <p className="text-base font-semibold ">Lịch tổ chức tháng {month}</p>
          </div>
          <div className="flex justify-center ">
            <CustomCalendar/>
          </div>
        </div>
        <div className=" p-4 rounded-xl w-full bg-whiteAlpha-100">
          <div className="flex justify-between items-start mb-[10px]">
            <TableBookingsPending />
          </div>
        </div>
      </div>
      <div className=" p-4">
        <TableStageStatus />
      </div>
      <div className="flex  gap-6 p-4">
        <div className="w-1/2 ">
          <div className="flex items-center justify-between mb-[10px]">
            <p className="text-base  font-semibold">Yêu cầu mới nhất</p>
            <Link href={`/admin/yeu-cau/${slug}`}>
              <p className="text-teal-400 font-bold text-xs">Xem thêm</p>
            </Link>
          </div>
          <div className="overflow-y-auto h-[430px]">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>Tên</th>
                  <th>Chi Nhánh</th>
                  <th>Số điện thoại</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(requestData) && requestData.length > 0 ? (
                  requestData.map((item, index) => (
                    <tr key={index}>
                      <td>{item.users ? item.users.username : "N/A"}</td>
                      <td>{item.branches ? item.branches.name : "N/A"}</td>
                      <td>{item.phone || "N/A"}</td>
                      <td>
                        <Link href={`/admin/yeu-cau/${item.branches?.slug}/${item.id}`}>
                          <p className="text-teal-400 font-bold text-xs">
                            Xem thêm
                          </p>
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="text-center h-[357px]">
                      Không có dữ liệu.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        {slug === "ho-chi-minh" && (
          <div className="w-1/2">
            <div className="flex items-center justify-between mb-[10px]">
              <p className="text-base font-semibold">Doanh thu tổng / năm</p>
              <select
                className="w-[150px] select"
                value={selectedPeriod}
                onChange={handlePeriodChange}
              >
                <option className="option" value="week">
                  Tuần
                </option>
                <option className="option" value="month">
                  Tháng
                </option>
                <option className="option" value="year">
                  Năm
                </option>
              </select>
            </div>

            {selectedPeriod === "week" && (
              <div className="p-2  bg-blackAlpha-100 rounded-xl min-h-[410px]">
                <div className="flex items-center justify-between gap-[10px] mb-[10px]">
                  <p className=" text-base">Doanh thu theo tuần</p>
                </div>
                <Chart data={dataByWeek} chartType="line" />
              </div>
            )}
            {selectedPeriod === "month" && (
              <div className="p-2  bg-blackAlpha-100 rounded-xl">
                <div className="flex items-center justify-between gap-[10px] mb-[10px]">
                  <p className=" text-base">Doanh thu theo tháng</p>
                </div>
                <Chart data={dataByMonth} chartType="line" />
              </div>
            )}
            {selectedPeriod === "year" && (
              <div className="p-2  bg-blackAlpha-100 rounded-xl">
                <div className="flex items-center justify-between gap-[10px] mb-[10px]">
                  <p className=" text-base">Doanh thu theo năm</p>
                </div>
                <Chart data={dataByYear} chartType="line" />
              </div>
            )}
          </div>
        )}
        {slug !== "ho-chi-minh" && (
          <div className="w-1/2">
            <div className="flex justify-between gap-[10px] items-center mb-[10px]">
              <p className="text-base font-semibold ">Doanh thu tổng</p>
            </div>
            <div className="p-2  bg-blackAlpha-100 rounded-xl min-h-[410px]">
              <div className="flex items-center justify-between gap-[10px] mb-[10px]">
                <p className=" text-base">Doanh thu theo năm</p>
              </div>
              <Chart data={dataBranch} chartType="bar" />
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default Page;
