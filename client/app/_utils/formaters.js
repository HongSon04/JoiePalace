import { formatDistanceToNow } from "date-fns";

export function formatDateTime(dateTime) {
  const date = new Date(dateTime);
  return date.toLocaleString();
}

export function ISOStringToDateTimeString(isoString) {
  const date = new Date(isoString);
  return date.toLocaleString();
}

export function formatRelativeTime(dateTime) {
  return formatDistanceToNow(new Date(dateTime), { addSuffix: true });
}

export function formatPrice(price) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  })
    .format(price)
    .replace("₫", "đ");
}

export const formatFullDateTime = (input) => {
  // Convert input to a Date object
  const date = new Date(input);

  // Check if the date is valid
  if (isNaN(date.getTime())) {
    throw new Error("Invalid date object");
  }

  // Format to ISO 8601
  const isoFormat = date.toISOString(); // YYYY-MM-DDTHH:mm:ss.sssZ

  // Format to 12-hour format with AM/PM
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12; // Convert to 12-hour format
  hours = hours ? hours : 12; // The hour '0' should be '12'
  const formattedTime = `${String(hours).padStart(2, "0")}:${String(
    minutes
  ).padStart(2, "0")} ${ampm}`;

  // Format to dd/mm/yyyy
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
  const year = date.getFullYear();
  const formattedDate = `${day}/${month}/${year}`;

  // Return an object with all formats
  return {
    iso: isoFormat,
    time: formattedTime,
    date: formattedDate,
  };
};

// Function to convert the custom date object to a standard Date object
export const toStandardDate = (customDate) => {
  return new Date(customDate.year, customDate.month - 1, customDate.day);
};
