import axios from "axios";
import { API_CONFIG } from "../_utils/api.config";


export const fetchAllPackages = async (slug) => {
  const response = await axios.get(
    API_CONFIG.PACKAGES.GET_ALL({
      itemsPerPage: 99999,
    })
  );

  if (response.status !== 200) {
    throw new Error("Có lỗi khi lấy danh sách chi nhánh");
  }

  return response.data.data;
};