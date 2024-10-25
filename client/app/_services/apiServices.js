import axios from "axios";
import { API_CONFIG } from "@/app/_utils/api.config";

export const fetchAllDashBoard = async () => {
    try {
      const response = await axios.get(API_CONFIG.DASHBOARD.GET_ALL_INFO);
      if (response.status !== 200) {
        throw new Error("Có lỗi khi lấy dữ liệu !");
      }
      return response.data;
    } catch (error) {
      console.error("Lỗi:", error);
      throw error; 
    }
  };
export const fetchAllTotalRevenueMonth = async () => {
    try {
        const response = await axios.get(API_CONFIG.DASHBOARD.GET_TOTAL_REVENUE_FOR_ALL_BRANCH_EACH_MONTH );
        if (response.status !== 200) {
        throw new Error("Có lỗi khi lấy dữ liệu !");
        }
        return response.data;
    } catch (error) {
        console.error("Lỗi:", error);
        throw error; 
    }
};
  