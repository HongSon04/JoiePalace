import axios from "axios";
import { API_CONFIG } from "../_utils/api.config";

export const createNewBooking = async (data) => {
  console.log(1);

  const response = await axios.post(API_CONFIG.BOOKINGS.CREATE, data);

  console.log(2);
  if (response.status !== 200) {
    throw new Error("Có lỗi khi booking");
  }

  return response.data.data;
};
