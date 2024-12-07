import axios from "axios";
import { API_CONFIG } from "../_utils/api.config";

export const getCakeWedding = async (id) => {
  const response = await axios.get(
    // `https://joieplace.live/api/products/get/${id}`
    API_CONFIG.PRODUCTS.GET_BY_ID(id)
  );
  if (response.status !== 201 && response.status !== 200) {
    throw new Error("Có lỗi xảy ra khi lấy dữ liệu");
  }
  return response.data.data;
};
