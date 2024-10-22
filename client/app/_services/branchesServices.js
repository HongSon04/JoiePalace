// services/branchService.js
import axios from "axios";
import { API_CONFIG } from "@/app/_utils/api.config";

export const fetchBranchesFromApi = async () => {
  const response = await axios.get(API_CONFIG.BRANCHES.GET_ALL);

  if (response.status !== 200) {
    throw new Error("Có lỗi khi lấy danh sách chi nhánh");
  }

  return response.data.data;
};

export const fetchBranchBySlug = async (slug) => {
  const response = await axios.get(API_CONFIG.BRANCHES.GET_BY_SLUG(slug), {
    params: { slug },
  });

  if (response.status !== 200) {
    throw new Error("Có lỗi khi lấy dữ liệu chi nhánh");
  }

  return response.data.data;
};

export const fetchCurrentBranch = async (slug) => {
  const response = await axios.get(API_CONFIG.BRANCHES.GET_BY_SLUG(slug), {
    params: { slug },
  });

  if (response.status !== 200) {
    throw new Error("Có lỗi khi lấy dữ liệu chi nhánh");
  }

  localStorage.setItem("currentBranch", JSON.stringify(response.data.data));

  return response.data.data;
};

export const fetchBranchDataById = async (branchId) => {
  try {
    const response = await axios.get(API_CONFIG.DASHBOARD.GET_BOOKING_STATUS(branchId));
    
    // Kiểm tra và trả về dữ liệu đúng
    if (Array.isArray(response.data) && response.data.length > 0) {
      return response.data[0]; // Trả về đối tượng đầu tiên
    } else {
      throw new Error("Không có dữ liệu cho chi nhánh này");
    }
  } catch (error) {
    console.error("Lỗi:", error);
    throw error;
  }
};

