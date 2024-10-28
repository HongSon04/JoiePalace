import axios from "axios";
import { API_CONFIG } from "../_utils/api.config";

export const createNewBooking = async () => {
  const response = await axios.get(API_CONFIG.BOOKINGS.CREATE);

  if (response.status !== 200) {
    throw new Error("Có lỗi khi lấy thông tin tài khoản");
  }

  return response.data.data;
};
