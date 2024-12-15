"use client";
import "@/app/_styles/calendar.css";
import { CalendarDate, isWeekend, parseDate } from "@internationalized/date";
import { Calendar } from "@nextui-org/react";
import { useLocale } from "@react-aria/i18n";
import { useEffect, useState } from "react";
import { API_CONFIG, makeAuthorizedRequest } from "../_utils/api.config";

// Hàm lấy ngày bắt đầu và kết thúc của tháng và tuần hiện tại
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

  const dayOfWeek = currentDate.getDay();
  const startOfWeek = new Date(currentDate);
  startOfWeek.setDate(currentDate.getDate() - dayOfWeek + 1);
  const endOfWeek = new Date(currentDate);
  endOfWeek.setDate(currentDate.getDate() - dayOfWeek + 6);

  return {
    startDate: formatDate(startDate),
    endDate: formatDate(endDate),
  };
}

// Hàm để format ngày
const formatDate = (dateInput) => {
  const date = new Date(dateInput);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

export default function CustomCalendar() {
  const [branchData, setBranchData] = useState(null);
  const [dataBooking, setDataBooking] = useState(null);

  const bookings = dataBooking?.data || [];

  const partyDates = bookings
    .map(
      (booking) =>
        new Date(booking.organization_date).toISOString().split("T")[0]
    )
    .map((dateString) => {
      const date = parseDate(dateString);
      return [date, date];
    });

  console.log("partyDates -> ", partyDates);

  let { locale } = useLocale();

  let isDateUnavailable = (date) => {
    // Check if the date is in partyDates
    const isPartyDate = partyDates.some(
      (interval) =>
        date.compare(interval[0]) >= 0 && date.compare(interval[1]) <= 0
    );

    // Return true only if it's a party date
    return isPartyDate;
  };

  // useEffect để lấy dữ liệu khi component được mount
  useEffect(() => {
    const fetchAminData = async () => {
      try {
        const currentBranch = JSON.parse(localStorage.getItem("currentBranch"));
        let branchId = currentBranch.id;
        if (currentBranch.slug === "ho-chi-minh") {
          branchId = 0;
        }

        const { startDate, endDate } = getCurrentMonthAndWeekDates();

        // Chuyển đổi "DD-MM-YYYY" thành đối tượng Date
        const start = new Date(startDate.split("-").reverse().join("-"));
        const end = new Date(endDate.split("-").reverse().join("-"));

        // Tính số ngày giữa 2 ngày
        const diffDays = (end - start) / (1000 * 3600 * 24);

        // Gửi yêu cầu API với startDate và endDate
        const dataBooking = await makeAuthorizedRequest(
          API_CONFIG.BOOKINGS.GET_ALL({
            branch_id: branchId,
            startDate: startDate,
            endDate: endDate,
            itemsPerPage: diffDays + 1,
            status: "pending",
          }),
          "GET",
          null
        );

        setDataBooking(dataBooking);
        setBranchData({ branchId });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchAminData();
  }, []);

  // Calendar component sử dụng Next UI
  return (
    <Calendar
      aria-label="Party Dates"
      isDisabled={true}
      isDateUnavailable={isDateUnavailable}
      classNames={{
        cellDisabled: "custom-calendar-cell-disabled",
        base: "bg-whiteAlpha-100",
        title: "text-white",
        nextButton: "text-white",
        prevButton: "text-white",
        headerWrapper: "bg-transparent text-white",
        gridHeader: "bg-transparent border-b border-whiteAlpha-200",
      }}
    />
  );
}
