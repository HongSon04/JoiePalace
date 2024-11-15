import axios from "axios";
import { API_CONFIG } from "../_utils/api.config";

export const getStageById = async (id) => {
  const response = await axios.get(
    `https://joieplace.live/api/stages/get/${id}`
  );

  if (response.status !== 200) {
    throw new Error("Có lỗi khi lấy dữ liệu sản phẩm");
  }

  return response.data.data;
};
