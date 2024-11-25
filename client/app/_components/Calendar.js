// components/CustomCalendar.js
import React, { useState } from 'react';
import { Calendar } from '@nextui-org/react';
import { today, getLocalTimeZone } from '@internationalized/date';

const CustomCalendar = () => {
  // Mảng các ngày cần đánh dấu (ví dụ: ngày đã được đặt chỗ)
  const markedDates = [
    new Date(2024, 10, 22),  // 22 November 2024
    new Date(2024, 10, 25),  // 25 November 2024
    new Date(2024, 10, 30),  // 30 November 2024
    new Date(2024, 10, 28),  // 28 November 2024
  ];

  // State cho ngày hiện tại được chọn
  const [selectedDate, setSelectedDate] = useState(today(getLocalTimeZone()));

  // Hàm để xử lý khi người dùng chọn ngày
  const handleChange = (date) => {
    setSelectedDate(date);
  };

  // Hàm để render các ngày đã được đánh dấu giống ngày hiện tại
  const renderMarked = (date) => {
    const isMarked = markedDates.some(
      (markedDate) =>
        markedDate.getDate() === date.getDate() &&
        markedDate.getMonth() === date.getMonth() &&
        markedDate.getFullYear() === date.getFullYear()
    );

    if (isMarked) {
      return {
        style: {
          borderRadius: '50%',  // Để khoanh tròn ngày
          backgroundColor: '#0070f3', // Màu nền khi đánh dấu
          color: 'white', // Màu chữ
          width: '30px', // Kích thước của khoanh tròn
          height: '30px', // Kích thước của khoanh tròn
          display: 'flex', // Đảm bảo căn giữa
          justifyContent: 'center', // Căn giữa ngày
          alignItems: 'center', // Căn giữa ngày
        }
      };
    }
    return {};
  };

  return (
    <div>
      <Calendar
        aria-label="Date (Read Only)"
        value={selectedDate}  // Hiển thị ngày hiện tại người dùng đang chọn
        isReadOnly
        onChange={handleChange}  // Cập nhật ngày khi người dùng chọn
        marked={markedDates}  // Đánh dấu các ngày cần thiết
        renderMarked={renderMarked}  // Sử dụng renderMarked để tùy chỉnh cách đánh dấu
      />
    </div>
  );
};

export default CustomCalendar;
