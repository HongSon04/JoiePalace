import axios from "axios";
import { API_CONFIG } from "../_utils/api.config";

export const fetchUserProfile = async () => {
  const response = await axios.get(API_CONFIG.USER.PROFILE);

  if (response.status !== 200) {
    throw new Error("Có lỗi khi lấy thông tin tài khoản");
  }

  return response.data.data;
};
