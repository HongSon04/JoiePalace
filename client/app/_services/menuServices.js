import axios from "axios";
import { API_CONFIG } from "../_utils/api.config";

export const fetchMenuBySlug = async (slug) => {
  const response = await axios.get(API_CONFIG.MENU.GET_BY_SLUG(slug));

  if (response.status !== 200) {
    throw new Error("Có lỗi khi lấy dữ liệu");
  }

  return response.data.data;
};
export const getMenuById = async (id) => {
  const response = await axios.get(API_CONFIG.MENU.GET_BY_ID(id));

  if (response.status !== 200) {
    throw new Error("Có lỗi khi lấy dữ liệu");
  }

  return response.data.data;
};
