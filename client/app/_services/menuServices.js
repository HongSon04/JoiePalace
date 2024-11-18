import axios from "axios";
import { API_CONFIG } from "../_utils/api.config";

export const fetchMenuBySlug = async (slug) => {
  const response = await axios.get(API_CONFIG.MENU.GET_BY_SLUG(slug));

  if (response.status !== 200) {
    throw new Error("Có lỗi khi lấy dữ liệu");
  }

  return response.data.data;
};

export const fetchAllMenu = async (userId) => {
  try {
    const response = await axios.get(API_CONFIG.MENU.GET_ALL({
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

export const getMenuById = async (id) => {
  const response = await axios.get(API_CONFIG.MENU.GET_BY_ID(id));

  if (response.status !== 200) {
    throw new Error("Có lỗi khi lấy dữ liệu");
  }

  return response.data.data;
};
