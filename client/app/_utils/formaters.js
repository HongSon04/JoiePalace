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
  }).format(price);
}
