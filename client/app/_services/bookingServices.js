import axios from "axios";
import { API_CONFIG } from "../_utils/api.config";

export const createNewBooking = async (data) => {
  const response = await axios.post(API_CONFIG.BOOKINGS.CREATE, data);
  if (response.status !== 201 && response.status !== 200) {
    throw new Error("Có lỗi khi booking");
  }
  return { status: response.status, data: response.data.data };
};

export const fetchAllPartyBookings = async (id) => {
  const response = await axios.get(API_CONFIG.BOOKINGS.GET_ALL(id));

  if (response.status !== 200) {
    throw new Error("Có lỗi khi lấy dữ liệu");
  }

  return response.data.data;
};
export const fetchAllBookingByUserId = async (userId) => {
  try {
    const response = await axios.get(API_CONFIG.BOOKINGS.GET_ALL({
        user_id: userId,
        itemsPerPage: 99999,
      }
    ));

    if (response.status !== 200) {
      throw new Error("Có lỗi khi lấy dữ liệu");
    }

    return response.data.data;
  } catch (error) {
    console.error('Error fetching bookings:', error);
    throw new Error("Có lỗi khi lấy dữ liệu");
  }
};
export const fetchBookingById = async (id) => {
  try {
    const response = await axios.get(API_CONFIG.BOOKINGS.GET_BY_ID(id));

    if (response.status !== 200) {
      throw new Error("Có lỗi khi lấy dữ liệu");
    }

    return response.data.data;
  } catch (error) {
    console.error('Error fetching bookings:', error);
    throw new Error("Có lỗi khi lấy dữ liệu");
  }
};
