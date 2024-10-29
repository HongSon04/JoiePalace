import { formatDistanceToNow } from "date-fns";

export function formatDateTime(dateTime) {
  const date = new Date(dateTime);
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
    .replace("₫", "VND");
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

// Example usage
try {
  const formattedDateTime = formatDateTime("2024-10-25T09:07:54.323Z");
  console.log(formattedDateTime.iso); // Outputs: 2024-10-25T09:07:54.323Z
  console.log(formattedDateTime.time); // Outputs: 09:07 AM
  console.log(formattedDateTime.date); // Outputs: 25/10/2024
} catch (error) {
  console.error(error.message);
}

// Example usage
// const date = new Date("2024-10-25T09:07:54.323Z");
// const formattedDateTime = formatDateTime(date);

// console.log(formattedDateTime.iso); // Outputs: 2024-10-25T09:07:54.323Z
// console.log(formattedDateTime.time); // Outputs: 09:07 AM
// console.log(formattedDateTime.date); // Outputs: 25/10/2024
