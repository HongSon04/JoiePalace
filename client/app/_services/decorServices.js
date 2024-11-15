import axios from "axios";
import { API_CONFIG } from "../_utils/api.config";

export const getDecorById = async (id) => {
  const response = await axios.get(API_CONFIG.DECORS.GET_BY_ID(id));
  if (response.status !== 201 && response.status !== 200) {
    throw new Error("Có lỗi xảy ra khi lấy dữ liệu");
  }
  return response.data.data;
};
