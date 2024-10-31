import axios from "axios";
import { API_CONFIG } from "../_utils/api.config";

export const createNewBooking = async (data) => {
  const response = await axios.post(API_CONFIG.BOOKINGS.CREATE, data);
  if (response.status !== 201 && response.status !== 200) {
    throw new Error("Có lỗi khi booking");
  }
  return { status: response.status, data: response.data.data };
};

export const fetchAllPartyBookings = async () => {
  const response = await axios.get(API_CONFIG.BOOKINGS.GET_ALL);

  if (response.status !== 200) {
    throw new Error("Có lỗi khi lấy thông tin tài khoản");
  }

  return response.data.data;

}