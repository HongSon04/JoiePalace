import axios from "axios";
import { API_CONFIG } from "../_utils/api.config";

export const fecthAllPartyTypes = async () => {
  const response = await axios.get(API_CONFIG.PARTYTYPES.GET_ALL());

  if (response.status !== 200) {
    throw new Error("Có lỗi khi lấy thông tin tài khoản");
  }

  return response.data.data;
};


