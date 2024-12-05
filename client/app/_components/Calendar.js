"use client";
import { Calendar } from "@nextui-org/react";
import { useState, useEffect } from "react";
import { API_CONFIG, makeAuthorizedRequest } from "../_utils/api.config";
import { DateTime } from 'luxon';
import { parseISO, isValid, isWeekend } from "date-fns";
import { useLocale } from "antd/es/locale";

// Hàm lấy ngày bắt đầu và kết thúc của tháng và tuần hiện tại
function getCurrentMonthAndWeekDates() {
  const currentDate = new Date();
  const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

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
        const start = new Date(startDate.split('-').reverse().join('-'));
        const end = new Date(endDate.split('-').reverse().join('-'));

        // Tính số ngày giữa 2 ngày
        const diffDays = (end - start) / (1000 * 3600 * 24);

        // Gửi yêu cầu API với startDate và endDate
        const dataBooking = await makeAuthorizedRequest(
          API_CONFIG.BOOKINGS.GET_ALL({
            branch_id: branchId,
            startDate: startDate,
            endDate: endDate,
            itemsPerPage: diffDays + 1,
            status: "pending"
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
  }, []);  // Fetch once on mount

  // Kiểm tra nếu dataBooking có dữ liệu hợp lệ trước khi sử dụng
  const bookings = dataBooking?.data || [];
  // Chuyển đổi expired_at thành đối tượng DateTime
  const expiredDates = bookings
    .map((booking) => {
      const expiredAt = booking.expired_at;
      if (expiredAt) {
        try {
          // Chuyển đổi expiredAt thành DateTime và bỏ giờ, phút, giây
          const dateTime = DateTime.fromISO(expiredAt).startOf('day');
          if (!dateTime.isValid) {
            // console.error("Invalid DateTime from expired_at:", expiredAt);
            return null; // Trả về null nếu không hợp lệ
          }
          return dateTime; // Trả về đối tượng DateTime hợp lệ
        } catch (error) {
          // console.error("Error parsing expired_at:", expiredAt, error);
          return null;
        }
      }
      return null; // Trả về null nếu expired_at không tồn tại
    })
    .filter(Boolean); // Lọc bỏ các giá trị null (invalid dates)

  // Tạo disabledRanges từ expiredDates
  let disabledRanges = expiredDates.map((expiredDate) => {
    if (!expiredDate || !expiredDate.isValid) return null; // Nếu expiredDate không hợp lệ, trả về null
    // Chuyển DateTime thành chuỗi ISO để đảm bảo tính tương thích với Calendar
    const startDate = expiredDate.toISODate(); // Chuyển thành chuỗi ISO chuẩn (YYYY-MM-DD)
    const endDate = expiredDate.plus({ days: 5 }).toISODate(); // Tạo phạm vi từ expiredDate đến expiredDate + 5 ngày
    return [startDate, endDate]; // Trả về phạm vi ngày dưới dạng chuỗi ISO
  }).filter(Boolean); // Lọc bỏ các phạm vi không hợp lệ

  // console.log("Disabled Ranges:", disabledRanges); // Kiểm tra disabledRanges


  // Hàm kiểm tra ngày không khả dụng
  let isDateUnavailable = (date) => {
    // Kiểm tra nếu date không hợp lệ (trong trường hợp sử dụng DateTime từ Luxon)
    if (!date || !(date instanceof Date || date.isValid)) {
      // console.error("Invalid date:", date);
      return true; // Trả về true nếu ngày không hợp lệ (vô hiệu hóa)
    }

    // Chuyển đối tượng `date` thành DateTime (nếu là đối tượng Date)
    const dateTime = DateTime.fromJSDate(date);

    // Kiểm tra phạm vi disabledRanges
    return disabledRanges.some(([start, end]) => {
      const startDate = DateTime.fromISO(start);
      const endDate = DateTime.fromISO(end);

      // So sánh date với start và end (sử dụng Luxon DateTime để so sánh)
      return dateTime >= startDate && dateTime <= endDate;
    });
  };

  // Calendar component sử dụng Next UI
  return (
    <Calendar
      aria-label="Date (Unavailable)"
      isDateUnavailable={isDateUnavailable} // Truyền hàm kiểm tra ngày không khả dụng
    />
  );
}
